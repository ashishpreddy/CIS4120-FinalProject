import React, { useState } from 'react';
import './DropsPage.css';
import { useCart } from '../components/CartContext';
import CartIcon from '../components/CartIcon';
// Import images from assets
import batmanCover from '../assets/Batman_TheLongHalloween.jpg';
import invincibleCover from '../assets/Invincible_CompendiumVol1.jpg';
import spawnCover from '../assets/Spawn_OriginsCollection.jpg';
import infinityCover from '../assets/TheInfinityGauntlet.jpg';

const DropsPage = () => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [cartNotification, setCartNotification] = useState(null);
  const { addToCart, cartItems } = useCart();
  
  const handleAddToCart = (comicName) => {
    addToCart({ name: comicName, id: Date.now() });
    setCartNotification(comicName);
    setTimeout(() => {
      setCartNotification(null);
    }, 3000);
  };

  return (
    <div className="drops-page">
      <div className="comic-panel-background"></div>
      
      <CartIcon />
      
      <div className="drops-header">
        <h1 className="drops-title">Drops</h1>
        <p className="drops-description">
          Remember, your Drop will be matched as best as possible with your current Wishlist - make sure it is up to date!
        </p>
        <button className="info-button-large" onClick={() => setShowInstructions(true)}>
          <span className="info-icon">ℹ️</span>
          <span>How Drops Work</span>
        </button>
      </div>
      
      {showInstructions && (
        <div className="instruction-popup">
          <div className="popup-content">
            <button className="close-popup" onClick={() => setShowInstructions(false)}>✖</button>
            <h3>Drops Instructions</h3>
            <div className="instruction-item">
              <span className="instruction-number">1</span>
              <p>Drops are personalized comic recommendations based on your wishlist and browsing history.</p>
            </div>
            <div className="instruction-item">
              <span className="instruction-number">2</span>
              <p>New drops arrive weekly! Add them to your cart directly or bookmark them for later.</p>
            </div>
            <div className="instruction-item">
              <span className="instruction-number">3</span>
              <p>Keep your wishlist updated to receive the most relevant drops tailored to your interests.</p>
            </div>
          </div>
        </div>
      )}
      
      {cartNotification && (
        <div className="cart-notification">
          <div className="notification-content">
            <div className="notification-icon">🎉</div>
            <p>Added "{cartNotification}" to your cart!</p>
          </div>
        </div>
      )}
      
      <div className="your-drops">
        <div className="section-header">
          <h2>Your Drops</h2>
          <div className="zap-badge">ZAP!</div>
        </div>
        <p>Based on your wishlist</p>
      </div>
      
      <div className="drops-grid">
        <div className="comic-drop">
          <div className="comic-cover" style={{backgroundImage: `url(${batmanCover})`}}></div>
          <h3>Batman: The Long Halloween</h3>
          <div className="comic-details">
            <div className="comic-publisher">DC Comics</div>
            <div className="comic-price">$24.99</div>
          </div>
          <div className="drop-actions">
            <button className="bookmark-button">🔖</button>
            <button className="info-button">ℹ️</button>
            <button className="add-button" onClick={() => handleAddToCart("Batman: The Long Halloween")}>+</button>
          </div>
        </div>
        
        <div className="comic-drop">
          <div className="comic-cover" style={{backgroundImage: `url(${invincibleCover})`}}></div>
          <h3>Invincible Compendium Vol. 1</h3>
          <div className="comic-details">
            <div className="comic-publisher">Image Comics</div>
            <div className="comic-price">$59.99</div>
          </div>
          <div className="drop-actions">
            <button className="bookmark-button">🔖</button>
            <button className="info-button">ℹ️</button>
            <button className="add-button" onClick={() => handleAddToCart("Invincible Compendium Vol. 1")}>+</button>
          </div>
        </div>
        
        <div className="comic-drop">
          <div className="comic-cover" style={{backgroundImage: `url(${spawnCover})`}}></div>
          <h3>Spawn: Origins Collection</h3>
          <div className="comic-details">
            <div className="comic-publisher">Image Comics</div>
            <div className="comic-price">$19.99</div>
          </div>
          <div className="drop-actions">
            <button className="bookmark-button">🔖</button>
            <button className="info-button">ℹ️</button>
            <button className="add-button" onClick={() => handleAddToCart("Spawn: Origins Collection")}>+</button>
          </div>
        </div>
        
        <div className="comic-drop">
          <div className="comic-cover" style={{backgroundImage: `url(${infinityCover})`}}></div>
          <h3>The Infinity Gauntlet</h3>
          <div className="comic-details">
            <div className="comic-publisher">Marvel</div>
            <div className="comic-price">$24.99</div>
          </div>
          <div className="drop-actions">
            <button className="bookmark-button">🔖</button>
            <button className="info-button">ℹ️</button>
            <button className="add-button" onClick={() => handleAddToCart("The Infinity Gauntlet")}>+</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropsPage; 