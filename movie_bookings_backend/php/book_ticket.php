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
    echo json_encode(["message" => "Unauthorized. Please log in to book a ticket."]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (
    !isset($data->movie_title) || 
    !isset($data->booking_date) || 
    !isset($data->show_time) || 
    !isset($data->seats) || 
    !isset($data->total_price)
) {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data"]);
    exit();
}

$user_id = $_SESSION['user_id'];
$movie_title = strip_tags($data->movie_title);
$movie_image = isset($data->movie_image) ? strip_tags($data->movie_image) : '';
$booking_date = strip_tags($data->booking_date);
$show_time = strip_tags($data->show_time);
$seats = json_encode($data->seats);
$total_price = $data->total_price;

try {
    $stmt = $conn->prepare("INSERT INTO bookings (user_id, movie_title, movie_image, booking_date, show_time, seats, total_price) VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->execute([$user_id, $movie_title, $movie_image, $booking_date, $show_time, $seats, $total_price]);
    
    http_response_code(201);
    echo json_encode(["message" => "Booking successful"]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Internal Server Error: " . $e->getMessage()]);
}
?>