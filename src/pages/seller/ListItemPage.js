import React, { useState } from 'react';
import './ListItemPage.css';

const ListItemPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    issueNumber: '',
    publisher: '',
    author: '',
    artist: '',
    character: '',
    genre: '',
    yearPublished: '',
    condition: 'Near Mint',
    grade: '',
    description: '',
    price: '',
    quantity: 1,
    shippingOption: 'standard',
    shippingPrice: '4.99',
    availability: true
  });
  
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalImagesPreview, setAdditionalImagesPreview] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const conditionOptions = [
    'Mint', 'Near Mint', 'Very Fine', 'Fine', 'Very Good', 'Good', 'Fair', 'Poor'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCoverImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setCoverImage(selectedFile);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAdditionalImagesChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 5); // Limit to 5 files
      setAdditionalImages([...additionalImages, ...filesArray]);
      
      // Create preview URLs
      const newPreviews = filesArray.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(file);
        });
      });
      
      Promise.all(newPreviews).then(values => {
        setAdditionalImagesPreview([...additionalImagesPreview, ...values]);
      });
    }
  };

  const removeAdditionalImage = (index) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index));
    setAdditionalImagesPreview(additionalImagesPreview.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.issueNumber.trim()) newErrors.issueNumber = "Issue number is required";
    if (!formData.publisher.trim()) newErrors.publisher = "Publisher is required";
    if (!formData.price.trim()) newErrors.price = "Price is required";
    else if (isNaN(parseFloat(formData.price))) newErrors.price = "Price must be a number";
    
    if (!coverImage) newErrors.coverImage = "Cover image is required";
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setSubmitting(true);
    setErrors({});
    
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        setFormData({
          title: '',
          issueNumber: '',
          publisher: '',
          author: '',
          artist: '',
          character: '',
          genre: '',
          yearPublished: '',
          condition: 'Near Mint',
          grade: '',
          description: '',
          price: '',
          quantity: 1,
          shippingOption: 'standard',
          shippingPrice: '4.99',
          availability: true
        });
        setCoverImage(null);
        setCoverImagePreview(null);
        setAdditionalImages([]);
        setAdditionalImagesPreview([]);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="list-item-page">
      <div className="comic-panel-background"></div>
      
      <div className="list-item-header">
        <h1 className="list-item-title">List Item</h1>
        <p className="list-item-subtitle">Create a new comic listing</p>
      </div>
      
      <div className="list-item-content">
        {success ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>Listing Created Successfully!</h2>
            <p>Your comic has been added to your inventory.</p>
          </div>
        ) : (
          <form className="list-item-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2 className="section-title">Images</h2>
              
              <div className="image-upload-container">
                <div className="cover-image-upload">
                  <label className="upload-label">Cover Image (Required)</label>
                  <div 
                    className={`image-upload-area ${errors.coverImage ? 'error' : ''}`} 
                    onClick={() => document.getElementById('cover-image-input').click()}
                  >
                    {coverImagePreview ? (
                      <img src={coverImagePreview} alt="Cover Preview" className="image-preview" />
                    ) : (
                      <div className="upload-placeholder">
                        <div className="upload-icon">📷</div>
                        <p>Click to upload cover image</p>
                      </div>
                    )}
                  </div>
                  {errors.coverImage && <div className="error-message">{errors.coverImage}</div>}
                  <input 
                    type="file" 
                    id="cover-image-input" 
                    accept="image/*" 
                    onChange={handleCoverImageChange}
                    style={{ display: 'none' }}
                  />
                </div>
                
                <div className="additional-images-upload">
                  <label className="upload-label">Additional Images (Optional, max 5)</label>
                  <div className="additional-images-container">
                    {additionalImagesPreview.map((preview, index) => (
                      <div key={index} className="additional-image">
                        <img src={preview} alt={`Preview ${index}`} className="additional-image-preview" />
                        <button 
                          type="button" 
                          className="remove-image-button" 
                          onClick={() => removeAdditionalImage(index)}
                        >
                          ✖
                        </button>
                      </div>
                    ))}
                    
                    {additionalImagesPreview.length < 5 && (
                      <div 
                        className="add-image-button" 
                        onClick={() => document.getElementById('additional-images-input').click()}
                      >
                        <span>+</span>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    id="additional-images-input" 
                    accept="image/*" 
                    multiple 
                    onChange={handleAdditionalImagesChange}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h2 className="section-title">Basic Information</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Title*</label>
                  <input 
                    type="text" 
                    id="title" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange}
                    className={errors.title ? 'error' : ''}
                  />
                  {errors.title && <div className="error-message">{errors.title}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="issueNumber">Issue Number*</label>
                  <input 
                    type="text" 
                    id="issueNumber" 
                    name="issueNumber" 
                    value={formData.issueNumber} 
                    onChange={handleInputChange}
                    className={errors.issueNumber ? 'error' : ''}
                  />
                  {errors.issueNumber && <div className="error-message">{errors.issueNumber}</div>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="publisher">Publisher*</label>
                  <input 
                    type="text" 
                    id="publisher" 
                    name="publisher" 
                    value={formData.publisher} 
                    onChange={handleInputChange}
                    className={errors.publisher ? 'error' : ''}
                  />
                  {errors.publisher && <div className="error-message">{errors.publisher}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="yearPublished">Year Published</label>
                  <input 
                    type="text" 
                    id="yearPublished" 
                    name="yearPublished" 
                    value={formData.yearPublished} 
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="author">Author</label>
                  <input 
                    type="text" 
                    id="author" 
                    name="author" 
                    value={formData.author} 
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="artist">Artist</label>
                  <input 
                    type="text" 
                    id="artist" 
                    name="artist" 
                    value={formData.artist} 
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="character">Character</label>
                  <input 
                    type="text" 
                    id="character" 
                    name="character" 
                    value={formData.character} 
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="genre">Genre</label>
                  <input 
                    type="text" 
                    id="genre" 
                    name="genre" 
                    value={formData.genre} 
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h2 className="section-title">Condition & Grading</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="condition">Condition</label>
                  <select 
                    id="condition" 
                    name="condition" 
                    value={formData.condition} 
                    onChange={handleInputChange}
                  >
                    {conditionOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="grade">Grade (e.g., CGC 9.8)</label>
                  <input 
                    type="text" 
                    id="grade" 
                    name="grade" 
                    value={formData.grade} 
                    onChange={handleInputChange}
                    placeholder="CGC 9.8"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Describe the condition, special features, or any other details about this comic..."
                />
              </div>
            </div>
            
            <div className="form-section">
              <h2 className="section-title">Pricing & Shipping</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price ($)*</label>
                  <input 
                    type="text" 
                    id="price" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className={errors.price ? 'error' : ''}
                  />
                  {errors.price && <div className="error-message">{errors.price}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="quantity">Quantity</label>
                  <input 
                    type="number" 
                    id="quantity" 
                    name="quantity" 
                    value={formData.quantity} 
                    onChange={handleInputChange}
                    min="1"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="shippingOption">Shipping Option</label>
                  <select 
                    id="shippingOption" 
                    name="shippingOption" 
                    value={formData.shippingOption} 
                    onChange={handleInputChange}
                  >
                    <option value="standard">Standard Shipping</option>
                    <option value="express">Express Shipping</option>
                    <option value="free">Free Shipping</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="shippingPrice">Shipping Price ($)</label>
                  <input 
                    type="text" 
                    id="shippingPrice" 
                    name="shippingPrice" 
                    value={formData.shippingPrice} 
                    onChange={handleInputChange}
                    disabled={formData.shippingOption === 'free'}
                  />
                </div>
              </div>
              
              <div className="form-group checkbox-group">
                <input 
                  type="checkbox" 
                  id="availability" 
                  name="availability" 
                  checked={formData.availability} 
                  onChange={handleInputChange}
                />
                <label htmlFor="availability">List as available immediately</label>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="button" className="cancel-button">Cancel</button>
              <button 
                type="submit" 
                className="submit-button" 
                disabled={submitting}
              >
                {submitting ? 'Creating Listing...' : 'Create Listing'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ListItemPage; 