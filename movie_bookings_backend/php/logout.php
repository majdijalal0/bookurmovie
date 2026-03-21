<?php
session_start();

require_once __DIR__ . '/config.php';
header("Access-Control-Allow-Origin: " . FRONTEND_URL);
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

session_unset();
session_destroy();

if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

http_response_code(200);
echo json_encode(["message" => "Logout successful"]);
?>