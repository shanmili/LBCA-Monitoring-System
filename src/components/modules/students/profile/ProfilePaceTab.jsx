const ProfilePaceTab = ({ student }) => {
  const totalCompleted = student.subjects?.reduce((sum, s) => sum + s.completed, 0) || 0;
  const totalPaces = student.subjects?.reduce((sum, s) => sum + s.total, 0) || 0;
  const avgTestScore = student.subjects?.length
    ? Math.round(student.subjects.reduce((sum, s) => sum + (s.testScore || 0), 0) / student.subjects.length)
    : 0;

  return (
    <div className="tab-content pace-tab">
      <div className="pace-summary-bar">
        <div className="pace-summary-item">
          <span className="summary-number">{totalCompleted}</span>
          <span className="summary-label">PACEs Completed</span>
        </div>
        <div className="pace-summary-item">
          <span className="summary-number">{totalPaces - totalCompleted}</span>
          <span className="summary-label">PACEs Remaining</span>
        </div>
        <div className="pace-summary-item">
          <span className="summary-number">{avgTestScore}%</span>
          <span className="summary-label">Avg Test Score</span>
        </div>
      </div>

      <h4>PACE Progress by Subject</h4>
      {student.subjects && student.subjects.length > 0 ? (
        <table className="pace-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Completed</th>
              <th>Total</th>
              <th>Progress</th>
              <th>Test Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {student.subjects.map((subj, index) => {
              const pct = Math.round((subj.completed / subj.total) * 100);
              return (
                <tr key={index}>
                  <td className="subject-name">{subj.name}</td>
                  <td>{subj.completed}</td>
                  <td>{subj.total}</td>
                  <td>
                    <div className="progress-bar-wrapper">
                      <div className="progress-bar-container">
                        <div
                          className={`progress-bar ${pct < 60 ? 'low' : pct < 80 ? 'medium' : 'high'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="progress-text">{pct}%</span>
                    </div>
                  </td>
                  <td className="test-score">{subj.testScore}%</td>
                  <td>
                    <span className={`subject-status ${subj.status === 'Behind' ? 'behind' : 'on-track'}`}>
                      {subj.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className="no-data-message">No PACE progress data available.</p>
      )}
    </div>
  );
};

export default ProfilePaceTab;
