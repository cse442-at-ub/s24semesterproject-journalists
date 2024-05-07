<?php
require_once '../config/config.php';

// Enabling CORS for local development
header('Access-Control-Allow-Origin: https://www-student.cse.buffalo.edu');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Handle file upload
    $imagePath = ''; // Default image path
    if (isset($_FILES['image'])) {
        $targetDirectory = __DIR__ . '/../uploads/'; // Server path to the uploads directory
        $imageFileType = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
        $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
        $maxSize = 5000000; // 5 MB

        if (in_array($imageFileType, $allowedTypes) && $_FILES['image']['size'] <= $maxSize) {
            $uniqueName = md5(uniqid(rand(), true)) . '.' . $imageFileType;
            $targetFile = $targetDirectory . $uniqueName;

            if (!file_exists($targetDirectory)) {
                mkdir($targetDirectory, 0755, true);
            }

            if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
                $imagePath = 'backend/uploads/' . $uniqueName;
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Internal Server Error - Failed to upload image"]);
                exit;
            }
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Invalid file type or size"]);
            exit;
        }
    }

     // Retrieve user ID from authorization token
    $headers = getallheaders();
    $authHeader = '';
    foreach ($headers as $header => $value) {
        if (strtolower($header) == 'authorization') {
            $authHeader = $value;
            break;
        }
    }

    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $token = $matches[1];
    } else {
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

    // Retrieve profile data from FormData instead of json_decode since we're posting with multipart/form-data
    $first_name = $_POST['firstName'] ?? null;
    $last_name = $_POST['lastName'] ?? null;
    $address = $_POST['address'] ?? null;
    $city = $_POST['city'] ?? null;
    $state = $_POST['state'] ?? null;
    $contact_number = $_POST['contactNumber'] ?? null;

    $updateStmt = $pdo->prepare("INSERT INTO profiles (user_id, first_name, last_name, address, city, state, contact_number, profile_image) VALUES (:user_id, :first_name, :last_name, :address, :city, :state, :contact_number, :profile_image) ON DUPLICATE KEY UPDATE first_name = :first_name, last_name = :last_name, address = :address, city = :city, state = :state, contact_number = :contact_number, profile_image = :profile_image");

    $updateResult = $updateStmt->execute([
        'user_id' => $user_id,
        'first_name' => $first_name,
        'last_name' => $last_name,
        'address' => $address,
        'city' => $city,
        'state' => $state,
        'contact_number' => $contact_number,
        'profile_image' => $imagePath
    ]);

    if ($updateResult) {
        echo json_encode(["message" => "Profile updated successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Internal Server Error - Could not update profile"]);
    }
}
