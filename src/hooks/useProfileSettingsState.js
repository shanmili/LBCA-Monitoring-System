import { useState } from 'react';
import useLoginState from './useLoginState';

const DEFAULT_SCHEDULE = [
  { day: 'Monday', startTime: '07:30', endTime: '16:00', available: true },
  { day: 'Tuesday', startTime: '07:30', endTime: '16:00', available: true },
  { day: 'Wednesday', startTime: '07:30', endTime: '16:00', available: true },
  { day: 'Thursday', startTime: '07:30', endTime: '16:00', available: true },
  { day: 'Friday', startTime: '07:30', endTime: '16:00', available: true },
];

const AVAILABLE_SECTIONS = [
  'Section A', 'Section B', 'Section C', 'Section D',
  'Section E', 'Section F', 'Section G', 'Section H',
];

// Abstracted State Hook (similar to useThemeState)
const useProfileSettingsState = (userRole = 'admin') => {
  // Connect to the login state to share the email
  const { email, setEmail } = useLoginState();
  
  const [fname, setFname] = useState(userRole === 'teacher' ? 'Teacher' : 'Admin');
  const [lname, setLname] = useState('User');
  const [toast, setToast] = useState('');
  const [toastTimer, setToastTimer] = useState(null);

  // Schedule availability (teacher-specific)
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);

  // Sections handled (teacher-specific)
  const [sections, setSections] = useState(['Section A']);

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer) clearTimeout(toastTimer);
    const t = setTimeout(() => setToast(''), 2800);
    setToastTimer(t);
  };

  const updateScheduleDay = (index, field, value) => {
    setSchedule(prev => prev.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const toggleSection = (section) => {
    setSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const displayName = [fname, lname].filter(Boolean).join(' ') || 'Your Name';
  const initials = ((fname[0] || '') + (lname[0] || '')).toUpperCase() || '?';

  return {
    fname, setFname,
    lname, setLname,
    email, setEmail,
    toast, showToast,
    displayName, initials,
    schedule, setSchedule, updateScheduleDay,
    sections, setSections, toggleSection,
    availableSections: AVAILABLE_SECTIONS,
    defaultSchedule: DEFAULT_SCHEDULE,
  };
};

export default useProfileSettingsState;