import { useState, useRef, useEffect } from 'react';
import { Search, Bell } from 'lucide-react';
import useHeaderState from '../../hooks/useHeaderState.js';
import { useNotifications } from '../../context/NotificationContext.jsx';
import UserMenu from './UserMenu.jsx';
import NotificationDropdown from './NotificationDropdown.jsx';
import '../../styles/layout/Header.css';

const Header = ({ onToggleSidebar, onLogout, activeTab, onNavigate, adminPhoto, userRole = 'admin' }) => {
  const { pageTitle } = useHeaderState(activeTab);
  const { notifications, unreadCount, markAllRead, markRead } = useNotifications();

  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleNotif = () => setNotifOpen((prev) => !prev);

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="page-title">{pageTitle}</h1>
      </div>

      <div className="header-right">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
            aria-label="Search"
          />
          <Search className="search-icon" size={18} />
        </div>

        <div className="notif-wrapper" ref={notifRef}>
          <div
            className="notif-bell-area"
            onClick={toggleNotif}
            role="button"
            tabIndex={0}
            aria-label="Notifications"
            onKeyDown={(e) => e.key === 'Enter' && toggleNotif()}
          >
            <Bell className="notif-bell-icon" />
            {unreadCount > 0 && (
              <span className="notif-badge">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>

          {notifOpen && (
            <NotificationDropdown
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkAllRead={markAllRead}
              onMarkRead={markRead}
              onNavigate={onNavigate}
              onClose={() => setNotifOpen(false)}
            />
          )}
        </div>

        <UserMenu onLogout={onLogout} onNavigate={onNavigate} adminPhoto={adminPhoto} userRole={userRole} />
      </div>
    </header>
  );
};

export default Header;