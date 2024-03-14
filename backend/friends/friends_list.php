<?php
require_once '../config/config.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: GET');

$user_id = authenticateRequest($pdo);
if (!$user_id) {
    exit; // Authentication failed, response is already set within the function
}

// Fetch the list of friends
$stmt = $pdo->prepare("SELECT u.id, u.email FROM users u INNER JOIN friend_requests fr ON (fr.user_id = u.id OR fr.friend_user_id = u.id) AND (fr.user_id = :user_id OR fr.friend_user_id = :user_id) WHERE fr.status = 'accepted' AND u.id != :user_id GROUP BY u.id");
$stmt->execute(['user_id' => $user_id]);
$friends = $stmt->fetchAll(PDO::FETCH_ASSOC);


http_response_code(200);
echo json_encode($friends);

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
