<?php
require_once __DIR__ . '/config.php';
header("Access-Control-Allow-Origin: " . FRONTEND_URL);
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

session_start();
include 'db_connect.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit();
}

$user_id = $_SESSION['user_id'];

$sql = "SELECT movie_id, movie_title, poster_path, added_at FROM watchlist WHERE user_id = ? ORDER BY added_at DESC";
$stmt = $conn->prepare($sql);
$stmt->execute([$user_id]);

$watchlist = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $watchlist[] = [
        'id' => $row['movie_id'],
        'title' => $row['movie_title'],
        'poster_path' => $row['poster_path'],
        'added_at' => $row['added_at']
    ];
}

echo json_encode($watchlist);

$conn = null;
?>
