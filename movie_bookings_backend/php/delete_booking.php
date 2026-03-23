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
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->booking_id)) {
    http_response_code(400);
    echo json_encode(["message" => "Booking ID is required"]);
    exit();
}

$booking_id = $data->booking_id;

try {
    $stmt = $conn->prepare("DELETE FROM bookings WHERE id = ? AND user_id = ?");
    $stmt->execute([$booking_id, $user_id]);

    echo json_encode(["message" => "Booking deleted successfully"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Database error: " . $e->getMessage()]);
}
?>