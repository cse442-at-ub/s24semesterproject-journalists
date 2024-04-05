<?php
require_once '../config/config.php'; // Ensure this path is correct

// Enabling CORS for local development
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
// Security
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');

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
        // Prepare a select statement to fetch user details including email_verified status
        $sql = "SELECT id, email, password, email_verified FROM users WHERE email = :email";

        if ($stmt = $pdo->prepare($sql)) {
            // Bind variables to the prepared statement as parameters
            $stmt->bindParam(":email", $param_email, PDO::PARAM_STR);
            $param_email = $email;

            // Attempt to execute the prepared statement
            if ($stmt->execute()) {
                // Check if user exists
                if ($stmt->rowCount() == 1) {
                    // Fetch user data
                    $row = $stmt->fetch(PDO::FETCH_ASSOC);

                    // Check if email has been verified
                    if ($row['email_verified']) {
                        // Verify the password
                        if (password_verify($password, $row["password"])) {
                            // Password is correct, so start the login process
                            $user_id = $row["id"];

                            // Generate a new token
                            $token = bin2hex(random_bytes(16)); // 32 characters long

                            // Insert token into the database
                            $insert_sql = "INSERT INTO user_tokens (user_id, token, expires_at, type) VALUES (:user_id, :token, DATE_ADD(NOW(), INTERVAL 1 HOUR), 'login')";
                            if ($insert_stmt = $pdo->prepare($insert_sql)) {
                                $insert_stmt->bindParam(":user_id", $user_id, PDO::PARAM_INT);
                                $insert_stmt->bindParam(":token", $token, PDO::PARAM_STR);

                                if ($insert_stmt->execute()) {
                                    // Token successfully stored
                                    $response['message'] = "Login successful.";
                                    $response['user_id'] = $user_id;
                                    $response['token'] = $token;
                                } else {
                                    // Error storing token
                                    $response['error']['token'] = "Error generating authentication token.";
                                }
                            }
                        } else {
                            // Password is not valid
                            $response['error']['credentials'] = "Invalid email or password.";
                        }
                    } else {
                        // Email has not been verified
                        $response['error']['verify'] = "Email has not been verified. Please check your inbox for a verification email.";
                    }
                } else {
                    // Email doesn't exist
                    $response['error']['credentials'] = "Invalid email or password.";
                }
            } else {
                // SQL execution error
                $response['error']['unexpected'] = "Oops! Something went wrong. Please try again later.";
            }
            unset($stmt);
        }
    }

    // Close connection
    unset($pdo);

    // Send JSON response back to the Axios client
    echo json_encode($response);
}
