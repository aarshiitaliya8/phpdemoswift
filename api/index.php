<?php
$request_uri = $_SERVER['REQUEST_URI'] ?? '/';
$path = parse_url($request_uri, PHP_URL_PATH);
$file = ltrim($path, '/');
if (!empty($file) && file_exists(__DIR__ . '/../' . $file) && is_file(__DIR__ . '/../' . $file) && pathinfo($file, PATHINFO_EXTENSION) === 'php') {
    chdir(__DIR__ . '/..');
    require __DIR__ . '/../' . $file;
} else {
    chdir(__DIR__ . '/..');
    require __DIR__ . '/../index.php';
}
