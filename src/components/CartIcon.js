import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import './CartIcon.css';

const CartIcon = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  
  const handleCartClick = () => {
    navigate('/cart');
  };
  
  return (
    <div className="cart-icon" onClick={handleCartClick}>
      <span>🛒</span>
      {cartItems.length > 0 && (
        <div className="cart-badge">{cartItems.length}</div>
      )}
    </div>
  );
};

export default CartIcon; 