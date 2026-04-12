import { useEffect, useMemo, useState } from 'react';
import { studentsData } from '../data/mockData';
import { listStudents, mapStudentToUi } from '../api/studentsApi';
import { listEarlyWarnings } from '../api/warningPaceApi';

const SCHOOL_YEARS = ['2025-2026', '2024-2025', '2023-2024'];

export default function useEarlyWarningState() {
  const [filters, setFilters] = useState({
    schoolYear: '2025-2026',
    gradeLevel: 'All',
    risk: 'All',
    section: 'All'
  });
  const [allStudents, setAllStudents] = useState(studentsData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadWarnings = async () => {
      setLoading(true);
      setError('');

      try {
        const [studentRows, warningRows] = await Promise.all([
          listStudents(),
          listEarlyWarnings(),
        ]);

        const warningByStudentId = new Map(
          (warningRows || []).map((item) => [String(item.student), item])
        );

        const merged = (studentRows || []).map((student) =>
          mapStudentToUi(student, warningByStudentId.get(String(student.id)))
        );

        if (isMounted) {
          setAllStudents(merged);
        }
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setAllStudents(studentsData);
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load early warnings from API.'
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadWarnings();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredStudents = useMemo(() => allStudents.filter(student => {
    const matchesRisk = filters.risk === 'All' || student.riskLevel === filters.risk;
    const matchesGrade = filters.gradeLevel === 'All' || student.gradeLevel === filters.gradeLevel;
    const matchesSection = filters.section === 'All' || student.section === filters.section;
    return matchesRisk && matchesGrade && matchesSection;
  }), [allStudents, filters]);

  const riskCounts = useMemo(() => ({
    high: allStudents.filter((s) => s.riskLevel === 'High').length,
    medium: allStudents.filter((s) => s.riskLevel === 'Medium').length,
    low: allStudents.filter((s) => s.riskLevel === 'Low').length,
  }), [allStudents]);

  return {
    SCHOOL_YEARS,
    filters,
    updateFilter,
    allStudents,
    filteredStudents,
    riskCounts,
    loading,
    error,
  };
}
