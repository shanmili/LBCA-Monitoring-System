import { 
  AlertTriangle, 
  AlertCircle, 
  CalendarX, 
  CheckCheck 
} from 'lucide-react';
import '../../styles/layout/Notification.css';

const severityIcon = (type) => {
  switch(type) {
    case 'at-risk': 
      return <AlertTriangle size={14} className="notif-icon notif-icon--high" />;
    case 'attendance': 
      return <CalendarX size={14} className="notif-icon notif-icon--high" />;
    case 'risk': 
      return <AlertCircle size={14} className="notif-icon notif-icon--medium" />;
    default: 
      return <AlertCircle size={14} className="notif-icon notif-icon--low" />;
  }
};

const NotificationDropdown = ({ 
  notifications, 
  unreadCount, 
  onMarkAllRead, 
  onMarkRead, 
  onNavigate,
  onClose 
}) => {
  return (
    <div className="notif-dropdown">
      <div className="notif-header">
        <span className="notif-header__title">
          Notifications
          {unreadCount > 0 && (
            <span className="notif-header__count">{unreadCount} new</span>
          )}
        </span>
        {unreadCount > 0 && (
          <button className="notif-mark-all" onClick={onMarkAllRead}>
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
              className={`notif-item ${!n.read ? 'unread' : ''} ${n.studentId ? 'clickable' : ''}`}
              onClick={() => {
                onMarkRead(n.id);
                if (n.studentId && onNavigate) {
                  onClose();
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
  );
};

export default NotificationDropdown;