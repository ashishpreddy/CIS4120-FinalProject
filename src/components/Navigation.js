import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = ({ isSeller, setIsSeller }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const toggleMode = () => {
    setIsSeller(!isSeller);
  };

  // Buyer navigation items
  const buyerNavItems = [
    { path: '/drops', icon: '🎁', label: 'Drops' },
    { path: '/wishlist', icon: '📋', label: 'Wishlist' },
    { path: '/', icon: '🏠', label: 'Home', className: 'home-nav' },
    { path: '/buy', icon: '🏪', label: 'Buy' },
    { path: '/profile', icon: '👤', label: 'Profile' }
  ];

  // Seller navigation items
  const sellerNavItems = [
    { path: '/inventory', icon: '📚', label: 'Inventory' },
    { path: '/add-listing', icon: '➕', label: 'Add Listing' },
    { path: '/', icon: '🏠', label: 'Home', className: 'home-nav' },
    { path: '/orders', icon: '📦', label: 'Orders' },
    { path: '/analytics', icon: '📊', label: 'Analytics' }
  ];

  const navItems = isSeller ? sellerNavItems : buyerNavItems;

  return (
    <nav className="navigation">
      {navItems.map((item, index) => (
        <Link 
          key={index}
          to={item.path} 
          className={`nav-item ${item.className || ''} ${currentPath === item.path ? 'active' : ''}`}
        >
          <div className="nav-icon">{item.icon}</div>
          <div className="nav-button">{item.label}</div>
        </Link>
      ))}
    </nav>
  );
};

export default Navigation; 