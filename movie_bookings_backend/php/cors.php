<?php
if (file_exists(__DIR__ . '/config.php')) {
    require_once __DIR__ . '/config.php';
}

$allowed_origin = defined('FRONTEND_URL') ? FRONTEND_URL : (getenv('FRONTEND_URL') ?: 'https://bookurmovie.vercel.app');

$allowed_origin = rtrim($allowed_origin, '/');

$origin = isset($_SERVER['HTTP_ORIGIN']) ? rtrim($_SERVER['HTTP_ORIGIN'], '/') : '';

if ($origin === $allowed_origin || $origin === 'http://localhost:5173') {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
} else {
    header("Access-Control-Allow-Origin: " . $allowed_origin);
}

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>