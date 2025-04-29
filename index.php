<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

require_once 'controllers/StudentController.php';

$requestMethod = $_SERVER['REQUEST_METHOD'];
$path = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : '/';

$studentController = new StudentController();

switch ($requestMethod) {
    case 'GET':
        if ($path === '/api/students') {
            $studentController->getAll();
        } elseif (preg_match('#^/api/students/(\d+)$#', $path, $matches)) {
            $id = $matches[1];
            $studentController->getById($id);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Not found']);
        }
        break;

    case 'POST':
        if ($path === '/api/students') {
            $studentController->create();
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Not found']);
        }
        break;
    
    case 'PUT':
        if (preg_match('#^/api/students/(\d+)$#', $path, $matches)) {
            $id = $matches[1];
            $studentController->update($id);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Not found']);
        }
        break;
    
    case 'DELETE':
        if (preg_match('#^/api/students/(\d+)$#', $path, $matches)) {
            $id = $matches[1];
            $studentController->delete($id);
        } elseif ($path === '/api/students') {
            $studentController->deleteMultiple();
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Not found']);
        }
        break;
    
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
