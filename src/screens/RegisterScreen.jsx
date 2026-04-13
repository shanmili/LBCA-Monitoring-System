import { useState } from 'react';
import '../styles/Login.css';

const RegisterScreen = ({ onRegister, error, isLoading, onBackToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    contact_number: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(formData);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-circle">
            <span className="logo-text">L</span>
          </div>
          <h1 className="title">LBCA Portal</h1>
          <p className="subtitle">Create Admin Account</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Row 1: First Name and Last Name */}
          <div className="form-row">
            <div className="form-group half">
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="first_name"
                className="form-input"
                placeholder="Enter first name"
                value={formData.first_name}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group half">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                name="last_name"
                className="form-input"
                placeholder="Enter last name"
                value={formData.last_name}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Row 2: Email and Contact Number */}
          <div className="form-row">
            <div className="form-group half">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group half">
              <label className="form-label">Contact Number</label>
              <input
                type="text"
                name="contact_number"
                className="form-input"
                placeholder="Enter contact number"
                value={formData.contact_number}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Row 3: Password and Confirm Password */}
          <div className="form-row">
            <div className="form-group half">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group half">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="password_confirm"
                className="form-input"
                placeholder="Confirm your password"
                value={formData.password_confirm}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-submit" 
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>

          {/* Login link - smaller text */}
          <div className="login-link">
            Already have an account?{' '}
            <span 
              onClick={onBackToLogin} 
              className="link-text"
            >
              Login
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterScreen;