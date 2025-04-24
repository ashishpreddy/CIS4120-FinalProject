import React, { useState, useEffect } from 'react';
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
  const [dropsUpdatedNotification, setDropsUpdatedNotification] = useState(false);
  const { addToCart } = useCart();
  const { wishlistItems, authorWishlistItems, addToWishlist } = useWishlist();
  
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
  
  // Get featured comics from localStorage or generate new ones
  const getFeaturedComics = () => {
    // Try to get stored drops from localStorage
    const storedDrops = localStorage.getItem('featuredDrops');
    
    if (storedDrops) {
      return JSON.parse(storedDrops);
    } else {
      // If no stored drops, generate random ones
      const availableComics = comicData.filter(comic => comic.Availability !== false);
      const randomComics = [...availableComics].sort(() => 0.5 - Math.random()).slice(0, 4);
      
      // Store in localStorage
      localStorage.setItem('featuredDrops', JSON.stringify(randomComics));
      return randomComics;
    }
  };
  
  // Generate drops based on wishlist preferences with improved author handling
  const generateDrops = () => {
    // Get comics that are available
    const availableComics = comicData.filter(comic => comic.Availability !== false);
    
    // If wishlist is empty, return random comics
    if (wishlistItems.length === 0 && authorWishlistItems.length === 0) {
      const randomComics = [...availableComics].sort(() => 0.5 - Math.random()).slice(0, 4);
      
      // Check if drops have changed
      const currentDrops = JSON.parse(localStorage.getItem('featuredDrops') || '[]');
      const currentTitles = currentDrops.map(comic => comic.Title).sort();
      const newTitles = randomComics.map(comic => comic.Title).sort();
      
      const dropsChanged = JSON.stringify(currentTitles) !== JSON.stringify(newTitles);
      
      // Store in localStorage
      localStorage.setItem('featuredDrops', JSON.stringify(randomComics));
      
      // Set notification based on whether drops changed
      setDropsUpdatedNotification(dropsChanged);
      
      return randomComics;
    }
    
    // First, get exact matches from the wishlist (highest priority)
    const exactMatches = availableComics.filter(comic => 
      wishlistItems.some(item => item.name === comic.Title)
    );
    
    // Reserve up to 2 slots for exact matches
    const exactMatchesToInclude = exactMatches.slice(0, 2);
    const exactMatchIds = exactMatchesToInclude.map(comic => comic.Title);
    
    // Count comics by each author for dynamic scoring
    const comicsByAuthor = {};
    availableComics.forEach(comic => {
      if (comic.Author) {
        comicsByAuthor[comic.Author] = (comicsByAuthor[comic.Author] || 0) + 1;
      }
    });
    
    // Score remaining comics based on wishlist preferences
    const scoredComics = availableComics
      .filter(comic => !exactMatchIds.includes(comic.Title))
      .map(comic => {
        let score = 0;
        
        // Check if comic is in wishlist (but wasn't included in exact matches)
        if (wishlistItems.some(item => item.name === comic.Title)) {
          score += 100;
        }
        
        // Increased Author Match Score with dynamic scoring and weighted preferences
        const authorMatch = authorWishlistItems.findIndex(item => item.name === comic.Author);
        if (authorMatch !== -1) {
          // Base score increased to 90
          const baseAuthorScore = 90;
          
          // Add rank bonus (higher ranks get higher scores)
          const rankBonus = (authorWishlistItems.length - authorMatch) * 5;
          
          // Add scarcity bonus (authors with fewer comics get higher scores)
          const authorComicCount = comicsByAuthor[comic.Author] || 1;
          const scarcityBonus = Math.max(20 - authorComicCount * 2, 0); // Max 20 points for rare authors
          
          score += baseAuthorScore + rankBonus + scarcityBonus;
        } else {
          // Penalty for non-matches
          score -= 15; // Apply penalty for comics not by wishlist authors
        }
        
        // Check for buzzword matches with wishlist comics
        const wishlistComics = wishlistItems.map(item => 
          comicData.find(c => c.Title === item.name)
        ).filter(Boolean);
        
        // Count matching buzzwords
        wishlistComics.forEach(wishComic => {
          if (wishComic.Buzzwords && comic.Buzzwords) {
            const matchingBuzzwords = wishComic.Buzzwords.filter(buzz => 
              comic.Buzzwords.includes(buzz)
            );
            score += matchingBuzzwords.length * 10;
          }
          
          // Add points for same genre
          if (wishComic.Genre === comic.Genre) {
            score += 5;
          }
          
          // Add points for same character
          if (wishComic.Character === comic.Character) {
            score += 5;
          }
          
          // Add points for same publisher
          if (wishComic.Publisher === comic.Publisher) {
            score += 3;
          }
        });
        
        return { comic, score, isAuthorMatch: authorMatch !== -1 };
      });
    
    // Get the top author matches (up to 1 slot)
    const authorMatches = scoredComics
      .filter(item => item.isAuthorMatch)
      .sort((a, b) => b.score - a.score)
      .slice(0, 1)
      .map(item => item.comic);
    
    // Get IDs of selected comics to avoid duplicates
    const selectedIds = [...exactMatchIds, ...authorMatches.map(comic => comic.Title)];
    
    // Then get the highest scoring comics overall that aren't already selected
    const remainingTopComics = scoredComics
      .filter(item => !selectedIds.includes(item.comic.Title))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4 - exactMatchesToInclude.length - authorMatches.length)
      .map(item => item.comic);
    
    // Combine the selections
    let topComics = [...exactMatchesToInclude, ...authorMatches, ...remainingTopComics];
    
    // If we still don't have 4 comics, fill with random ones
    if (topComics.length < 4) {
      const allUsedIds = topComics.map(comic => comic.Title);
      const remainingComics = availableComics
        .filter(comic => !allUsedIds.includes(comic.Title))
        .sort(() => 0.5 - Math.random())
        .slice(0, 4 - topComics.length);
      
      topComics.push(...remainingComics);
    }
    
    // Check if drops have changed
    const currentDrops = JSON.parse(localStorage.getItem('featuredDrops') || '[]');
    const currentTitles = currentDrops.map(comic => comic.Title).sort();
    const newTitles = topComics.map(comic => comic.Title).sort();
    
    const dropsChanged = JSON.stringify(currentTitles) !== JSON.stringify(newTitles);
    
    // Store in localStorage
    localStorage.setItem('featuredDrops', JSON.stringify(topComics));
    
    // Set notification based on whether drops changed
    setDropsUpdatedNotification(dropsChanged);
    
    return topComics;
  };
  
  const [featuredComics, setFeaturedComics] = useState(getFeaturedComics());
  
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

  useEffect(() => {
    // Check if drops should be updated
    const shouldUpdate = localStorage.getItem('updateDrops') === 'true';
    
    if (shouldUpdate) {
      // Clear the flag
      localStorage.removeItem('updateDrops');
      
      // Generate new drops
      const newDrops = generateDrops();
      setFeaturedComics(newDrops);
      
      // Don't show notification on drops page
      setDropsUpdatedNotification(false);
    }
  }, [wishlistItems, authorWishlistItems]);

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
          <div className="popup-content">
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