import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi, userApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userStats, setUserStats] = useState(null);
  const [adminStats, setAdminStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        if (user?.role === 'admin') {
          const data = await adminApi.getAdminStats();
          setAdminStats(data);
        } else {
          const data = await userApi.getDashboardStats();
          setUserStats(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const role = user?.role || localStorage.getItem('user_role') || 'user';

  if (loading) {
    return <div className="dashboard"><p>Loading dashboard...</p></div>;
  }

  if (role === 'admin') {
    return (
      <div className="dashboard">
        <div className="sidebar">
          <h2 className="logo">Lost & Found</h2>
          <ul>
            <li className="active" onClick={() => navigate('/dashboard')}>Dashboard</li>
            <li onClick={() => navigate('/home')}>Home Feed</li>
            <li onClick={() => navigate('/browse')}>Browse Items</li>
            <li onClick={() => navigate('/admin')}>Admin Panel</li>
            <li onClick={() => navigate('/profile')}>Profile</li>
          </ul>
        </div>

        <div className="main">
          <div className="header">
            <div>
              <h1>Admin Dashboard</h1>
              <p>Welcome back, {user?.fullname || user?.username || 'Admin'}</p>
            </div>
          </div>

          <div className="cards">
            <div className="card">
            <h2>{adminStats?.total_users ?? 0}</h2>
            <p>Total Users</p>
          </div>
          <div className="card">
            <h2>{adminStats?.total_items ?? 0}</h2>
            <p>Total Items</p>
          </div>
          <div className="card">
            <h2>{adminStats?.total_claims ?? 0}</h2>
            <p>Total Claims</p>
          </div>
          <div className="card">
            </div>
          </div>

          <div className="actions">
            <button className="action-btn primary" onClick={() => navigate('/admin')}>Open Admin Panel</button>
            <button className="action-btn secondary" onClick={() => navigate('/browse')}>Review Browse Feed</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2 className="logo">Lost & Found</h2>
        <ul>
          <li className="active" onClick={() => navigate('/dashboard')}>Dashboard</li>
          <li onClick={() => navigate('/browse')}>Browse Items</li>
          <li onClick={() => navigate('/report-lost')}>Report Lost</li>
          <li onClick={() => navigate('/report-found')}>Report Found</li>
          <li onClick={() => navigate('/claims')}>My Claims</li>
          <li onClick={() => navigate('/posts')}>My Posts</li>
          <li onClick={() => navigate('/profile')}>Profile</li>
        </ul>
      </div>

      <div className="main">
        <div className="header">
          <div>
            <h1>Welcome</h1>
            <p>College Lost & Found Dashboard</p>
          </div>
        </div>

        <div className="cards">
          <div className="card">
            <h2>{userStats?.total_items ?? 0}</h2>
            <p>My Items</p>
          </div>
          <div className="card">
            <h2>{userStats?.total_claims ?? 0}</h2>
            <p>My Claims</p>
          </div>
          <div className="card">
            <h2>{userStats?.total_pending_posts ?? 0}</h2>
            <p>Pending Posts</p>
          </div>
          <div className="card">
            <h2>{userStats?.total_pending_claims ?? 0}</h2>
            <p>Pending Claims</p>
          </div>
        </div>

        <div className="actions">
          <button className="action-btn primary" onClick={() => navigate('/report-lost')}>Report Lost</button>
          <button className="action-btn success" onClick={() => navigate('/report-found')}>Report Found</button>
          <button className="action-btn info" onClick={() => navigate('/claims')}>My Claims</button>
          <button className="action-btn secondary" onClick={() => navigate('/browse')}>Browse Items</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;