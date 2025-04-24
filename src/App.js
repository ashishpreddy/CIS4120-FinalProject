import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import HomeScreen from './pages/HomeScreen';
import BuyMarketplace from './pages/BuyMarketplace';
import WishlistPage from './pages/WishlistPage';
import DropsPage from './pages/DropsPage';
import ProfilePage from './pages/ProfilePage';
import Navigation from './components/Navigation';
import { CartProvider } from './components/CartContext';
import CartPage from './pages/CartPage';
import { WishlistProvider } from './components/WishlistContext';
import ScrollToTop from './components/ScrollToTop';

// Import seller pages
import InventoryPage from './pages/seller/InventoryPage';
import ListItemPage from './pages/seller/ListItemPage';
import OrdersPage from './pages/seller/OrdersPage';
import AnalyticsPage from './pages/seller/AnalyticsPage';

// Import the SellerLayout component
import SellerLayout from './components/SellerLayout';

function App() {
  const [currentPage] = useState('home');
  const [isSeller, setIsSeller] = useState(false);
  
  // Create a RouteObserver component that will watch route changes
  const RouteObserver = () => {
    const location = useLocation();
    
    useEffect(() => {
      // Set isSeller to false when navigating to buy pages
      if (location.pathname === '/buy' || location.pathname === '/buy-marketplace') {
        setIsSeller(false);
      }
    }, [location]);
    
    return null;
  };
  
  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <HomeScreen setIsSeller={setIsSeller} />;
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
        return <HomeScreen setIsSeller={setIsSeller} />;
    }
  };
  
  return (
    <CartProvider>
      <WishlistProvider>
        <Router>
          <ScrollToTop />
          <div className="app">
            <RouteObserver />
            <Routes>
              <Route path="/" element={renderPage()} />
              <Route path="/buy" element={<BuyMarketplace />} />
              <Route path="/buy-marketplace" element={<BuyMarketplace />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/drops" element={<DropsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/friends" element={<div>Friends Page</div>} />
              
              {/* Seller Routes - wrapped with SellerLayout */}
              <Route path="/inventory" element={
                <SellerLayout>
                  <InventoryPage />
                </SellerLayout>
              } />
              <Route path="/add-listing" element={
                <SellerLayout>
                  <ListItemPage />
                </SellerLayout>
              } />
              <Route path="/orders" element={
                <SellerLayout>
                  <OrdersPage />
                </SellerLayout>
              } />
              <Route path="/analytics" element={
                <SellerLayout>
                  <AnalyticsPage />
                </SellerLayout>
              } />
            </Routes>
            <Navigation isSeller={isSeller} setIsSeller={setIsSeller} />
          </div>
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App; 