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

if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    $data = json_decode(file_get_contents("php://input"), true);
    $comment_id = isset($data['comment_id']) ? $data['comment_id'] : null;

    if (!$comment_id) {
        http_response_code(400);
        echo json_encode(["error" => "Bad Request - Comment ID is required"]);
        exit;
    }

    // First, retrieve the owner of the comment to check if the current user is allowed to delete it
    $stmt = $pdo->prepare("SELECT user_id FROM comments WHERE comment_id = :comment_id");
    $stmt->execute(['comment_id' => $comment_id]);
    $comment = $stmt->fetch();

    if (!$comment) {
        http_response_code(404);
        echo json_encode(["error" => "Not Found - Comment does not exist"]);
        exit;
    }

    if ($comment['user_id'] != $user_id) {
        // Optional: Check if the user has admin privileges if you want admins to be able to delete any comment
        http_response_code(403);
        echo json_encode(["error" => "Forbidden - You do not have permission to delete this comment"]);
        exit;
    }

    // Delete the comment
    $stmt = $pdo->prepare("DELETE FROM comments WHERE comment_id = :comment_id");
    $success = $stmt->execute(['comment_id' => $comment_id]);

    if ($success) {
        http_response_code(200);
        echo json_encode(["message" => "Comment deleted successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Internal Server Error - Failed to delete comment"]);
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

