import { apiRequest } from './client';

const STUDENT_PACES_PATH = '/student-paces/';
const EARLY_WARNINGS_PATH = '/early-warnings/';

export function listStudentPaces(params = {}) {
  return apiRequest(STUDENT_PACES_PATH, { params });
}

export function listEarlyWarnings(params = {}) {
  return apiRequest(EARLY_WARNINGS_PATH, { params });
}

export function updateStudentPace(paceId, payload) {
  return apiRequest(`${STUDENT_PACES_PATH}${paceId}/`, {
    method: 'PATCH',
    body: payload,
  });
}

export function createStudentPace(payload) {
  return apiRequest(STUDENT_PACES_PATH, {
    method: 'POST',
    body: payload,
  });
}
