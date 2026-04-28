import FilterBar from '../../common/FilterBar';
import '../../../styles/dashboard/OverviewSection.css';

const OverviewSection = ({ title, subtitle, filters, onFilterChange }) => {
  // Convert filters object to array format that FilterBar expects
  const filterOptions = [
    {
      key: 'schoolYear',
      value: filters.schoolYear,
      options: [
        { value: '2025-2026', label: 'SY 2025-2026' },
        { value: '2024-2025', label: 'SY 2024-2025' },
        { value: '2023-2024', label: 'SY 2023-2024' },
      ]
    },
    {
      key: 'section',
      value: filters.section,
      options: [
        { value: 'All', label: 'All Sections' },
        { value: 'Section A', label: 'Section A' },
        { value: 'Section B', label: 'Section B' },
        { value: 'Section C', label: 'Section C' },
      ]
    },
    {
      key: 'quarter',
      value: filters.quarter,
      options: [
        { value: 'Q1', label: 'Q1' },
        { value: 'Q2', label: 'Q2' },
        { value: 'Q3', label: 'Q3' },
        { value: 'Q4', label: 'Q4' },
      ]
    },
    {
      key: 'risk',
      value: filters.risk,
      options: [
        { value: 'All', label: 'All Risk' },
        { value: 'High', label: 'High' },
        { value: 'Medium', label: 'Medium' },
        { value: 'Low', label: 'Low' },
      ]
    }
  ];

  return (
    <div className="overview-section">
      <div className="title-group">
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{subtitle}</p>
      </div>
      <FilterBar 
        filters={filterOptions} 
        onFilterChange={onFilterChange} 
      />
    </div>
  );
};

export default OverviewSection;