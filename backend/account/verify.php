<?php

// Enabling CORS for local development
header('Access-Control-Allow-Origin: https://www-student.cse.buffalo.edu');
// Security
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');

require_once '../config/config.php'; // Adjust the path as needed

$response = []; // To store the response messages

if (isset($_GET['token'])) {
    $token = $_GET['token'];

    // Prepare a select statement to find the token
    $sql = "SELECT user_id, expires_at FROM user_tokens WHERE token = :token AND type = 'email_verification'";
    if ($stmt = $pdo->prepare($sql)) {
        $stmt->bindParam(":token", $token, PDO::PARAM_STR);

        if ($stmt->execute()) {
            if ($stmt->rowCount() == 1) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                $user_id = $row['user_id'];
                $expires_at = strtotime($row['expires_at']);
                $current_time = time();

                if ($current_time <= $expires_at) {
                    // Token is valid, update user's email_verified status
                    $updateSql = "UPDATE users SET email_verified = TRUE WHERE id = :user_id";
                    if ($updateStmt = $pdo->prepare($updateSql)) {
                        $updateStmt->bindParam(":user_id", $user_id, PDO::PARAM_INT);

                        if ($updateStmt->execute()) {
                            // Successfully verified email
                            $response['message'] = "Email successfully verified.";

                            // Optionally, delete the token
                            $deleteSql = "DELETE FROM user_tokens WHERE token = :token";
                            if ($deleteStmt = $pdo->prepare($deleteSql)) {
                                $deleteStmt->bindParam(":token", $token, PDO::PARAM_STR);
                                $deleteStmt->execute();
                            }
                        } else {
                            $response['error'] = "An error occurred while updating your account.";
                        }
                    }
                } else {
                    // Token has expired
                    $response['error'] = "Verification link has expired. Please try registering again.";
                }
            } else {
                // Token not found
                $response['error'] = "Invalid verification link.";
            }
        } else {
            $response['error'] = "An error occurred. Please try again later.";
        }
        unset($stmt);
    }
} else {
    // No token provided
    $response['error'] = "No verification token provided.";
}

echo json_encode($response);
