<?php
require_once '../config/config.php';

// Enabling CORS for local development
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
// Security
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');


// Decode JSON data for non-file fields
$data = json_decode(file_get_contents("php://input"), true);

// Handle multipart/form-data for the image file manually if needed

// Get the Bearer Token from the Authorization header
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

// Validate the token and get user_id
$stmt = $pdo->prepare("SELECT user_id FROM user_tokens WHERE token = :token AND expires_at > NOW()");
$stmt->execute(['token' => $token]);
$tokenRow = $stmt->fetch();

if (!$tokenRow) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized - Invalid token"]);
    exit;
}

$user_id = $tokenRow['user_id'];

$title = $_POST['title']; // Assuming title is sent as part of form-data
$body = $_POST['body']; // Assuming body is sent as part of form-data

$imagePath = ''; // Default image path

// Check if an image file is part of the request
if (isset($_FILES['image'])) {
    $targetDirectory = "/path/to/your/uploads/directory/"; // Use a path outside of the webroot if possible

    // Validate the image (check file type, size, etc.)
    $imageFileType = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
    $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
    $maxSize = 5000000; // 5 MB

    if (in_array($imageFileType, $allowedTypes) && $_FILES['image']['size'] <= $maxSize) {
        // Create a unique filename for the image to prevent overwrites and potential directory traversal issues
        $uniqueName = md5(uniqid(rand(), true)) . '.' . $imageFileType;
        $targetFile = $targetDirectory . $uniqueName;

        // Attempt to move the uploaded file to the target directory
        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
            // Here, convert the file system path to a URL or relative path to be used in your application
            $imagePath = 'uploads/' . $uniqueName;
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

$insertStmt = $pdo->prepare("INSERT INTO journal_entries (user_id, title, body, image_path) VALUES (:user_id, :title, :body, :image_path)");
$insertResult = $insertStmt->execute([
    'user_id' => $user_id,
    'title' => $title,
    'body' => $body,
    'image_path' => $imagePath
]);

if ($insertResult) {
    $createdId = $pdo->lastInsertId();
    http_response_code(201);
    echo json_encode(["message" => "Journal entry created successfully", "id" => $createdId, "image_path" => $imagePath]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Internal Server Error - Could not create journal entry"]);
}
