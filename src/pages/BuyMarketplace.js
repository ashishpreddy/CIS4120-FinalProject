import React, { useState, useEffect } from 'react';
import './BuyMarketplace.css';
import CartIcon from '../components/CartIcon';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useWishlist } from '../components/WishlistContext';
import { useCart } from '../components/CartContext';

// Import comic data
import comicData from '../comic_volumes_20.json';

// Import fallback images for each category
import batmanFallback from '../assets/batman-vol-1-1.jpg';
import spidermanFallback from '../assets/amazing-spider-man-vol-1-1.jpg';
import xmenFallback from '../assets/x-men-vol-1-1.jpg';
import doomFallback from '../assets/doctor-strange-vol-1-1.jpg';
import defaultCover from '../assets/batman-vol-1-1.jpg';

const BuyMarketplace = () => {
  const [expandedFilter, setExpandedFilter] = useState(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedComic, setSelectedComic] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredComics, setFilteredComics] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    publishers: [],
    characters: [],
    genres: [],
    grades: []
  });
  
  const [cartNotification, setCartNotification] = useState(null);
  const [wishlistNotification, setWishlistNotification] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use the wishlist context instead of local state
  const { wishlistItems, addToWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  // Handle URL parameters on component mount
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const comicParam = queryParams.get('comic');
    const authorParam = queryParams.get('author');
    
    if (comicParam) {
      // Find the comic in the data
      const comic = comicData.find(c => c.Title === comicParam);
      if (comic) {
        // Set the comic as selected to show the popup
        setSelectedComic(comic);
      } else {
        // If comic not found, set it as search query
        setSearchQuery(comicParam);
        setShowSearchPopup(true);
      }
    } else if (authorParam) {
      // Set author as search query and show search popup
      setSearchQuery(authorParam);
      setShowSearchPopup(true);
      
      // Perform search for this author
      const results = comicData.filter(comic => 
        comic.Author && comic.Author.toLowerCase().includes(authorParam.toLowerCase())
      );
      setSearchResults(results);
    }
    
    // Clear the URL parameters after handling them
    if (comicParam || authorParam) {
      // Use the current path instead of hardcoding it
      navigate(location.pathname, { replace: true });
    }
  }, [location.search, navigate, location.pathname]);
  
  // Function to safely get image path
  const getImagePath = (imagePath, fallback) => {
    try {
      // Extract just the filename from the path in the JSON
      const filename = imagePath.split('/').pop();
      // Try to require the image from assets
      return require(`../assets/${filename}`);
    } catch (error) {
      // If image not found, return fallback
      return fallback;
    }
  };
  
  // Extract unique publishers, characters, and genres from the JSON data
  const publishers = [...new Set(comicData.map(comic => comic.Publisher))].filter(Boolean);
  const characters = [...new Set(comicData.map(comic => comic.Character))].filter(Boolean);
  const genres = [...new Set(comicData.map(comic => comic.Genre))].filter(Boolean);
  
  // Group comics by character for display
  const getComicsByCharacter = (character) => {
    return comicData.filter(comic => 
      comic.Character && comic.Character.toLowerCase().includes(character.toLowerCase())
    ).slice(0, 2); // Limit to 2 comics per character for display
  };
  
  // Toggle filter sections
  const toggleFilter = (filter) => {
    if (expandedFilter === filter) {
      setExpandedFilter(null);
    } else {
      setExpandedFilter(filter);
    }
  };
  
  // Handle checkbox changes for filters
  const handleFilterChange = (type, value) => {
    setActiveFilters(prev => {
      const current = [...prev[type]];
      if (current.includes(value)) {
        return { ...prev, [type]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [type]: [...current, value] };
      }
    });
  };
  
  // Apply filters to comics
  const applyFilters = () => {
    let filtered = [...comicData];
    
    // Filter by publishers
    if (activeFilters.publishers.length > 0) {
      filtered = filtered.filter(comic => 
        comic.Publisher && activeFilters.publishers.includes(comic.Publisher)
      );
    }
    
    // Filter by characters
    if (activeFilters.characters.length > 0) {
      filtered = filtered.filter(comic => 
        comic.Character && activeFilters.characters.includes(comic.Character)
      );
    }
    
    // Filter by genres
    if (activeFilters.genres.length > 0) {
      filtered = filtered.filter(comic => 
        comic.Genre && activeFilters.genres.includes(comic.Genre)
      );
    }
    
    // Filter by grades
    if (activeFilters.grades.length > 0) {
      filtered = filtered.filter(comic => {
        if (!comic.Grade) return false;
        
        const grade = parseFloat(comic.Grade.replace('CGC ', ''));
        
        if (activeFilters.grades.includes('Gem Mint (10.0)') && grade === 10.0) return true;
        if (activeFilters.grades.includes('Mint (9.9-9.0)') && grade >= 9.0 && grade <= 9.9) return true;
        if (activeFilters.grades.includes('Near Mint (8.9-8.0)') && grade >= 8.0 && grade <= 8.9) return true;
        if (activeFilters.grades.includes('Very Fine (7.9-7.0)') && grade >= 7.0 && grade <= 7.9) return true;
        if (activeFilters.grades.includes('Below Fine (< 6.0)') && grade < 6.0) return true;
        
        return false;
      });
    }
    
    // Group filtered comics by character
    const characterGroups = {};
    filtered.forEach(comic => {
      if (comic.Character) {
        if (!characterGroups[comic.Character]) {
          characterGroups[comic.Character] = [];
        }
        characterGroups[comic.Character].push(comic);
      }
    });
    
    setFilteredComics(Object.entries(characterGroups).map(([character, comics]) => ({
      character,
      comics: comics.slice(0, 2) // Limit to 2 comics per character
    })));
  };
  
  // Reset filters
  const resetFilters = () => {
    setActiveFilters({
      publishers: [],
      characters: [],
      genres: [],
      grades: []
    });
    setFilteredComics([]);
  };
  
  // Handle search button click
  const handleSearch = () => {
    setShowSearchPopup(true);
  };
  
  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    // Search for comics that match the query
    const results = comicData.filter(comic => 
      comic.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (comic.Character && comic.Character.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (comic.Author && comic.Author.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    setSearchResults(results);
    
    if (results.length === 1) {
      // If only one result, show the comic details directly
      setSelectedComic(results[0]);
    }
  };
  
  // Handle comic selection from search results
  const handleComicSelect = (comic) => {
    setSelectedComic(comic);
    setSearchResults([]);
  };
  
  // Handle "For You" button click
  const handleForYouClick = () => {
    navigate('/drops');
  };
  
  // Handle info button click on a category
  const handleCategoryInfo = (character) => {
    setSelectedCategory(character);
    // Find the first comic for this character to display details
    const comic = comicData.find(c => c.Character === character);
    if (comic) {
      setSelectedComic(comic);
    }
  };

  // Get comics for specific categories
  const batmanComics = getComicsByCharacter("Batman");
  const spidermanComics = getComicsByCharacter("Spider-Man");
  const xmenComics = getComicsByCharacter("X-Men");
  
  // For Dr. Strange instead of Dr. Doom (since Doom isn't in our data)
  const strangeComics = getComicsByCharacter("Doctor Strange");

  const handleAddToCart = (comic) => {
    // Pass the full comic object
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

  return (
    <div className="buy-marketplace">
      <div className="comic-panel-background"></div>
      
      <CartIcon />
      
      <div className="marketplace-header">
        <h1 className="marketplace-title">Buy</h1>
        <h2 className="marketplace-subtitle">Marketplace</h2>
      </div>
      
      <div className="search-bar">
        <button className="search-button" onClick={handleSearch}>
          <span className="button-text">Search</span>
          <span className="button-icon">🔍</span>
        </button>
        <button className="recommendations-button" onClick={handleForYouClick}>
          <span className="button-text">For You</span>
          <span className="button-icon">✨</span>
        </button>
      </div>
      
      <div className="marketplace-content">
        <div className="filters-sidebar">
          <div className="filter-header" onClick={() => setShowFilterPanel(!showFilterPanel)}>
            <h3 className="filter-title">Filter by</h3>
            <span className={`filter-toggle ${showFilterPanel ? 'open' : ''}`}>▼</span>
          </div>
          
          {showFilterPanel && (
            <div className="filter-options">
              <div className="filter-group">
                <div 
                  className="filter-group-header" 
                  onClick={() => toggleFilter('publisher')}
                >
                  <h4>Publisher</h4>
                  <span className={`filter-toggle ${expandedFilter === 'publisher' ? 'open' : ''}`}>▼</span>
                </div>
                
                {expandedFilter === 'publisher' && (
                  <div className="filter-group-options">
                    {publishers.map((publisher, index) => (
                      <div className="filter-option" key={index}>
                        <input 
                          type="checkbox" 
                          id={`publisher-${index}`} 
                          checked={activeFilters.publishers.includes(publisher)}
                          onChange={() => handleFilterChange('publishers', publisher)}
                        />
                        <label htmlFor={`publisher-${index}`}>{publisher}</label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="filter-group">
                <div 
                  className="filter-group-header" 
                  onClick={() => toggleFilter('character')}
                >
                  <h4>Character</h4>
                  <span className={`filter-toggle ${expandedFilter === 'character' ? 'open' : ''}`}>▼</span>
                </div>
                
                {expandedFilter === 'character' && (
                  <div className="filter-group-options">
                    {characters.map((character, index) => (
                      <div className="filter-option" key={index}>
                        <input 
                          type="checkbox" 
                          id={`character-${index}`} 
                          checked={activeFilters.characters.includes(character)}
                          onChange={() => handleFilterChange('characters', character)}
                        />
                        <label htmlFor={`character-${index}`}>{character}</label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="filter-group">
                <div 
                  className="filter-group-header" 
                  onClick={() => toggleFilter('genre')}
                >
                  <h4>Genre</h4>
                  <span className={`filter-toggle ${expandedFilter === 'genre' ? 'open' : ''}`}>▼</span>
                </div>
                
                {expandedFilter === 'genre' && (
                  <div className="filter-group-options">
                    {genres.map((genre, index) => (
                      <div className="filter-option" key={index}>
                        <input 
                          type="checkbox" 
                          id={`genre-${index}`} 
                          checked={activeFilters.genres.includes(genre)}
                          onChange={() => handleFilterChange('genres', genre)}
                        />
                        <label htmlFor={`genre-${index}`}>{genre}</label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="filter-group">
                <div 
                  className="filter-group-header" 
                  onClick={() => toggleFilter('grade')}
                >
                  <h4>Grade</h4>
                  <span className={`filter-toggle ${expandedFilter === 'grade' ? 'open' : ''}`}>▼</span>
                </div>
                
                {expandedFilter === 'grade' && (
                  <div className="filter-group-options">
                    <div className="filter-option">
                      <input 
                        type="checkbox" 
                        id="grade-1" 
                        checked={activeFilters.grades.includes('Gem Mint (10.0)')}
                        onChange={() => handleFilterChange('grades', 'Gem Mint (10.0)')}
                      />
                      <label htmlFor="grade-1">Gem Mint (10.0)</label>
                    </div>
                    <div className="filter-option">
                      <input 
                        type="checkbox" 
                        id="grade-2" 
                        checked={activeFilters.grades.includes('Mint (9.9-9.0)')}
                        onChange={() => handleFilterChange('grades', 'Mint (9.9-9.0)')}
                      />
                      <label htmlFor="grade-2">Mint (9.9-9.0)</label>
                    </div>
                    <div className="filter-option">
                      <input 
                        type="checkbox" 
                        id="grade-3" 
                        checked={activeFilters.grades.includes('Near Mint (8.9-8.0)')}
                        onChange={() => handleFilterChange('grades', 'Near Mint (8.9-8.0)')}
                      />
                      <label htmlFor="grade-3">Near Mint (8.9-8.0)</label>
                    </div>
                    <div className="filter-option">
                      <input 
                        type="checkbox" 
                        id="grade-4" 
                        checked={activeFilters.grades.includes('Very Fine (7.9-7.0)')}
                        onChange={() => handleFilterChange('grades', 'Very Fine (7.9-7.0)')}
                      />
                      <label htmlFor="grade-4">Very Fine (7.9-7.0)</label>
                    </div>
                    <div className="filter-option">
                      <input 
                        type="checkbox" 
                        id="grade-5" 
                        checked={activeFilters.grades.includes('Below Fine (< 6.0)')}
                        onChange={() => handleFilterChange('grades', 'Below Fine (< 6.0)')}
                      />
                      <label htmlFor="grade-5">Below Fine (&lt; 6.0)</label>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="filter-actions">
                <button className="apply-filters-button" onClick={applyFilters}>Apply Filters</button>
                <button className="reset-filters-button" onClick={resetFilters}>Reset</button>
              </div>
            </div>
          )}
        </div>
        
        <div className="comics-grid">
          {/* Show filtered comics if available, otherwise show default categories */}
          {filteredComics.length > 0 ? (
            filteredComics.map((group, index) => (
              <div className="comic-category" key={index}>
                <div className="category-header">
                  <h3>{group.character}</h3>
                  <div className="category-actions">
                    <button 
                      className="info-button"
                      onClick={() => handleCategoryInfo(group.character)}
                    >ℹ️</button>
                  </div>
                </div>
                <div className="comic-covers">
                  {group.comics.map((comic, comicIndex) => (
                    <div 
                      key={comicIndex}
                      className="comic-cover" 
                      style={{backgroundImage: `url(${getImagePath(comic.CoverImage, defaultCover)})`}}
                      title={`${comic.Title} - ${comic.Price}`}
                      onClick={() => setSelectedComic(comic)}
                    ></div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="comic-category featured">
                <div className="category-header">
                  <h3>Batman</h3>
                  <div className="category-actions">
                    <button 
                      className="info-button"
                      onClick={() => handleCategoryInfo("Batman")}
                    >ℹ️</button>
                  </div>
                </div>
                <div className="comic-covers">
                  {batmanComics.length > 0 ? (
                    batmanComics.map((comic, index) => (
                      <div 
                        key={index}
                        className="comic-cover" 
                        style={{backgroundImage: `url(${getImagePath(comic.CoverImage, batmanFallback)})`}}
                        title={`${comic.Title} - ${comic.Price}`}
                        onClick={() => setSelectedComic(comic)}
                      ></div>
                    ))
                  ) : (
                    <div 
                      className="comic-cover" 
                      style={{backgroundImage: `url(${batmanFallback})`}}
                      title="Batman"
                    ></div>
                  )}
                </div>
              </div>
              
              <div className="comic-category">
                <div className="category-header">
                  <h3>Spider-Man</h3>
                  <div className="category-actions">
                    <button 
                      className="info-button"
                      onClick={() => handleCategoryInfo("Spider-Man")}
                    >ℹ️</button>
                  </div>
                </div>
                <div className="comic-covers">
                  {spidermanComics.length > 0 ? (
                    spidermanComics.map((comic, index) => (
                      <div 
                        key={index}
                        className="comic-cover" 
                        style={{backgroundImage: `url(${getImagePath(comic.CoverImage, spidermanFallback)})`}}
                        title={`${comic.Title} - ${comic.Price}`}
                        onClick={() => setSelectedComic(comic)}
                      ></div>
                    ))
                  ) : (
                    <div 
                      className="comic-cover" 
                      style={{backgroundImage: `url(${spidermanFallback})`}}
                      title="Spider-Man"
                    ></div>
                  )}
                </div>
              </div>
              
              <div className="comic-category">
                <div className="category-header">
                  <h3>X-Men</h3>
                  <div className="category-actions">
                    <button 
                      className="info-button"
                      onClick={() => handleCategoryInfo("X-Men")}
                    >ℹ️</button>
                  </div>
                </div>
                <div className="comic-covers">
                  {xmenComics.length > 0 ? (
                    xmenComics.map((comic, index) => (
                      <div 
                        key={index}
                        className="comic-cover" 
                        style={{backgroundImage: `url(${getImagePath(comic.CoverImage, xmenFallback)})`}}
                        title={`${comic.Title} - ${comic.Price}`}
                        onClick={() => setSelectedComic(comic)}
                      ></div>
                    ))
                  ) : (
                    <div 
                      className="comic-cover" 
                      style={{backgroundImage: `url(${xmenFallback})`}}
                      title="X-Men"
                    ></div>
                  )}
                </div>
              </div>
              
              <div className="comic-category">
                <div className="category-header">
                  <h3>Dr. Strange</h3>
                  <div className="category-actions">
                    <button 
                      className="info-button"
                      onClick={() => handleCategoryInfo("Doctor Strange")}
                    >ℹ️</button>
                  </div>
                </div>
                <div className="comic-covers">
                  {strangeComics.length > 0 ? (
                    strangeComics.map((comic, index) => (
                      <div 
                        key={index}
                        className="comic-cover" 
                        style={{backgroundImage: `url(${getImagePath(comic.CoverImage, doomFallback)})`}}
                        title={`${comic.Title} - ${comic.Price}`}
                        onClick={() => setSelectedComic(comic)}
                      ></div>
                    ))
                  ) : (
                    <div 
                      className="comic-cover" 
                      style={{backgroundImage: `url(${doomFallback})`}}
                      title="Dr. Strange"
                    ></div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="wishlist-section">
        <div className="wishlist-header">
          <h2>Your Wishlist</h2>
          <div className="pow-badge">POW!</div>
        </div>
        <div className="wishlist-controls">
          <Link to="/wishlist" className="edit-button no-underline">Edit ✏️</Link>
        </div>
        
        <ol className="wishlist-items">
          {wishlistItems.map((item, index) => (
            <li key={item.id}>
              <span className="rank">{index + 1}</span> {item.name}
            </li>
          )).slice(0, 5)}
        </ol>
        {wishlistItems.length > 5 && <div className="more-indicator">...</div>}
      </div>
      
      {/* Search Popup */}
      {showSearchPopup && (
        <div className="search-popup">
          <div className="search-popup-content">
            <button className="close-popup" onClick={() => {
              setShowSearchPopup(false);
              setSearchQuery('');
              setSearchResults([]);
            }}>✖</button>
            <h3>Search Comics</h3>
            <form onSubmit={handleSearchSubmit}>
              <div className="search-input-container">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    // Show suggestions as user types
                    if (e.target.value.length > 2) {
                      const suggestions = comicData
                        .filter(comic => comic.Title.toLowerCase().includes(e.target.value.toLowerCase()))
                        .slice(0, 5);
                      setSearchResults(suggestions);
                    } else {
                      setSearchResults([]);
                    }
                  }}
                  placeholder="Enter title, character, or author"
                  autoFocus
                />
                <button type="submit" className="search-submit-button">🔍</button>
              </div>
            </form>
            
            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((comic, index) => (
                  <div 
                    key={index} 
                    className="search-result-item"
                    onClick={() => handleComicSelect(comic)}
                  >
                    <div 
                      className="result-thumbnail" 
                      style={{backgroundImage: `url(${getImagePath(comic.CoverImage, defaultCover)})`}}
                    ></div>
                    <div className="result-details">
                      <div className="result-title">{comic.Title}</div>
                      <div className="result-info">{comic.Publisher} • {comic.Character}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Comic Details Popup */}
      {selectedComic && (
        <div className="comic-details-popup">
          <div className="comic-details-content">
            <button className="close-popup" onClick={() => setSelectedComic(null)}>✖</button>
            <h3>{selectedComic.Title}</h3>
            
            <div className="comic-details-grid">
              <div className="comic-details-cover">
                <img 
                  src={getImagePath(selectedComic.CoverImage, defaultCover)} 
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
                
                <div className="detail-item">
                  <span className="detail-label">Availability:</span>
                  <span className={`detail-value ${selectedComic.Availability === false ? 'unavailable-text' : 'available-text'}`}>
                    {selectedComic.Availability === false ? 'Currently Unavailable' : 'In Stock'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="comic-description">
              <h4>Description:</h4>
              <p>{selectedComic.Description}</p>
            </div>
            
            <div className="comic-details-actions">
              <button 
                className={`add-to-cart-button ${selectedComic.Availability === false ? 'button-disabled' : ''}`}
                onClick={() => {
                  if (selectedComic.Availability !== false) {
                    handleAddToCart(selectedComic);
                    setSelectedComic(null);
                  }
                }}
                disabled={selectedComic.Availability === false}
              >
                {selectedComic.Availability === false ? 'Out of Stock' : 'Add to Cart'}
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
    </div>
  );
};

export default BuyMarketplace; 