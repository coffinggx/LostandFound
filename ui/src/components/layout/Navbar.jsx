import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('user_role');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get('search') || '');
  }, [location.search]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_profile');
    navigate('/login');
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const trimmedTerm = searchTerm.trim();
    navigate(trimmedTerm ? `/?search=${encodeURIComponent(trimmedTerm)}` : '/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/">
            <span className="brand-text">Lost & Found</span>
          </Link>
        </div>

        <div className="nav-menu">
          <Link to="/" className="nav-link">Browse</Link>
          {role === 'admin' ? (
            <>
              <Link to="/admin" className="nav-link">Admin</Link>
              <Link to="/profile" className="nav-link">Profile</Link>
            </>
          ) : (
            <>
              <Link to="/claims" className="nav-link">My Claims</Link>
              <Link to="/posts" className="nav-link">My Posts</Link>
              <Link to="/profile" className="nav-link">Profile</Link>
            </>
          )}
        </div>

        <div className="nav-actions">
          <form className="nav-search" onSubmit={handleSearch}>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search items"
              aria-label="Search items"
            />
            <button type="submit">Search</button>
          </form>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;