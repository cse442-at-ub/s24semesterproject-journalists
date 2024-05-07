<?php
require_once '../config/config.php';

// Enabling CORS for local development
header('Access-Control-Allow-Origin: https://www-student.cse.buffalo.edu');
// Security
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');

// Authenticate the request
$user_id = authenticateRequest($pdo);
if (!$user_id) {
    exit; // Authentication failed, response is already set within the function
}

// Decode JSON data for non-file fields
$data = json_decode(file_get_contents("php://input"), true);
$action = $data['action'];

switch ($action) {
    case 'send':
        sendFriendRequest($data, $pdo, $user_id);
        break;
    case 'accept':
        acceptFriendRequest($data, $pdo, $user_id);
        break;
    case 'decline':
        declineFriendRequest($data, $pdo, $user_id);
        break;
    default:
        http_response_code(400);
        echo json_encode(["error" => "Invalid action"]);
        break;
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


// Function definitions for sendFriendRequest, acceptFriendRequest, declineFriendRequest go here...

function sendFriendRequest($data, $pdo, $user_id)
{
    $friend_email = $data['friend_email'];

    // Convert friend_email to friend_user_id by querying the users table
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->execute(['email' => $friend_email]);
    $friendUserRow = $stmt->fetch();

    if (!$friendUserRow) {
        http_response_code(404);
        echo json_encode(["error" => "User not found"]);
        exit;
    }

    $friend_user_id = $friendUserRow['id'];

    // Check if a friend request already exists or a friendship is established
    $checkStmt = $pdo->prepare("SELECT * FROM friend_requests WHERE (user_id = :user_id AND friend_user_id = :friend_user_id) OR (user_id = :friend_user_id AND friend_user_id = :user_id)");
    $checkStmt->execute([
        'user_id' => $user_id,
        'friend_user_id' => $friend_user_id
    ]);
    if ($checkStmt->fetch()) {
        // Existing request found, don't allow a new request to be sent
        http_response_code(409); // 409 Conflict might be a suitable status code
        echo json_encode(["error" => "A friend request already exists or you are already friends"]);
        exit;
    }

    // Proceed to insert the friend request since no existing request/friendship is found
    $insertStmt = $pdo->prepare("INSERT INTO friend_requests (user_id, friend_user_id, status) VALUES (:user_id, :friend_user_id, 'pending')");
    $insertResult = $insertStmt->execute([
        'user_id' => $user_id,
        'friend_user_id' => $friend_user_id
    ]);

    if ($insertResult) {
        http_response_code(200);
        echo json_encode(["message" => "Friend request sent successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Internal Server Error - Could not send friend request"]);
    }
}



function acceptFriendRequest($data, $pdo, $user_id) {
    $request_id = $data['request_id'];

    // Fetch details of the friend request
    $stmt = $pdo->prepare("SELECT * FROM friend_requests WHERE request_id = :request_id");
    $stmt->execute(['request_id' => $request_id]);
    $request = $stmt->fetch();

    if (!$request) {
        http_response_code(404);
        echo json_encode(["error" => "Friend request not found"]);
        exit;
    }

    if ($request['friend_user_id'] != $user_id) {
        http_response_code(403);
        echo json_encode(["error" => "Unauthorized to accept this friend request"]);
        exit;
    }

    // Update friend request status to 'accepted'
    $updateStmt = $pdo->prepare("UPDATE friend_requests SET status = 'accepted' WHERE request_id = :request_id AND friend_user_id = :user_id");
    $updateResult = $updateStmt->execute(['request_id' => $request_id, 'user_id' => $user_id]);

    if ($updateResult) {
        // Fetch user names for the response message
        $userStmt = $pdo->prepare("SELECT email FROM users WHERE id = :id");
        $userStmt->execute(['id' => $request['user_id']]);
        $userRow = $userStmt->fetch();

        $friendStmt = $pdo->prepare("SELECT email FROM users WHERE id = :id");
        $friendStmt->execute(['id' => $user_id]);
        $friendRow = $friendStmt->fetch();

        http_response_code(200);
        echo json_encode(["message" => "{$friendRow['email']} accepted friend request from {$userRow['email']}"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Internal Server Error - Could not accept friend request"]);
    }
}


function declineFriendRequest($data, $pdo, $user_id) {
    $request_id = $data['request_id'];

    // Fetch details of the friend request
    $stmt = $pdo->prepare("SELECT * FROM friend_requests WHERE request_id = :request_id");
    $stmt->execute(['request_id' => $request_id]);
    $request = $stmt->fetch();

    if (!$request) {
        http_response_code(404);
        echo json_encode(["error" => "Friend request not found"]);
        exit;
    }

    if ($request['friend_user_id'] != $user_id) {
        http_response_code(403);
        echo json_encode(["error" => "Unauthorized to decline this friend request"]);
        exit;
    }

    // Update friend request status to 'declined'
    $updateStmt = $pdo->prepare("UPDATE friend_requests SET status = 'declined' WHERE request_id = :request_id AND friend_user_id = :user_id");
    $updateResult = $updateStmt->execute(['request_id' => $request_id, 'user_id' => $user_id]);

    if ($updateResult) {
        // Fetch user names for the response message
        $userStmt = $pdo->prepare("SELECT email FROM users WHERE id = :id");
        $userStmt->execute(['id' => $request['user_id']]);
        $userRow = $userStmt->fetch();

        $friendStmt = $pdo->prepare("SELECT email FROM users WHERE id = :id");
        $friendStmt->execute(['id' => $user_id]);
        $friendRow = $friendStmt->fetch();

        http_response_code(200);
        echo json_encode(["message" => "{$friendRow['email']} declined friend request from {$userRow['email']}"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Internal Server Error - Could not decline friend request"]);
    }
}
