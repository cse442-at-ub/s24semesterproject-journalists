<?php
require_once '../config/config.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    // Authenticate the user and get their user ID
    $user_id = authenticateRequest($pdo);
    if (!$user_id) {
        exit; // Authentication failed, response is already set within the function
    }

    // Retrieve survey question and answer from the request body
    $question = isset($data['question']) ? $data['question'] : null;
    $answer = isset($data['answer']) ? $data['answer'] : null;

    // Validate input
    if (empty($question) || empty($answer)) {
        http_response_code(400);
        echo json_encode(["error" => "Bad Request - Question and answer are required"]);
        exit;
    }

    // Insert survey data into the database
    $stmt = $pdo->prepare("INSERT INTO survey_responses (user_id, question, answer) VALUES (:user_id, :question, :answer)");
    $success = $stmt->execute([
        'user_id' => $user_id,
        'question' => $question,
        'answer' => $answer
    ]);

    if ($success) {
        http_response_code(201);
        echo json_encode(["message" => "Survey response added successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Internal Server Error - Failed to add survey response"]);
    }
}

// ... (rest of the authenticateRequest function)

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
