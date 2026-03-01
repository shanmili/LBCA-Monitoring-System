import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = ({ email, password }) => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isLoggedIn
            ? <Navigate to="/dashboard" replace />
            : <LoginScreen onLogin={handleLogin} />
        }
      />
      <Route
        path="/*"
        element={
          isLoggedIn
            ? <DashboardScreen onLogout={handleLogout} />
            : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

export default App;