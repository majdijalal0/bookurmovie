<?php
require_once __DIR__ . '/cors.php';      
require_once __DIR__ . '/session_config.php';
configure_session();
session_start();                          
require_once __DIR__ . '/db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit();
}

$user_id = $_SESSION['user_id'];

try {
    $stmt = $conn->prepare("DELETE FROM bookings WHERE user_id = ?");
    $stmt->execute([$user_id]);
    echo json_encode(["message" => "All bookings cleared"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Database error: " . $e->getMessage()]);
}
?>