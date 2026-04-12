import { apiRequest } from './client';

const DASHBOARD_ENDPOINT = import.meta.env.VITE_DASHBOARD_ENDPOINT || '';

export function fetchDashboardData(filters) {
  if (!DASHBOARD_ENDPOINT) {
    return Promise.resolve(null);
  }

  return apiRequest(DASHBOARD_ENDPOINT, {
    params: {
      school_year: filters.schoolYear,
      section: filters.section === 'All' ? undefined : filters.section,
      quarter: filters.quarter,
      risk: filters.risk === 'All' ? undefined : filters.risk,
    },
  });
}
