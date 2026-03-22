<?php
require_once __DIR__ . '/cors.php';      
session_start();                          
require_once __DIR__ . '/db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}



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
