<?php
require_once '../config/config.php';

// Enabling CORS for local development
header('Access-Control-Allow-Origin: https://www-student.cse.buffalo.edu');
// Security
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');


// Decode the received JSON data
$data = json_decode(file_get_contents("php://input"), true);

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

// Extract the journal entry ID from the request
$entry_id = $data['entry_id'];

// Prepare the delete statement
$deleteStmt = $pdo->prepare("DELETE FROM journal_entries WHERE id = :entry_id AND user_id = :user_id");
$deleteResult = $deleteStmt->execute([
    'entry_id' => $entry_id,
    'user_id' => $user_id
]);

// Respond to the client
if ($deleteResult) {
    echo json_encode(["message" => "Journal entry deleted successfully"]);
} else {
    // Delete failed
    http_response_code(500);
    echo json_encode(["error" => "Internal Server Error - Could not delete journal entry"]);
}
