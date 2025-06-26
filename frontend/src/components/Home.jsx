import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <h2>🛡️ Welcome to AuthGuardian</h2>
      <button onClick={() => navigate('/register')}>Register</button>
      <button onClick={() => navigate('/login')}>Login</button>
      <button onClick={() => navigate('/recover')}>Forgot Password</button>
    </div>
  );
};

export default Home;
