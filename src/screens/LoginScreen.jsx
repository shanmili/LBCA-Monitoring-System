import { useState } from 'react';
import '../styles/Login.css';

const LoginScreen = ({ onLogin, error, isLoading, onRegisterClick }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(identifier, password);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-circle">
            <span className="logo-text">L</span>
          </div>
          <h1 className="title">LBCA Portal</h1>
          <p className="subtitle">Sign in to your account</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className="btn-submit" 
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="dev-register-link">
            <span 
              onClick={onRegisterClick} 
              className="dev-link"
            >
              Register Admin (Dev Only)
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;