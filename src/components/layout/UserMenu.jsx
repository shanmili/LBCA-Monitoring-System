import { useState, useRef, useEffect } from 'react';
import { ChevronDown, User, Sun, LogOut } from 'lucide-react';
import Theme from '../common/Theme.jsx';
import '../../styles/layout/UserMenu.css';

const UserMenu = ({ onLogout, onNavigate, adminPhoto, userRole = 'admin' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleProfileClick = () => {
    closeMenu();
    if (onNavigate) {
      onNavigate('account-settings');  
    }
  };

  return (
    <div className="user-menu" ref={menuRef}>
      <button className="user-menu-trigger" onClick={toggleMenu}>
        <div className="avatar">
          {adminPhoto ? (
            <img src={adminPhoto} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (userRole === 'admin' ? 'AD' : 'TC')}
        </div>
        <div className="user-info">
          <span className="user-name">{userRole === 'admin' ? 'Admin User' : 'Teacher User'}</span>
          <span className="user-role">{userRole === 'admin' ? 'Administrator' : 'Teacher'}</span>
        </div>
        <ChevronDown size={18} className={`dropdown-icon ${isOpen ? 'rotate' : ''}`} />
      </button>

      {isOpen && (
        <div className="user-dropdown">
          <div className="dropdown-header">
            <p>Signed in as <strong>{userRole === 'admin' ? 'Admin' : 'Teacher'}</strong></p>
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