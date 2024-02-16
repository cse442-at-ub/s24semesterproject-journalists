<?php
$host = 'oceanus.cse.buffalo.edu'; // Replace with your MySQL host
$db   = 'cse442_2024_spring_team_l_db';
$user = 'nlsukhde'; // Your MySQL username
$pass = '50400666'; // Your MySQL password

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["error" => "Could not connect to the database: " . $e->getMessage()]);
    exit;
}

$stmt = $pdo->query("SELECT * FROM messages ORDER BY posted_on DESC");
$messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($messages);
