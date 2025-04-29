<?php
// For this mini-backend, we'll use file-based storage
// In a real application, you would connect to a database

class Student {
    private $dataFile = 'data/students.json';
    
    public function __construct() {
        if (!file_exists('data')) {
            mkdir('data', 0755, true);
        }
        
        if (!file_exists($this->dataFile)) {
            file_put_contents($this->dataFile, json_encode([]));
        }
    }
    
    public function getAll() {
        $data = file_get_contents($this->dataFile);
        return json_decode($data, true);
    }
    
    public function getById($id) {
        $students = $this->getAll();
        
        foreach ($students as $student) {
            if ($student['id'] == $id) {
                return $student;
            }
        }
        
        return null;
    }
    
    public function create($data) {
        $students = $this->getAll();
        
        $maxId = 0;
        foreach ($students as $student) {
            if ($student['id'] > $maxId) {
                $maxId = $student['id'];
            }
        }
        
        $data['id'] = $maxId + 1;
        $students[] = $data;
        
        $result = file_put_contents($this->dataFile, json_encode($students));
        
        return $result ? $data : false;
    }
    
    public function update($id, $data) {
        $students = $this->getAll();
        $updated = false;
        
        foreach ($students as $key => $student) {
            if ($student['id'] == $id) {
                $students[$key] = $data;
                $updated = true;
                break;
            }
        }
        
        if (!$updated) {
            return false;
        }
        
        $result = file_put_contents($this->dataFile, json_encode($students));
        
        return $result ? $data : false;
    }
    
    public function delete($id) {
        $students = $this->getAll();
        $newStudents = [];
        $deleted = false;
        
        foreach ($students as $student) {
            if ($student['id'] != $id) {
                $newStudents[] = $student;
            } else {
                $deleted = true;
            }
        }
        
        if (!$deleted) {
            return false;
        }
        
        $result = file_put_contents($this->dataFile, json_encode($newStudents));
        
        return $result ? true : false;
    }
    
    public function deleteMultiple($ids) {
        $students = $this->getAll();
        $newStudents = [];
        
        foreach ($students as $student) {
            if (!in_array($student['id'], $ids)) {
                $newStudents[] = $student;
            }
        }
        
        $result = file_put_contents($this->dataFile, json_encode($newStudents));
        
        return $result ? true : false;
    }
}
