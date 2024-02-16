<?php
// It's better to move these to a separate, non-public configuration file
$host = 'oceanus.cse.buffalo.edu';
$db   = 'cse442_2024_spring_team_l_db';
$user = 'nlsukhde';
$pass = '50400666';

header('Content-Type: application/json');
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["error" => "Invalid request method"]);
    exit;
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents("php://input"), true);
    $message = trim($data['message'] ?? '');

    if (empty($message)) {
        http_response_code(400); // Bad Request
        echo json_encode(["error" => "Message is required"]);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO messages (message, posted_on) VALUES (:message, NOW())");
    $stmt->execute(['message' => $message]);
    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["error" => "Could not connect to the database: " . $e->getMessage()]);
}
