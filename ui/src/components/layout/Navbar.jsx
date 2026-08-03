import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('user_role');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_profile');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/home">
            <span className="brand-text">Lost & Found</span>
          </Link>
        </div>

        <div className="nav-menu">
          <Link to="/home" className="nav-link">Home</Link>
          <Link to="/browse" className="nav-link">Browse</Link>
          {role === 'admin' ? (
            <>
              <Link to="/admin" className="nav-link">Admin</Link>
              <Link to="/profile" className="nav-link">Profile</Link>
            </>
          ) : (
            <>
              <Link to="/claims" className="nav-link">My Claims</Link>
              <Link to="/posts" className="nav-link">My Posts</Link>
              <Link to="/report-lost" className="nav-link">Report Lost</Link>
              <Link to="/report-found" className="nav-link">Report Found</Link>
              <Link to="/profile" className="nav-link">Profile</Link>
            </>
          )}
        </div>

        <div className="nav-actions">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;