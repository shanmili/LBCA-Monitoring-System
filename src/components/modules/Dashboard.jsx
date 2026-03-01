import React from 'react';
import OverviewSection from './dashboard/OverviewSection';
import KpiCards from './dashboard/KpiCards';
import TrendChart from './dashboard/TrendChart';
import AttendanceChart from './dashboard/AttendanceChart';
import AtRiskTable from './dashboard/AtRiskTable';
import ActivityFeed from './dashboard/ActivityFeed';
import useDashboardDataState from '../../hooks/useDashboardDataState';
import '../../styles/dashboard/dashboard.css';

const Dashboard = ({ onNavigate, userRole = 'admin' }) => {
  const {
    filters,
    updateFilter,
    kpiData,
    trendData,
    attendanceData,
    atRiskStudents,
    activityFeed
  } = useDashboardDataState();

  return (
    <div className="dashboard">
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