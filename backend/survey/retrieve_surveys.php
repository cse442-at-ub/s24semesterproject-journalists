<?php
require_once '../config/config.php';

// Enabling CORS for local development
header('Access-Control-Allow-Origin: https://www-student.cse.buffalo.edu');
// Security
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');

// Authenticate the request and get the authenticated user's ID
$authenticated_user_id = authenticateRequest($pdo);
if (!$authenticated_user_id) {
    exit; // Authentication failed, response is already set within the function
}

// Get the user ID from the query parameter
$requested_user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : null;

if (!$requested_user_id) {
    http_response_code(400);
    echo json_encode(["error" => "Bad Request - User ID is required"]);
    exit;
}

// Fetch the survey questions and answers for the specified user
$stmt = $pdo->prepare("SELECT * FROM survey_responses WHERE user_id = :user_id");
$stmt->execute(['user_id' => $requested_user_id]);
$surveys = $stmt->fetchAll(PDO::FETCH_ASSOC);

if ($surveys) {
    http_response_code(200);
    echo json_encode($surveys);
} else {
    http_response_code(404);
    echo json_encode(["error" => "No survey responses found for the specified user"]);
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
