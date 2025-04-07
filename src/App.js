import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomeScreen from './pages/HomeScreen';
import BuyMarketplace from './pages/BuyMarketplace';
import WishlistPage from './pages/WishlistPage';
import DropsPage from './pages/DropsPage';
import ProfilePage from './pages/ProfilePage';
import Navigation from './components/Navigation';
import { CartProvider } from './components/CartContext';
import CartPage from './pages/CartPage';

function App() {
  const [currentPage] = useState('home');
  
  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <HomeScreen />;
      case 'buy':
        return <BuyMarketplace />;
      case 'wishlist':
        return <WishlistPage />;
      case 'drops':
        return <DropsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'cart':
        return <CartPage />;
      default:
        return <HomeScreen />;
    }
  };
  
  return (
    <CartProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={renderPage()} />
            <Route path="/buy" element={<BuyMarketplace />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/drops" element={<DropsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/friends" element={<div>Friends Page</div>} />
          </Routes>
          <Navigation />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App; 