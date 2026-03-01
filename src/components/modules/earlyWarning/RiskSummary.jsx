import { AlertTriangle } from 'lucide-react';

const RiskSummary = ({ counts }) => {
  return (
    <div className="risk-summary">
      <div className="risk-card high">
        <AlertTriangle size={24} />
        <div className="risk-info">
          <span className="risk-count">{counts.high}</span>
          <span className="risk-label">High Risk</span>
        </div>
      </div>
      <div className="risk-card medium">
        <AlertTriangle size={24} />
        <div className="risk-info">
          <span className="risk-count">{counts.medium}</span>
          <span className="risk-label">Medium Risk</span>
        </div>
      </div>
      <div className="risk-card low">
        <AlertTriangle size={24} />
        <div className="risk-info">
          <span className="risk-count">{counts.low}</span>
          <span className="risk-label">Low Risk</span>
        </div>
      </div>
    </div>
  );
};

export default RiskSummary;