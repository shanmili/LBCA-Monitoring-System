import { apiRequest } from './client';

const STUDENTS_PATH = '/api/students/';
const ENROLLMENTS_PATH = '/api/enrollments/';

const toDisplayStudentId = (value) => {
  if (value === undefined || value === null) {
    return '';
  }
  return String(value);
};

const fullNameToParts = (value = '') => {
  const parts = String(value).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { first: '', middle: '', last: '' };
  }
  if (parts.length === 1) {
    return { first: parts[0], middle: '', last: '' };
  }
  return {
    first: parts[0],
    middle: parts.length > 2 ? parts.slice(1, -1).join(' ') : '',
    last: parts[parts.length - 1],
  };
};

const normalizeRiskLevel = (value) => {
  const normalized = String(value || '').toLowerCase();
  if (normalized === 'critical' || normalized === 'high') {
    return 'High';
  }
  if (normalized === 'medium' || normalized === 'moderate') {
    return 'Medium';
  }
  return 'Low';
};

export const mapStudentToUi = (student, warning = null, pace = null) => {
  const warningRisk = warning?.risk_level || warning?.status;
  const riskLevel = normalizeRiskLevel(warningRisk);

  return {
    id: toDisplayStudentId(student.id),
    firstName: student.first_name || '',
    middleName: student.middle_name || '',
    lastName: student.last_name || '',
    dateOfBirth: student.birth_date || '',
    gender: student.gender || '',
    address: student.address || '',
    guardianFirstName: student.guardian_first_name || '',
    guardianMiddleName: student.guardian_mid_name || '',
    guardianLastName: student.guardian_last_name || '',
    guardianContact: student.guardian_contact || '',
    guardianRelationship: student.relationship || '',
    gradeLevel: student.grade_level || student.gradeLevel || 'N/A',
    section: student.section || 'N/A',
    pacePercent: Number(pace?.pace_percent ?? warning?.pace_percent ?? 0),
    attendance: Number(warning?.attendance ?? 0),
    riskLevel,
    status:
      Number(pace?.pace_percent ?? warning?.pace_percent ?? 100) < 80
        ? 'Behind'
        : 'On Track',
    factor:
      warning?.subject ||
      (riskLevel === 'High' || riskLevel === 'Medium' ? 'PACE and warning trend' : 'None'),
    subjects: [],
    attendanceSummary: {
      present: Number(warning?.attendance ?? 0),
      late: 0,
      absent: 0,
    },
    riskDetails: [],
  };
};

export function listStudents() {
  return apiRequest(STUDENTS_PATH);
}

export function getStudent(studentId) {
  return apiRequest(`${STUDENTS_PATH}${studentId}/`);
}

export function createStudent(payload) {
  return apiRequest(STUDENTS_PATH, {
    method: 'POST',
    body: payload,
  });
}

export function updateStudent(studentId, payload) {
  return apiRequest(`${STUDENTS_PATH}${studentId}/`, {
    method: 'PATCH',
    body: payload,
  });
}

export function deleteStudent(studentId) {
  return apiRequest(`${STUDENTS_PATH}${studentId}/`, {
    method: 'DELETE',
  });
}

export function listEnrollments() {
  return apiRequest(ENROLLMENTS_PATH);
}

export function createEnrollment(payload) {
  return apiRequest(ENROLLMENTS_PATH, {
    method: 'POST',
    body: payload,
  });
}

export const mapStudentFormToApi = (formData) => {
  const guardian = fullNameToParts(
    `${formData.guardianFirstName || ''} ${formData.guardianMiddleName || ''} ${formData.guardianLastName || ''}`
  );

  return {
    first_name: formData.firstName,
    middle_name: formData.middleName || '',
    last_name: formData.lastName,
    birth_date: formData.dateOfBirth,
    gender: formData.gender,
    address: formData.address,
    guardian_first_name: guardian.first || formData.guardianFirstName,
    guardian_mid_name: guardian.middle || formData.guardianMiddleName || '',
    guardian_last_name: guardian.last || formData.guardianLastName,
    guardian_contact: formData.guardianContact,
    relationship: formData.guardianRelationship,
    grade_level: formData.gradeLevel || undefined,
    section: formData.section || undefined,
  };
};
