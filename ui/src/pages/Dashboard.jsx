import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">🎒 Lost & Found</h2>
        <ul>
          <li className="active" onClick={() => navigate('/dashboard')}>🏠 Dashboard</li>
          <li onClick={() => navigate('/browse')}>🔍 Browse Items</li>
          <li onClick={()=> navigate('/report-lost')}>📢 Report Lost</li>
          <li onClick={()=> navigate('/report-found')}>📦 Report Found</li>
          <li onClick={() => navigate('/claims')}>📋 My Claims</li>
          <li onClick={() => navigate('/posts')}>📝 My Posts</li>
          <li onClick={()=> navigate('/profile')}>👤 Profile</li>
          <li className="logout">🚪 Logout</li>
        </ul>
      </div>
      
      <div className="main">
        {/* Header */}
        <div className="header">
          <div>
            <h1>Welcome 👋</h1>
            <p>College Lost & Found Dashboard</p>
          </div>
          <input type="text" placeholder="Search items..." />
        </div>

        {/* Cards */}
        <div className="cards">
          <div className="card">
            <div className="card-icon">🔴</div>
            <h2>25</h2>
            <p>Lost Items</p>
          </div>
          <div className="card">
            <div className="card-icon">🟢</div>
            <h2>18</h2>
            <p>Found Items</p>
          </div>
          <div className="card">
            <div className="card-icon">📋</div>
            <h2>10</h2>
            <p>My Claims</p>
          </div>
          <div className="card">
            <div className="card-icon">✅</div>
            <h2>15</h2>
            <p>Returned Items</p>
          </div>
        </div>

        {/* Recent Items */}
        <div className="recent">
          <h2>Recent Items</h2>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>🎒 Bag</td>
                <td>Library</td>
                <td className="lost">Lost</td>
              </tr>
              <tr>
                <td>📱 Mobile</td>
                <td>Canteen</td>
                <td className="found">Found</td>
              </tr>
              <tr>
                <td>💳 ID Card</td>
                <td>Block A</td>
                <td className="lost">Lost</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Quick Actions */}
        <div className="actions">
          <button className="action-btn primary" onClick={()=> navigate('/report-lost')}>➕ Report Lost</button>
          <button className="action-btn success" onClick={()=> navigate('/report-found')}>📦 Report Found</button>
          <button className="action-btn info" onClick={() => navigate('/claims')}>📋 My Claims</button>
          <button className="action-btn secondary" onClick={() => navigate('/browse')}>🔍 Browse Items</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;