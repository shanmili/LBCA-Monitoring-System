import { AlertTriangle, Shield } from 'lucide-react';
import RiskBadge from '../../../common/RiskBadge';

const ProfileRiskTab = ({ student }) => {
  return (
    <div className="tab-content risk-tab">
      <div className="current-risk">
        <span>Current Risk Level:</span>
        <RiskBadge level={student.riskLevel} />
      </div>

      {/* Factor Cards */}
      {student.riskDetails && student.riskDetails.length > 0 ? (
        <div className="risk-details-list">
          <h4>Risk Factor Details</h4>
          {student.riskDetails.map((detail, index) => (
            <div key={index} className={`risk-detail-card ${detail.severity.toLowerCase()}`}>
              <div className="risk-detail-header">
                <AlertTriangle size={16} />
                <span className="risk-detail-factor">{detail.factor}</span>
                <span className={`severity-badge ${detail.severity.toLowerCase()}`}>
                  {detail.severity}
                </span>
              </div>
              <p className="risk-detail-text">{detail.detail}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-risk-message">
          <Shield size={40} className="no-risk-icon" />
          <p>No risk factors detected. This student is on track.</p>
        </div>
      )}

      {/* Suggested Action */}
      {student.suggestedAction && student.suggestedAction !== 'None' && (
        <div className="suggested-action-card">
          <h4>Recommended Action</h4>
          <p>{student.suggestedAction}</p>
        </div>
      )}
    </div>
  );
};

export default ProfileRiskTab;
