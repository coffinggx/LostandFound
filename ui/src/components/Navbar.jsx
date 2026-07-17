import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/dashboard">
            <span className="brand-icon">🎒</span>
            <span className="brand-text">Lost & Found</span>
          </Link>
        </div>

        <div className="nav-menu">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/browse" className="nav-link">Browse</Link>
          <Link to="/claims" className="nav-link">My Claims</Link>
          <Link to="/posts" className="nav-link">My Posts</Link>
        </div>

        <div className="nav-actions">
          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;