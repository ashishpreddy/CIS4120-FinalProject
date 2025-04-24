import React from 'react';
import { Link } from 'react-router-dom';
import './HomeScreen.css';

const HomeScreen = () => {
  return (
    <div className="home-screen">
      <div className="comic-panel-background"></div>
      
      <div className="logo-container">
        <div className="logo-burst"></div>
        <h1 className="logo">
          <span className="logo-c">c</span>
          <span className="logo-o">o</span>
          <span className="logo-m">m</span>
          <span className="logo-i">i</span>
          <span className="logo-x">x</span>
        </h1>
        <p className="tagline">
          Your global community for<br />
          buying and selling comics!
        </p>
      </div>
      
      <h2 className="cta-heading">I want to...</h2>


      <div className="cta-buttons">
        <Link to="/buy" className="cta-button buy-button">
          <div className="icon">🛒</div>
          <span>Buy</span>
          <div className="button-effect"></div>
        </Link>
        <Link to="/sell" className="cta-button sell-button">
          <div className="icon">🏷️</div>
          <span>Sell</span>
          <div className="button-effect"></div>
        </Link>
      </div>
      
      <div className="trending-section">
        <div className="section-header">
          <h2 className="section-title">Trending</h2>
          <div className="hot-badge">HOT!</div>
        </div>
        
        <div className="trending-item">
          <div className="trending-icon">🔥</div>
          <p>
            <strong>The Sandman</strong> has been on fire recently with <strong>46</strong> buys!
          </p>
        </div>
        
        <div className="trending-item">
          <div className="trending-icon">⏰</div>
          <p>
            Jim Lee's exclusive <strong>X-Men</strong> releases <strong>3/25</strong> at <strong>12pm EST</strong>!
          </p>
        </div>
        
        <div className="trending-item">
          <div className="trending-icon">💰</div>
          <p>
            <strong>Batman #800</strong> just sold for a record <strong>$12,500</strong>!
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen; 