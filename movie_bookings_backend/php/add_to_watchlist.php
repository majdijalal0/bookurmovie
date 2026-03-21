<?php
require_once __DIR__ . '/config.php';
header("Access-Control-Allow-Origin: " . FRONTEND_URL);
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

session_start();
include 'db_connect.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit();
}

if (!isset($data->movie_id) || !isset($data->movie_title)) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid movie data"]);
    exit();
}

$user_id = $_SESSION['user_id'];
$movie_id = $data->movie_id;
$movie_title = $data->movie_title;
$poster_path = isset($data->poster_path) ? $data->poster_path : null;

$check_sql = "SELECT id FROM watchlist WHERE user_id = ? AND movie_id = ?";
$check_stmt = $conn->prepare($check_sql);
$check_stmt->execute([$user_id, $movie_id]);

if ($check_stmt->fetch(PDO::FETCH_ASSOC)) {
    http_response_code(409); 
    echo json_encode(["message" => "Movie already in watchlist"]);
    exit();
}

$sql = "INSERT INTO watchlist (user_id, movie_id, movie_title, poster_path) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

try {
    $stmt->execute([$user_id, $movie_id, $movie_title, $poster_path]);
    http_response_code(201);
    echo json_encode(["message" => "Added to watchlist successfully"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error adding to watchlist: " . $e->getMessage()]);
}

$conn = null;
?>
