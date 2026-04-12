import { apiRequest, clearAuthToken, setAuthToken } from './client';

const ADMIN_LOGIN_PATH = '/api/admin/login/';
const TEACHER_LOGIN_PATH = '/api/teacher/login/';
const TEACHER_LOGOUT_PATH = '/api/teacher/logout/';
const TEACHER_PROFILE_PATH = '/api/teacher/profile/';

const buildLoginBody = (identifier, password) => ({
  username: identifier,
  email: identifier,
  identifier,
  password,
});

export async function login(identifier, password) {
  const credentials = buildLoginBody(identifier, password);

  const attempts = [
    { role: 'admin', path: ADMIN_LOGIN_PATH },
    { role: 'teacher', path: TEACHER_LOGIN_PATH },
  ];

  let lastError = null;

  for (const attempt of attempts) {
    try {
      const payload = await apiRequest(attempt.path, {
        method: 'POST',
        body: credentials,
        auth: false,
      });

      if (payload?.token) {
        setAuthToken(payload.token);
      }

      return {
        role: attempt.role,
        payload,
      };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('Login failed');
}

export async function logout(role) {
  try {
    if (role === 'teacher') {
      await apiRequest(TEACHER_LOGOUT_PATH, { method: 'POST' });
    }
  } finally {
    clearAuthToken();
  }
}

export function getTeacherProfile() {
  return apiRequest(TEACHER_PROFILE_PATH);
}
