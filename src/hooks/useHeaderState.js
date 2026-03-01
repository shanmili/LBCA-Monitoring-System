import { useState } from 'react';

export default function useHeaderState(activeTab) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const pageTitle = {
    dashboard: 'Dashboard',
    students: 'Students',
    pace: 'PACE Progress',
    risk: 'Early Warning',
    'student-profile': 'Student Profile',
    'account-settings': 'Account Settings',
  }[activeTab] || 'Dashboard';

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  return {
    isDropdownOpen,
    toggleDropdown,
    closeDropdown,
    pageTitle,
  };
}