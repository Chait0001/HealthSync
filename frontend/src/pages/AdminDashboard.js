import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="dashboard">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.name}!</p>
        
        <div className="dashboard-grid">
          <div className="dashboard-card card-doctors">
            <div className="card-icon">⚕</div>
            <h3>Manage Doctors</h3>
            <p>Add, edit, and manage doctor profiles</p>
            <Link to="/doctors" className="btn">Manage Doctors</Link>
          </div>
          
          <div className="dashboard-card card-patients">
            <div className="card-icon">📋</div>
            <h3>Manage Patients</h3>
            <p>View and manage patient records</p>
            <Link to="/patients" className="btn">Manage Patients</Link>
          </div>
          
          <div className="dashboard-card card-appointments">
            <div className="card-icon">📅</div>
            <h3>Appointments</h3>
            <p>View and manage all appointments</p>
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

export default AdminDashboard;