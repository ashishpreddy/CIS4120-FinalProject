import React, { useState } from 'react';
import './CartPage.css';
import { useCart } from '../components/CartContext';
import { useNavigate } from 'react-router-dom';

// Import comic cover images
import batmanCover from '../assets/Batman_TheLongHalloween.jpg';
import invincibleCover from '../assets/Invincible_CompendiumVol1.jpg';
import spawnCover from '../assets/Spawn_OriginsCollection.jpg';
import infinityCover from '../assets/TheInfinityGauntlet.jpg';
import Batman1 from '../assets/Batman1.jpg';
import Spiderman1 from '../assets/Spiderman1.jpg';
import NewRelease1 from '../assets/NewRelease1.jpg';
import Xmen1 from '../assets/Xmen1.jpg';
import DrDoom1 from '../assets/DrDoom1.jpg';

const CartPage = () => {
  const { cartItems, removeFromCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const navigate = useNavigate();
  
  // Map comic names to their cover images and prices
  const comicDetails = {
    'Batman: The Long Halloween': { image: batmanCover, price: 24.99 },
    'Invincible Compendium Vol. 1': { image: invincibleCover, price: 59.99 },
    'Spawn: Origins Collection': { image: spawnCover, price: 29.99 },
    'The Infinity Gauntlet': { image: infinityCover, price: 24.99 },
    'Batman Vol. 1': { image: Batman1, price: 19.99 },
    'Amazing Spider-Man': { image: Spiderman1, price: 17.99 },
    'New Avengers': { image: NewRelease1, price: 21.99 },
    'X-Men: Dark Phoenix Saga': { image: Xmen1, price: 22.99 },
    'Infamous Iron Man': { image: DrDoom1, price: 18.99 }
  };
  
  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => {
    const comicPrice = comicDetails[item.name]?.price || 0;
    return total + comicPrice;
  }, 0);
  
  // Calculate discount
  const discount = promoApplied ? subtotal * 0.1 : 0;
  
  // Calculate shipping
  const shipping = subtotal > 50 ? 0 : 5.99;
  
  // Calculate total
  const total = subtotal - discount + shipping;
  
  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'boom10') {
      setPromoApplied(true);
    } else {
      alert('Invalid promo code');
    }
  };
  
  const handleCheckout = () => {
    alert('Thank you for your purchase! Your comics will be shipped soon.');
    // Here you would typically process the payment and clear the cart
  };
  
  const getComicCover = (comicName) => {
    return comicDetails[comicName]?.image || Batman1; // Default to Batman1 if not found
  };
  
  const getComicPrice = (comicName) => {
    return comicDetails[comicName]?.price || 0;
  };

  return (
    <div className="cart-page">
      <div className="comic-panel-background"></div>
      
      <div className="back-button" onClick={() => navigate(-1)}>
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
                <div className="cart-item" key={item.id}>
                  <div 
                    className="item-cover" 
                    style={{backgroundImage: `url(${getComicCover(item.name)})`}}
                  ></div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <div className="item-price">${getComicPrice(item.name).toFixed(2)}</div>
                  </div>
                  <button 
                    className="remove-item-button" 
                    onClick={() => removeFromCart(item.id)}
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
              
              {promoApplied && (
                <div className="summary-row discount">
                  <span>Discount (10%)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <div className="promo-code">
                <input 
                  type="text" 
                  placeholder="Promo Code" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={promoApplied}
                />
                <button 
                  className="button button-secondary"
                  onClick={handleApplyPromo}
                  disabled={promoApplied}
                >
                  Apply
                </button>
              </div>
              
              {promoApplied && (
                <div className="promo-applied">
                  <span>✓</span> BOOM10 applied!
                </div>
              )}
              
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
            <button className="button button-secondary" onClick={() => navigate(-1)}>
              Continue Shopping
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage; 