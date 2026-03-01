import '../../../styles/students/StudentTable.css';

const StudentTable = ({ students, getStatusBadgeClass, onNavigate }) => {
  // Helper function to get full name
  const getFullName = (student) => {
    const middleInitial = student.middleName ? ` ${student.middleName.charAt(0)}.` : '';
    return `${student.lastName}, ${student.firstName}${middleInitial}`;
  };

  return (
    <div className="students-table-container">
      <table className="students-list-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Student Name</th>
            <th>Grade</th>
            <th>Section</th>
            <th>Guardian</th>
            <th>Contact</th>
            <th>PACE %</th>
            <th>Attendance</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map(student => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td className="student-name-cell">{getFullName(student)}</td>
                <td>{student.gradeLevel}</td>
                <td>{student.section}</td>
                <td>{student.guardianLastName}</td>
                <td>{student.guardianContact}</td>
                <td>{student.pacePercent}%</td>
                <td>{student.attendance}%</td>
                <td>
                  <span className={getStatusBadgeClass(student.status)}>
                    {student.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="view-button"
                    onClick={() => onNavigate('student-profile', student.id)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="no-results">No students found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;