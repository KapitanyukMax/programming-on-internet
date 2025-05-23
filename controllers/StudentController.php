<?php
require_once 'models/Student.php';
require_once 'helpers/Validator.php';

class StudentController
{
    private $student;
    private $validator;

    public function __construct()
    {
        $this->student = new Student();
        $this->validator = new Validator();
    }

    public function getAll()
    {
        $students = $this->student->getAll();

        echo json_encode([
            'status' => true,
            'error' => null,
            'students' => $students
        ]);
    }

    public function getById($id)
    {
        $student = $this->student->getById($id);

        if ($student) {
            echo json_encode([
                'status' => true,
                'error' => null,
                'student' => $student
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                'status' => false,
                'error' => 'Student not found',
            ]);
        }
    }

    public function create()
    {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data) {
            http_response_code(400);
            echo json_encode([
                'status' => false,
                'error' => 'Invalid JSON data'
            ]);
            return;
        }

        $validationResult = $this->validator->validateStudent($data);

        if (!$validationResult['valid']) {
            http_response_code(422);
            echo json_encode([
                'status' => false,
                'error' => $validationResult['error']
            ]);
            return;
        }

        $result = $this->student->create($data);

        if ($result) {
            echo json_encode([
                'status' => true,
                'error' => null,
                'student' => $result,
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'status' => false,
                'error' => 'Failed to create student'
            ]);
        }
    }

    public function update($id)
    {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data) {
            http_response_code(400);
            echo json_encode([
                'status' => false,
                'error' => 'Invalid JSON data'
            ]);
            return;
        }

        $data['id'] = $id;

        $validationResult = $this->validator->validateStudent($data);

        if (!$validationResult['valid']) {
            http_response_code(422);
            echo json_encode([
                'status' => false,
                'error' => $validationResult['error']
            ]);
            return;
        }

        $result = $this->student->update($id, $data);

        if ($result) {
            echo json_encode([
                'status' => true,
                'error' => null,
                'student' => $result
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'status' => false,
                'error' => 'Failed to update student'
            ]);
        }
    }

    public function delete($id)
    {
        $result = $this->student->delete($id);

        if ($result) {
            echo json_encode([
                'status' => true,
                'error' => null,
                'message' => 'Student deleted successfully'
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'status' => false,
                'error' => 'Failed to delete student'
            ]);
        }
    }

    public function deleteMultiple()
    {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data || !isset($data['ids']) || !is_array($data['ids'])) {
            http_response_code(400);
            echo json_encode([
                'status' => false,
                'error' => 'Invalid JSON data'
            ]);
            return;
        }

        $result = $this->student->deleteMultiple($data['ids']);

        if ($result) {
            echo json_encode([
                'status' => true,
                'error' => null,
                'message' => 'Students deleted successfully'
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'status' => false,
                'error' => 'Failed to delete students'
            ]);
        }
    }
}
