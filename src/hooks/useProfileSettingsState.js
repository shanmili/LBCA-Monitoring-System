import { useState, useEffect } from 'react';
import { getTeacherProfile, updateTeacherProfile, updatePassword } from '../api/authApi';

const DEFAULT_SCHEDULE = [
  { day: 'Monday', startTime: '07:30', endTime: '16:00', available: true },
  { day: 'Tuesday', startTime: '07:30', endTime: '16:00', available: true },
  { day: 'Wednesday', startTime: '07:30', endTime: '16:00', available: true },
  { day: 'Thursday', startTime: '07:30', endTime: '16:00', available: true },
  { day: 'Friday', startTime: '07:30', endTime: '16:00', available: true },
];

const AVAILABLE_SECTIONS = ['Section A', 'Section B', 'Section C', 'Section D', 'Section E', 'Section F', 'Section G', 'Section H'];

const useProfileSettingsState = (userRole = 'admin') => {
  // Profile fields
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [accountStatus, setAccountStatus] = useState('Active');
  const [memberSince, setMemberSince] = useState('');
  const [lastLogin, setLastLogin] = useState('');
  
  // UI state
  const [toast, setToast] = useState('');
  const [toastTimer, setToastTimer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Teacher-specific fields
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  const [sections, setSections] = useState(['Section A']);

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer) clearTimeout(toastTimer);
    const t = setTimeout(() => setToast(''), 3000);
    setToastTimer(t);
  };

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const data = await getTeacherProfile();
      setFname(data.first_name || '');
      setLname(data.last_name || '');
      setEmail(data.email || '');
      setPhone(data.contact_number || '');
      setUsername(data.username || (userRole === 'admin' ? 'ADMIN001' : 'TCH001'));
      setAccountStatus(data.status || 'Active');
      setMemberSince(data.created_at ? new Date(data.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'January 12, 2024');
      setLastLogin(data.last_login ? new Date(data.last_login).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Today');
    } catch (error) {
      console.error('Failed to load profile:', error);
      showToast('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserData = async (userData) => {
    setIsLoading(true);
    try {
      const response = await updateTeacherProfile(userData);
      if (userData.first_name !== undefined) setFname(userData.first_name);
      if (userData.last_name !== undefined) setLname(userData.last_name);
      if (userData.email !== undefined) setEmail(userData.email);
      if (userData.contact_number !== undefined) setPhone(userData.contact_number);
      showToast('Profile updated successfully!');
      return response;
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to update profile';
      showToast(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserPassword = async (currentPassword, newPassword) => {
    setIsLoading(true);
    try {
      const response = await updatePassword(currentPassword, newPassword);
      showToast('Password updated successfully!');
      return response;
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Current password is incorrect';
      showToast(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
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

  const displayName = [fname, lname].filter(Boolean).join(' ') || 'User';
  const initials = ((fname[0] || '') + (lname[0] || '')).toUpperCase() || '?';

  useEffect(() => {
    loadUserData();
  }, []);

  return {
    // Profile fields
    fname, setFname,
    lname, setLname,
    email, setEmail,
    phone, setPhone,
    username,
    accountStatus,
    memberSince,
    lastLogin,
    // UI state
    toast, showToast,
    isLoading,
    // Display helpers
    displayName, initials,
    // Teacher schedule
    schedule, setSchedule, updateScheduleDay,
    sections, setSections, toggleSection,
    availableSections: AVAILABLE_SECTIONS,
    defaultSchedule: DEFAULT_SCHEDULE,
    // API functions
    loadUserData,
    saveUserData,
    updateUserPassword,
  };
};

export default useProfileSettingsState;