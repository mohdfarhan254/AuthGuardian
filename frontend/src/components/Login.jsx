import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', formData);
      localStorage.setItem('token', res.data.token); // Save JWT
      alert('✅ Logged in!');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || '❌ Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '50px auto' }}>
      <h2>🔐 Login</h2>
      <input name="email" placeholder="Email" onChange={handleChange} required /> <br /><br />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required /> <br /><br />
      <button type="submit">Login</button>
      <p onClick={() => navigate('/recover')} style={{ color: 'blue', cursor: 'pointer' }}>
        Forgot Password?
      </p>
    </form>
  );
};

export default Login;
