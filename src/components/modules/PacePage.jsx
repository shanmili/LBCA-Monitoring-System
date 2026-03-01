import PaceFilter from './pace/PaceFilter';
import PaceTable from './pace/PaceTable';
import usePaceEncodingState from '../../hooks/usePaceEncodingState';
import '../../styles/pace/PacePage.css';

const PacePage = () => {
  const {
    filters,
    updateFilter,
    encodingData,
    handleDataChange,
    handleAddPaceForCurrent,
  } = usePaceEncodingState();

  return (
    <div className="pace-page">
      <div className="pace-header-row">
        <div className="header-title">
          <div className="title-wrapper">
            <h2>PACE Progress Encoding</h2>
          </div>
          <p className="header-subtitle">Record student PACE completion and test scores</p>
        </div>
        
        <PaceFilter 
          filters={filters}
          onFilterChange={updateFilter}
        />
      </div>

      <PaceTable 
        data={encodingData}
        onDataChange={handleDataChange}
        onAddPaceForCurrent={handleAddPaceForCurrent}
        subject={filters.subject}
        section={filters.section}
        gradeLevel={filters.gradeLevel}
      />
    </div>
  );
};

export default PacePage;