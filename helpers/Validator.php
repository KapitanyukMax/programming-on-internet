<?php

class Validator {
    public function validateStudent($data) {
        $error = '';
        $requiredFields = ['group', 'firstName', 'lastName', 'gender', 'birthday'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                $error = 'The '.$field.' field is required';
                break;
            }
        }
        
        if ($error) {
            return [
                'valid' => false,
                'error' => $error
            ];
        }
        
        $nameRegex = '/^[A-Z][a-z]*(?:[-\'][A-Z][a-z]*)*$/u';
        
        if (!preg_match($nameRegex, $data['firstName']) || strlen($data['firstName']) <= 2) {
            $error = 'First name must contain only latin letters, \' or - and be at least 3 characters long';
        } elseif (!preg_match($nameRegex, $data['lastName']) || strlen($data['lastName']) <= 2) {
            $error = 'Last name must contain only letters, \' or - and be at least 3 characters long';
        } elseif (!$this->isAgeInRange($data['birthday'], 13, 100)) {
            $error = 'Age must be between 13 and 100 years';
        }
        
        return [
            'valid' => !$error,
            'error' => $error
        ];
    }
    
    public function isAgeInRange($birthday, $minAge, $maxAge) {
        $birthdayDate = new DateTime($birthday);
        $now = new DateTime();
        
        $interval = $birthdayDate->diff($now);
        $age = $interval->y;
        
        return ($age >= $minAge && $age <= $maxAge);
    }
}