import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/', { replace: true });
    window.location.reload();
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome to HealthSync Dashboard</h1>
        <button onClick={handleLogout} className="btn logout-btn">Logout</button>
      </div>
      
      <div>
        <h2>Hello, {user.name}!</h2>
        <p>Role: {user.role}</p>
        <p>Email: {user.email}</p>
        <p>You have successfully logged into the HealthSync system.</p>
      </div>
    </div>
  );
};

export default Dashboard;