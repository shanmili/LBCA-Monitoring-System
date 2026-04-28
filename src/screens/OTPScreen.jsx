import { useState, useRef, useEffect } from 'react';
import '../styles/Login.css';

const OTPScreen = ({
  onVerify,
  onResend,
  onBack,
  error,
  isLoading,
  email,
  purpose = 'login', // 'login' | 'password-reset'
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState(60);
  const inputs = useRef([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...otp];
    next[index] = value;
    setOtp(next);

    // Advance focus
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    // Auto-submit: use `next` (not stale `otp`) and only when all 6 are filled
    if (value && next.every((d) => d !== '')) {
      onVerify(next.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        // Clear current cell
        const next = [...otp];
        next[index] = '';
        setOtp(next);
      } else if (index > 0) {
        // Move back and clear previous cell
        const next = [...otp];
        next[index - 1] = '';
        setOtp(next);
        inputs.current[index - 1]?.focus();
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) inputs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < 5) inputs.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = [...otp];
    [...pasted].forEach((char, i) => {
      next[i] = char;
    });
    setOtp(next);
    const nextFocusIndex = Math.min(pasted.length, 5);
    inputs.current[nextFocusIndex]?.focus();
    // Auto-submit only if all 6 digits were pasted
    if (pasted.length === 6) {
      onVerify(next.join(''));
    }
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    setResendCooldown(60);
    inputs.current[0]?.focus();
    onResend();
  };

  const handleManualVerify = () => {
    const code = otp.join('');
    if (code.length === 6) {
      onVerify(code);
    }
  };

  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + '*'.repeat(b.length) + c)
    : '';

  const isComplete = otp.every((d) => d !== '');

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-circle otp-icon">
            <span className="logo-text">✉</span>
          </div>
          <h1 className="title">
            {purpose === 'login' ? 'Two-Factor Auth' : 'Check Your Email'}
          </h1>
          <p className="subtitle">
            {purpose === 'login'
              ? `Enter the 6-digit code sent to ${maskedEmail}`
              : `We sent a reset code to ${maskedEmail}`}
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="otp-container">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className={`otp-input ${digit ? 'otp-filled' : ''} ${error ? 'otp-error' : ''}`}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              disabled={isLoading}
              aria-label={`OTP digit ${i + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          className="btn-submit"
          disabled={isLoading || !isComplete}
          onClick={handleManualVerify}
        >
          {isLoading ? (
            <span className="btn-loading">
              <span className="spinner" />
              Verifying...
            </span>
          ) : purpose === 'login' ? (
            'Verify & Sign In'
          ) : (
            'Verify Code'
          )}
        </button>

        <div className="otp-footer">
          <p className="otp-resend-text">
            Didn't receive the code?{' '}
            {resendCooldown > 0 ? (
              <span className="otp-cooldown">Resend in {resendCooldown}s</span>
            ) : (
              <button type="button" className="register-link" onClick={handleResend}>
                Resend code
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPScreen;
