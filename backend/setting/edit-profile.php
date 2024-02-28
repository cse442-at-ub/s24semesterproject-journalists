<?php
require_once '../config/config.php';

// Enabling CORS for local development
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// Decode the received JSON data
$data = json_decode(file_get_contents("php://input"), true);

// Get the Bearer Token from the Authorization header
$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
$token = '';
if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    $token = $matches[1];
} else {
    // Token not provided or invalid format
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized - Token not provided or invalid"]);
    exit;
}

// Validate the token and get user_id
$stmt = $pdo->prepare("SELECT user_id FROM user_tokens WHERE token = :token AND expires_at > NOW()");
$stmt->execute(['token' => $token]);
$tokenRow = $stmt->fetch();

if (!$tokenRow) {
    // Token is invalid or expired
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized - Invalid token"]);
    exit;
}

// Get user_id from the valid token
$user_id = $tokenRow['user_id'];

// Extract profile data from the request
$first_name = isset($data['first_name']) ? $data['first_name'] : null;
$last_name = isset($data['last_name']) ? $data['last_name'] : null;
$address = isset($data['address']) ? $data['address'] : null;
$city = isset($data['city']) ? $data['city'] : null;
$state = isset($data['state']) ? $data['state'] : null;
$contact_number = isset($data['contact_number']) ? $data['contact_number'] : null;

// Prepare the update statement
$updateStmt = $pdo->prepare("INSERT INTO profiles (user_id, first_name, last_name, address, city, state, contact_number) VALUES (:user_id, :first_name, :last_name, :address, :city, :state, :contact_number) ON DUPLICATE KEY UPDATE first_name = :first_name, last_name = :last_name, address = :address, city = :city, state = :state, contact_number = :contact_number");

$updateResult = $updateStmt->execute([
    'user_id' => $user_id,
    'first_name' => $first_name,
    'last_name' => $last_name,
    'address' => $address,
    'city' => $city,
    'state' => $state,
    'contact_number' => $contact_number,
]);

// Respond to the client
if ($updateResult) {
    echo json_encode(["message" => "Profile updated successfully"]);
} else {
    // Update failed
    http_response_code(500);
    echo json_encode(["error" => "Internal Server Error - Could not update profile"]);
}