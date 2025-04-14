import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  
  const addToCart = (item) => {
    // Handle both cases: when item is an object or just a string (comic name)
    const newItem = typeof item === 'string' 
      ? { 
          id: `comic-${Date.now()}`, 
          name: item,
          cartId: `comic-${Date.now()}`
        }
      : {
          ...item,
          id: item.id || `comic-${Date.now()}`,
          name: item.Title || item.name,
          cartId: `cart-${Date.now()}`
        };
    
    setCartItems([...cartItems, newItem]);
  };
  
  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => {
      // Check both id and cartId to ensure we find the right item
      // Use OR logic - remove if either matches
      return item.id !== itemId && item.cartId !== itemId;
    }));
  };
  
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext); 