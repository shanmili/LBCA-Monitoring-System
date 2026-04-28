import { useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import OTPScreen from './screens/OTPScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPassword';

// Use the same env var names as `src/services/api.js` so both modules target the same backend.
const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const USE_MOCK_FALLBACK = (import.meta.env.VITE_USE_MOCK_FALLBACK || 'false') === 'true';
const DEVICE_ID = (() => {
  let id = localStorage.getItem('device_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('device_id', id);
  }
  return id;
})();

/**
 * Extract human-readable error message from API response
 */
const extractErrorMessage = (data, defaultMessage = 'An error occurred') => {
  if (!data) return defaultMessage;
  
  // If data.detail is a string, use it
  if (typeof data.detail === 'string') return data.detail;
  
  // If data.detail is an object, try to extract message
  if (data.detail && typeof data.detail === 'object') {
    if (data.detail.message) return data.detail.message;
    if (data.detail.error) return data.detail.error;
    // If it has multiple errors, join them
    if (Array.isArray(data.detail)) {
      return data.detail.map(err => 
        typeof err === 'string' ? err : err.message || err.error || 'Unknown error'
      ).join(', ');
    }
  }
  
  // Check for other common error fields
  if (data.message) return data.message;
  if (data.error) return data.error;
  
  // Last resort
  return defaultMessage;
};

const parseResponseBody = async (res) => {
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }

  const text = await res.text();
  if (text && /<!doctype html|<html/i.test(text)) {
    return { detail: 'Server returned HTML instead of JSON. Check VITE_API_URL and backend port.' };
  }
  return { detail: text || 'Unexpected non-JSON response from server' };
};

/**
 * AuthController manages all pre-login screens:
 * login → (2FA OTP) → app
 * login → forgot password → OTP → reset password → login
 * login → register → pending approval page
 *
 * Props:
 *   onAuthSuccess(accessToken, refreshToken, user) — called when fully authenticated
 */
const AuthController = ({ onAuthSuccess }) => {
  const [screen, setScreen] = useState('login');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Shared state across steps
  const [pendingUserId, setPendingUserId] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingOtpCode, setPendingOtpCode] = useState('');

  const clearError = () => setError('');

  // ─── Login ───────────────────────────────────────────────
  const handleLogin = async (email, password) => {
    setIsLoading(true);
    clearError();
    // Try a list of common auth endpoints until one returns a JSON response
    const candidates = [
      '/api/sessions',
      '/api/v1/sessions',
      '/api/auth/login',
      '/api/v1/auth/login',
      '/api/token-auth/',
      '/api/token/',
      '/api/auth/token/login/',
      '/api/login/',
      '/auth/token/login/',
      // Django backend custom admin/teacher endpoints
      '/api/admin/login/',
      '/api/v1/admin/login/',
      '/api/teacher/login/',
      '/api/v1/teacher/login/',
    ];

    let lastError = null;
    try {
      for (const path of candidates) {
        try {
          const url = `${API_BASE.replace(/\/$/, '')}${path}`;
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              // Some backends expect `username` instead of `email` (Django admin)
              username: email,
              email,
              password,
              device_id: DEVICE_ID,
              device_name: navigator.userAgent.slice(0, 100),
            }),
          });

          const data = await parseResponseBody(res);

          // If server returned HTML or non-json, parseResponseBody returns an object with detail explaining that.
          if (!res.ok && (!data || typeof data !== 'object')) {
            lastError = new Error(`Endpoint ${path} returned non-JSON response`);
            continue;
          }

          // If response is JSON but not ok, surface its message
          if (!res.ok) {
            lastError = new Error(extractErrorMessage(data, `Login failed at ${path}`));
            // If 401/403, credentials may be wrong — stop trying further candidate endpoints
            if (res.status === 401 || res.status === 403) break;
            continue;
          }

          // Successful JSON response — normalize token fields
          const access = data.access_token || data.token || data.key || (data.data && data.data.token) || null;
          const refresh = data.refresh_token || data.refresh || null;

          if (data.requires_2fa || data.requires_otp) {
            setPendingUserId(data.user_id || data.user?.id || '');
            setPendingEmail(email);
            if (data.debug_otp) setError(`Development OTP: ${data.debug_otp}`);
            setScreen('otp-login');
            return;
          }

          if (access) {
            localStorage.setItem('access_token', access);
            if (refresh) localStorage.setItem('refresh_token', refresh);
            const user = data.user || data.data?.user || data;
            onAuthSuccess(access, refresh, user);
            return;
          }

          // If no token fields but login succeeded, try to proceed with returned user
          if (data.user) {
            onAuthSuccess(null, null, data.user);
            return;
          }

          lastError = new Error(extractErrorMessage(data, `Unexpected login response from ${path}`));
        } catch (innerErr) {
          lastError = innerErr;
          continue;
        }
      }

      throw lastError || new Error('Login failed: no compatible auth endpoint found');
    } catch (err) {
      // If configured, allow a local mock fallback for testing credentials
      if (USE_MOCK_FALLBACK) {
        const lcEmail = (email || '').toLowerCase();
        // demo admin
        if (lcEmail === 'admin@lbca.edu.ph' && password === 'Admin123!') {
          const demoAccess = 'demo-admin-token';
          const demoUser = { id: 'demo-admin', email: lcEmail, role: 'admin', name: 'LBCA Admin' };
          localStorage.setItem('access_token', demoAccess);
          localStorage.setItem('refresh_token', 'demo-refresh');
          onAuthSuccess(demoAccess, 'demo-refresh', demoUser);
          setIsLoading(false);
          return;
        }

        // demo teacher
        if (lcEmail === 'teacher@lbca.edu.ph' && password === 'Teacher123!') {
          const demoAccess = 'demo-teacher-token';
          const demoUser = { id: 'demo-teacher', email: lcEmail, role: 'teacher', name: 'Demo Teacher' };
          localStorage.setItem('access_token', demoAccess);
          localStorage.setItem('refresh_token', 'demo-refresh');
          onAuthSuccess(demoAccess, 'demo-refresh', demoUser);
          setIsLoading(false);
          return;
        }
      }

      setError(err.message || err.toString() || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── 2FA Verify (login) ───────────────────────────────────
  const handleVerifyLoginOtp = async (code) => {
    setIsLoading(true);
    clearError();
    try {
      const res = await fetch(`${API_BASE}/api/otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: pendingUserId,
          code,
          device_id: DEVICE_ID,
          device_name: navigator.userAgent.slice(0, 100),
        }),
      });
      const data = await parseResponseBody(res);
      if (!res.ok) throw new Error(extractErrorMessage(data, 'Invalid OTP'));

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      onAuthSuccess(data.access_token, data.refresh_token, data.user);
    } catch (err) {
      setError(err.message || err.toString() || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendLoginOtp = async () => {
    // Re-trigger login to resend OTP — uses stored email
    // A real implementation would have a dedicated resend endpoint
    clearError();
  };

  // ─── Registration ─────────────────────────────────────────
  const handleRegister = async (formData) => {
    setIsLoading(true);
    clearError();
    try {
      const res = await fetch(`${API_BASE}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await parseResponseBody(res);
      if (!res.ok) throw new Error(extractErrorMessage(data, 'Registration failed'));
      // RegisterScreen handles its own success state
    } catch (err) {
      setError(err.message || err.toString() || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Forgot Password ──────────────────────────────────────
  const handleForgotPassword = async (email, proceedToOtp = false) => {
    if (proceedToOtp) {
      setPendingEmail(email);
      setScreen('otp-reset');
      return;
    }
    setIsLoading(true);
    clearError();
    try {
      const res = await fetch(`${API_BASE}/api/password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await parseResponseBody(res);
      if (!res.ok) throw new Error(extractErrorMessage(data, 'Request failed'));
      setPendingEmail(email);
      setScreen('otp-reset'); // Go directly to OTP screen
    } catch (err) {
      setError(err.message || err.toString() || 'Request failed');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Verify Reset OTP ─────────────────────────────────────
const handleVerifyResetOtp = async (code) => {
  setIsLoading(true);
  clearError();
  try {
    const res = await fetch(`${API_BASE}/api/password-reset/validate-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: pendingEmail, code }),
    });
    const data = await parseResponseBody(res);
    if (!res.ok) throw new Error(extractErrorMessage(data, 'Invalid OTP'));
    
    // OTP is valid, store it and proceed to password form
    setPendingOtpCode(code);
    setScreen('reset-password');
  } catch (err) {
    setError(err.message || err.toString() || 'Invalid OTP');
  } finally {
    setIsLoading(false);
  }
};

const handleResendResetOtp = async () => {
  await handleForgotPassword(pendingEmail);
};

  // ─── Reset Password ───────────────────────────────────────
  const handleResetPassword = async ({ token, new_password, confirm_password }) => {
    setIsLoading(true);
    clearError();
    try {
      const res = await fetch(`${API_BASE}/api/password-reset`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password, confirm_password }),
      });
      const data = await parseResponseBody(res);
      if (!res.ok) throw new Error(extractErrorMessage(data, 'Reset failed'));
      setScreen('login');
      // Optionally show a success toast here
    } catch (err) {
      setError(err.message || err.toString() || 'Reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────
  switch (screen) {
    case 'login':
      return (
        <LoginScreen
          onLogin={handleLogin}
          onForgotPassword={() => { clearError(); setScreen('forgot-password'); }}
          onRegister={() => { clearError(); setScreen('register'); }}
          error={error}
          isLoading={isLoading}
        />
      );

    case 'register':
      return (
        <RegisterScreen
          onRegister={handleRegister}
          onBack={() => { clearError(); setScreen('login'); }}
          error={error}
          isLoading={isLoading}
        />
      );

    case 'otp-login':
      return (
        <OTPScreen
          onVerify={handleVerifyLoginOtp}
          onResend={handleResendLoginOtp}
          onBack={() => { clearError(); setScreen('login'); }}
          error={error}
          isLoading={isLoading}
          email={pendingEmail}
          purpose="login"
        />
      );

    case 'forgot-password':
      return (
        <ForgotPasswordScreen
          onSubmit={handleForgotPassword}
          onBack={() => { clearError(); setScreen('login'); }}
          error={error}
          isLoading={isLoading}
        />
      );

    case 'otp-reset':
      return (
        <OTPScreen
          onVerify={handleVerifyResetOtp}
          onResend={handleResendResetOtp}
          onBack={() => { clearError(); setScreen('forgot-password'); }}
          error={error}
          isLoading={isLoading}
          email={pendingEmail}
          purpose="password-reset"
        />
      );

    case 'reset-password':
      return (
        <ResetPasswordScreen
          onSubmit={handleResetPassword}
          onBack={() => { clearError(); setScreen('otp-reset'); }}
          error={error}
          isLoading={isLoading}
          otpCode={pendingOtpCode}
        />
      );

    default:
      return null;
  }
};

export default AuthController;
