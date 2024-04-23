<?php
require_once '../config/config.php';

// Enabling CORS for local development
header('Access-Control-Allow-Origin: *');
// Security
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');

$user_id = authenticateRequest($pdo);
if (!$user_id) {
    exit; // Authentication failed, response is already set within the function
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    $journal_entry_id = isset($data['journal_entry_id']) ? $data['journal_entry_id'] : null;
    $comment = isset($data['comment']) ? $data['comment'] : null;

    if (!$journal_entry_id || empty($comment)) {
        http_response_code(400);
        echo json_encode(["error" => "Bad Request - Journal entry ID and comment are required"]);
        exit;
    }

    // Insert comment into the database
    $stmt = $pdo->prepare("INSERT INTO comments (user_id, journal_entry_id, comment) VALUES (:user_id, :journal_entry_id, :comment)");
    $success = $stmt->execute(['user_id' => $user_id, 'journal_entry_id' => $journal_entry_id, 'comment' => $comment]);

    if ($success) {
        $comment_id = $pdo->lastInsertId(); // Fetch the ID of the newly added comment
        http_response_code(201);
        echo json_encode([
            "message" => "Comment added successfully",
            "comment_id" => $comment_id // Include the comment_id in the response
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Internal Server Error - Failed to add comment"]);
    }
}

function authenticateRequest($pdo)
{
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
        return false;
    }

    // Assuming your token table is named `user_tokens` and it links to `users` via a `user_id`
    $stmt = $pdo->prepare("SELECT user_id FROM user_tokens WHERE token = :token AND expires_at > NOW()");
    $stmt->execute(['token' => $token]);
    $tokenRow = $stmt->fetch();

    if (!$tokenRow) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized - Invalid token"]);
        return false;
    }

    return $tokenRow['user_id']; // Return user ID upon successful authentication
}