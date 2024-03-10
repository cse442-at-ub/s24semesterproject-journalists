<?php
require_once '../config/config.php';



// Authentication and user verification (extracted user_id from token)
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

// Assuming entry_id is passed as part of the form-data
$entry_id = $_POST['entry_id'];
$title = $_POST['title'];
$body = $_POST['body'];

// Handle file upload if an image is provided
$imagePath = ''; // Default to empty, indicating no change to existing image path
if (isset($_FILES['image'])) {
    $targetDirectory = "/web/CSE442-542/2024-Spring/cse-442l/backend/uploads/";
    // Ensure this directory exists and is writable
    $targetFile = $targetDirectory . basename($_FILES['image']['name']);

    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
        $imagePath = $targetFile; // Adjust this path as necessary
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Internal Server Error - Failed to upload image"]);
        exit;
    }
}

// Prepare the update statement, including the new image path if an image was uploaded
$updateSql = "UPDATE journal_entries SET title = :title, body = :body" . ($imagePath ? ", image_path = :image_path" : "") . " WHERE id = :entry_id AND user_id = :user_id";
$updateStmt = $pdo->prepare($updateSql);

// Bind parameters
$updateStmt->bindParam(':title', $title);
$updateStmt->bindParam(':body', $body);
$updateStmt->bindParam(':entry_id', $entry_id, PDO::PARAM_INT);
$updateStmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
if ($imagePath) {
    $updateStmt->bindParam(':image_path', $imagePath);
}

// Execute the update
$updateResult = $updateStmt->execute();

if ($updateResult) {
    echo json_encode(["message" => "Journal entry updated successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Internal Server Error - Could not update journal entry"]);
}
