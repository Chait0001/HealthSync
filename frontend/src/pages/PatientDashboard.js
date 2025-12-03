import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const PatientDashboard = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="dashboard">
        <h1>Patient Dashboard</h1>
        <p>Welcome back, {user?.name}!</p>
        
        <div className="dashboard-grid">
          <div className="dashboard-card card-appointments">
            <div className="card-icon">📅</div>
            <h3>My Appointments</h3>
            <p>View and book appointments</p>
            <Link to="/appointments" className="btn">View Appointments</Link>
          </div>
          
          <div className="dashboard-card card-profile">
            <div className="card-icon">👤</div>
            <h3>Profile</h3>
            <p>Update your profile information</p>
            <Link to="/profile" className="btn">View Profile</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientDashboard;