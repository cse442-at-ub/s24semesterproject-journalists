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

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $journal_entry_id = $_GET['journal_entry_id'] ?? null;

    if (!$journal_entry_id) {
        http_response_code(400);
        echo json_encode(["error" => "Bad Request - Journal entry ID is required"]);
        exit;
    }

    // Fetch comments along with their IDs
    $stmt = $pdo->prepare("SELECT comment_id, user_id, comment, created_at FROM comments WHERE journal_entry_id = :journal_entry_id ORDER BY created_at DESC");
    $stmt->execute(['journal_entry_id' => $journal_entry_id]);
    $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["comments" => $comments]);
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