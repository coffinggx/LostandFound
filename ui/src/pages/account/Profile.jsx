import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../api';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const data = await userApi.getUserById(user.id);
        setProfile(data);
      } catch (err) {
        setError(err.message || 'Unable to load profile.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <img
              src={`https://ui-avatars.com/api/?name=${(profile?.fullname || user?.fullname || 'User').replace(' ', '+')}&size=120&background=3b82f6&color=fff`}
              alt="Profile"
            />
          </div>
          <div className="profile-info-header">
            <h1>{profile?.fullname || user?.fullname || 'User'}</h1>
            <p className="profile-role">{profile?.role || user?.role || 'user'} • {profile?.department || user?.department || 'Unknown'}</p>
          </div>
        </div>

        {loading && <p>Loading profile...</p>}
        {error && <p className="auth-error">{error}</p>}

        {profile && (
          <div className="profile-details">
            <h2>Personal Information</h2>
            <div className="details-grid">
              <div className="detail-item">
                <div className="detail-content">
                  <label>Username</label>
                  <p>{profile.username}</p>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-content">
                  <label>Email</label>
                  <p>{profile.email}</p>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-content">
                  <label>Phone</label>
                  <p>{profile.phone || 'Not provided'}</p>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-content">
                  <label>Department</label>
                  <p>{profile.department}</p>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-content">
                  <label>Role</label>
                  <p>{profile.role || 'user'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;