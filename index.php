<?php
$host = 'oceanus.cse.buffalo.edu'; // Replace with your MySQL host
$db   = 'cse442_2024_spring_team_l_db';
$user = 'nlsukhde'; // Your MySQL username
$pass = '50400666'; // Your MySQL password

// Create a new PDO instance
try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Could not connect to the database $db :" . $e->getMessage());
}

// Handling form submission
if ($_SERVER["REQUEST_METHOD"] == "POST" && !empty($_POST['message'])) {
    $stmt = $pdo->prepare("INSERT INTO messages (message) VALUES (:message)");
    $stmt->execute(['message' => $_POST['message']]);
}

// Fetching messages
$stmt = $pdo->query("SELECT * FROM messages ORDER BY posted_on DESC");
$messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html>

<head>
    <title>Guestbook</title>
</head>

<body>
    <h1>Guestbook</h1>

    <form method="post">
        <textarea name="message" placeholder="Leave your message here"></textarea>
        <button type="submit">Post Message</button>
    </form>

    <h2>Messages</h2>
    <?php foreach ($messages as $message) : ?>
        <p>
            <strong>Posted on:</strong> <?php echo $message['posted_on']; ?><br>
            <?php echo htmlspecialchars($message['message']); ?>
        </p>
    <?php endforeach; ?>
</body>

</html>