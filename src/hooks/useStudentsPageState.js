import { useEffect, useMemo, useState } from 'react';
import { studentsData } from '../data/mockData';
import {
  createStudent,
  listStudents,
  mapStudentFormToApi,
  mapStudentToUi,
} from '../api/studentsApi';
import { listEarlyWarnings, listStudentPaces } from '../api/warningPaceApi';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadStudents = async () => {
      setLoading(true);
      setError('');

      try {
        const [studentRows, warningRows, paceRows] = await Promise.all([
          listStudents(),
          listEarlyWarnings(),
          listStudentPaces(),
        ]);

        const warningByStudentId = new Map(
          (warningRows || []).map((item) => [String(item.student), item])
        );
        const paceByStudentId = new Map(
          (paceRows || []).map((item) => [String(item.student), item])
        );

        const mapped = (studentRows || []).map((student) =>
          mapStudentToUi(
            student,
            warningByStudentId.get(String(student.id)),
            paceByStudentId.get(String(student.id))
          )
        );

        if (isMounted) {
          setStudents(mapped);
        }
      } catch (requestError) {
        if (!isMounted) {
          return;
        }
        setStudents(studentsData);
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load students from API.'
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadStudents();

    return () => {
      isMounted = false;
    };
  }, []);

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

  const filteredStudents = useMemo(getFilteredStudents, [students, teacher, searchTerm, filters]);

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

  const handleAddStudent = async (formData) => {
    try {
      const payload = mapStudentFormToApi(formData);
      const created = await createStudent(payload);

      const newStudent = {
        ...mapStudentToUi(created),
        gradeLevel: formData.gradeLevel,
        section: formData.section,
      };

      setStudents((prev) => [...prev, newStudent]);
      setError('');
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to create student.'
      );
      throw requestError;
    }
  };

  return {
    SCHOOL_YEARS,
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    students,
    filteredStudents,
    loading,
    error,
    getStatusBadgeClass,
    handleAddStudent,
  };
}