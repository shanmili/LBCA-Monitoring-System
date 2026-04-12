import { useEffect, useMemo, useRef, useState } from 'react';
import { paceSubjects, paceEncodingData, studentsData, studentGrades, studentSections } from '../data/mockData';
import { listEnrollments, listStudents } from '../api/studentsApi';
import { createStudentPace, listStudentPaces, updateStudentPace } from '../api/warningPaceApi';

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
  const [allStudents, setAllStudents] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [lastSavedAt, setLastSavedAt] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const saveTimerRef = useRef(null);

  const mapApiStudentToRow = (student) => ({
    id: String(student.id),
    firstName: student.first_name || '',
    lastName: student.last_name || '',
    gradeLevel: student.grade_level || student.gradeLevel || '',
    section: student.section || '',
  });

  useEffect(() => {
    let isMounted = true;

    const loadStudents = async () => {
      try {
        const rows = await listStudents();
        if (isMounted) {
          setAllStudents((rows || []).map(mapApiStudentToRow));
        }
      } catch {
        if (isMounted) {
          setAllStudents(
            studentsData.map((student) => ({
              id: String(student.id),
              firstName: student.firstName || '',
              lastName: student.lastName || '',
              gradeLevel: student.gradeLevel || '',
              section: student.section || '',
            }))
          );
        }
      }
    };

    loadStudents();

    return () => {
      isMounted = false;
    };
  }, []);

  const classStudents = useMemo(
    () =>
      allStudents.filter(
        (student) =>
          student.gradeLevel === filters.gradeLevel && student.section === filters.section
      ),
    [allStudents, filters.gradeLevel, filters.section]
  );

  // Load data when filters change
  useEffect(() => {

    // Filter students based on selected grade and section
    const filteredStudents = classStudents;

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
  }, [classStudents, filters.section, filters.subject, filters.gradeLevel, paceDataStore]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDataChange = (updatedData) => {
    setEncodingData(updatedData);
    setHasUnsavedChanges(true);
    setSaveError('');

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
      const gradeSectionStudents = allStudents.filter(s => 
        s.gradeLevel === gradeLevel && s.section === section
      );

      // If no students found, show warning but continue to next record
      if (gradeSectionStudents.length === 0) {
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
      gradeSectionStudents.forEach(student => {

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

    setHasUnsavedChanges(true);

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
    setHasUnsavedChanges(true);

    // Refresh current view
    setFilters(prev => ({ ...prev }));
  };

  const computePacePercent = (paceRecords = []) => {
    if (!Array.isArray(paceRecords) || paceRecords.length === 0) {
      return 0;
    }

    const completed = paceRecords.filter((record) => {
      const score = record?.testScore;
      return score !== null && score !== undefined && score !== '';
    }).length;

    return Number(((completed / paceRecords.length) * 100).toFixed(2));
  };

  const saveCurrentClassPace = async () => {
    if (!encodingData || encodingData.length === 0) {
      return;
    }

    setSaving(true);
    setSaveError('');

    try {
      const existing = await listStudentPaces({ subject: filters.subject });
      const enrollments = await listEnrollments().catch(() => []);
      const existingByStudent = new Map(
        (existing || [])
          .filter((row) => row.subject === filters.subject)
          .map((row) => [String(row.student), row])
      );
      const enrollmentByStudent = new Map(
        (enrollments || [])
          .filter((row) => row?.student)
          .map((row) => [String(row.student), row.id])
      );

      const saveTasks = encodingData.map(async (row) => {
        const studentId = Number(row.studentId);
        if (!Number.isFinite(studentId)) {
          return;
        }

        const pacePercent = computePacePercent(row.paceRecords);
        const completed = Array.isArray(row.paceRecords)
          ? row.paceRecords.filter(
              (record) =>
                record?.testScore !== null &&
                record?.testScore !== undefined &&
                record?.testScore !== ''
            ).length
          : 0;
        const pacesBehind = Math.max(0, 6 - completed);

        const existingRow = existingByStudent.get(String(studentId));
        if (existingRow?.id) {
          await updateStudentPace(existingRow.id, {
            pace_percent: pacePercent,
            paces_behind: pacesBehind,
          });
          return;
        }

        const createPayload = {
          student: studentId,
          subject: filters.subject,
          pace_percent: pacePercent,
          paces_behind: pacesBehind,
        };

        const enrollmentId = enrollmentByStudent.get(String(studentId));
        if (enrollmentId) {
          createPayload.enrollment = enrollmentId;
        }

        await createStudentPace(createPayload);
      });

      await Promise.all(saveTasks);

      setHasUnsavedChanges(false);
      setLastSavedAt(new Date().toLocaleTimeString());
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unable to save PACE updates.');
      throw error;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!hasUnsavedChanges) {
      return;
    }

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      saveCurrentClassPace().catch(() => {
        // Error state is already captured in saveError.
      });
    }, 1200);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [encodingData, hasUnsavedChanges, filters.subject]);

  return {
    SCHOOL_YEARS,
    filters,
    updateFilter,
    encodingData,
    handleDataChange,
    handleAddPaceRecord,
    handleAddPaceForCurrent,
    saveCurrentClassPace,
    saving,
    saveError,
    hasUnsavedChanges,
    lastSavedAt,
  };
}