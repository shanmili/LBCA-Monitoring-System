import { useState } from 'react';
import useLoginState from './useLoginState';

// Abstracted State Hook (similar to useThemeState)
const useProfileSettingsState = (userRole = 'admin') => {
  // Connect to the login state to share the email
  const { email, setEmail } = useLoginState();
  
  const [fname, setFname] = useState(userRole === 'teacher' ? 'Teacher' : 'Admin');
  const [lname, setLname] = useState('User');
  const [toast, setToast] = useState('');
  const [toastTimer, setToastTimer] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer) clearTimeout(toastTimer);
    const t = setTimeout(() => setToast(''), 2800);
    setToastTimer(t);
  };

  const displayName = [fname, lname].filter(Boolean).join(' ') || 'Your Name';
  const initials = ((fname[0] || '') + (lname[0] || '')).toUpperCase() || '?';

  return {
    fname, setFname,
    lname, setLname,
    email, setEmail,
    toast, showToast,
    displayName, initials
  };
};

export default useProfileSettingsState;