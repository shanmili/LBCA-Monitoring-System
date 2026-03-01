import { AlertTriangle } from 'lucide-react';

const ProfileAttendanceTab = ({ student }) => {
  const summary = student.attendanceSummary;

  return (
    <div className="tab-content attendance-tab">
      {/* Attendance Summary */}
      {summary && (
        <div className="attendance-summary">
          <div className="att-summary-card present">
            <span className="att-pct">{summary.present}%</span>
            <span className="att-label">Present</span>
          </div>
          <div className="att-summary-card late">
            <span className="att-pct">{summary.late}%</span>
            <span className="att-label">Late</span>
          </div>
          <div className="att-summary-card absent">
            <span className="att-pct">{summary.absent}%</span>
            <span className="att-label">Absent</span>
          </div>
        </div>
      )}

      <h4>Attendance Overview</h4>
      <div className="attendance-bar-visual">
        <div className="att-bar">
          <div className="att-segment present" style={{ width: `${summary?.present || 0}%` }} />
          <div className="att-segment late" style={{ width: `${summary?.late || 0}%` }} />
          <div className="att-segment absent" style={{ width: `${summary?.absent || 0}%` }} />
        </div>
        <div className="att-legend">
          <span className="legend-item"><span className="dot present"></span> Present</span>
          <span className="legend-item"><span className="dot late"></span> Late</span>
          <span className="legend-item"><span className="dot absent"></span> Absent</span>
        </div>
      </div>

      {student.attendance < 80 && (
        <div className="attendance-warning">
          <AlertTriangle size={16} />
          <span>Attendance is below the 80% minimum threshold. Immediate action recommended.</span>
        </div>
      )}
    </div>
  );
};

export default ProfileAttendanceTab;
