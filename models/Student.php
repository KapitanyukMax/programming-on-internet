<?php

class Student
{
    private $pdo;

    public function __construct()
    {
        try {
            $host = 'localhost';
            $db = 'student_db';
            $user = 'root';
            $pass = '';
            $charset = 'utf8mb4';

            $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];

            $this->pdo = new PDO($dsn, $user, $pass, $options);
            $this->createTable();
        } catch (PDOException $e) {
            throw new Exception("Database connection failed: " . $e->getMessage());
        }
    }

    private function createTable()
    {
        $sql = "CREATE TABLE IF NOT EXISTS students (
            id INT AUTO_INCREMENT PRIMARY KEY,
            `firstName` VARCHAR(100),
            `lastName` VARCHAR(100),
            `email` VARCHAR(100),
            `group` VARCHAR(50),
            `gender` VARCHAR(10),
            `birthday` DATE,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";

        $this->pdo->exec($sql);
    }

    public function getAll()
    {
        $stmt = $this->pdo->query("SELECT * FROM students");
        return $stmt->fetchAll();
    }

    public function getById($id)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM students WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function create($data)
    {
        if (isset($data['id']))
            unset($data['id']);

        $fields = array_keys($data);

        $escapedFields = array_map(function ($field) {
            return "`" . $field . "`";
        }, $fields);

        $placeholders = array_fill(0, count($fields), '?');

        $sql = "INSERT INTO students (" . implode(', ', $escapedFields) . ") 
                VALUES (" . implode(', ', $placeholders) . ")";

        $stmt = $this->pdo->prepare($sql);
        $result = $stmt->execute(array_values($data));

        if ($result) {
            $data['id'] = $this->pdo->lastInsertId();
            return $data;
        }

        return false;
    }

    public function update($id, $data)
    {
        $data['id'] = $id;

        $fields = [];
        foreach (array_keys($data) as $key) {
            if ($key !== 'id') {
                $fields[] = "`$key` = :$key";
            }
        }

        $sql = "UPDATE students SET " . implode(', ', $fields) . " WHERE id = :id";

        $stmt = $this->pdo->prepare($sql);
        $result = $stmt->execute($data);

        return $result ? $data : false;
    }

    public function delete($id)
    {
        $stmt = $this->pdo->prepare("DELETE FROM students WHERE id = ?");
        $result = $stmt->execute([$id]);

        return $result;
    }

    public function deleteMultiple($ids)
    {
        if (empty($ids)) {
            return false;
        }

        $placeholders = implode(',', array_fill(0, count($ids), '?'));

        $sql = "DELETE FROM students WHERE id IN ($placeholders)";
        $stmt = $this->pdo->prepare($sql);
        $result = $stmt->execute($ids);

        return $result;
    }
}
