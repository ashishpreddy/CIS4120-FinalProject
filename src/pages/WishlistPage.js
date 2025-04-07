import React, { useState, useEffect } from 'react';
import './WishlistPage.css';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from './StrictModeDroppable';
import { useCart } from '../components/CartContext';
import { useNavigate } from 'react-router-dom';
import CartIcon from '../components/CartIcon';

const WishlistPage = () => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newComicName, setNewComicName] = useState('');
  const [newComicRank, setNewComicRank] = useState(1);
  const { cartItems } = useCart();
  const navigate = useNavigate();
  
  const [wishlistItems, setWishlistItems] = useState([
    { id: 'item-1', name: 'Batman - The Long Halloween' },
    { id: 'item-2', name: 'Invincible Compendium Vol. 1' },
    { id: 'item-3', name: 'Spawn: Origins Collection' },
    { id: 'item-4', name: 'The Infinity Gauntlet' },
    { id: 'item-5', name: 'All-New Guardians of the Galaxy' },
    { id: 'item-6', name: 'Watchmen' },
    { id: 'item-7', name: 'Saga Vol. 1' },
    { id: 'item-8', name: 'The Walking Dead Compendium' },
  ]);
  
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    
    const items = Array.from(wishlistItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setWishlistItems(items);
  };
  
  const handleAddComic = (e) => {
    e.preventDefault();
    if (!newComicName.trim()) return;
    
    const newItem = {
      id: `item-${Date.now()}`,
      name: newComicName.trim()
    };
    
    const newItems = [...wishlistItems];
    // Insert at the specified rank (adjusting for 0-based index)
    const insertIndex = Math.min(Math.max(0, newComicRank - 1), wishlistItems.length);
    newItems.splice(insertIndex, 0, newItem);
    
    setWishlistItems(newItems);
    setNewComicName('');
    setNewComicRank(1);
    setShowAddForm(false);
  };
  
  const handleRemoveComic = (id) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  const handleCartClick = () => {
    console.log('Navigating to cart from WishlistPage');
    navigate('/cart');
  };

  return (
    <div className="wishlist-page">
      <div className="comic-panel-background"></div>
      
      <CartIcon />
      
      <div className="wishlist-header">
        <h1 className="wishlist-title">Wishlist</h1>
      </div>
      
      <div className="wishlist-description">
        <p>Drag and drop to rank comics in order of preference</p>
        <button className="info-button-large" onClick={() => setShowInstructions(true)}>
          <span className="info-icon">ℹ️</span>
          <span>How to use your Wishlist</span>
        </button>
      </div>
      
      {showInstructions && (
        <div className="instruction-popup">
          <div className="popup-content">
            <button className="close-popup" onClick={() => setShowInstructions(false)}>✖</button>
            <h3>Wishlist Instructions</h3>
            <div className="instruction-item">
              <span className="instruction-number">1</span>
              <p>Your wishlist helps us find the best comics for you based on your preferences!</p>
            </div>
            <div className="instruction-item">
              <span className="instruction-number">2</span>
              <p>Drag and drop items using the ≡ handle to rank them in order of preference.</p>
            </div>
            <div className="instruction-item">
              <span className="instruction-number">3</span>
              <p>The higher an item is on your list, the more likely we'll find it for you in Drops!</p>
            </div>
          </div>
        </div>
      )}
      
      {showAddForm && (
        <div className="instruction-popup">
          <div className="popup-content">
            <button className="close-popup" onClick={() => setShowAddForm(false)}>✖</button>
            <h3>Add Comic to Wishlist</h3>
            <form onSubmit={handleAddComic} className="add-comic-form">
              <div className="form-group">
                <label htmlFor="comicName">Comic Name:</label>
                <input 
                  type="text" 
                  id="comicName" 
                  value={newComicName} 
                  onChange={(e) => setNewComicName(e.target.value)}
                  placeholder="Enter comic name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="comicRank">Rank (1-{wishlistItems.length + 1}):</label>
                <input 
                  type="number" 
                  id="comicRank" 
                  value={newComicRank} 
                  onChange={(e) => setNewComicRank(parseInt(e.target.value))}
                  min="1" 
                  max={wishlistItems.length + 1}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="button button-accent">Add Comic</button>
                <button type="button" className="button button-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="wishlist-container">
        <div className="section-header">
          <h2>Your Wishlist</h2>
          <div className="boom-badge">BOOM!</div>
        </div>
        
        <DragDropContext onDragEnd={onDragEnd}>
          <StrictModeDroppable droppableId="wishlist">
            {(provided) => (
              <ol 
                className="wishlist-items"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {wishlistItems.map((item, index) => (
                  <Draggable 
                    key={item.id} 
                    draggableId={item.id} 
                    index={index}
                  >
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="wishlist-item"
                      >
                        <div className="item-rank">{index + 1}</div>
                        <div className="item-name">{item.name}</div>
                        <div 
                          className="rank-handle"
                          {...provided.dragHandleProps}
                        >≡</div>
                        <button 
                          className="remove-button" 
                          onClick={() => handleRemoveComic(item.id)}
                          title="Remove from wishlist"
                        >
                          ✖
                        </button>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ol>
            )}
          </StrictModeDroppable>
        </DragDropContext>
        
        <div className="wishlist-actions">
          <button className="button button-secondary" onClick={() => setShowAddForm(true)}>Add Comic</button>
          <button className="button button-accent">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage; 