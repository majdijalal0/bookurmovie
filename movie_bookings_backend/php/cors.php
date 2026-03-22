<?php
$allowed_origin = getenv('FRONTEND_URL') ?: 'https://bookurmovie.vercel.app';
header("Access-Control-Allow-Origin: " . $allowed_origin);
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>