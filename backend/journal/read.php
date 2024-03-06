<?php
require_once '../config/config.php';

// Enabling CORS and setting headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');

// Get the Bearer Token from the Authorization header
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

// Validate the token and get user_id
$stmt = $pdo->prepare("SELECT user_id FROM user_tokens WHERE token = :token AND expires_at > NOW()");
$stmt->execute(['token' => $token]);
$tokenRow = $stmt->fetch();

if (!$tokenRow) {
    // Token is invalid or expired
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized - Invalid token"]);
    exit;
}

// Get user_id from the valid token
$user_id = $tokenRow['user_id'];

// Check for entry_id in the request
$entry_id = isset($_GET['entry_id']) ? $_GET['entry_id'] : null;

if ($entry_id) {
    // Fetch and return a single entry
    $stmt = $pdo->prepare("SELECT * FROM journal_entries WHERE id = :entry_id AND user_id = :user_id");
    $stmt->execute(['entry_id' => $entry_id, 'user_id' => $user_id]);
    $entry = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode($entry ? $entry : ["message" => "No entry found"]);
} else {
    // Fetch and return all entries for the user
    $stmt = $pdo->prepare("SELECT * FROM journal_entries WHERE user_id = :user_id");
    $stmt->execute(['user_id' => $user_id]);
    $entries = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($entries);
}
