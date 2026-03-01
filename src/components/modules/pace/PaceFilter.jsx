import FilterBar from '../../../components/common/FilterBar';
import { schoolYears, studentGrades, studentSections, paceSubjects } from '../../../data/mockData';

const PaceFilter = ({ filters, onFilterChange, onAddPaceRecord }) => {
  const filterOptions = [
    {
      key: 'schoolYear',
      value: filters.schoolYear,
      options: schoolYears.map(year => ({ 
        value: year, 
        label: `SY ${year}` 
      }))
    },
    {
      key: 'gradeLevel',
      value: filters.gradeLevel,
      options: studentGrades.map(grade => ({ 
        value: grade, 
        label: grade 
      }))
    },
    {
      key: 'section',
      value: filters.section,
      options: studentSections.map(section => ({ 
        value: section, 
        label: section 
      }))
    },
    {
      key: 'subject',
      value: filters.subject,
      options: paceSubjects.map(subject => ({
        value: subject,
        label: subject
      }))
    }
  ];

  return (
    <div className="filter-section">
      <FilterBar 
        filters={filterOptions} 
        onFilterChange={onFilterChange} 
      />
    </div>
  );
};

export default PaceFilter;