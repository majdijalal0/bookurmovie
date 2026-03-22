<?php
require_once __DIR__ . '/cors.php';      
session_start();                          
require_once __DIR__ . '/db_connect.php';


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