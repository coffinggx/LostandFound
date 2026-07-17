import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaUniversity, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@college.edu',
    phone: '+977 9812345678',
    department: 'Computer Science',
    studentId: 'CS-2023-001',
    joinDate: '2023-09-01'
  });

  const [formData, setFormData] = useState(profile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfile(formData);
    setIsEditing(false);
    alert('✅ Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <img 
              src={`https://ui-avatars.com/api/?name=${profile.name.replace(' ', '+')}&size=120&background=3b82f6&color=fff`} 
              alt="Profile" 
            />
          </div>
          <div className="profile-info-header">
            <h1>{profile.name}</h1>
            <p className="profile-role">Student • {profile.department}</p>
          </div>
          <div className="profile-actions">
            {!isEditing ? (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                <FaEdit /> Edit
              </button>
            ) : (
              <div className="edit-actions">
                <button className="save-btn" onClick={handleSubmit}>
                  <FaSave /> Save
                </button>
                <button className="cancel-btn" onClick={handleCancel}>
                  <FaTimes />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Stats */}
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-number">5</span>
            <span className="stat-label">Lost</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">3</span>
            <span className="stat-label">Found</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">7</span>
            <span className="stat-label">Claims</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">4</span>
            <span className="stat-label">Returned</span>
          </div>
        </div>

        {/* Profile Details */}
        <div className="profile-details">
          <h2>Personal Information</h2>
          <div className="details-grid">
            <div className="detail-item">
              <div className="detail-icon">
                <FaUser />
              </div>
              <div className="detail-content">
                <label>Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profile.name}</p>
                )}
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <FaEnvelope />
              </div>
              <div className="detail-content">
                <label>Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profile.email}</p>
                )}
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <FaPhone />
              </div>
              <div className="detail-content">
                <label>Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profile.phone}</p>
                )}
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <FaUniversity />
              </div>
              <div className="detail-content">
                <label>Department</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profile.department}</p>
                )}
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <span className="icon-text">🎓</span>
              </div>
              <div className="detail-content">
                <label>Student ID</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profile.studentId}</p>
                )}
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <span className="icon-text">📅</span>
              </div>
              <div className="detail-content">
                <label>Join Date</label>
                <p>{profile.joinDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;