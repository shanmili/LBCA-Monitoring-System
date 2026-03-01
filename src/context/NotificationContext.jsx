import { createContext, useContext, useState } from 'react';
import { studentsData } from '../data/mockData.jsx';

// Helper function to get student name from different data structures
function getStudentName(student) {
  if (student.name) {
    // Old structure: "Last, First"
    const nameParts = student.name.split(',');
    const firstName = nameParts[1]?.trim() || '';
    const lastName = nameParts[0]?.trim() || '';
    return `${firstName} ${lastName}`.trim() || student.name;
  } else {
    // New structure: firstName, lastName, middleName
    const firstName = student.firstName || '';
    const lastName = student.lastName || '';
    return `${firstName} ${lastName}`.trim() || student.id;
  }
}

// --- Generate system notifications from student data ---
function generateSystemNotifications(students) {
  const notifications = [];
  let id = 1;

  students.forEach((student) => {
    const fullName = getStudentName(student);

    if (student.pacePercent < 40) {
      notifications.push({
        id: id++,
        type: 'at-risk',
        severity: 'high',
        title: 'At-Risk Alert',
        message: `${fullName} is below 40% PACE completion (${student.pacePercent}%)`,
        student: fullName,
        studentId: student.id,
        time: '10 mins ago',
        read: false,
      });
    } else if (student.pacePercent < 50) {
      notifications.push({
        id: id++,
        type: 'at-risk',
        severity: 'high',
        title: 'At-Risk Alert',
        message: `${fullName} is critically behind at ${student.pacePercent}% PACE`,
        student: fullName,
        studentId: student.id,
        time: '25 mins ago',
        read: false,
      });
    }

    if (student.riskLevel === 'High') {
      notifications.push({
        id: id++,
        type: 'risk',
        severity: 'high',
        title: 'Risk Alert Generated',
        message: `Risk alert generated for ${fullName} — ${student.factor || 'High risk'}`,
        student: fullName,
        studentId: student.id,
        time: '1 hour ago',
        read: false,
      });
    } else if (student.riskLevel === 'Medium') {
      notifications.push({
        id: id++,
        type: 'risk',
        severity: 'medium',
        title: 'Risk Warning',
        message: `${fullName} flagged for monitoring — ${student.factor || 'Medium risk'}`,
        student: fullName,
        studentId: student.id,
        time: '2 hours ago',
        read: true,
      });
    }

    if (student.attendance < 75) {
      notifications.push({
        id: id++,
        type: 'attendance',
        severity: 'high',
        title: 'Low Attendance Alert',
        message: `${fullName}'s attendance has dropped to ${student.attendance}% — below minimum threshold`,
        student: fullName,
        studentId: student.id,
        time: '3 hours ago',
        read: true,
      });
    }
  });

  return notifications;
}

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() =>
    generateSystemNotifications(studentsData)
  );

  // User activity log — only things the user did
  const [userActivity, setUserActivity] = useState([
    { id: 1, text: 'PACE score updated for Section A — Math', time: '1 hour ago' },
    { id: 2, text: 'Attendance finalized for Section B', time: '2 hours ago' },
    { id: 3, text: 'New Quarter 1 goals published', time: '5 hours ago' },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const addUserActivity = (text) => {
    setUserActivity((prev) => [
      { id: Date.now(), text, time: 'Just now' },
      ...prev,
    ]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAllRead,
        markRead,
        userActivity,
        addUserActivity,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}