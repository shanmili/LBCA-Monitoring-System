import { useState, useEffect } from 'react';
import { studentsData } from '../data/mockData';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'pace', label: 'PACE Progress' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'risk', label: 'Risk Details' },
];

export default function useStudentProfileState(studentId) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const found = studentsData.find(s => s.id === studentId);
    setStudentData(found);
    setActiveTab('overview');
    setShowEditModal(false);
  }, [studentId]);

  const handleSaveEdit = (formData) => {
    const updated = { ...studentData, ...formData };
    const idx = studentsData.findIndex(s => s.id === studentData.id);
    if (idx !== -1) {
      studentsData[idx] = updated;
    }
    setStudentData(updated);
    setShowEditModal(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return {
    TABS,
    activeTab,
    setActiveTab,
    showEditModal,
    setShowEditModal,
    student: studentData,
    handleSaveEdit,
    handlePrint,
  };
}