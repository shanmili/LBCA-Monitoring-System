import { apiRequest, clearAuthToken, setAuthToken } from './client';

const ADMIN_LOGIN_PATH = '/api/admin/login/';
const TEACHER_LOGIN_PATH = '/api/teacher/login/';
const TEACHER_LOGOUT_PATH = '/api/teacher/logout/';
const TEACHER_PROFILE_PATH = '/api/teacher/profile/';
const ADMIN_REGISTER_PATH = '/api/admin/register/';
const CHECK_ADMIN_PATH = '/api/check-admin/';

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

// Admin registration - returns registration data with username
export async function adminRegister(userData) {
  const response = await apiRequest(ADMIN_REGISTER_PATH, {
    method: 'POST',
    body: {
      email: userData.email,
      password: userData.password,
      password_confirm: userData.password_confirm,
      first_name: userData.first_name,
      last_name: userData.last_name,
      contact_number: userData.contact_number,
    },
    auth: false,
  });

  return response;
}

// Check if admin exists
export async function checkAdminExists() {
  const response = await apiRequest(CHECK_ADMIN_PATH, {
    method: 'GET',
    auth: false,
  });
  return response;
}

export async function updateTeacherProfile(userData) {
  const response = await apiRequest('/api/teacher/profile/update/', {
    method: 'PATCH',
    body: userData,
  });
  return response;
}

export async function updatePassword(currentPassword, newPassword) {
  const response = await apiRequest('/api/teacher/profile/update/', {
    method: 'PATCH',
    body: {
      old_password: currentPassword,
      new_password: newPassword,
    },
  });
  return response;
}