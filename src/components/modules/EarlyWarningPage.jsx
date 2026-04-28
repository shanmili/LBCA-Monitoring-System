import RiskSummary from './earlyWarning/RiskSummary';
import WarningFilter from './earlyWarning/WarningFilter';
import WarningTable from './earlyWarning/WarningTable';
import useEarlyWarningState from '../../hooks/useEarlyWarningState';
import '../../styles/earlyWarning/EarlyWarningPage.css';

const EarlyWarningPage = ({ onNavigate, teacher = null }) => {
  const {
    filters,
    updateFilter,
    filteredStudents,
    allStudents,
    riskCounts,
    loading,
    error,
  } = useEarlyWarningState(teacher);

  return (
    <div className="warning-page">
      <div className="warning-header-row">
        <div className="header-title">
          <h2>Early Warning Alerts</h2>
          <p className="header-subtitle">Monitor and manage at-risk students based on PACE progress</p>
        </div>
        
        <WarningFilter 
          filters={filters}
          onFilterChange={updateFilter}
          teacher={teacher}
        />
      </div>

      {/* Risk Summary Cards */}
      <RiskSummary counts={riskCounts} />

      {/* At-Risk Students Table */}
      <WarningTable 
        students={loading ? [] : filteredStudents}
        onNavigate={onNavigate}
      />

      {loading && <p>Loading warning data...</p>}
      {error && <p style={{ color: '#991B1B' }}>API warning: {error}</p>}

      <div className="warning-footer">
        <p>Showing {filteredStudents.length} of {allStudents.length} students</p>
      </div>
    </div>
  );
};

export default EarlyWarningPage;