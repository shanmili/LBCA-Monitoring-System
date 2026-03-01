import { useEffect } from 'react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout.jsx';
import { NotificationProvider } from '../context/NotificationContext.jsx';
import { useSchool } from '../context/SchoolContext';
import Dashboard from '../components/modules/Dashboard.jsx';
import ProfileSetting from '../components/modules/ProfileSetting.jsx';
import StudentsPage from '../components/modules/StudentsPage.jsx';
import StudentsProfile from '../components/modules/students/StudentProfile.jsx';
import TeachersPage from '../components/modules/TeachersPage.jsx';
import PacePage from '../components/modules/PacePage.jsx';
import EarlyWarningPage from '../components/modules/EarlyWarningPage.jsx';

const AdminScreen = ({ onLogout }) => {
  const navigate = useNavigate();
  const { schoolLogo } = useSchool();

  useEffect(() => {
    if (window.location.pathname === '/') {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleNavigate = (tab, studentId) => {
    if (tab === 'logout') { 
      onLogout(); 
      return; 
    }
    
    if (tab === 'teachers') {
      navigate('/teachers');
    } else if (tab === 'student-profile' && studentId) {
      navigate(`/student/${studentId}`);
    } else {
      navigate(`/${tab}`);
    }
  };

  const getActiveTab = () => {
    const path = window.location.pathname;
    if (path.includes('/account-settings')) return 'account-settings';
    if (path.includes('/students')) return 'students';
    if (path.includes('/teachers')) return 'teachers';
    if (path.includes('/pace')) return 'pace';
    if (path.includes('/risk')) return 'risk';
    if (path.includes('/student/')) return 'students';
    return 'dashboard';
  };

  return (
    <NotificationProvider>
      <MainLayout
        onLogout={onLogout}
        activeTab={getActiveTab()}
        onNavigate={handleNavigate}
        userRole="admin"
        schoolLogo={schoolLogo}
      >
        <Routes>
          <Route path="/dashboard" element={<Dashboard onNavigate={handleNavigate} />} />
          <Route path="/students" element={<StudentsPage onNavigate={handleNavigate} />} />
          <Route path="/teachers" element={<TeachersPage onNavigate={handleNavigate} />} />
          <Route path="/pace" element={<PacePage onNavigate={handleNavigate} />} />
          <Route path="/risk" element={<EarlyWarningPage onNavigate={handleNavigate} />} />
          <Route path="/account-settings" element={<ProfileSetting onNavigate={handleNavigate} />} />
          <Route path="/student/:studentId" element={<StudentsProfile onNavigate={handleNavigate} />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </MainLayout>
    </NotificationProvider>
  );
};

export default AdminScreen;