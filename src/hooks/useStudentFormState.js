import { useState, useEffect } from 'react';
import { studentSections, studentGrades } from '../data/mockData';

const emptyStudentForm = {
  firstName: '',
  middleName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  address: '',
  guardianFirstName: '',
  guardianMiddleName: '',
  guardianLastName: '',
  guardianContact: '',
  guardianRelationship: '',
  gradeLevel: '',
  section: '',
};

export default function useStudentFormState({ isOpen, student, onSave }) {
  const isEdit = Boolean(student);

  const buildFormData = () => {
    if (student) {
      return {
        firstName: student.firstName || '',
        middleName: student.middleName || '',
        lastName: student.lastName || '',
        dateOfBirth: student.dateOfBirth || '',
        gender: student.gender || '',
        address: student.address || '',
        guardianFirstName: student.guardianFirstName || '',
        guardianMiddleName: student.guardianMiddleName || '',
        guardianLastName: student.guardianLastName || '',
        guardianContact: student.guardianContact || '',
        guardianRelationship: student.guardianRelationship || '',
        gradeLevel: student.gradeLevel || '',
        section: student.section || '',
      };
    }
    return { ...emptyStudentForm };
  };

  const [formData, setFormData] = useState(buildFormData);

  useEffect(() => {
    if (isOpen) {
      setFormData(buildFormData());
    }
  }, [isOpen, student]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGuardianChange = (field, value) => {
    setFormData(prev => ({ ...prev, [`guardian${field.charAt(0).toUpperCase() + field.slice(1)}`]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Combine name fields for display if needed
    const fullName = `${formData.lastName}, ${formData.firstName}${formData.middleName ? ' ' + formData.middleName : ''}`;
    const guardianFullName = `${formData.guardianLastName}, ${formData.guardianFirstName}${formData.guardianMiddleName ? ' ' + formData.guardianMiddleName : ''}`;
    
    const studentData = {
      ...formData,
      name: fullName,
      guardianName: guardianFullName,
      id: student?.id || `S${Date.now()}`,
    };
    onSave(studentData);
  };

  return {
    isEdit,
    formData,
    studentSections,
    studentGrades,
    handleChange,
    handleGuardianChange,
    handleSubmit,
  };
}