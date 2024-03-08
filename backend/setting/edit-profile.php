<?php
require_once '../config/config.php';


if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

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
        // Token not provided or invalid format
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized - Token not provided or invalid"]);
        exit;
    }


    $stmt = $pdo->prepare("SELECT user_id FROM user_tokens WHERE token = :token AND expires_at > NOW()");
    $stmt->execute(['token' => $token]);
    $tokenRow = $stmt->fetch();

    if (!$tokenRow) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized - Invalid token"]);
        exit;
    }

    $user_id = $tokenRow['user_id'];
    $first_name = isset($data['firstName']) ? $data['firstName'] : null;
    $last_name = isset($data['lastName']) ? $data['lastName'] : null;
    $address = isset($data['address']) ? $data['address'] : null;
    $city = isset($data['city']) ? $data['city'] : null;
    $state = isset($data['state']) ? $data['state'] : null;
    $contact_number = isset($data['contactNumber']) ? $data['contactNumber'] : null;

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

    if ($updateResult) {
        echo json_encode(["message" => "Profile updated successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Internal Server Error - Could not update profile"]);
    }
}
