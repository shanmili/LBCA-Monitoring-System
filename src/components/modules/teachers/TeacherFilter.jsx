import FilterBar from '../../../components/common/FilterBar';

const TeacherFilter = ({ filters, onFilterChange }) => {
  const filterOptions = [
    {
      key: 'status',
      value: filters.status,
      options: [
        { value: 'All', label: 'All Accounts' },
        { value: 'active', label: 'Active Only' },
        { value: 'inactive', label: 'Inactive Only' }
      ]
    },
    {
      key: 'customized',
      value: filters.customized,
      options: [
        { value: 'All', label: 'All Accounts' },
        { value: 'yes', label: 'Customized' },
        { value: 'no', label: 'Not Customized' }
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

export default TeacherFilter;