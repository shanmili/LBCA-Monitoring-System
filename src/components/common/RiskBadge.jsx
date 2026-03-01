const RiskBadge = ({ level }) => {
  const getRiskClass = () => {
    switch(level) {
      case 'High': return 'risk-high';
      case 'Medium': return 'risk-medium';
      case 'Low': return 'risk-low';
      default: return 'risk-low';
    }
  };
  
  return (
    <span className={`risk-badge ${getRiskClass()}`}>
      {level}
    </span>
  );
};

export default RiskBadge;

//basta abt ni sa risk badge for students