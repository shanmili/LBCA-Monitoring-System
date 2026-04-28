const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

function getToken() {
  return localStorage.getItem('access_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  const contentType = res.headers.get('content-type') || '';
  const parseBody = async () => {
    if (contentType.includes('application/json')) return res.json();
    const text = await res.text();
    if (text && /<!doctype html|<html/i.test(text)) {
      return { detail: 'Server returned HTML instead of JSON. Check VITE_API_URL and backend port.' };
    }
    return { detail: text || res.statusText };
  };

  if (!res.ok) {
    const err = await parseBody();
    throw new Error(err.detail || err.error || `Request failed: ${res.status}`);
  }

  // 204 No Content
  if (res.status === 204) return null;
  return parseBody();
}

// ── Grade Levels ──────────────────────────────────────────────────────────────
export const gradeLevelApi = {
  list: () => request('/api/grade-levels/'),
  get: (id) => request(`/api/grade-levels/${id}`),
  create: (data) => request('/api/grade-levels', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/api/grade-levels/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id) => request(`/api/grade-levels/${id}`, { method: 'DELETE' }),
};

// ── School Years ──────────────────────────────────────────────────────────────
export const schoolYearApi = {
  list: () => request('/api/school-years/'),
  getCurrent: () => request('/api/school-years/current/'),
  get: (id) => request(`/api/school-years/${id}`),
  create: (data) => request('/api/school-years', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/api/school-years/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id) => request(`/api/school-years/${id}`, { method: 'DELETE' }),
};

// ── Sections ──────────────────────────────────────────────────────────────────
export const sectionApi = {
  list: (gradeLevelId = null) =>
    request(gradeLevelId ? `/api/sections/?grade_level_id=${gradeLevelId}` : '/api/sections/'),
  get: (id) => request(`/api/sections/${id}`),
  create: (data) => request('/api/sections', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/api/sections/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id) => request(`/api/sections/${id}`, { method: 'DELETE' }),
};

// ── Subjects ───────────────────────────────────────────────────────────────────
export const subjectApi = {
  list: (gradeLevelId = null) =>
    request(gradeLevelId ? `/api/subjects/?grade_level_id=${gradeLevelId}` : '/api/subjects/'),
  get: (id) => request(`/api/subjects/${id}`),
  create: (data) => request('/api/subjects', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/api/subjects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id) => request(`/api/subjects/${id}`, { method: 'DELETE' }),
};

// ── Students ──────────────────────────────────────────────────────────────────
export const studentApi = {
  list: () => request('/api/students/'),
  get: (id) => request(`/api/students/${id}`),
  create: (data) => request('/api/students', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/api/students/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id) => request(`/api/students/${id}`, { method: 'DELETE' }),
};

// ── Student Enrollments ───────────────────────────────────────────────────────
export const enrollmentApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.student_id) qs.set('student_id', params.student_id);
    if (params.school_year_id) qs.set('school_year_id', params.school_year_id);
    const query = qs.toString();
    return request(query ? `/api/enrollments/?${query}` : '/api/enrollments/');
  },
  get: (id) => request(`/api/enrollments/${id}`),
  /** Creates student + enrollment in one call */
  createWithStudent: (data) =>
    request('/api/enrollments/with-student', { method: 'POST', body: JSON.stringify(data) }),
  create: (data) =>
    request('/api/enrollments', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/api/enrollments/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id) => request(`/api/enrollments/${id}`, { method: 'DELETE' }),
};
