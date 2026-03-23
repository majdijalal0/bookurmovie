<?php
require_once __DIR__ . '/cors.php';      
require_once __DIR__ . '/session_config.php';
configure_session();
session_start();                          
require_once __DIR__ . '/db_connect.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit();
}

$user_id = $_SESSION['user_id'];

try {
    $stmt = $conn->prepare("SELECT id, movie_title, movie_image, booking_date, show_time, seats, total_price FROM bookings WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->execute([$user_id]);
    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($bookings as &$booking) {
        $booking['seats'] = json_decode($booking['seats']);
    }

    echo json_encode($bookings);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Database error: " . $e->getMessage()]);
}
?>