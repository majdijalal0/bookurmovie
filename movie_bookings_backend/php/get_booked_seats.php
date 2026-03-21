<?php
session_start();
require_once __DIR__ . '/config.php';
header("Access-Control-Allow-Origin: " . FRONTEND_URL);
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include 'db_connect.php';

$movie_title = isset($_GET['movie_title']) ? $_GET['movie_title'] : '';
$booking_date = isset($_GET['booking_date']) ? $_GET['booking_date'] : '';
$show_time = isset($_GET['show_time']) ? $_GET['show_time'] : '';

if (empty($movie_title) || empty($booking_date) || empty($show_time)) {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data: movie_title, booking_date, and show_time are required."]);
    exit();
}

try {
    $stmt = $conn->prepare("SELECT seats FROM bookings WHERE movie_title = ? AND booking_date = ? AND show_time = ?");
    $stmt->execute([$movie_title, $booking_date, $show_time]);
    
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $booked_seats = [];
    foreach ($results as $row) {
        $seats_array = json_decode($row['seats'], true);
        if (is_array($seats_array)) {
            $booked_seats = array_merge($booked_seats, $seats_array);
        }
    }
    
    echo json_encode(array_values(array_unique($booked_seats)));
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Internal Server Error: " . $e->getMessage()]);
}
?>