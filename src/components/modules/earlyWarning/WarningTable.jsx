import { Bell } from 'lucide-react';
import RiskBadge from '../../../components/common/RiskBadge';

const WarningTable = ({ students, onNavigate }) => {
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

  if (!students || students.length === 0) {
    return (
      <div className="no-alerts">
        <Bell size={48} />
        <p>No students found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="warning-table-container">
      <table className="warning-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Student Name</th>
            <th>Section</th>
            <th>PACE %</th>
            <th>Attendance</th>
            <th>Risk Level</th>
            <th>Primary Factor</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id} className={`risk-row ${student.riskLevel.toLowerCase()}`}>
              <td>{student.id}</td>
              <td className="student-name">{getFullName(student)}</td>
              <td>{student.section}</td>
              <td className="pace-cell">{student.pacePercent}%</td>
              <td>{student.attendance}%</td>
              <td><RiskBadge level={student.riskLevel} /></td>
              <td className="factor-cell">{student.factor || 'None'}</td>
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
  );
};

export default WarningTable;