import { apiRequest, clearAuthToken, setAuthToken } from './client';

const LOGIN_PATH = '/api/auth/login/';
const LOGOUT_PATH = '/api/auth/logout/';
const PROFILE_PATH = '/api/auth/profile/';

const buildLoginBody = (identifier, password) => ({
  username: identifier,
  email: identifier,
  identifier,
  password,
});

export async function login(identifier, password) {
  const credentials = buildLoginBody(identifier, password);

  try {
    const payload = await apiRequest(LOGIN_PATH, {
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

export async function logout(role) {
  try {
    await apiRequest(LOGOUT_PATH, { method: 'POST' });
  } finally {
    clearAuthToken();
  }
}

export function getTeacherProfile() {
  return apiRequest(PROFILE_PATH);
}
