<?php
require_once '../config/config.php';

// Enabling CORS for local development
header('Access-Control-Allow-Origin: https://www-student.cse.buffalo.edu');
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

    if (!$journal_entry_id) {
        http_response_code(400);
        echo json_encode(["error" => "Bad Request - Journal entry ID is required"]);
        exit;
    }

    // Check if the like already exists
    $stmt = $pdo->prepare("SELECT like_id FROM likes WHERE user_id = :user_id AND journal_entry_id = :journal_entry_id");
    $stmt->execute(['user_id' => $user_id, 'journal_entry_id' => $journal_entry_id]);
    $like = $stmt->fetch();

    if ($like) {
        // Like exists, so remove it
        $stmt = $pdo->prepare("DELETE FROM likes WHERE like_id = :like_id");
        $success = $stmt->execute(['like_id' => $like['like_id']]);
        if ($success) {
            http_response_code(200);
            echo json_encode(["message" => "Like removed successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Internal Server Error - Failed to remove like"]);
        }
    } else {
        // Like does not exist, add it
        $stmt = $pdo->prepare("INSERT INTO likes (user_id, journal_entry_id) VALUES (:user_id, :journal_entry_id)");
        $success = $stmt->execute(['user_id' => $user_id, 'journal_entry_id' => $journal_entry_id]);

        if ($success) {
            http_response_code(201);
            echo json_encode(["message" => "Like added successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Internal Server Error - Failed to add like"]);
        }
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