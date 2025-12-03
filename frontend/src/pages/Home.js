import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardRoute = () => {
    if (!user) return null;
    const role = user.role?.toLowerCase();
    return role === 'admin' ? '/admin' : role === 'doctor' ? '/doctor' : role === 'patient' ? '/patient' : '/dashboard';
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">HealthSync</Link>
          <div className="nav-links">
            {user ? (
              <>
                <span className="nav-user">Welcome, {user.name}</span>
                <Link to={getDashboardRoute()} className="nav-link">Dashboard</Link>
                <Link to="/profile" className="nav-link">Profile</Link>
                <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/signup" className="nav-link">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="home-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Welcome to HealthSync</h1>
            <p className="hero-subtitle">Smart Healthcare Management System</p>
            <p className="hero-description">Centralize patient records, enable secure communication, and simplify healthcare workflows.</p>
            {user ? (
              <div className="hero-buttons">
                <Link to={getDashboardRoute()} className="btn btn-primary">Go to Dashboard</Link>
                <Link to="/appointments" className="btn btn-secondary">View Appointments</Link>
              </div>
            ) : (
              <div className="hero-buttons">
                <Link to="/signup" className="btn btn-primary">Get Started</Link>
                <Link to="/login" className="btn btn-secondary">Login</Link>
              </div>
            )}
          </div>
          <div className="hero-image">
            <div className="animated-doctor">
              <div className="doctor-figure">
                <div className="doctor-head">
                  <div className="doctor-face">
                    <div className="doctor-eyes">
                      <div className="eye left-eye"></div>
                      <div className="eye right-eye"></div>
                    </div>
                    <div className="doctor-mouth"></div>
                  </div>
                  <div className="doctor-hair"></div>
                </div>
                <div className="doctor-body">
                  <div className="doctor-coat">
                    <div className="coat-collar"></div>
                    <div className="stethoscope">
                      <div className="stethoscope-tube"></div>
                      <div className="stethoscope-head"></div>
                    </div>
                    <div className="medical-badge"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose HealthSync?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚕</div>
              <h3>Doctor Management</h3>
              <p>Efficiently manage doctor profiles, schedules, and specializations</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Patient Records</h3>
              <p>Secure and organized patient information management system</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Appointment Scheduling</h3>
              <p>Streamlined appointment booking and management</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3>Secure & Private</h3>
              <p>Role-based access control ensures data security</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;