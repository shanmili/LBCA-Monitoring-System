import FilterBar from '../../../components/common/FilterBar';
import { studentSections, studentGrades, schoolYears } from '../../../data/mockData';

const StudentFilter = ({ filters, onFilterChange, teacher = null }) => {
  // Get available grades based on teacher assignment
  const getAvailableGrades = () => {
    if (teacher?.assignedGrades) {
      return teacher.assignedGrades;
    }
    return studentGrades;
  };

  // Get available sections based on teacher assignment
  const getAvailableSections = () => {
    if (teacher?.assignedSections) {
      return teacher.assignedSections;
    }
    return studentSections;
  };

  const filterOptions = [
    {
      key: 'schoolYear',
      value: filters.schoolYear,
      options: [
        { value: 'All', label: 'All Years' },
        ...schoolYears.map(year => ({ 
          value: year, 
          label: `SY ${year}` 
        }))
      ]
    },
    {
      key: 'gradeLevel',
      value: filters.gradeLevel,
      options: [
        { value: 'All', label: 'All Grades' },
        ...getAvailableGrades().map(grade => ({ 
          value: grade, 
          label: grade 
        }))
      ]
    },
    {
      key: 'section',
      value: filters.section,
      options: [
        { value: 'All', label: 'All Sections' },
        ...getAvailableSections().map(section => ({ 
          value: section, 
          label: section 
        }))
      ]
    },
    {
      key: 'status',
      value: filters.status,
      options: [
        { value: 'All', label: 'All Status' },
        { value: 'On Track', label: 'On Track' },
        { value: 'Behind', label: 'Behind' },
        { value: 'At Risk', label: 'At Risk' },
      ]
    }
  ];

  return (
    <FilterBar 
      filters={filterOptions} 
      onFilterChange={onFilterChange} 
    />
  );
};

export default StudentFilter;