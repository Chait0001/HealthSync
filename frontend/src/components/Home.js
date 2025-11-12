import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">HealthSync</Link>
          <div className="nav-links">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="home-content">
        <div className="container">
          <h1>Welcome to HealthSync</h1>
          <p>Smart Healthcare Management System</p>
          <p>Centralize patient records, enable secure communication, and simplify healthcare workflows.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;