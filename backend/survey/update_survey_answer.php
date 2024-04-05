<?php
require_once '../config/config.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
// Security
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    // Authenticate the user and get their user ID
    $user_id = authenticateRequest($pdo);
    if (!$user_id) {
        exit; // Authentication failed, response is already set within the function
    }

    // Retrieve survey ID and new answer from the request body
    $survey_id = isset($data['survey_id']) ? $data['survey_id'] : null;
    $new_answer = isset($data['new_answer']) ? $data['new_answer'] : null;

    // Validate input
    if (empty($survey_id) || empty($new_answer)) {
        http_response_code(400);
        echo json_encode(["error" => "Bad Request - Survey ID and new answer are required"]);
        exit;
    }

    // Update the survey answer in the database
    $stmt = $pdo->prepare("UPDATE survey_responses SET answer = :new_answer WHERE id = :survey_id AND user_id = :user_id");
    $success = $stmt->execute([
        'new_answer' => $new_answer,
        'survey_id' => $survey_id,
        'user_id' => $user_id
    ]);

    if ($success) {
        http_response_code(200);
        echo json_encode(["message" => "Survey answer updated successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Internal Server Error - Failed to update survey answer"]);
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
