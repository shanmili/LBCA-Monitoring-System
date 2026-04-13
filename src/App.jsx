import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import TeacherScreen from './screens/TeacherScreen';
import AdminScreen from './screens/AdminScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

import './styles/Variables.css';
import './styles/Global.css';
import './styles/Login.css';
import './styles/Theme.css';
import './styles/layout/MainLayout.css';
import './styles/layout/Header.css';
import './styles/layout/Sidebar.css';
import './styles/layout/UserMenu.css';
import './styles/layout/Notification.css';
import './styles/profileSetting/ProfileSetting.css';

import { SchoolProvider } from './context/SchoolContext';
import LoadingScreen from './components/common/LoadingScreen';
import { login, logout, adminRegister, checkAdminExists } from './api/authApi';

function AppContent() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('lbca_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [adminExists, setAdminExists] = useState(true);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const data = await checkAdminExists();
        setAdminExists(data.admin_exists);
      } catch (error) {
        console.error('Failed to check admin:', error);
      } finally {
        setCheckingAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  const handleLogin = async (identifier, password) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await login(identifier, password);
      const userData = {
        role: result.role,
        username: result.payload?.username || identifier,
        firstName: result.payload?.first_name || '',
        lastName: result.payload?.last_name || '',
      };
      sessionStorage.setItem('lbca_user', JSON.stringify(userData));
      setUser(userData);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Invalid username or password'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (formData) => {
    setIsLoading(true);
    setError('');

    try {
      // Step 1: Register
      const registerResult = await adminRegister(formData);
      
      // Step 2: Auto-login with the returned username
      const loginResult = await login(registerResult.username, formData.password);
      
      const userData = {
        role: loginResult.role,
        username: loginResult.payload?.username || registerResult.username,
        firstName: loginResult.payload?.first_name || '',
        lastName: loginResult.payload?.last_name || '',
      };
      sessionStorage.setItem('lbca_user', JSON.stringify(userData));
      setUser(userData);
      setShowRegister(false);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Registration failed'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      await logout(user?.role);
    } finally {
      sessionStorage.removeItem('lbca_user');
      setUser(null);
      setIsLoading(false);
      navigate('/');
    }
  };

  if (checkingAdmin) {
    return <LoadingScreen message="Checking system..." />;
  }

  if (isLoading) {
    return <LoadingScreen message={user ? 'Signing out...' : 'Signing you in...'} />;
  }

  // If no admin exists, show registration only
  if (!adminExists && !user) {
    return (
      <Routes>
        <Route path="*" element={
          <RegisterScreen 
            onRegister={handleRegister} 
            error={error} 
            isLoading={isLoading} 
          />
        } />
      </Routes>
    );
  }

  return (
    <Routes>
      {!user && !showRegister && (
        <Route path="*" element={
          <LoginScreen 
            onLogin={handleLogin} 
            error={error} 
            isLoading={isLoading}
            onRegisterClick={() => setShowRegister(true)}
          />
        } />
      )}
      {!user && showRegister && (
        <Route path="*" element={
          <RegisterScreen 
            onRegister={handleRegister} 
            error={error} 
            isLoading={isLoading}
            onBackToLogin={() => setShowRegister(false)}
          />
        } />
      )}
      {user?.role === 'teacher' && (
        <Route path="/*" element={<TeacherScreen onLogout={handleLogout} user={user} />} />
      )}
      {user?.role === 'admin' && (
        <Route path="/*" element={<AdminScreen onLogout={handleLogout} user={user} />} />
      )}
    </Routes>
  );
}

function App() {
  return (
    <SchoolProvider>
      <BrowserRouter basename="/LBCA-Monitoring-System">
        <AppContent />
      </BrowserRouter>
    </SchoolProvider>
  );
}

export default App;