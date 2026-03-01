import { useState, useEffect } from 'react';
import { paceSubjects, paceEncodingData, studentsData, studentGrades, studentSections } from '../data/mockData';

const SCHOOL_YEARS = ['2025-2026', '2024-2025', '2023-2024'];

export default function usePaceEncodingState() {
  console.log('usePaceEncodingState initialized');

  const [filters, setFilters] = useState({
    schoolYear: '2025-2026',
    gradeLevel: studentGrades[0] || 'Grade 7',
    section: studentSections[0] || 'Section A',
    subject: paceSubjects[0] || 'Math'
  });

  // Store all PACE data
  const [paceDataStore, setPaceDataStore] = useState(() => {
    console.log('Initializing paceDataStore with:', paceEncodingData);
    return paceEncodingData;
  });

  const [encodingData, setEncodingData] = useState([]);

  // Load data when filters change
  useEffect(() => {
    console.log('Filters changed:', filters);

    // Filter students based on selected grade and section
    const filteredStudents = studentsData.filter(student => 
      student.gradeLevel === filters.gradeLevel && student.section === filters.section
    );

    console.log('Filtered students:', filteredStudents.length);

    // Get existing PACE data for this section/subject
    let sectionData = paceDataStore[filters.section]?.[filters.subject] || [];

    // AUTO-CREATE TABLE: If no records exist but there are students, create the table with PACE #1
    if (sectionData.length === 0 && filteredStudents.length > 0) {
      console.log('Auto-creating PACE table for', filters.subject);

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

    console.log('Combined data:', combinedData);
    setEncodingData(combinedData);
  }, [filters.section, filters.subject, filters.gradeLevel, paceDataStore]);

  const updateFilter = (key, value) => {
    console.log('Updating filter:', key, value);
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDataChange = (updatedData) => {
    console.log('Data changed:', updatedData);
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
      console.log('Updated paceDataStore:', newStore);
      return newStore;
    });
  };

  const handleAddPaceRecord = (newRecords) => {
    console.log('Adding new PACE records:', newRecords);

    // Create a deep copy of the current store
    const updatedStore = JSON.parse(JSON.stringify(paceDataStore));
    console.log('Current store before update:', updatedStore);

    // Track if any records were actually added
    let recordsAdded = false;

    // Process each new record
    newRecords.forEach((record, index) => {
      const { subject, gradeLevel, section } = record;
      console.log(`Processing record ${index + 1}:`, { subject, gradeLevel, section });

      // Get students for this grade and section
      const classStudents = studentsData.filter(s => 
        s.gradeLevel === gradeLevel && s.section === section
      );
      console.log(`Found ${classStudents.length} students for ${gradeLevel} ${section}`);

      // If no students found, show warning but continue to next record
      if (classStudents.length === 0) {
        console.warn(`No students found for ${gradeLevel} ${section}. Cannot create PACE records.`);
        alert(`No students found for ${gradeLevel} ${section}. Please add students first.`);
        return;
      }

      // Initialize section if it doesn't exist
      if (!updatedStore[section]) {
        console.log(`Creating new section: ${section}`);
        updatedStore[section] = {};
      }

      // Initialize subject if it doesn't exist
      if (!updatedStore[section][subject]) {
        console.log(`Creating new subject: ${subject} in section ${section}`);
        updatedStore[section][subject] = [];
      }

      // For each student in the class
      classStudents.forEach(student => {
        console.log(`Processing student: ${student.id}`);

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
            console.log(`Student ${student.id} exists, adding PACE #1`);
            updatedStore[section][subject][existingIndex].paceRecords.push(newPaceRecord);
            recordsAdded = true;
          } else {
            console.log(`Student ${student.id} already has PACE #1, skipping`);
          }
        } else {
          // New student
          console.log(`Student ${student.id} is new, creating entry with PACE #1`);
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
      console.log('No new records were added');
      return;
    }

    console.log('Updated store after processing:', updatedStore);

    // Update the state
    setPaceDataStore(updatedStore);

    // Check if current filters match any of the new records
    const shouldRefresh = newRecords.some(record => 
      record.subject === filters.subject &&
      record.gradeLevel === filters.gradeLevel &&
      record.section === filters.section
    );

    console.log('Should refresh current view:', shouldRefresh);

    if (shouldRefresh) {
      // Force a refresh by triggering a filter update
      console.log('Refreshing current view');
      setFilters(prev => ({ ...prev }));
    }
  };

  const handleAddPaceForCurrent = () => {
    console.log('Adding PACE for current view');
    console.log('Current filters:', filters);
    console.log('Current encodingData:', encodingData);

    // Check if there are students in current view
    if (!encodingData || encodingData.length === 0) {
      console.log('No students in current view');
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
      console.log(`Adding PACE for student:`, student);

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
          console.log(`Student exists, adding PACE #${nextPaceNo}`);
          existingStudent.paceRecords.push(newPaceRecord);
          recordsAdded = true;
        } else {
          console.log(`Student already has PACE #${nextPaceNo}, skipping`);
        }
      } else {
        // New student in store
        console.log(`Student is new in store, creating with PACE #1`);
        updatedStore[filters.section][filters.subject].push({
          studentId: student.studentId,
          name: student.name,
          paceRecords: [newPaceRecord]
        });
        recordsAdded = true;
      }
    });

    if (!recordsAdded) {
      console.log('No new PACE records were added');
      alert('All students already have this PACE number or no changes were made.');
      return;
    }

    console.log('Updated store:', updatedStore);
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