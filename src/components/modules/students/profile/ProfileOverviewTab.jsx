import { BookOpen, Calendar, Shield, Target, AlertTriangle, User, Phone, MapPin, Calendar as CalendarIcon, Users, AlertCircle } from 'lucide-react';
import RiskBadge from '../../../common/RiskBadge';

const ProfileOverviewTab = ({ student }) => {
  // Helper function to get guardian full name
  const getGuardianFullName = () => {
    const middleInitial = student.guardianMiddleName ? ` ${student.guardianMiddleName.charAt(0)}.` : '';
    return `${student.guardianLastName}, ${student.guardianFirstName}${middleInitial}`;
  };

  return (
    <div className="tab-content overview-tab">
      {/* Quick Stats Cards */}
      <div className="overview-stats-row">
        <div className="overview-stat-card pace-stat">
          <BookOpen size={20} />
          <div className="stat-content">
            <span className="stat-number">{student.pacePercent}%</span>
            <span className="stat-label">PACE Completion</span>
          </div>
        </div>
        <div className="overview-stat-card attendance-stat">
          <Calendar size={20} />
          <div className="stat-content">
            <span className="stat-number">{student.attendance}%</span>
            <span className="stat-label">Attendance</span>
          </div>
        </div>
        <div className="overview-stat-card risk-stat-card">
          <Shield size={20} />
          <div className="stat-content">
            <RiskBadge level={student.riskLevel} />
            <span className="stat-label">Risk Level</span>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="overview-grid">
        {/* Column 1 - Student Information */}
        <div className="info-card">
          <h4>
            <User size={16} />
            Student Information
          </h4>
          
          <div className="info-section">
            <div className="info-row">
              <span className="info-label">Full Name:</span>
              <span className="info-value">{student.lastName}, {student.firstName} {student.middleName}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Date of Birth:</span>
              <span className="info-value">{student.dateOfBirth}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Gender:</span>
              <span className="info-value">{student.gender}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Address:</span>
              <span className="info-value">{student.address}</span>
            </div>
          </div>

          {/* Guardian Information */}
          <div className="info-subsection">
            <h5>
              <Users size={14} />
              Guardian Information
            </h5>
            <div className="info-row">
              <span className="info-label">Guardian:</span>
              <span className="info-value">{getGuardianFullName()}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Contact:</span>
              <span className="info-value">{student.guardianContact}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Relationship:</span>
              <span className="info-value">{student.guardianRelationship}</span>
            </div>
          </div>
        </div>

        {/* Column 2 - Enrollment & Risk Information */}
        <div className="info-card">
          <h4>
            <CalendarIcon size={16} />
            Enrollment & Risk Information
          </h4>
          
          {/* Enrollment Section */}
          <div className="info-section">
            <h5>Enrollment Details</h5>
            <div className="info-row">
              <span className="info-label">Grade Level:</span>
              <span className="info-value">{student.gradeLevel}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Section:</span>
              <span className="info-value">{student.section}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Student ID:</span>
              <span className="info-value">{student.id}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Status:</span>
              <span className="info-value">
                <span className={`status-inline ${student.status === 'Behind' ? 'behind' : 'on-track'}`}>
                  {student.status}
                </span>
              </span>
            </div>
          </div>

          {/* Risk Explanation Section */}
          {student.riskLevel !== 'Low' && (
            <div className="risk-explanation-section">
              <h5 className="risk-section-title">
                <AlertCircle size={14} />
                Risk Explanation
              </h5>
              
              <div className="risk-explanation-content">
                <div className="risk-explanation-item">
                  <span className="risk-explanation-label">Primary Factor</span>
                  <span className="risk-explanation-value">{student.factor || 'None'}</span>
                </div>
                
                {student.secondaryRisk && student.secondaryRisk !== 'None' && (
                  <div className="risk-explanation-item">
                    <span className="risk-explanation-label">Secondary Factor</span>
                    <span className="risk-explanation-value">{student.secondaryRisk}</span>
                  </div>
                )}
                
                {student.suggestedAction && student.suggestedAction !== 'None' && (
                  <div className="risk-explanation-item suggested">
                    <span className="risk-explanation-label">Suggested Action</span>
                    <span className="risk-explanation-value suggested-text">{student.suggestedAction}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileOverviewTab;