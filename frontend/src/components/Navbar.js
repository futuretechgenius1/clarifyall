import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    closeMenu();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            {/* AI Brain/Neural Network Icon */}
            <circle cx="12" cy="12" r="3" strokeWidth="2" fill="currentColor" opacity="0.2"/>
            <circle cx="6" cy="6" r="2" strokeWidth="2"/>
            <circle cx="18" cy="6" r="2" strokeWidth="2"/>
            <circle cx="6" cy="18" r="2" strokeWidth="2"/>
            <circle cx="18" cy="18" r="2" strokeWidth="2"/>
            <line x1="8" y1="7" x2="10" y2="10" strokeWidth="1.5"/>
            <line x1="16" y1="7" x2="14" y2="10" strokeWidth="1.5"/>
            <line x1="8" y1="17" x2="10" y2="14" strokeWidth="1.5"/>
            <line x1="16" y1="17" x2="14" y2="14" strokeWidth="1.5"/>
            <line x1="7" y1="8" x2="7" y2="16" strokeWidth="1.5" strokeDasharray="2 2"/>
            <line x1="17" y1="8" x2="17" y2="16" strokeWidth="1.5" strokeDasharray="2 2"/>
          </svg>
          <span className="logo-text">Clarifyall</span>
        </Link>

        {/* Hamburger Menu Button */}
        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Menu */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="navbar-link" onClick={closeMenu}>
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>
          
          <Link to="/categories" className="navbar-link" onClick={closeMenu}>
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Categories
          </Link>
          
          <Link to="/about" className="navbar-link" onClick={closeMenu}>
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About
          </Link>
          
          <Link to="/submit" className="navbar-link navbar-link-submit" onClick={closeMenu}>
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Submit Tool
          </Link>

          {/* Auth Section */}
          <div className="navbar-auth">
            {isAuthenticated ? (
              <div className="user-menu-container">
                <button className="user-menu-button" onClick={toggleUserMenu}>
                  <div className="user-avatar">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} />
                    ) : (
                      <span>{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                    )}
                  </div>
                  <span className="user-name">{user?.name || 'User'}</span>
                  <svg className="dropdown-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {isUserMenuOpen && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      <p className="user-dropdown-name">{user?.name}</p>
                      <p className="user-dropdown-email">{user?.email}</p>
                    </div>
                    <div className="user-dropdown-divider"></div>
                    <Link to={`/profile/${user?.id}`} className="user-dropdown-item" onClick={() => { setIsUserMenuOpen(false); closeMenu(); }}>
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      My Profile
                    </Link>
                    <Link to="/saved-tools" className="user-dropdown-item" onClick={() => { setIsUserMenuOpen(false); closeMenu(); }}>
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                      </svg>
                      Saved Tools
                    </Link>
                    <Link to="/my-submissions" className="user-dropdown-item" onClick={() => { setIsUserMenuOpen(false); closeMenu(); }}>
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                      My Submissions
                    </Link>
                    <div className="user-dropdown-divider"></div>
                    <button className="user-dropdown-item logout" onClick={handleLogout}>
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="navbar-link-auth login" onClick={closeMenu}>
                  Login
                </Link>
                <Link to="/register" className="navbar-link-auth register" onClick={closeMenu}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
