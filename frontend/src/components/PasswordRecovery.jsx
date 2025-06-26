// src/components/PasswordRecovery.jsx
import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const PasswordRecovery = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/forgot-password', { email });
      setMessage('📨 OTP sent to your email');
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || '❌ Failed to send OTP');
    }
    setLoading(false);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      alert('❌ Enter a valid 6-digit OTP');
      return;
    }
    setStep(3);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/reset-password', {
        email,
        otp: otp.trim(),
        newPassword,
      });
      alert('✅ Password reset successfully');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || '❌ Failed to reset password');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', textAlign: 'center' }}>
      <h2>🔐 Password Recovery</h2>

      {step === 1 && (
        <form onSubmit={handleSendOtp}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          /><br /><br />
          <button type="submit" disabled={loading}>
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp}>
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength={6}
            inputMode="numeric"
          /><br /><br />
          <button type="submit">Continue</button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          /><br /><br />
          <button type="submit" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}

      {message && <p style={{ marginTop: 20, color: 'green' }}>{message}</p>}
    </div>
  );
};

export default PasswordRecovery;
