<?php
define('DB_SERVER', 'oceanus.cse.buffalo.edu');
define('DB_USERNAME', 'nlsukhde');
define('DB_PASSWORD', '50400666');
define('DB_NAME', 'cse442_2024_spring_team_l_db');

/* Attempt to connect to MySQL database */
try {
    $pdo = new PDO("mysql:host=" . DB_SERVER . ";dbname=" . DB_NAME, DB_USERNAME, DB_PASSWORD);
    // Set the PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("ERROR: Could not connect. " . $e->getMessage());
}
