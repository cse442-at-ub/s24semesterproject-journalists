<?php
require_once '../config/config.php';

// Enabling CORS for local development
header('Access-Control-Allow-Origin: https://www-student.cse.buffalo.edu');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

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
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized - Token not provided or invalid"]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT user_id FROM user_tokens WHERE token = :token AND expires_at > NOW()");
    $stmt->execute(['token' => $token]);
    $tokenRow = $stmt->fetch();

    if (!$tokenRow) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized - Invalid token"]);
        exit;
    }

    $user_id = $tokenRow['user_id'];

    // Retrieve profile information including profile image
    $profileStmt = $pdo->prepare("SELECT first_name, last_name, address, city, state, contact_number, profile_image FROM profiles WHERE user_id = :user_id");
    $profileStmt->execute(['user_id' => $user_id]);
    $profileRow = $profileStmt->fetch(PDO::FETCH_ASSOC);

    if ($profileRow) {
        // Check if profile image is not empty and provide a full path if necessary
        if (!empty($profileRow['profile_image'])) {
            $profileRow['profile_image'] = $profileRow['profile_image'];
        }
        echo json_encode($profileRow);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Profile not found"]);
    }
}
