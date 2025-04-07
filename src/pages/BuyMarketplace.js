import React, { useState } from 'react';
import './BuyMarketplace.css';
import { useCart } from '../components/CartContext';
import { useNavigate } from 'react-router-dom';
import CartIcon from '../components/CartIcon'; // Import CartIcon component
// Import images from assets
import Batman1 from '../assets/Batman1.jpg';
import Batman2 from '../assets/Batman2.jpg';
import Spiderman1 from '../assets/Spiderman1.jpg';
import Spiderman2 from '../assets/Spiderman2.jpg';
import NewRelease1 from '../assets/NewRelease1.jpg';
import NewRelease2 from '../assets/NewRelease2.jpg';
import Xmen1 from '../assets/Xmen1.jpg';
import Xmen2 from '../assets/Xmen2.png';
import DrDoom1 from '../assets/DrDoom1.jpg';
import DrDoom2 from '../assets/DrDoom2.jpg';

const BuyMarketplace = () => {
  const [expandedFilter, setExpandedFilter] = useState(null);
  const { cartItems } = useCart();
  const navigate = useNavigate();
  
  const toggleFilter = (filter) => {
    if (expandedFilter === filter) {
      setExpandedFilter(null);
    } else {
      setExpandedFilter(filter);
    }
  };

  return (
    <div className="buy-marketplace">
      <div className="comic-panel-background"></div>
      
      {/* Replace Link with CartIcon component */}
      <CartIcon />
      
      <div className="marketplace-header">
        <h1 className="marketplace-title">Buy</h1>
        <h2 className="marketplace-subtitle">Marketplace</h2>
      </div>
      
      <div className="search-bar">
        <button className="search-button">
          <span className="button-text">Search</span>
          <span className="button-icon">🔍</span>
        </button>
        <button className="recommendations-button">
          <span className="button-text">For You</span>
          <span className="button-icon">✨</span>
        </button>
      </div>
      
      <div className="marketplace-content">
        <div className="filters-sidebar">
          <h3 className="filter-title">Filter by</h3>
          <div className={`filter-category ${expandedFilter === 'publisher' ? 'expanded' : ''}`}>
            <div className="filter-header" onClick={() => toggleFilter('publisher')}>
              <span>Publisher</span>
              <span className="expand">{expandedFilter === 'publisher' ? '−' : '+'}</span>
            </div>
            {expandedFilter === 'publisher' && (
              <div className="filter-options">
                <label><input type="checkbox" /> Marvel</label>
                <label><input type="checkbox" /> DC</label>
                <label><input type="checkbox" /> Image</label>
                <label><input type="checkbox" /> Dark Horse</label>
              </div>
            )}
          </div>
          
          <div className={`filter-category ${expandedFilter === 'grade' ? 'expanded' : ''}`}>
            <div className="filter-header" onClick={() => toggleFilter('grade')}>
              <span>Grade</span>
              <span className="expand">{expandedFilter === 'grade' ? '−' : '+'}</span>
            </div>
            {expandedFilter === 'grade' && (
              <div className="filter-options">
                <label><input type="checkbox" /> Mint (9.9-10.0)</label>
                <label><input type="checkbox" /> Near Mint (9.0-9.8)</label>
                <label><input type="checkbox" /> Very Fine (7.5-8.5)</label>
                <label><input type="checkbox" /> Fine (5.5-7.0)</label>
              </div>
            )}
          </div>
          
          <div className={`filter-category ${expandedFilter === 'price' ? 'expanded' : ''}`}>
            <div className="filter-header" onClick={() => toggleFilter('price')}>
              <span>Price</span>
              <span className="expand">{expandedFilter === 'price' ? '−' : '+'}</span>
            </div>
            {expandedFilter === 'price' && (
              <div className="filter-options">
                <label><input type="checkbox" /> Under $10</label>
                <label><input type="checkbox" /> $10-$25</label>
                <label><input type="checkbox" /> $25-$50</label>
                <label><input type="checkbox" /> $50-$100</label>
                <label><input type="checkbox" /> $100+</label>
              </div>
            )}
          </div>
          
          <div className="filter-category">
            <div className="filter-header" onClick={() => toggleFilter('artist')}>
              <span>Artist</span>
              <span className="expand">{expandedFilter === 'artist' ? '−' : '+'}</span>
            </div>
          </div>
          
          <div className="filter-category">
            <div className="filter-header" onClick={() => toggleFilter('author')}>
              <span>Author</span>
              <span className="expand">{expandedFilter === 'author' ? '−' : '+'}</span>
            </div>
          </div>
          
          <div className="filter-category">
            <div className="filter-header" onClick={() => toggleFilter('genre')}>
              <span>Genre</span>
              <span className="expand">{expandedFilter === 'genre' ? '−' : '+'}</span>
            </div>
          </div>
          
          <div className="filter-category">
            <div className="filter-header" onClick={() => toggleFilter('character')}>
              <span>Character</span>
              <span className="expand">{expandedFilter === 'character' ? '−' : '+'}</span>
            </div>
          </div>
        </div>
        
        <div className="comics-grid">
          <div className="comic-category">
            <div className="category-header">
              <h3>Batman</h3>
              <div className="category-actions">
                <button className="bookmark-button">🔖</button>
                <button className="info-button">ℹ️</button>
              </div>
            </div>
            <div className="comic-covers">
              <div className="comic-cover" style={{backgroundImage: `url(${Batman1})`}}></div>
              <div className="comic-cover" style={{backgroundImage: `url(${Batman2})`}}></div>
            </div>
          </div>
          
          <div className="comic-category">
            <div className="category-header">
              <h3>Spider-Man</h3>
              <div className="category-actions">
                <button className="bookmark-button">🔖</button>
                <button className="info-button">ℹ️</button>
              </div>
            </div>
            <div className="comic-covers">
              <div className="comic-cover" style={{backgroundImage: `url(${Spiderman1})`}}></div>
              <div className="comic-cover" style={{backgroundImage: `url(${Spiderman2})`}}></div>
            </div>
          </div>
          
          <div className="comic-category featured">
            <div className="category-header">
              <h3>New Releases</h3>
              <div className="new-badge">NEW!</div>
            </div>
            <div className="comic-covers">
              <div className="comic-cover" style={{backgroundImage: `url(${NewRelease1})`}}></div>
              <div className="comic-cover" style={{backgroundImage: `url(${NewRelease2})`}}></div>
            </div>
          </div>
          
          <div className="comic-category">
            <div className="category-header">
              <h3>X-Men</h3>
              <div className="category-actions">
                <button className="bookmark-button">🔖</button>
                <button className="info-button">ℹ️</button>
              </div>
            </div>
            <div className="comic-covers">
              <div className="comic-cover" style={{backgroundImage: `url(${Xmen1})`}}></div>
              <div className="comic-cover" style={{backgroundImage: `url(${Xmen2})`}}></div>
            </div>
          </div>
          
          <div className="comic-category">
            <div className="category-header">
              <h3>Dr. Doom</h3>
              <div className="category-actions">
                <button className="bookmark-button">🔖</button>
                <button className="info-button">ℹ️</button>
              </div>
            </div>
            <div className="comic-covers">
              <div className="comic-cover" style={{backgroundImage: `url(${DrDoom1})`}}></div>
              <div className="comic-cover" style={{backgroundImage: `url(${DrDoom2})`}}></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="wishlist-section">
        <div className="wishlist-header">
          <h2>Your Wishlist</h2>
          <div className="pow-badge">POW!</div>
        </div>
        <div className="wishlist-controls">
          <button className="view-button">View 👁️</button>
          <button className="edit-button">Edit ✏️</button>
        </div>
        
        <ol className="wishlist-items">
          <li><span className="rank">1</span> Batman - The Long Halloween</li>
          <li><span className="rank">2</span> Invincible</li>
          <li><span className="rank">3</span> Spawn: Origins</li>
          <li><span className="rank">4</span> The Infinity Gauntlet</li>
          <li><span className="rank">5</span> All-New Guardians of the Galaxy</li>
        </ol>
        <div className="more-indicator">...</div>
      </div>
    </div>
  );
};

export default BuyMarketplace; 