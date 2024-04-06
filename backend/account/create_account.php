<?php
require_once '../config/config.php'; // Make sure this path is correct


// Enabling CORS for local development
header('Access-Control-Allow-Origin: https://www-student.cse.buffalo.edu');
// Security
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');
// Initialize variables
$email = $password = "";
$response = [];

// Process data when form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    // Validate email
    if (empty(trim($data["email"]))) {
        $response['error']['email'] = "Please enter an email.";
    } else {
        $sql = "SELECT id FROM users WHERE email = :email";
        if ($stmt = $pdo->prepare($sql)) {
            $stmt->bindParam(":email", $param_email, PDO::PARAM_STR);
            $param_email = trim($data["email"]);
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
        // Generate a unique verification token
        $token = bin2hex(random_bytes(16));

        // Prepare an insert statement for the user
        $sql = "INSERT INTO users (email, password, email_verified) VALUES (:email, :password, FALSE)";
        if ($stmt = $pdo->prepare($sql)) {
            $stmt->bindParam(":email", $param_email, PDO::PARAM_STR);
            $stmt->bindParam(":password", $param_password, PDO::PARAM_STR);

            // Set parameters and hash the password
            $param_email = $email;
            $param_password = password_hash($password, PASSWORD_DEFAULT);

            if ($stmt->execute()) {
                $user_id = $pdo->lastInsertId();

                // Insert the verification token into the user_tokens table
                $expires_at = date('Y-m-d H:i:s', strtotime('+1 day')); // Token expires in 1 day
                $sql = "INSERT INTO user_tokens (user_id, token, expires_at, type) VALUES (:user_id, :token, :expires_at, 'email_verification')";
                if ($stmt = $pdo->prepare($sql)) {
                    $stmt->bindParam(":user_id", $user_id, PDO::PARAM_INT);
                    $stmt->bindParam(":token", $token, PDO::PARAM_STR);
                    $stmt->bindParam(":expires_at", $expires_at, PDO::PARAM_STR);
                    if ($stmt->execute()) {
                        // Send verification email
                        $verificationLink = "http://localhost/React-Guestbook/backend/account/verify.php?token=" . $token;
                        $subject = "Verify Your Email for Journalist";
                        $headers = "From: no-reply@journalist.com\r\n";
                        $headers .= "Reply-To: no-reply@journalist.com\r\n";
                        $headers .= "Content-type: text/html\r\n";
                        $message = "<html><body>";
                        $message .= "<p>Please click on the following link to verify your email for Journalist:</p>";
                        $message .= "<a href='" . $verificationLink . "'>Verify Email</a>";
                        $message .= "</body></html>";
                        if (mail($email, $subject, $message, $headers)) {
                            $response['message'] = "Verification email sent. Please check your email to verify your account.";
                        } else {
                            $response['error']['mail'] = "Failed to send verification email.";
                        }
                    }
                }
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
