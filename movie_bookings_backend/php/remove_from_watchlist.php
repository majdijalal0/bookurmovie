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

if (!isset($data->movie_id)) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid movie data"]);
    exit();
}

$user_id = $_SESSION['user_id'];
$movie_id = $data->movie_id;

$sql = "DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?";
$stmt = $conn->prepare($sql);

try {
    $stmt->execute([$user_id, $movie_id]);
    echo json_encode(["message" => "Removed from watchlist successfully"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error removing from watchlist: " . $e->getMessage()]);
}

$conn = null;
?>
