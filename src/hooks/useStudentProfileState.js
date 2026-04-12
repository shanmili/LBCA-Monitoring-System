import { useState, useEffect } from 'react';
import { studentsData } from '../data/mockData';
import PrintStudentProfile from '../components/modules/students/PrintStudentProfile';
import { getStudent, mapStudentFormToApi, mapStudentToUi, updateStudent } from '../api/studentsApi';

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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadStudent = async () => {
      setLoading(true);
      setError('');

      try {
        const row = await getStudent(studentId);
        if (isMounted) {
          setStudentData(mapStudentToUi(row));
        }
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        const fallback = studentsData.find((s) => String(s.id) === String(studentId));
        setStudentData(fallback || null);
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load student profile from API.'
        );
      } finally {
        if (isMounted) {
          setLoading(false);
          setActiveTab('overview');
          setShowEditModal(false);
        }
      }
    };

    loadStudent();

    return () => {
      isMounted = false;
    };
  }, [studentId]);

  const handleSaveEdit = async (formData) => {
    if (!studentData?.id) {
      return;
    }

    try {
      const updatedApi = await updateStudent(studentData.id, mapStudentFormToApi(formData));
      const updatedUi = {
        ...mapStudentToUi(updatedApi),
        gradeLevel: formData.gradeLevel || studentData.gradeLevel,
        section: formData.section || studentData.section,
      };
      setStudentData(updatedUi);
      setError('');
      setShowEditModal(false);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to update student profile.'
      );
      throw requestError;
    }
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
    loading,
    error,
    handleSaveEdit,
    handlePrint,
  };
}