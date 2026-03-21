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

if (!isset($data->name) || !isset($data->email) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data"]);
    exit();
}

if (!filter_var($data->email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid email format"]);
    exit();
}

$name = htmlspecialchars(strip_tags($data->name));
$email = htmlspecialchars(strip_tags($data->email));
$password = password_hash($data->password, PASSWORD_DEFAULT);
$phone = isset($data->phone) ? htmlspecialchars(strip_tags($data->phone)) : '';

try {
    $checkStmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $checkStmt->execute([$email]);
    if ($checkStmt->rowCount() > 0) {
        http_response_code(409);
        echo json_encode(["message" => "Email already exists"]);
        exit();
    }

    $stmt = $conn->prepare("INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)");
    $stmt->execute([$name, $email, $password, $phone]);
    
    $userId = $conn->lastInsertId();
    $_SESSION['user_id'] = $userId;
    
    http_response_code(201);
    echo json_encode([
        "id" => $userId,
        "name" => $name,
        "email" => $email,
        "phone" => $phone
    ]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Internal Server Error"]);
}
?>
