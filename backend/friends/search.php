<?php
require_once '../config/config.php';

// Enabling CORS for local development
header('Access-Control-Allow-Origin: *');
// Security
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');

// Authenticate the request first (ensure authenticateRequest function is defined)
$user_id = authenticateRequest($pdo);
if (!$user_id) {
    exit; // Authentication failed, response is already set within the function
}

// Retrieve the search term from the query parameter
$searchTerm = isset($_GET['query']) ? $_GET['query'] : '';

// Perform the search only if the search term is not empty
if (!empty($searchTerm)) {
    // Use the LIKE operator for partial matches, and use PDO's prepare and execute to prevent SQL injection
    $stmt = $pdo->prepare("SELECT id, email FROM users WHERE email LIKE :searchTerm");
    $stmt->execute(['searchTerm' => "%$searchTerm%"]);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return the search results
    http_response_code(200);
    echo json_encode($users);
} else {
    // If the search term is empty, return an error message
    http_response_code(400);
    echo json_encode(["error" => "Bad Request - Search term is required"]);
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
