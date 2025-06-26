import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [step, setStep] = useState('register'); // 'register' or 'verify'
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Register user
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/register', formData);
      alert('✅ OTP sent to your email');
      setStep('verify');
    } catch (err) {
      alert(err.response?.data?.message || '❌ Registration failed');
    }
    setLoading(false);
  };

  // Verify OTP
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/verify-email', {
        email: formData.email,
        otp: otp.trim(),
      });
      alert('✅ Email verified! You can now login.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || '❌ OTP verification failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', textAlign: 'center' }}>
      {step === 'register' ? (
        <>
          <h2>🛡️ Register</h2>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            /><br /><br />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            /><br /><br />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            /><br /><br />
            <button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </>
      ) : (
        <>
          <h2>🔐 Verify OTP</h2>
          <form onSubmit={handleVerify}>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              inputMode="numeric"
            /><br /><br />
            <button type="submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
          <p style={{ marginTop: 20, color: '#555' }}>
            OTP sent to: <b>{formData.email}</b>
          </p>
        </>
      )}
    </div>
  );
};

export default Register;
