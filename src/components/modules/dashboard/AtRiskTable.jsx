import RiskBadge from '../../common/RiskBadge';
import "../../../styles/dashboard/AtRiskTable.css";

const AtRiskTable = ({ students, onNavigate }) => {
  // Helper function to get full name
  const getFullName = (student) => {
    if (student.name) {
      // Old data structure - already has name
      return student.name;
    }
    
    // New data structure - construct from firstName, middleName, lastName
    const middleInitial = student.middleName ? ` ${student.middleName.charAt(0)}.` : '';
    return `${student.lastName}, ${student.firstName}${middleInitial}`;
  };

  return (
    <div className="table-card">
      <div className="table-header">
        <h3 className="table-title">At-Risk Students</h3>
        <select className="risk-filter">
          <option value="All">All Risks</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
      
      <div className="table-wrapper">
        <table className="risk-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Section</th>
              <th>PACE %</th>
              <th>Risk</th>
              <th>Primary Factor</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td className="student-name">{getFullName(student)}</td>
                <td>{student.section}</td>
                <td className="pace-cell">{student.pacePercent}%</td>
                <td><RiskBadge level={student.riskLevel} /></td>
                <td className="factor-cell">{student.factor}</td>
                <td>
                  <button 
                    className="view-btn"
                    onClick={() => onNavigate('student-profile', student.id)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AtRiskTable;