import '../../../styles/dashboard/StatCard.css';

const StatCard = ({ 
  title,
  value,
  subtext,
  icon: Icon,
  color,
  trend,
  onClick
}) => {
  return (
    <div 
      className={`dash-stat-card ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
      // Removed borderLeftColor style
    >
      <div className="dash-stat-header">
        <div>
          <p className="dash-stat-title">{title}</p>
          <h3 className="dash-stat-value">{value}</h3>
        </div>
        {Icon && (
          <div className="dash-stat-icon" style={{ color }}>
            <Icon size={24} />
          </div>
        )}
      </div>
      <div className="dash-stat-footer">
        {trend && (
          <span className={`dash-trend-${trend}`}>
            {trend === 'up' ? '↑' : '↓'}
          </span>
        )}
        <span className="dash-stat-subtext">{subtext}</span>
      </div>
    </div>
  );
};

export default StatCard;