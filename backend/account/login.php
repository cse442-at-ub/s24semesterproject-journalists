<?php
require_once '../config/config.php'; // Ensure this path is correct

// Enabling CORS for local development
header('Access-Control-Allow-Origin: https://www-student.cse.buffalo.edu');
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

    // Check if email and password are empty and set error messages
    if (empty(trim($data["email"]))) {
        $response['error']['email'] = "Please enter your email.";
    } else {
        $email = trim($data["email"]);
    }

    if (empty(trim($data["password"]))) {
        $response['error']['password'] = "Please enter your password.";
    } else {
        $password = trim($data["password"]);
    }

    // Validate credentials if no previous errors
    if (empty($response['error'])) {
        // Prepare a select statement to fetch user details including email_verified status
        $sql = "SELECT id, email, password, email_verified FROM users WHERE email = :email";

        if ($stmt = $pdo->prepare($sql)) {
            $stmt->bindParam(":email", $param_email, PDO::PARAM_STR);
            $param_email = $email;

            if ($stmt->execute()) {
                if ($stmt->rowCount() == 1) {
                    $row = $stmt->fetch(PDO::FETCH_ASSOC);
                    if ($row['email_verified']) {
                        if (password_verify($password, $row["password"])) {
                            $user_id = $row["id"];
                            $token = bin2hex(random_bytes(16)); // 32 characters long

                            // Insert token into the database
                            $insert_sql = "INSERT INTO user_tokens (user_id, token, expires_at, type) VALUES (:user_id, :token, DATE_ADD(NOW(), INTERVAL 1 HOUR), 'login')";
                            if ($insert_stmt = $pdo->prepare($insert_sql)) {
                                $insert_stmt->bindParam(":user_id", $user_id, PDO::PARAM_INT);
                                $insert_stmt->bindParam(":token", $token, PDO::PARAM_STR);

                                if ($insert_stmt->execute()) {
                                    // Check if it's the user's first login by counting tokens
                                    $token_count_sql = "SELECT COUNT(*) AS token_count FROM user_tokens WHERE user_id = :user_id";
                                    if ($token_count_stmt = $pdo->prepare($token_count_sql)) {
                                        $token_count_stmt->bindParam(":user_id", $user_id, PDO::PARAM_INT);

                                        if ($token_count_stmt->execute()) {
                                            $token_count_row = $token_count_stmt->fetch(PDO::FETCH_ASSOC);
                                            if ($token_count_row) {
                                                $is_first_login = $token_count_row['token_count'] == 1;
                                                $response['first_login'] = $is_first_login;
                                            }
                                        }
                                    }

                                    $response['message'] = "Login successful.";
                                    $response['user_id'] = $user_id;
                                    $response['token'] = $token;
                                } else {
                                    $response['error']['token'] = "Error generating authentication token.";
                                }
                            }
                        } else {
                            $response['error']['credentials'] = "Invalid email or password.";
                        }
                    } else {
                        $response['error']['verify'] = "Email has not been verified. Please check your inbox for a verification email.";
                    }
                } else {
                    $response['error']['credentials'] = "Invalid email or password.";
                }
            } else {
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
