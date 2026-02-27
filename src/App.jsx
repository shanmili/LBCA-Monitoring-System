import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import TeacherScreen from './screens/TeacherScreen';
import AdminScreen from './screens/AdminScreen';
import LoginScreen from './screens/LoginScreen';

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

const VALID_CREDENTIALS = {
  teacher: { email: 'teacher@lbca.edu', password: 'teacher123' },
  admin: { email: 'admin@lbca.edu', password: 'admin123' }
};

function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('lbca_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (email, password) => {
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      if (email === VALID_CREDENTIALS.teacher.email &&
          password === VALID_CREDENTIALS.teacher.password) {
        const userData = { role: 'teacher', email };
        sessionStorage.setItem('lbca_user', JSON.stringify(userData));
        setUser(userData);
      } else if (email === VALID_CREDENTIALS.admin.email &&
                 password === VALID_CREDENTIALS.admin.password) {
        const userData = { role: 'admin', email };
        sessionStorage.setItem('lbca_user', JSON.stringify(userData));
        setUser(userData);
      } else {
        setError('Invalid email or password');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('lbca_user');
    setUser(null);
  };

  return (
    <SchoolProvider>
      <BrowserRouter basename="/LBCA-Monitoring-System">
        <Routes>
          {!user && (
            <Route path="*" element={
              <LoginScreen
                onLogin={handleLogin}
                error={error}
                isLoading={isLoading}
              />
            } />
          )}

          {user?.role === 'teacher' && (
            <>
              <Route path="/*" element={<TeacherScreen onLogout={handleLogout} user={user} />} />
            </>
          )}

          {user?.role === 'admin' && (
            <>
              <Route path="/*" element={<AdminScreen onLogout={handleLogout} user={user} />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </SchoolProvider>
  );
}

export default App;