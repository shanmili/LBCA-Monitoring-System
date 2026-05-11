import { apiRequest, clearAuthToken, setAuthToken } from './client';

const TEACHER_LOGIN_PATH = '/api/teacher/login/';
const ADMIN_LOGIN_PATH = '/api/admin/login/';
const ADMIN_REGISTER_PATH = '/api/admin/register/';
const TEACHER_LOGOUT_PATH = '/api/teacher/logout/';
const TEACHER_PROFILE_PATH = '/api/teacher/profile/';

const buildLoginBody = (identifier, password) => ({
  username: identifier,
  password,
});

export async function login(identifier, password) {
  const credentials = buildLoginBody(identifier, password);

  try {
    // Try teacher login first (works for both teachers and admins)
    const payload = await apiRequest(TEACHER_LOGIN_PATH, {
      method: 'POST',
      body: credentials,
      auth: false,
    });

    if (payload?.token) {
      setAuthToken(payload.token);
    }

    // Use the payload's role if available
    const finalRole = payload?.role || 'teacher';

    return {
      role: finalRole,
      payload,
    };
  } catch (error) {
    throw error || new Error('Login failed');
  }
}

export async function adminRegister(firstName, lastName, email, password) {
  try {
    const payload = await apiRequest(ADMIN_REGISTER_PATH, {
      method: 'POST',
      body: {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      },
      auth: false,
    });

    if (payload?.token) {
      setAuthToken(payload.token);
    }

    return payload;
  } catch (error) {
    throw error || new Error('Registration failed');
  }
}

export async function logout(role) {
  try {
    await apiRequest(TEACHER_LOGOUT_PATH, { method: 'POST' });
  } finally {
    clearAuthToken();
  }
}

export function getTeacherProfile() {
  return apiRequest(TEACHER_PROFILE_PATH);
}
