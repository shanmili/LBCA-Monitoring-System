import { Filter } from 'lucide-react';
import '../../styles/FilterBar.css';

const FilterBar = ({ filters, onFilterChange, children }) => {
  return (
    <div className="filter-bar">
      <div className="filter-label">
        <Filter size={16} />
        <span>Filters:</span>
      </div>
      
      <div className="filter-group">
        {filters.map((filter, index) => (
          <select
            key={index}
            className="filter-select"
            value={filter.value}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
          >
            {filter.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ))}
        
        {/* Additional custom filter elements can be passed as children */}
        {children}
      </div>
    </div>
  );
};

export default FilterBar;