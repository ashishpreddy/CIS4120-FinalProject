import React, { useState } from 'react';
import './DropsPage.css';
import { useCart } from '../components/CartContext';
import { useWishlist } from '../components/WishlistContext';
import CartIcon from '../components/CartIcon';

// Import comic data
import comicData from '../comic_volumes_20.json';

// Import fallback image
import defaultCover from '../assets/batman-vol-1-1.jpg';

const DropsPage = () => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [cartNotification, setCartNotification] = useState(null);
  const [wishlistNotification, setWishlistNotification] = useState(null);
  const [selectedComic, setSelectedComic] = useState(null);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  
  // Function to safely get image path
  const getImagePath = (comicTitle) => {
    try {
      // Find the comic in the JSON data
      const comic = comicData.find(c => c.Title === comicTitle);
      
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
  
  // Get featured comics from the JSON data
  const getFeaturedComics = () => {
    // For this example, we'll just take the first 4 comics from the data
    return comicData.slice(0, 4);
  };
  
  const featuredComics = getFeaturedComics();
  
  const handleAddToCart = (comic) => {
    // Pass the full comic object instead of just the title
    addToCart({
      id: `comic-${Date.now()}`,
      name: comic.Title,
      Title: comic.Title,
      Price: comic.Price
    });
    setCartNotification(comic.Title);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setCartNotification(null);
    }, 3000);
  };
  
  const handleAddToWishlist = (comic) => {
    addToWishlist(comic.Title);
    setWishlistNotification(comic.Title);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setWishlistNotification(null);
    }, 3000);
  };
  
  const handleShowDetails = (comic) => {
    setSelectedComic(comic);
  };

  return (
    <div className="drops-page">
      <div className="comic-panel-background"></div>
      
      <CartIcon />
      
      <div className="drops-header">
        <h1 className="drops-title">Drops</h1>
        <p className="drops-subtitle">Exclusive comics available for a limited time!</p>
        <button className="info-button-large" onClick={() => setShowInstructions(true)}>
          <span className="info-icon">ℹ️</span>
          <span>How Drops Work</span>
        </button>
      </div>
      
      {showInstructions && (
        <div className="instruction-popup">
          <div className="popup-content">
            <button className="close-popup" onClick={() => setShowInstructions(false)}>✖</button>
            <h3>How Drops Work</h3>
            <div className="instruction-item">
              <span className="instruction-number">1</span>
              <p>Drops are limited-time offers of rare and collectible comics.</p>
            </div>
            <div className="instruction-item">
              <span className="instruction-number">2</span>
              <p>New drops are released every week based on your wishlist preferences.</p>
            </div>
            <div className="instruction-item">
              <span className="instruction-number">3</span>
              <p>Act fast! Once a drop is gone, it might not come back for a while.</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="drops-grid">
        {featuredComics.map((comic, index) => (
          <div className="comic-card" key={index}>
            <div className="comic-cover">
              <img src={getImagePath(comic.Title)} alt={comic.Title} />
            </div>
            <div className="comic-info">
              <h3>{comic.Title}</h3>
              <p className="comic-price">{comic.Price}</p>
              <div className="comic-actions">
                <button 
                  className="info-button" 
                  onClick={() => handleShowDetails(comic)}
                  title="View Details"
                >
                  ℹ️
                </button>
                <button 
                  className="add-button" 
                  onClick={() => handleAddToCart(comic)}
                  title="Add to Cart"
                >
                  +
                </button>
                <button 
                  className="wishlist-button" 
                  onClick={() => handleAddToWishlist(comic)}
                  title="Add to Wishlist"
                >
                  ❤️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {cartNotification && (
        <div className="cart-notification">
          <div className="notification-content">
            <span className="notification-icon">🛒</span>
            <p>{cartNotification} added to cart!</p>
          </div>
        </div>
      )}
      
      {wishlistNotification && (
        <div className="cart-notification">
          <div className="notification-content">
            <span className="notification-icon">❤️</span>
            <p>{wishlistNotification} added to wishlist!</p>
          </div>
        </div>
      )}
      
      {selectedComic && (
        <div className="comic-details-popup">
          <div className="comic-details-content">
            <button className="close-popup" onClick={() => setSelectedComic(null)}>✖</button>
            <h3>{selectedComic.Title}</h3>
            
            <div className="comic-details-grid">
              <div className="comic-details-cover">
                <img 
                  src={getImagePath(selectedComic.Title)} 
                  alt={selectedComic.Title} 
                />
              </div>
              
              <div className="comic-details-info">
                <div className="detail-item">
                  <span className="detail-label">Publisher:</span>
                  <span className="detail-value">{selectedComic.Publisher}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Artist:</span>
                  <span className="detail-value">{selectedComic.Artist}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Author:</span>
                  <span className="detail-value">{selectedComic.Author}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Genre:</span>
                  <span className="detail-value">{selectedComic.Genre}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Character:</span>
                  <span className="detail-value">{selectedComic.Character}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Price:</span>
                  <span className="detail-value">{selectedComic.Price}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Grade:</span>
                  <span className="detail-value">{selectedComic.Grade}</span>
                </div>
              </div>
            </div>
            
            <div className="comic-description">
              <h4>Description:</h4>
              <p>{selectedComic.Description}</p>
            </div>
            
            <div className="comic-details-actions">
              <button 
                className="add-to-cart-button"
                onClick={() => {
                  handleAddToCart(selectedComic);
                  setSelectedComic(null);
                }}
              >
                Add to Cart
              </button>
              <button 
                className="add-to-wishlist-button"
                onClick={() => {
                  handleAddToWishlist(selectedComic);
                  setSelectedComic(null);
                }}
              >
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropsPage; 