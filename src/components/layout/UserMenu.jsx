import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, User, Sun, LogOut } from 'lucide-react';
import Theme from '../common/Theme.jsx';
import '../../styles/layout/UserMenu.css';

const UserMenu = ({ onLogout, onNavigate, adminPhoto, userRole = 'admin' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const [displayName, setDisplayName] = useState('');
  const [initials, setInitials] = useState('');

  // Function to load fresh user data from sessionStorage
  const loadUserData = () => {
    const user = JSON.parse(sessionStorage.getItem('lbca_user') || '{}');
    
    // Get display name from first and last name
    const name = user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}`
      : (userRole === 'admin' ? 'Admin User' : 'Teacher User');
    setDisplayName(name);
    
    // Get initials from first and last name
    const firstInitial = user.firstName ? user.firstName.charAt(0).toUpperCase() : '';
    const lastInitial = user.lastName ? user.lastName.charAt(0).toUpperCase() : '';
    setInitials(firstInitial + lastInitial || (userRole === 'admin' ? 'AD' : 'TC'));
  };

  // Load data when component mounts and when menu opens
  useEffect(() => {
    loadUserData();

    const handleStorageChange = () => {
      loadUserData();
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const toggleMenu = () => {
    if (!isOpen) {
      loadUserData(); // Refresh data when opening menu
    }
    setIsOpen(!isOpen);
  };
  const closeMenu = () => setIsOpen(false);

  const handleProfileClick = () => {
    closeMenu();
    if (onNavigate) {
      onNavigate('account-settings');  
    }
  };

  // Get avatar content: photo > initials > default
  const getAvatarContent = () => {
    if (adminPhoto) {
      return <img src={adminPhoto} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />;
    }
    return initials;
  };

  return (
    <div className="user-menu" ref={menuRef}>
      <button className="user-menu-trigger" onClick={toggleMenu}>
        <div className="avatar">
          {getAvatarContent()}
        </div>
        <div className="user-info">
          <span className="user-name">{displayName}</span>
          <span className="user-role">{userRole === 'admin' ? 'Administrator' : 'Teacher'}</span>
        </div>
        <ChevronDown size={18} className={`dropdown-icon ${isOpen ? 'rotate' : ''}`} />
      </button>

      {isOpen && (
        <div className="user-dropdown">
          <div className="dropdown-header">
            <p>Signed in as <strong>{userRole === 'admin' ? 'Administrator' : 'Teacher'}</strong></p>
          </div>
          
          <div className="dropdown-divider" />
          
          <button 
            className="dropdown-item" 
            onClick={handleProfileClick}
          >
            <User size={16} /> 
            <span>Profile Settings</span>
          </button>
          
          <button className="dropdown-item">
            <Sun size={16} /> 
            <span>Theme</span> 
            <Theme />
          </button>
          
          <div className="dropdown-divider" />
          
          <button 
            className="dropdown-item logout" 
            onClick={() => { 
              closeMenu(); 
              if (onLogout) onLogout(); 
            }}
          >
            <LogOut size={16} /> 
            <span>Log Out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;