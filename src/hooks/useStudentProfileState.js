import { useState, useEffect } from 'react';
import { studentsData } from '../data/mockData';
import PrintStudentProfile from '../components/modules/students/PrintStudentProfile';

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

  // Helper functions for formatting
  const getFullName = (student) => {
    const middleInitial = student?.middleName ? ` ${student.middleName.charAt(0)}.` : '';
    return `${student?.lastName}, ${student?.firstName}${middleInitial}`;
  };

  const getGuardianFullName = (student) => {
    const middleInitial = student?.guardianMiddleName ? ` ${student.guardianMiddleName.charAt(0)}.` : '';
    return `${student?.guardianLastName}, ${student?.guardianFirstName}${middleInitial}`;
  };

  const handlePrint = () => {
    if (!studentData) return;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    // Get current date for the print header
    const printDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Get the print HTML from the separate component
    const printContent = PrintStudentProfile(
      studentData,
      getFullName,
      getGuardianFullName,
      printDate
    );

    // Write to the new window and print
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
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