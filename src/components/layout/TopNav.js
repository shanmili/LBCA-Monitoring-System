import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  LogOut, 
  User, 
  Sun,
  AlertTriangle,
  AlertCircle,
  CalendarX,
  CheckCheck,
} from 'lucide-react';
import useTopNavState from '../../hooks/useTopNavState';
import { useNotifications } from '../../context/NotificationContext';
import '../../styles/TopNav.css'; 
import Theme from '../common/Theme';

const severityIcon = (type) => {
  if (type === 'at-risk') return <AlertTriangle size={14} className="notif-icon notif-icon--high" />;
  if (type === 'risk') return <AlertCircle size={14} className="notif-icon notif-icon--medium" />;
  if (type === 'attendance') return <CalendarX size={14} className="notif-icon notif-icon--high" />;
  return <AlertCircle size={14} className="notif-icon notif-icon--low" />;
};

const TopNav = ({ onLogout, activeTab, onNavigate, adminPhoto, userRole = 'admin' }) => {
  const { isDropdownOpen, toggleDropdown, closeDropdown, pageTitle } = useTopNavState(activeTab);
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
    <header className="top-nav">
      <div className="nav-left">
        <h1 className="page-title">{pageTitle}</h1>
      </div>

      <div className="nav-right">
        <div className="search-container">
          <input type="text" placeholder="Search..." className="search-input" />
          <Search className="search-icon" />
        </div>
        
        {/* Notification Bell */}
        <div className="notif-wrapper" ref={notifRef}>
          <button className="notification-button" onClick={toggleNotif}>
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>

          {notifOpen && (
            <div className="notif-dropdown">
              <div className="notif-header">
                <span className="notif-header__title">
                  Notifications
                  {unreadCount > 0 && <span className="notif-header__count">{unreadCount} new</span>}
                </span>
                {unreadCount > 0 && (
                  <button className="notif-mark-all" onClick={markAllRead}>
                    <CheckCheck size={13} /> Mark all read
                  </button>
                )}
              </div>

              <ul className="notif-list">
                {notifications.length === 0 ? (
                  <li className="notif-empty">No notifications</li>
                ) : (
                  notifications.map((n) => (
                    <li
                      key={n.id}
                      className={`notif-item ${!n.read ? 'notif-item--unread' : ''} ${n.studentId ? 'notif-item--clickable' : ''}`}
                      onClick={() => {
                        markRead(n.id);
                        if (n.studentId && onNavigate) {
                          setNotifOpen(false);
                          onNavigate('student-profile', n.studentId);
                        }
                      }}
                    >
                      <div className="notif-item__icon">{severityIcon(n.type)}</div>
                      <div className="notif-item__body">
                        <p className="notif-item__title">{n.title}</p>
                        <p className="notif-item__msg">{n.message}</p>
                        <span className="notif-item__time">{n.time}</span>
                      </div>
                      {!n.read && <span className="notif-item__dot" />}
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        {/* User Profile Container with Click Event */}
        <div className="user-menu-container">
          <div 
            className="user-profile" 
            onClick={toggleDropdown}
          >
            <div className="avatar" style={{ overflow: 'hidden', padding: 0 }}>
              {adminPhoto ? (
                <img src={adminPhoto} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (userRole === 'admin' ? 'AD' : 'TC')}
            </div>
            <div className="user-info">
              <p className="user-name">{userRole === 'admin' ? 'Admin User' : 'Teacher User'}</p>
              <p className="user-role">{userRole === 'admin' ? 'Administrator' : 'Teacher'}</p>
            </div>
            <ChevronDown size={16} className={`dropdown-icon ${isDropdownOpen ? 'rotate' : ''}`} />
          </div>

          {/* The Dropdown Menu */}
          {isDropdownOpen && (
            <div className="user-dropdown">
              <div className="dropdown-header">
                <p>Signed in as <strong>{userRole === 'admin' ? 'Admin User' : 'Teacher User'}</strong></p>
              </div>
              <hr />
              <button className="dropdown-item" onClick={() => { closeDropdown(); if (onNavigate) onNavigate('account-settings'); }}>
                <User size={16} /> <span>Profile</span>
              </button>
              <button className="dropdown-item">
                  <Sun size={16} /> <span>Theme</span> <Theme />
              </button>
              <hr />
              <button className="dropdown-item logout" onClick={() => { closeDropdown(); if (onLogout) onLogout(); }}>
                <LogOut size={16} /> <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNav;

//Top Navigationn

