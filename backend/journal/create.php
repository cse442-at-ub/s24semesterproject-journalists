<?php
require_once '../config/config.php';

// Enabling CORS for local development
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// Decode the received JSON data
$data = json_decode(file_get_contents("php://input"), true);

// Get the Bearer Token from the Authorization header
$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
$token = '';
if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
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

// Extract journal entry data from the request
$title = $data['title'];
$body = $data['body'];

// Insert the journal entry into the database
$insertStmt = $pdo->prepare("INSERT INTO journal_entries (user_id, title, body) VALUES (:user_id, :title, :body)");
$insertResult = $insertStmt->execute([
    'user_id' => $user_id,
    'title' => $title,
    'body' => $body
]);

// Respond to the client
if ($insertResult) {
    echo json_encode(["message" => "Journal entry created successfully"]);
} else {
    // Insert failed
    http_response_code(500);
    echo json_encode(["error" => "Internal Server Error - Could not create journal entry"]);
}
