import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';
import { useAppMode } from './AppContext';

const Navigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { mode } = useAppMode();

  // Buyer navigation items
  const buyerNavItems = [
    { path: '/drops', icon: '🎁', label: 'Drops' },
    { path: '/wishlist', icon: '📋', label: 'Wishlist' },
    { path: '/', icon: '🏠', label: 'Home', isHome: true },
    { path: '/buy', icon: '🏪', label: 'Buy' },
    { path: '/profile', icon: '👤', label: 'Profile' }
  ];

  // Seller navigation items
  const sellerNavItems = [
    { path: '/inventory', icon: '📚', label: 'Inventory' },
    { path: '/list-item', icon: '➕', label: 'List Item' },
    { path: '/', icon: '🏠', label: 'Home', isHome: true },
    { path: '/orders', icon: '📦', label: 'Orders' },
    { path: '/analytics', icon: '📊', label: 'Analytics' }
  ];

  // Choose which navigation items to display based on mode
  const navItems = mode === 'buyer' ? buyerNavItems : sellerNavItems;

  return (
    <nav className="navigation">
      {navItems.map((item) => (
        <Link 
          key={item.path}
          to={item.path} 
          className={`nav-item ${item.isHome ? 'home-nav' : ''} ${currentPath === item.path ? 'active' : ''}`}
        >
          <div className="nav-icon">{item.icon}</div>
          <div className="nav-button">{item.label}</div>
        </Link>
      ))}
    </nav>
  );
};

export default Navigation; 