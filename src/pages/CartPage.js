import React, { useState } from 'react';
import './CartPage.css';
import { useCart } from '../components/CartContext';
import { useNavigate } from 'react-router-dom';

// Import comic data
import comicData from '../comic_volumes_20.json';

// Import fallback image
import defaultCover from '../assets/batman-vol-1-1.jpg';

const CartPage = () => {
  const { cartItems, removeFromCart } = useCart();
  const [showCheckoutConfirmation, setShowCheckoutConfirmation] = useState(false);
  const navigate = useNavigate();
  
  // Function to handle back button click
  const handleBackClick = () => {
    navigate(-1); // This navigates to the previous page in history
  };
  
  // Function to safely get image path
  const getImagePath = (comicName) => {
    try {
      // Find the comic in the JSON data
      const comic = comicData.find(c => c.Title.includes(comicName));
      if (comic && comic.CoverImage) {
        // Extract just the filename from the path in the JSON
        const filename = comic.CoverImage.split('/').pop();
        // Try to require the image from assets
        return require(`../assets/${filename}`);
      }
      throw new Error('Comic not found');
    } catch (error) {
      // If image not found, return default cover
      return defaultCover;
    }
  };
  
  // Function to get comic price from JSON data
  const getComicPrice = (comicName) => {
    const comic = comicData.find(c => c.Title.includes(comicName));
    if (comic && comic.Price) {
      // Remove $ and commas from price string and convert to number
      const priceString = comic.Price.replace('$', '').replace(/,/g, '');
      const price = parseFloat(priceString);
      // If price is too high (like collector's items), use a reasonable price
      return price > 1000 ? 24.99 : price;
    }
    return 19.99; // Default price if not found
  };
  
  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => {
    return total + getComicPrice(item.name);
  }, 0);
  
  // Calculate shipping
  const shipping = subtotal > 50 ? 0 : 5.99;
  
  // Calculate total
  const total = subtotal + shipping;
  
  const handleCheckout = () => {
    setShowCheckoutConfirmation(true);
  };
  
  const handleConfirmCheckout = () => {
    // Clear cart by removing each item individually
    [...cartItems].forEach(item => {
      removeFromCart(item.cartId || item.id);
    });
    
    setShowCheckoutConfirmation(false);
    navigate('/');
  };

  return (
    <div className="cart-page">
      <div className="comic-panel-background"></div>
      
      <div className="back-button" onClick={handleBackClick}>
        <span>←</span>
      </div>
      
      <div className="cart-header">
        <h1 className="cart-title">Your Cart</h1>
      </div>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty!</h2>
          <p>Looks like you haven't added any comics to your cart yet.</p>
          <button className="button button-accent" onClick={() => navigate('/drops')}>
            Check out Drops
          </button>
          <button className="button button-secondary" onClick={() => navigate('/buy')}>
            Browse Marketplace
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items-container">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div className="cart-item" key={item.cartId || item.id}>
                  <div 
                    className="item-cover" 
                    style={{backgroundImage: `url(${getImagePath(item.name)})`}}
                  ></div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <div className="item-price">${getComicPrice(item.name).toFixed(2)}</div>
                  </div>
                  <button 
                    className="remove-item-button" 
                    onClick={() => removeFromCart(item.cartId || item.id)}
                    title="Remove from cart"
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <button className="button button-accent checkout-button" onClick={handleCheckout}>
                Checkout
              </button>
              
              <div className="shipping-note">
                {subtotal < 50 ? (
                  <p>Add ${(50 - subtotal).toFixed(2)} more to qualify for free shipping!</p>
                ) : (
                  <p>You've qualified for free shipping!</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="continue-shopping">
            <button className="button button-secondary" onClick={handleBackClick}>
              Continue Shopping
            </button>
          </div>
        </>
      )}
      
      {/* Checkout Confirmation Popup */}
      {showCheckoutConfirmation && (
        <div className="checkout-confirmation-overlay">
          <div className="checkout-confirmation-popup">
            <div className="checkout-confirmation-content">
              <div className="checkout-icon">💥</div>
              <h2>KAPOW! Order Confirmed!</h2>
              <p>Thank you for shopping with Comic Collector! Your order has been received and is being processed faster than The Flash on coffee!</p>
              <p className="shipping-message">Your comics will be shipped in a protective sleeve and should arrive within 3-5 business days.</p>
              <div className="order-details">
                <div className="order-number">
                  <span>Order #:</span> CC-{Math.floor(100000 + Math.random() * 900000)}
                </div>
                <div className="order-total">
                  <span>Total:</span> ${total.toFixed(2)}
                </div>
              </div>
              <button className="button button-accent" onClick={handleConfirmCheckout}>
                Continue to Homepage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage; 