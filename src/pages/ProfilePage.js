import React, { useState } from 'react';
import './ProfilePage.css';

// Import comic data
import comicData from '../comic_volumes_20.json';

// Import fallback image
import defaultCover from '../assets/batman-vol-1-1.jpg';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('collection');
  
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
  
  // Collection comics - using specific comics from the JSON data
  const collectionComics = [
    "Invincible Vol. 1 #1",
    "Spawn Vol. 1 #1",
    "Batman Vol. 1 #1",
    "The Walking Dead Vol. 1 #1"
  ];
  
  return (
    <div className="profile-page">
      <div className="comic-panel-background"></div>
      
      <div className="profile-header">
        <div className="profile-avatar">
          <div 
            style={{
              width: '100%', 
              height: '100%', 
              backgroundColor: '#1A2238',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '36px'
            }}
          >
            👤
          </div>
          <div className="edit-avatar">✏️</div>
        </div>
        
        <div className="profile-info">
          <h1 className="profile-name">Comic Fan</h1>
          <p className="profile-stats">
            <span className="stat">
              <span className="stat-value">42</span>
              <span className="stat-label">Comics</span>
            </span>
            <span className="stat">
              <span className="stat-value">12</span>
              <span className="stat-label">Trades</span>
            </span>
            <span className="stat">
              <span className="stat-value">8</span>
              <span className="stat-label">Friends</span>
            </span>
          </p>
        </div>
      </div>
      
      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'collection' ? 'active' : ''}`}
          onClick={() => setActiveTab('collection')}
        >
          Collection
        </button>
        <button 
          className={`tab-button ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          Activity
        </button>
        <button 
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>
      
      <div className="profile-content">
        {activeTab === 'collection' && (
          <div className="collection-tab">
            <div className="section-header">
              <h2>My Collection</h2>
              <div className="zap-badge">ZAP!</div>
            </div>
            
            <div className="collection-grid">
              {collectionComics.map((comicTitle, index) => {
                const comic = comicData.find(c => c.Title === comicTitle);
                return (
                  <div className="comic-item" key={index}>
                    <div 
                      className="comic-cover" 
                      style={{backgroundImage: `url(${getImagePath(comicTitle)})`}}
                    ></div>
                    <div className="comic-title">{comic ? comic.Title : comicTitle}</div>
                  </div>
                );
              })}
            </div>
            
            <button className="button button-secondary view-all-button">View All Comics</button>
          </div>
        )}
        
        {activeTab === 'activity' && (
          <div className="activity-tab">
            <div className="section-header">
              <h2>Recent Activity</h2>
              <div className="pow-badge">POW!</div>
            </div>
            
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">🛒</div>
                <div className="activity-details">
                  <div className="activity-title">Purchased Batman Vol. 1 #1</div>
                  <div className="activity-time">2 days ago</div>
                </div>
              </div>
              
              <div className="activity-item">
                <div className="activity-icon">⭐</div>
                <div className="activity-details">
                  <div className="activity-title">Rated Doctor Strange Vol. 1 #1 5 stars</div>
                  <div className="activity-time">1 week ago</div>
                </div>
              </div>
              
              <div className="activity-item">
                <div className="activity-icon">📝</div>
                <div className="activity-details">
                  <div className="activity-title">Added Saga Vol. 1 #1 to wishlist</div>
                  <div className="activity-time">2 weeks ago</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="settings-tab">
            <div className="section-header">
              <h2>Settings</h2>
              <div className="boom-badge">BOOM!</div>
            </div>
            
            <div className="settings-list">
              <div className="settings-item">
                <div className="settings-label">Notifications</div>
                <div className="toggle-switch">
                  <input type="checkbox" id="notifications" defaultChecked />
                  <label htmlFor="notifications"></label>
                </div>
              </div>
              
              <div className="settings-item">
                <div className="settings-label">Dark Mode</div>
                <div className="toggle-switch">
                  <input type="checkbox" id="darkmode" />
                  <label htmlFor="darkmode"></label>
                </div>
              </div>
              
              <div className="settings-item">
                <div className="settings-label">Privacy</div>
                <div className="settings-value">Public Profile</div>
              </div>
              
              <div className="settings-item">
                <div className="settings-label">Language</div>
                <div className="settings-value">English</div>
              </div>
            </div>
            
            <button className="button button-accent save-settings-button">Save Settings</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage; 