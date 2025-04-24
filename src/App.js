import React from 'react';
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
import { WishlistProvider } from './components/WishlistContext';
import { AppProvider } from './components/AppContext';
import ScrollToTop from './components/ScrollToTop';

// Import seller pages
import InventoryPage from './pages/seller/InventoryPage';
import ListItemPage from './pages/seller/ListItemPage';
import OrdersPage from './pages/seller/OrdersPage';
import AnalyticsPage from './pages/seller/AnalyticsPage';

function App() {
  return (
    <AppProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <ScrollToTop />
            <div className="app">
              <Routes>
                {/* Buyer Routes */}
                <Route path="/" element={<HomeScreen />} />
                <Route path="/buy" element={<BuyMarketplace />} />
                <Route path="/buy-marketplace" element={<BuyMarketplace />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/drops" element={<DropsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/cart" element={<CartPage />} />
                
                {/* Seller Routes */}
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/list-item" element={<ListItemPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
              </Routes>
              <Navigation />
            </div>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AppProvider>
  );
}

export default App; 