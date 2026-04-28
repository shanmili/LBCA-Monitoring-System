import { useState } from 'react';
import '../styles/Login.css';

const ForgotPasswordScreen = ({ onSubmit, onBack, error, isLoading }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(email);
    setSubmitted(true);
  };

  if (submitted && !error) {
    return (
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-circle success-icon">
              <span className="logo-text">✓</span>
            </div>
            <h1 className="title">Check Your Email</h1>
            <p className="subtitle">
              If an account exists for <strong>{email}</strong>, an OTP has been sent.
              Check your inbox and spam folder.
            </p>
          </div>
          <button type="button" className="btn-submit" onClick={() => onSubmit(email, true)}>
            Enter OTP
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-circle">
            <span className="logo-text">L</span>
          </div>
          <h1 className="title">Forgot Password</h1>
          <p className="subtitle">
            Enter your email address and we'll send you a one-time code to reset your password.
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <button type="submit" className="btn-submit" disabled={isLoading || !email}>
            {isLoading ? (
              <span className="btn-loading">
                <span className="spinner" />
                Sending...
              </span>
            ) : (
              'Send Reset Code'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
