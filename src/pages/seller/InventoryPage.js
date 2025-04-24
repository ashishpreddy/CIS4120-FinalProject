import React, { useState, useEffect } from 'react';
import './InventoryPage.css';
import comicData from '../../comic_volumes_20.json';
import defaultCover from '../../assets/batman-vol-1-1.jpg';

const InventoryPage = () => {
  // Use first 6 comics from the JSON as seller's inventory
  const [inventory, setInventory] = useState(comicData.slice(0, 6));
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [comicImages, setComicImages] = useState({});

  // Function to safely get image path from comic data
  const getImagePath = (coverImagePath) => {
    try {
      if (!coverImagePath) throw new Error('No cover image path');
      
      // Extract just the filename from the path in the JSON
      const filename = coverImagePath.split('/').pop();
      
      // Try to require the image from assets
      return require(`../../assets/${filename}`);
    } catch (error) {
      console.log('Error loading image:', error);
      // If image not found, return default cover
      return defaultCover;
    }
  };

  // Load comic images from the JSON data
  useEffect(() => {
    const imageMap = {};
    inventory.forEach(comic => {
      if (comic.CoverImage) {
        try {
          imageMap[comic.Title] = getImagePath(comic.CoverImage);
        } catch (e) {
          imageMap[comic.Title] = defaultCover;
        }
      }
    });
    setComicImages(imageMap);
  }, [inventory]);

  const startEditing = (comic) => {
    setEditingId(comic.Title);
    setEditForm({
      price: comic.Price.replace('$', ''),
      grade: comic.Grade,
      description: comic.Description,
      availability: comic.Availability
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm({
      ...editForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const saveChanges = (comicTitle) => {
    const updatedInventory = inventory.map(comic => {
      if (comic.Title === comicTitle) {
        return {
          ...comic,
          Price: `$${editForm.price}`,
          Grade: editForm.grade,
          Description: editForm.description,
          Availability: editForm.availability
        };
      }
      return comic;
    });
    
    setInventory(updatedInventory);
    setEditingId(null);
  };

  return (
    <div className="inventory-page">
      <div className="comic-panel-background"></div>
      
      <div className="inventory-header">
        <h1 className="inventory-title">Inventory</h1>
        <p className="inventory-subtitle">Manage your comic listings</p>
      </div>
      
      <div className="inventory-content">
        <div className="inventory-stats">
          <div className="stat-card">
            <h3>Total Listings</h3>
            <p className="stat-value">{inventory.length}</p>
          </div>
          <div className="stat-card">
            <h3>Active Listings</h3>
            <p className="stat-value">{inventory.filter(comic => comic.Availability).length}</p>
          </div>
          <div className="stat-card">
            <h3>Inactive Listings</h3>
            <p className="stat-value">{inventory.filter(comic => !comic.Availability).length}</p>
          </div>
        </div>

        <div className="inventory-table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Price</th>
                <th>Grade</th>
                <th>Status</th>
                <th>Performance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((comic) => (
                <tr key={comic.Title} className={comic.Availability ? 'active-listing' : 'inactive-listing'}>
                  <td className="cover-cell">
                    <div 
                      className="comic-cover" 
                      style={{ backgroundImage: `url(${comicImages[comic.Title] || defaultCover})` }}
                    ></div>
                  </td>
                  <td>{comic.Title}</td>
                  <td>
                    {editingId === comic.Title ? (
                      <input 
                        type="text" 
                        name="price" 
                        value={editForm.price} 
                        onChange={handleInputChange}
                        className="edit-input"
                      />
                    ) : (
                      comic.Price
                    )}
                  </td>
                  <td>
                    {editingId === comic.Title ? (
                      <input 
                        type="text" 
                        name="grade" 
                        value={editForm.grade} 
                        onChange={handleInputChange}
                        className="edit-input"
                      />
                    ) : (
                      comic.Grade
                    )}
                  </td>
                  <td>
                    {editingId === comic.Title ? (
                      <label className="availability-toggle">
                        <input 
                          type="checkbox" 
                          name="availability" 
                          checked={editForm.availability} 
                          onChange={handleInputChange}
                        />
                        <span className="toggle-slider"></span>
                        <span className="toggle-label">{editForm.availability ? 'Active' : 'Inactive'}</span>
                      </label>
                    ) : (
                      <span className={`status-badge ${comic.Availability ? 'status-active' : 'status-inactive'}`}>
                        {comic.Availability ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="performance-indicator">
                      <div className="views-count">
                        <span className="icon"></span> {Math.floor(comic.Title.length * 7.3)} views
                      </div>
                      <div className="saves-count">
                        <span className="icon"></span> {Math.floor(comic.Title.length * 1.2)} saves
                      </div>
                    </div>
                  </td>
                  <td>
                    {editingId === comic.Title ? (
                      <div className="action-buttons">
                        <button className="save-btn" onClick={() => saveChanges(comic.Title)}>Save</button>
                        <button className="cancel-btn" onClick={cancelEditing}>Cancel</button>
                      </div>
                    ) : (
                      <div className="action-buttons">
                        <button className="edit-btn" onClick={() => startEditing(comic)}>Edit</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editingId && (
          <div className="description-editor">
            <h3>Edit Description</h3>
            <textarea 
              name="description" 
              value={editForm.description} 
              onChange={handleInputChange}
              rows="4"
              className="description-textarea"
            ></textarea>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage; 