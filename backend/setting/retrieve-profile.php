<?php
require_once '../config/config.php';

// Enabling CORS for local development
header('Access-Control-Allow-Origin: *');
// Security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');

// Check for OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Ensure the request is using POST method
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $headers = getallheaders();
    $authHeader = '';
    foreach ($headers as $header => $value) {
        if (strtolower($header) == 'authorization') {
            $authHeader = $value;
            break;
        }
    }

    if (preg_match('/Bearer\s(\S+)/i', $authHeader, $matches)) {
        $token = $matches[1];
    } else {
        // Token not provided or invalid format
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized - Token not provided or invalid"]);
        exit;
    }

    // Retrieve user_id from tokens table
    $stmt = $pdo->prepare("SELECT user_id FROM user_tokens WHERE token = :token AND expires_at > NOW()");
    $stmt->execute(['token' => $token]);
    $tokenRow = $stmt->fetch();

    if (!$tokenRow) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized - Invalid token"]);
        exit;
    }

    $user_id = $tokenRow['user_id'];

    // Retrieve profile information based on user_id
    $profileStmt = $pdo->prepare("SELECT first_name, last_name, address, city, state, contact_number FROM profiles WHERE user_id = :user_id");
    $profileStmt->execute(['user_id' => $user_id]);
    $profileRow = $profileStmt->fetch(PDO::FETCH_ASSOC);

    if ($profileRow) {
        echo json_encode($profileRow);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Profile not found"]);
    }
}
