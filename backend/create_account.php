<?php
require_once 'config.php';

// Enabling CORS for local development
header('Access-Control-Allow-Origin: *'); // In production, set this to your front-end's domain
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// Initialize variables
$email = $password = "";
$response = [];

// Process data when form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Get the input data from the request
    $data = json_decode(file_get_contents("php://input"), true);

    // Validate email
    if (empty(trim($data["email"]))) {
        $response['error']['email'] = "Please enter an email.";
    } else {
        // Prepare a select statement to check if email exists
        $sql = "SELECT id FROM users WHERE email = :email";

        if ($stmt = $pdo->prepare($sql)) {
            // Bind variables to the prepared statement as parameters
            $stmt->bindParam(":email", $param_email, PDO::PARAM_STR);

            // Set parameters
            $param_email = trim($data["email"]);

            // Execute the prepared statement
            if ($stmt->execute()) {
                if ($stmt->rowCount() == 1) {
                    $response['error']['email'] = "This email is already registered.";
                } else {
                    $email = trim($data["email"]);
                }
            } else {
                $response['error']['unexpected'] = "Oops! Something went wrong. Please try again later.";
            }
            unset($stmt);
        }
    }

    // Validate password
    if (empty(trim($data["password"]))) {
        $response['error']['password'] = "Please enter a password.";
    } elseif (strlen(trim($data["password"])) < 6) {
        $response['error']['password'] = "Password must have at least 6 characters.";
    } else {
        $password = trim($data["password"]);
    }

    // Check input errors before inserting in database
    if (empty($response['error'])) {
        // Prepare an insert statement
        $sql = "INSERT INTO users (email, password) VALUES (:email, :password)";

        if ($stmt = $pdo->prepare($sql)) {
            // Bind variables to the prepared statement as parameters
            $stmt->bindParam(":email", $param_email, PDO::PARAM_STR);
            $stmt->bindParam(":password", $param_password, PDO::PARAM_STR);

            // Set parameters and hash the password
            $param_email = $email;
            $param_password = password_hash($password, PASSWORD_DEFAULT);

            // Attempt to execute the prepared statement
            if ($stmt->execute()) {
                $response['message'] = "Account created successfully.";
            } else {
                $response['error']['unexpected'] = "Something went wrong. Please try again later.";
            }
            unset($stmt);
        }
    }

    // Close connection
    unset($pdo);

    // Send JSON response back to the Axios client
    echo json_encode($response);
}
