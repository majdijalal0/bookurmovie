<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/config.php';

try {
    $conn = new PDO(
        "mysql:host=" . DB_SERVER . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8",
        DB_USERNAME,
        DB_PASSWORD
    );
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Connection failed: " . $e->getMessage()]);
    exit();
}

?>