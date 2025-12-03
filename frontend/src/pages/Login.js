import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      const role = user.role?.toLowerCase();
      const dashboardRoute = role === 'admin' ? '/admin' : role === 'doctor' ? '/doctor' : role === 'patient' ? '/patient' : '/dashboard';
      navigate(dashboardRoute);
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);
      login(response.data.user, response.data.token);
      
      const role = response.data.user.role?.toLowerCase();
      const dashboardRoute = role === 'admin' ? '/admin' : role === 'doctor' ? '/doctor' : role === 'patient' ? '/patient' : '/dashboard';
      navigate(dashboardRoute);
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <button onClick={() => navigate('/')} className="back-btn">← Back</button>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login to HealthSync</h2>
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-signup" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        
        <div className="auth-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;