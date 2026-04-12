import { apiRequest } from './client';

const TEACHERS_PATH = '/api/admin/teachers/';
const CREATE_TEACHER_PATH = '/api/admin/teachers/create/';

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
  return apiRequest(CREATE_TEACHER_PATH, {
    method: 'POST',
    body: payload,
  });
}

export function deleteTeacher(teacherId) {
  return apiRequest(`/api/admin/teachers/${teacherId}/delete/`, {
    method: 'DELETE',
  });
}

export function reactivateTeacher(teacherId) {
  return apiRequest(`/api/admin/teachers/${teacherId}/reactivate/`, {
    method: 'PATCH',
  });
}
