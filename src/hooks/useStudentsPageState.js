import { useState } from 'react';
import { studentsData } from '../data/mockData';

const SCHOOL_YEARS = ['2025-2026', '2024-2025', '2023-2024'];

export default function useStudentsPageState(teacher = null) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    schoolYear: '2025-2026',
    gradeLevel: 'All',
    section: 'All',
    status: 'All'
  });
  const [students, setStudents] = useState(studentsData);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Filter students based on teacher's assignments
  const getFilteredStudents = () => {
    let filtered = students;

    // If teacher, only show students in their assigned grades/sections
    if (teacher) {
      filtered = filtered.filter(student => {
        const gradeMatch = teacher.assignedGrades?.includes(student.gradeLevel);
        const sectionMatch = teacher.assignedSections?.includes(student.section);
        return gradeMatch || sectionMatch;
      });
    }

    // Apply search and filters
    return filtered.filter(student => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      const lastName = student.lastName.toLowerCase();
      const matchesSearch = 
        fullName.includes(searchTerm.toLowerCase()) ||
        lastName.includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGrade = filters.gradeLevel === 'All' || student.gradeLevel === filters.gradeLevel;
      const matchesSection = filters.section === 'All' || student.section === filters.section;
      const matchesStatus = filters.status === 'All' || student.status === filters.status;
      
      return matchesSearch && matchesGrade && matchesSection && matchesStatus;
    });
  };

  const filteredStudents = getFilteredStudents();

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Behind':
      case 'At Risk':
        return 'status-badge at-risk';
      case 'On Track':
        return 'status-badge on-track';
      default:
        return 'status-badge';
    }
  };

  const handleAddStudent = (formData) => {
    const newId = 'S' + String(students.length + 1).padStart(3, '0');
    const newStudent = { 
      ...formData, 
      id: newId,
      pacePercent: 0,
      attendance: 0,
      subjects: [],
      attendanceSummary: { present: 0, late: 0, absent: 0 },
      riskDetails: []
    };
    setStudents(prev => [...prev, newStudent]);
    studentsData.push(newStudent);
  };

  return {
    SCHOOL_YEARS,
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    students,
    filteredStudents,
    getStatusBadgeClass,
    handleAddStudent,
  };
}