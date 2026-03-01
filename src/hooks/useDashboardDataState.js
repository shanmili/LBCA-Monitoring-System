import { useState } from 'react';
import { 
  studentsData, 
  atRiskStudents, 
  activityFeed,
  quarterlyPaceData,
  attendanceData 
} from '../data/mockData';

export default function useDashboardDataState() {
  const [filters, setFilters] = useState({
    schoolYear: '2025-2026',
    section: 'All',
    quarter: 'Q2',
    risk: 'All'
  });

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Calculate KPI data
  const totalStudents = studentsData.length;
  
  const filteredStudents = filters.section === 'All' 
    ? studentsData 
    : studentsData.filter(s => s.section === filters.section);
  
  const avgPaceCompletion = filteredStudents.length > 0
    ? (filteredStudents.reduce((sum, s) => sum + s.pacePercent, 0) / filteredStudents.length).toFixed(1)
    : 0;
  
  const behindPace = filteredStudents.filter(s => s.pacePercent < 80).length;
  
  const atRisk = filteredStudents.filter(s => s.riskLevel === 'High' || s.riskLevel === 'Medium').length;

  const kpiData = {
    totalStudents,
    avgPaceCompletion,
    behindPace,
    atRisk,
    quarter: filters.quarter
  };

  // Get trend data - this matches your mockData structure
  const trendData = quarterlyPaceData[filters.quarter] || quarterlyPaceData.Q2;

  // Attendance data
  const attendanceChartData = {
    overallPercentage: 92.3,
    chartData: attendanceData
  };

  // Filter at-risk students
  const filteredAtRisk = filters.section === 'All'
    ? atRiskStudents
    : atRiskStudents.filter(s => s.section === filters.section);

  return {
    filters,
    updateFilter,
    kpiData,
    trendData,
    attendanceData: attendanceChartData,
    atRiskStudents: filteredAtRisk,
    activityFeed
  };
}