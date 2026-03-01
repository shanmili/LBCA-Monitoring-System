import '../../styles/Logo.css';

const Logo = ({ adminPhoto, adminInitials = 'AD', showText = true }) => {
  return (
    <div className="admin-logo">
      <div className="logo-avatar">
        {adminPhoto ? (
          <img src={adminPhoto} alt="Admin" className="admin-photo" />
        ) : (
          <span className="admin-initials">{adminInitials}</span>
        )}
      </div>
      {showText && (
        <div className="logo-text-container">
          <span className="logo-system-name">LBCA</span>
          <span className="logo-system-subtitle">Monitoring System</span>
        </div>
      )}
    </div>
  );
};

export default Logo;