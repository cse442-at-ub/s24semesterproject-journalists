<?php
require_once 'config.php';

// Enabling CORS for local development
header('Access-Control-Allow-Origin: *');
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

    // Check if email is empty
    if (empty(trim($data["email"]))) {
        $response['error']['email'] = "Please enter your email.";
    } else {
        $email = trim($data["email"]);
    }

    // Check if password is empty
    if (empty(trim($data["password"]))) {
        $response['error']['password'] = "Please enter your password.";
    } else {
        $password = trim($data["password"]);
    }

    // Validate credentials
    if (empty($response['error'])) {
        // Prepare a select statement
        $sql = "SELECT id, email, password FROM users WHERE email = :email";

        if ($stmt = $pdo->prepare($sql)) {
            // Bind variables to the prepared statement as parameters
            $stmt->bindParam(":email", $param_email, PDO::PARAM_STR);

            // Set parameters
            $param_email = $email;

            // Attempt to execute the prepared statement
            if ($stmt->execute()) {
                // Check if email exists, if yes then verify password
                if ($stmt->rowCount() == 1) {
                    if ($row = $stmt->fetch()) {
                        $hashed_password = $row["password"];
                        if (password_verify($password, $hashed_password)) {
                            // Password is correct
                            $response['message'] = "Login successful.";
                            $response['user'] = [
                                'id' => $row["id"],
                                'email' => $row["email"]
                            ];
                        } else {
                            // Password is not valid
                            $response['error']['credentials'] = "Invalid email or password.";
                        }
                    }
                } else {
                    // Email doesn't exist
                    $response['error']['credentials'] = "Invalid email or password.";
                }
            } else {
                $response['error']['unexpected'] = "Oops! Something went wrong. Please try again later.";
            }

            // Close statement
            unset($stmt);
        }
    }

    // Close connection
    unset($pdo);

    // Send JSON response back to the Axios client
    echo json_encode($response);
}
