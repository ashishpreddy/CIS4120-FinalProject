import React, { useState, useEffect } from 'react';
import './WishlistPage.css';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from './StrictModeDroppable';
import CartIcon from '../components/CartIcon';
import comicData from '../comic_volumes_20.json';
import { useWishlist } from '../components/WishlistContext';

const WishlistPage = () => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formType, setFormType] = useState('comic'); // 'comic' or 'author'
  const [newComicRank, setNewComicRank] = useState(1);
  const [newAuthorRank, setNewAuthorRank] = useState(1);
  const [newComicName, setNewComicName] = useState('');
  const [newAuthorName, setNewAuthorName] = useState('');
  const [validationError, setValidationError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showComicSearch, setShowComicSearch] = useState(false);
  const [comicSearchQuery, setComicSearchQuery] = useState('');
  const [comicSearchResults, setComicSearchResults] = useState([]);
  const [showAuthorSearch, setShowAuthorSearch] = useState(false);
  const [authorSearchQuery, setAuthorSearchQuery] = useState('');
  const [authorSearchResults, setAuthorSearchResults] = useState([]);
  
  // Use the wishlist context
  const { 
    wishlistItems, 
    addToWishlist, 
    removeFromWishlist, 
    reorderWishlist,
    authorWishlistItems,
    addAuthorToWishlist,
    removeAuthorFromWishlist,
    reorderAuthorWishlist
  } = useWishlist();
  
  // Get all available comic titles and authors from JSON
  const allComicTitles = comicData.map(comic => comic.Title);
  const allAuthors = [...new Set(comicData.map(comic => comic.Author))].filter(Boolean);
  
  // Handle input change for comic name with suggestions
  const handleComicNameChange = (e) => {
    const value = e.target.value;
    setNewComicName(value);
    
    // Show suggestions if input has at least 2 characters
    if (value.length >= 2) {
      const filteredSuggestions = allComicTitles.filter(title => 
        title.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };
  
  // Handle input change for author name with suggestions
  const handleAuthorNameChange = (e) => {
    const value = e.target.value;
    setNewAuthorName(value);
    
    // Show suggestions if input has at least 2 characters
    if (value.length >= 2) {
      const filteredSuggestions = allAuthors.filter(author => 
        author.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };
  
  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion) => {
    if (formType === 'comic') {
      setNewComicName(suggestion);
    } else {
      setNewAuthorName(suggestion);
    }
    setSuggestions([]);
  };
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setSuggestions([]);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  const onDragEnd = (result, listType) => {
    if (!result.destination) return;
    
    if (listType === 'comics') {
      reorderWishlist(result);
    } else if (listType === 'authors') {
      reorderAuthorWishlist(result);
    }
  };
  
  const validateComic = (comicName) => {
    // Check if the comic exists in the JSON data
    return allComicTitles.includes(comicName);
  };
  
  const validateAuthor = (authorName) => {
    // Check if the author exists in the JSON data
    return allAuthors.includes(authorName);
  };
  
  const handleAddComic = (e) => {
    e.preventDefault();
    setValidationError('');
    
    if (!newComicName.trim()) {
      setValidationError('Please enter a comic name');
      return;
    }
    
    // Check if comic exists in JSON data
    if (!validateComic(newComicName)) {
      setValidationError('Comic not found in our database. Please check the title and try again.');
      return;
    }
    
    // Check if comic is already in wishlist
    if (wishlistItems.some(item => item.name === newComicName)) {
      setValidationError('This comic is already in your wishlist');
      return;
    }
    
    const success = addToWishlist(newComicName, newComicRank);
    
    if (success) {
      setNewComicName('');
      setNewComicRank(1);
      setShowAddForm(false);
    }
  };
  
  const handleAddAuthor = (e) => {
    e.preventDefault();
    setValidationError('');
    
    if (!newAuthorName.trim()) {
      setValidationError('Please enter an author name');
      return;
    }
    
    // Check if author exists in JSON data
    if (!validateAuthor(newAuthorName)) {
      setValidationError('Author not found in our database. Please check the name and try again.');
      return;
    }
    
    // Check if author is already in wishlist
    if (authorWishlistItems.some(item => item.name === newAuthorName)) {
      setValidationError('This author is already in your wishlist');
      return;
    }
    
    const success = addAuthorToWishlist(newAuthorName, newAuthorRank);
    
    if (success) {
      setNewAuthorName('');
      setNewAuthorRank(1);
      setShowAddForm(false);
    }
  };
  
  const handleRemoveComic = (id) => {
    removeFromWishlist(id);
  };
  
  const handleRemoveAuthor = (id) => {
    removeAuthorFromWishlist(id);
  };
  
  const openAddForm = (type) => {
    setFormType(type);
    setValidationError('');
    setShowAddForm(true);
    
    // Reset form fields
    if (type === 'comic') {
      setNewComicName('');
      setNewComicRank(wishlistItems.length + 1);
    } else {
      setNewAuthorName('');
      setNewAuthorRank(authorWishlistItems.length + 1);
    }
  };

  const handleComicSearch = () => {
    // Implement comic search logic here
    setComicSearchResults([]); // Placeholder
    setShowComicSearch(false);
  };

  const handleAuthorSearch = () => {
    // Implement author search logic here
    setAuthorSearchResults([]); // Placeholder
    setShowAuthorSearch(false);
  };

  const handleSelectComic = (comic) => {
    // Implement comic selection logic here
    setNewComicName(comic.Title);
    setShowComicSearch(false);
  };

  const handleSelectAuthor = (author) => {
    // Implement author selection logic here
    setNewAuthorName(author);
    setShowAuthorSearch(false);
  };

  const getImagePath = (title) => {
    // Implement logic to get image path based on comic title
    return ''; // Placeholder
  };

  return (
    <div className="wishlist-page">
      <div className="comic-panel-background"></div>
      
      <CartIcon />
      
      <div className="wishlist-header">
        <h1 className="wishlist-title">Wishlist</h1>
      </div>
      
      <div className="wishlist-description">
        <p>Drag and drop to rank comics and authors in order of preference</p>
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
            <div className="instruction-item">
              <span className="instruction-number">4</span>
              <p>You can add both specific comics and favorite authors to your wishlist.</p>
            </div>
          </div>
        </div>
      )}
      
      {showAddForm && (
        <div className="instruction-popup">
          <div className="popup-content">
            <button className="close-popup" onClick={() => setShowAddForm(false)}>✖</button>
            <h3>Add {formType === 'comic' ? 'Comic' : 'Author'} to Wishlist</h3>
            
            {formType === 'comic' ? (
              <form onSubmit={handleAddComic} className="add-comic-form">
                <div className="form-group">
                  <label htmlFor="comicName">Comic Title:</label>
                  <div className="autocomplete-container">
                    <input
                      type="text"
                      id="comicName"
                      value={newComicName}
                      onChange={handleComicNameChange}
                      placeholder="Enter comic title."
                      required
                      autoComplete="off"
                    />
                    {suggestions.length > 0 && (
                      <ul className="suggestions-list">
                        {suggestions.map((suggestion, index) => (
                          <li 
                            key={index} 
                            onClick={() => handleSelectSuggestion(suggestion)}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {validationError && (
                    <div className="validation-error">{validationError}</div>
                  )}
                  <div className="comic-suggestions">
                    <small>Available comics include: Batman Vol. 1 #1, Spawn Vol. 1 #1, Invincible Vol. 1 #1, etc.</small>
                  </div>
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
            ) : (
              <form onSubmit={handleAddAuthor} className="add-comic-form">
                <div className="form-group">
                  <label htmlFor="authorName">Author Name:</label>
                  <div className="autocomplete-container">
                    <input
                      type="text"
                      id="authorName"
                      value={newAuthorName}
                      onChange={handleAuthorNameChange}
                      placeholder="Enter author name."
                      required
                      autoComplete="off"
                    />
                    {suggestions.length > 0 && (
                      <ul className="suggestions-list">
                        {suggestions.map((suggestion, index) => (
                          <li 
                            key={index} 
                            onClick={() => handleSelectSuggestion(suggestion)}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {validationError && (
                    <div className="validation-error">{validationError}</div>
                  )}
                  <div className="comic-suggestions">
                    <small>Available authors include: Stan Lee, Jack Kirby, Todd McFarlane, etc.</small>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="authorRank">Rank (1-{authorWishlistItems.length + 1}):</label>
                  <input 
                    type="number" 
                    id="authorRank" 
                    value={newAuthorRank} 
                    onChange={(e) => setNewAuthorRank(parseInt(e.target.value))}
                    min="1" 
                    max={authorWishlistItems.length + 1}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="button button-accent">Add Author</button>
                  <button type="button" className="button button-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      
      <div className="wishlist-container">
        <div className="section-header">
          <h2>Your Wishlist</h2>
          <div className="boom-badge">BOOM!</div>
        </div>
        
        {/* Comics Section */}
        <div className="wishlist-section">
          <h3 className="wishlist-subheading">Comics</h3>
          
          <DragDropContext onDragEnd={(result) => onDragEnd(result, 'comics')}>
            <StrictModeDroppable droppableId="comics-wishlist">
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
            <button 
              className="button button-accent" 
              onClick={() => openAddForm('comic')}
            >
              Add Comic
            </button>
          </div>
        </div>
        
        {/* Authors Section */}
        <div className="wishlist-section">
          <h3 className="wishlist-subheading">Authors</h3>
          
          <DragDropContext onDragEnd={(result) => onDragEnd(result, 'authors')}>
            <StrictModeDroppable droppableId="authors-wishlist">
              {(provided) => (
                <ol 
                  className="wishlist-items"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {authorWishlistItems.map((item, index) => (
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
                            onClick={() => handleRemoveAuthor(item.id)}
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
            <button 
              className="button button-accent" 
              onClick={() => openAddForm('author')}
            >
              Add Author
            </button>
          </div>
        </div>
      </div>

      {showComicSearch && (
        <div className="search-popup">
          <div className="search-popup-content">
            <button className="close-popup" onClick={() => setShowComicSearch(false)}>✖</button>
            <h3>SEARCH COMICS</h3>
            
            <div className="search-input-container">
              <input
                type="text"
                value={comicSearchQuery}
                onChange={(e) => setComicSearchQuery(e.target.value)}
                placeholder="Search for comics..."
              />
              <button className="search-submit-button" onClick={handleComicSearch}>
                🔍
              </button>
            </div>
            
            <div className="search-results">
              {comicSearchResults.map((comic, index) => (
                <div 
                  key={index} 
                  className="search-result-item"
                  onClick={() => handleSelectComic(comic)}
                >
                  <div 
                    className="result-thumbnail" 
                    style={{backgroundImage: `url(${getImagePath(comic.Title)})`}}
                  ></div>
                  <div className="result-details">
                    <div className="result-title">{comic.Title}</div>
                    <div className="result-info">
                      {comic.Publisher} • {comic.Author}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showAuthorSearch && (
        <div className="search-popup author-search-popup">
          <div className="search-popup-content">
            <button className="close-popup" onClick={() => setShowAuthorSearch(false)}>✖</button>
            <h3>SEARCH AUTHORS</h3>
            
            <div className="search-input-container">
              <input
                type="text"
                value={authorSearchQuery}
                onChange={(e) => setAuthorSearchQuery(e.target.value)}
                placeholder="Search for authors..."
              />
              <button className="search-submit-button" onClick={handleAuthorSearch}>
                🔍
              </button>
            </div>
            
            <div className="search-results">
              {authorSearchResults.map((author, index) => (
                <div 
                  key={index} 
                  className="search-result-item"
                  onClick={() => handleSelectAuthor(author)}
                >
                  <div className="result-details">
                    <div className="result-title">{author}</div>
                    <div className="result-info">
                      Comic Author
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage; 