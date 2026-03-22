<?php
define('FRONTEND_URL', getenv('FRONTEND_URL') ?: 'https://bookurmovie.vercel.app');
define('DB_SERVER',   getenv('MYSQLHOST')     ?: 'localhost');
define('DB_PORT',     getenv('MYSQLPORT')     ?: '3306');
define('DB_NAME',     getenv('MYSQLDATABASE') ?: 'movies_booking');
define('DB_USERNAME', getenv('MYSQLUSER')     ?: 'root');
define('DB_PASSWORD', getenv('MYSQLPASSWORD') ?: '');
?>