import React from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="profile-page">
        <div className="profile-card">
          <h1>Profile</h1>
          <div className="profile-info">
            <div className="info-item">
              <label>Name:</label>
              <span>{user?.name}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{user?.email}</span>
            </div>
            <div className="info-item">
              <label>Role:</label>
              <span className={`role ${user?.role}`}>{user?.role}</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;