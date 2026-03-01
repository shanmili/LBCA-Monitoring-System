import { useState, useEffect } from 'react';
import { paceSubjects, paceEncodingData, studentsData, studentGrades, studentSections } from '../data/mockData';

const SCHOOL_YEARS = ['2025-2026', '2024-2025', '2023-2024'];

export default function usePaceEncodingState() {

  const [filters, setFilters] = useState({
    schoolYear: '2025-2026',
    gradeLevel: studentGrades[0] || 'Grade 7',
    section: studentSections[0] || 'Section A',
    subject: paceSubjects[0] || 'Math'
  });

  // Store all PACE data
  const [paceDataStore, setPaceDataStore] = useState(() => {
    return paceEncodingData;
  });

  const [encodingData, setEncodingData] = useState([]);

  // Load data when filters change
  useEffect(() => {

    // Filter students based on selected grade and section
    const filteredStudents = studentsData.filter(student => 
      student.gradeLevel === filters.gradeLevel && student.section === filters.section
    );

    // Get existing PACE data for this section/subject
    let sectionData = paceDataStore[filters.section]?.[filters.subject] || [];

    // AUTO-CREATE TABLE: If no records exist but there are students, create the table with PACE #1
    if (sectionData.length === 0 && filteredStudents.length > 0) {

      // Create initial record with PACE #1 for all students
      sectionData = filteredStudents.map(student => ({
        studentId: student.id,
        name: `${student.lastName}, ${student.firstName}`,
        paceRecords: [{ paceNo: 1, testScore: null }]
      }));

      // Update the store
      setPaceDataStore(prev => {
        const newStore = { ...prev };
        if (!newStore[filters.section]) {
          newStore[filters.section] = {};
        }
        newStore[filters.section][filters.subject] = sectionData;
        return newStore;
      });
    }

    const combinedData = filteredStudents.map(student => {
      const existingRecord = sectionData.find(r => r.studentId === student.id);
      return {
        studentId: student.id,
        name: `${student.lastName}, ${student.firstName}`,
        paceRecords: existingRecord?.paceRecords || [] // Will be empty array if no records
      };
    });

    setEncodingData(combinedData);
  }, [filters.section, filters.subject, filters.gradeLevel, paceDataStore]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDataChange = (updatedData) => {
    setEncodingData(updatedData);

    // Update paceDataStore
    setPaceDataStore(prev => {
      const newStore = { ...prev };
      if (!newStore[filters.section]) {
        newStore[filters.section] = {};
      }
      newStore[filters.section][filters.subject] = updatedData.map(student => ({
        studentId: student.studentId,
        name: student.name,
        paceRecords: student.paceRecords
      }));
      return newStore;
    });
  };

  const handleAddPaceRecord = (newRecords) => {

    // Create a deep copy of the current store
    const updatedStore = JSON.parse(JSON.stringify(paceDataStore));

    // Track if any records were actually added
    let recordsAdded = false;

    // Process each new record
    newRecords.forEach((record, index) => {
      const { subject, gradeLevel, section } = record;

      // Get students for this grade and section
      const classStudents = studentsData.filter(s => 
        s.gradeLevel === gradeLevel && s.section === section
      );

      // If no students found, show warning but continue to next record
      if (classStudents.length === 0) {
        alert(`No students found for ${gradeLevel} ${section}. Please add students first.`);
        return;
      }

      // Initialize section if it doesn't exist
      if (!updatedStore[section]) {
        updatedStore[section] = {};
      }

      // Initialize subject if it doesn't exist
      if (!updatedStore[section][subject]) {
        updatedStore[section][subject] = [];
      }

      // For each student in the class
      classStudents.forEach(student => {

        const existingIndex = updatedStore[section][subject].findIndex(
          r => r.studentId === student.id
        );

        const newPaceRecord = {
          paceNo: 1,
          testScore: null
        };

        if (existingIndex >= 0) {
          // Student exists - check if they already have PACE #1
          const hasPace1 = updatedStore[section][subject][existingIndex].paceRecords.some(
            r => r.paceNo === 1
          );

          if (!hasPace1) {
            updatedStore[section][subject][existingIndex].paceRecords.push(newPaceRecord);
            recordsAdded = true;
          } 
        } else {
          // New student
          updatedStore[section][subject].push({
            studentId: student.id,
            name: `${student.lastName}, ${student.firstName}`,
            paceRecords: [newPaceRecord]
          });
          recordsAdded = true;
        }
      });
    });

    if (!recordsAdded) {
      return;
    }

    // Update the state
    setPaceDataStore(updatedStore);

    // Check if current filters match any of the new records
    const shouldRefresh = newRecords.some(record => 
      record.subject === filters.subject &&
      record.gradeLevel === filters.gradeLevel &&
      record.section === filters.section
    );

    if (shouldRefresh) {
      // Force a refresh by triggering a filter update
      setFilters(prev => ({ ...prev }));
    }
  };

  const handleAddPaceForCurrent = () => {
    // Check if there are students in current view
    if (!encodingData || encodingData.length === 0) {
      alert('No students found in this class. Cannot add PACE record.');
      return;
    }

    // Create a deep copy
    const updatedStore = JSON.parse(JSON.stringify(paceDataStore));

    // Initialize section/subject if needed
    if (!updatedStore[filters.section]) {
      updatedStore[filters.section] = {};
    }
    if (!updatedStore[filters.section][filters.subject]) {
      updatedStore[filters.section][filters.subject] = [];
    }

    let recordsAdded = false;

    // For each student in current view
    encodingData.forEach(student => {
      // Ensure paceRecords exists (fix for the error)
      const currentPaceRecords = student.paceRecords || [];
      const nextPaceNo = currentPaceRecords.length + 1;

      const newPaceRecord = {
        paceNo: nextPaceNo,
        testScore: null
      };

      // Find if student already exists in store
      const existingIndex = updatedStore[filters.section][filters.subject].findIndex(
        r => r.studentId === student.studentId
      );

      if (existingIndex >= 0) {
        // Student exists in store
        const existingStudent = updatedStore[filters.section][filters.subject][existingIndex];

        // Ensure paceRecords exists for existing student
        if (!existingStudent.paceRecords) {
          existingStudent.paceRecords = [];
        }

        // Check if this PACE number already exists
        const hasPaceNo = existingStudent.paceRecords.some(r => r.paceNo === nextPaceNo);

        if (!hasPaceNo) {
          existingStudent.paceRecords.push(newPaceRecord);
          recordsAdded = true;
        }
      } else {
        // New student in store
        updatedStore[filters.section][filters.subject].push({
          studentId: student.studentId,
          name: student.name,
          paceRecords: [newPaceRecord]
        });
        recordsAdded = true;
      }
    });

    if (!recordsAdded) {
      alert('All students already have this PACE number or no changes were made.');
      return;
    }
    
    setPaceDataStore(updatedStore);

    // Refresh current view
    setFilters(prev => ({ ...prev }));
  };

  return {
    SCHOOL_YEARS,
    filters,
    updateFilter,
    encodingData,
    handleDataChange,
    handleAddPaceRecord,
    handleAddPaceForCurrent,
  };
}