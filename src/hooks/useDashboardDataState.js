import { useEffect, useState } from 'react';
import {
  studentsData,
  atRiskStudents,
  activityFeed,
  quarterlyPaceData,
  attendanceData,
} from '../data/mockData';
import { fetchDashboardData } from '../api/dashboardApi';

const USE_MOCK_FALLBACK = import.meta.env.VITE_USE_MOCK_FALLBACK !== 'false';
const DASHBOARD_ENDPOINT = import.meta.env.VITE_DASHBOARD_ENDPOINT || '';

const buildMockDashboardData = (filters) => {
  const filteredStudents =
    filters.section === 'All'
      ? studentsData
      : studentsData.filter((s) => s.section === filters.section);

  const avgPaceCompletion =
    filteredStudents.length > 0
      ? (
          filteredStudents.reduce((sum, s) => sum + s.pacePercent, 0) /
          filteredStudents.length
        ).toFixed(1)
      : 0;

  const behindPace = filteredStudents.filter((s) => s.pacePercent < 80).length;
  const atRisk = filteredStudents.filter(
    (s) => s.riskLevel === 'High' || s.riskLevel === 'Medium'
  ).length;

  const filteredAtRisk =
    filters.section === 'All'
      ? atRiskStudents
      : atRiskStudents.filter((s) => s.section === filters.section);

  return {
    kpiData: {
      totalStudents: studentsData.length,
      avgPaceCompletion,
      behindPace,
      atRisk,
      quarter: filters.quarter,
    },
    trendData: quarterlyPaceData[filters.quarter] || quarterlyPaceData.Q2,
    attendanceData: {
      overallPercentage: 92.3,
      chartData: attendanceData,
    },
    atRiskStudents: filteredAtRisk,
    activityFeed,
  };
};

const normalizeDashboardPayload = (payload, filters) => {
  const mock = buildMockDashboardData(filters);

  return {
    kpiData: {
      totalStudents: payload?.kpiData?.totalStudents ?? mock.kpiData.totalStudents,
      avgPaceCompletion:
        payload?.kpiData?.avgPaceCompletion ?? mock.kpiData.avgPaceCompletion,
      behindPace: payload?.kpiData?.behindPace ?? mock.kpiData.behindPace,
      atRisk: payload?.kpiData?.atRisk ?? mock.kpiData.atRisk,
      quarter: payload?.kpiData?.quarter ?? filters.quarter,
    },
    trendData: payload?.trendData || mock.trendData,
    attendanceData: {
      overallPercentage:
        payload?.attendanceData?.overallPercentage ??
        mock.attendanceData.overallPercentage,
      chartData: payload?.attendanceData?.chartData || mock.attendanceData.chartData,
    },
    atRiskStudents: payload?.atRiskStudents || mock.atRiskStudents,
    activityFeed: payload?.activityFeed || mock.activityFeed,
  };
};

export default function useDashboardDataState() {
  const [filters, setFilters] = useState({
    schoolYear: '2025-2026',
    section: 'All',
    quarter: 'Q2',
    risk: 'All'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState(buildMockDashboardData(filters));

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError('');

      try {
        const payload = await fetchDashboardData(filters);
        if (isMounted) {
          setDashboardData(normalizeDashboardPayload(payload, filters));
        }
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        if (USE_MOCK_FALLBACK) {
          setDashboardData(buildMockDashboardData(filters));
        }

        if (DASHBOARD_ENDPOINT) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Unable to load dashboard data from API.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  return {
    filters,
    updateFilter,
    loading,
    error,
    kpiData: dashboardData.kpiData,
    trendData: dashboardData.trendData,
    attendanceData: dashboardData.attendanceData,
    atRiskStudents: dashboardData.atRiskStudents,
    activityFeed: dashboardData.activityFeed,
  };
}