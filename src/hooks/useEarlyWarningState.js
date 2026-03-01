import { useState } from 'react';
import { studentsData } from '../data/mockData';

const SCHOOL_YEARS = ['2025-2026', '2024-2025', '2023-2024'];

export default function useEarlyWarningState() {
  const [filters, setFilters] = useState({
    schoolYear: '2025-2026',
    risk: 'All',
    section: 'All'
  });

  const allStudents = studentsData;

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredStudents = allStudents.filter(student => {
    const matchesRisk = filters.risk === 'All' || student.riskLevel === filters.risk;
    const matchesSection = filters.section === 'All' || student.section === filters.section;
    return matchesRisk && matchesSection;
  });

  const riskCounts = {
    high: allStudents.filter(s => s.riskLevel === 'High').length,
    medium: allStudents.filter(s => s.riskLevel === 'Medium').length,
    low: allStudents.filter(s => s.riskLevel === 'Low').length,
  };

  return {
    SCHOOL_YEARS,
    filters,
    updateFilter,
    allStudents,
    filteredStudents,
    riskCounts,
  };
}
