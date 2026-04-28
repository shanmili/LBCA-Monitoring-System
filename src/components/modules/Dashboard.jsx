import React from 'react';
import OverviewSection from './Dashboard/OverviewSection.jsx';
import KpiCards from './Dashboard/KpiCards.jsx';
import TrendChart from './Dashboard/TrendChart.jsx';
import AttendanceChart from './Dashboard/AttendanceChart.jsx';
import AtRiskTable from './Dashboard/AtRiskTable.jsx';
import ActivityFeed from './Dashboard/ActivityFeed.jsx';
import useDashboardDataState from '../../hooks/useDashboardDataState.js';
import LoadingScreen from '../common/LoadingScreen.jsx';
import '../../styles/dashboard/dashboard.css';

const Dashboard = ({ onNavigate, userRole = 'admin' }) => {
  const {
    filters,
    updateFilter,
    loading,
    error,
    kpiData,
    trendData,
    attendanceData,
    atRiskStudents,
    activityFeed
  } = useDashboardDataState();

  if (loading) {
    return <LoadingScreen message="Loading dashboard from API..." />;
  }

  return (
    <div className="dashboard">
      {error && (
        <div
          style={{
            marginBottom: '12px',
            border: '1px solid #FECACA',
            background: '#FEF2F2',
            color: '#991B1B',
            borderRadius: '8px',
            padding: '10px 12px',
            fontSize: '0.9rem',
          }}
        >
          API warning: {error}
        </div>
      )}

      <OverviewSection 
        title="Overview"
        subtitle={`Welcome back, ${userRole === 'teacher' ? 'Teacher User' : 'Admin User'}`}
        filters={filters}
        onFilterChange={updateFilter}
      />

      <KpiCards data={kpiData} onNavigate={onNavigate} />

      <div className="charts-row">
        <TrendChart data={trendData} />
        <AttendanceChart data={attendanceData} />
      </div>

      <div className="bottom-row">
        <AtRiskTable students={atRiskStudents} onNavigate={onNavigate} />
        <ActivityFeed activities={activityFeed} />
      </div>
    </div>
  );
};

export default Dashboard;