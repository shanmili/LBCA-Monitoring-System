import { apiRequest } from './client';

const TEACHERS_PATH = '/api/teachers/';

export const mapTeacherToUi = (teacher) => ({
  id: String(teacher.teacher_id ?? teacher.id ?? ''),
  username: teacher.username || '',
  status: String(teacher.status || 'Active').toLowerCase(),
  hasCustomized: !teacher.is_first_login,
  lastLogin: teacher.last_login || 'Never',
  createdAt: teacher.created_at ? String(teacher.created_at).slice(0, 10) : 'N/A',
});

export function listTeachers() {
  return apiRequest(TEACHERS_PATH);
}

export function createTeacher(payload) {
  return apiRequest(TEACHERS_PATH, {
    method: 'POST',
    body: payload,
  });
}

export function deleteTeacher(teacherId) {
  return apiRequest(`${TEACHERS_PATH}${teacherId}/`, {
    method: 'DELETE',
  });
}

export function reactivateTeacher(teacherId) {
  return apiRequest(`${TEACHERS_PATH}${teacherId}/`, {
    method: 'PATCH',
  });
}
