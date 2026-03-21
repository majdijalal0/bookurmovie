<?php
session_start();

require_once __DIR__ . '/config.php';
header("Access-Control-Allow-Origin: " . FRONTEND_URL); 
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include 'db_connect.php';

if (isset($_SESSION['user_id'])) {
    try {
        $stmt = $conn->prepare("SELECT id, name, email, phone FROM users WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            echo json_encode(['loggedIn' => true, 'user' => $user]);
        } else {
            echo json_encode(['loggedIn' => false]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['loggedIn' => false, 'message' => 'Database error']);
    }
} else {
    echo json_encode(['loggedIn' => false]);
}
?>