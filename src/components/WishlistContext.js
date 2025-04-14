import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
const WishlistContext = createContext();

// Create provider component
export const WishlistProvider = ({ children }) => {
  // Initialize comic wishlist from localStorage if available
  const [wishlistItems, setWishlistItems] = useState(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [
      { id: 'item-1', name: 'Saga Vol. 1 #1' },
      { id: 'item-2', name: 'Invincible Vol. 1 #1' },
      { id: 'item-3', name: 'Spawn Vol. 1 #1' },
      { id: 'item-4', name: 'The Walking Dead Vol. 1 #1' },
      { id: 'item-5', name: 'The Silver Surfer Vol. 1 #1' },
      { id: 'item-6', name: 'Batman Vol. 1 #1' },
    ];
  });

  // Initialize author wishlist from localStorage if available
  const [authorWishlistItems, setAuthorWishlistItems] = useState(() => {
    const savedAuthorWishlist = localStorage.getItem('authorWishlist');
    return savedAuthorWishlist ? JSON.parse(savedAuthorWishlist) : [
      { id: 'author-1', name: 'Stan Lee' },
      { id: 'author-2', name: 'Jack Kirby' },
      { id: 'author-3', name: 'Todd McFarlane' },
    ];
  });

  // Save comic wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Save author wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('authorWishlist', JSON.stringify(authorWishlistItems));
  }, [authorWishlistItems]);

  // Add comic to wishlist
  const addToWishlist = (comicName, rank = null) => {
    // Check if comic is already in wishlist
    if (wishlistItems.some(item => item.name === comicName)) {
      return false; // Already exists
    }
    
    const newItem = {
      id: `item-${Date.now()}`,
      name: comicName
    };
    
    let newItems = [...wishlistItems];
    
    if (rank !== null) {
      // Insert at the specified rank (adjusting for 0-based index)
      const insertIndex = Math.min(Math.max(0, rank - 1), wishlistItems.length);
      newItems.splice(insertIndex, 0, newItem);
    } else {
      // Add to the end if no rank specified
      newItems.push(newItem);
    }
    
    setWishlistItems(newItems);
    return true; // Successfully added
  };

  // Add author to wishlist
  const addAuthorToWishlist = (authorName, rank = null) => {
    // Check if author is already in wishlist
    if (authorWishlistItems.some(item => item.name === authorName)) {
      return false; // Already exists
    }
    
    const newItem = {
      id: `author-${Date.now()}`,
      name: authorName
    };
    
    let newItems = [...authorWishlistItems];
    
    if (rank !== null) {
      // Insert at the specified rank (adjusting for 0-based index)
      const insertIndex = Math.min(Math.max(0, rank - 1), authorWishlistItems.length);
      newItems.splice(insertIndex, 0, newItem);
    } else {
      // Add to the end if no rank specified
      newItems.push(newItem);
    }
    
    setAuthorWishlistItems(newItems);
    return true; // Successfully added
  };

  // Remove comic from wishlist
  const removeFromWishlist = (id) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  // Remove author from wishlist
  const removeAuthorFromWishlist = (id) => {
    setAuthorWishlistItems(authorWishlistItems.filter(item => item.id !== id));
  };

  // Reorder comic wishlist items
  const reorderWishlist = (result) => {
    if (!result.destination) {
      return;
    }
    
    const items = Array.from(wishlistItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setWishlistItems(items);
  };

  // Reorder author wishlist items
  const reorderAuthorWishlist = (result) => {
    if (!result.destination) {
      return;
    }
    
    const items = Array.from(authorWishlistItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setAuthorWishlistItems(items);
  };

  return (
    <WishlistContext.Provider 
      value={{ 
        wishlistItems, 
        setWishlistItems, 
        addToWishlist, 
        removeFromWishlist,
        reorderWishlist,
        authorWishlistItems,
        setAuthorWishlistItems,
        addAuthorToWishlist,
        removeAuthorFromWishlist,
        reorderAuthorWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use the wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}; 