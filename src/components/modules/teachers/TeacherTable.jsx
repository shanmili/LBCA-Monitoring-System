import '../../../styles/teachers/TeacherTable.css';

const TeacherTable = ({ teachers, onToggleStatus, getStatusBadgeClass, getCustomizedBadgeClass }) => {

  const handleStatusToggle = (teacher) => {
    const action = teacher.status === 'active' ? 'deactivate' : 'activate';
    const message = `Are you sure you want to ${action} the account "${teacher.username}"?`;
    
    if (window.confirm(message)) {
      onToggleStatus(teacher.id);
    }
  };

  return (
    <div className="teachers-table-container">
      <table className="teachers-list-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Status</th>
            <th>Profile</th>
            <th>Last Login</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.length > 0 ? (
            teachers.map(teacher => (
              <tr key={teacher.id}>
                <td>{teacher.id}</td>
                <td className="username-cell">{teacher.username}</td>
                <td>
                  <span className={getStatusBadgeClass(teacher.status)}>
                    {teacher.status}
                  </span>
                </td>
                <td>
                  <span className={getCustomizedBadgeClass(teacher.hasCustomized)}>
                    {teacher.hasCustomized ? 'Customized' : 'Default'}
                  </span>
                </td>
                <td>{teacher.lastLogin}</td>
                <td>{teacher.createdAt}</td>
                <td>
                  <button 
                    className={`status-toggle ${teacher.status === 'active' ? 'active' : 'inactive'}`}
                    onClick={() => handleStatusToggle(teacher)}
                    title={teacher.status === 'active' ? 'Deactivate account' : 'Activate account'}
                  >
                    {teacher.status === 'active' ? (
                      <> Deactivate</>
                    ) : (
                      <> Activate</>
                    )}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-results">No teacher accounts found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherTable;