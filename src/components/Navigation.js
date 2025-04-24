import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="navigation">
      <Link to="/drops" className={`nav-item ${currentPath === '/drops' ? 'active' : ''}`}>
        <div className="nav-icon">🎁</div>
        <div className="nav-button">Drops</div>
      </Link>
      
      <Link to="/wishlist" className={`nav-item ${currentPath === '/wishlist' ? 'active' : ''}`}>
        <div className="nav-icon">📋</div>
        <div className="nav-button">Wishlist</div>
      </Link>
      
      <Link to="/" className={`nav-item home-nav ${currentPath === '/' ? 'active' : ''}`}>
        <div className="nav-icon">🏠</div>
        <div className="nav-button">Home</div>
      </Link>
      
      <Link to="/buy" className={`nav-item ${currentPath === '/buy' ? 'active' : ''}`}>
        <div className="nav-icon">🏪</div>
        <div className="nav-button">Buy</div>
      </Link>
      
      <Link to="/profile" className={`nav-item ${currentPath === '/profile' ? 'active' : ''}`}>
        <div className="nav-icon">👤</div>
        <div className="nav-button">Profile</div>
      </Link>
    </nav>
  );
};

export default Navigation; 