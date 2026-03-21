<?php
session_start();

require_once __DIR__ . '/config.php';
header("Access-Control-Allow-Origin: " . FRONTEND_URL); 
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'db_connect.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->email) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data"]);
    exit();
}

$email = htmlspecialchars(strip_tags($data->email));
$password = $data->password;

try {
    $stmt = $conn->prepare("SELECT id, name, password, phone FROM users WHERE email = ?");
    $stmt->execute([$email]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        unset($user['password']); 
        $_SESSION['user_id'] = $user['id'];
        http_response_code(200);
        echo json_encode(["message" => "Login successful", "user" => $user]);
    } else {
        http_response_code(401);
        echo json_encode(["message" => "Invalid credentials"]);
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Internal Server Error"]);
}
?>