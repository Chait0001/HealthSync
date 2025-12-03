import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const role = user.role?.toLowerCase();
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (role === 'doctor') {
        navigate('/doctor', { replace: true });
      } else if (role === 'patient') {
        navigate('/patient', { replace: true });
      }
    }
  }, [user, navigate]);

  return (
    <Layout>
      <div className="dashboard">
        <h1>Welcome to HealthSync Dashboard</h1>
        <p>Redirecting to your dashboard...</p>
      </div>
    </Layout>
  );
};

export default Dashboard;