import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createProduct, validateProductData, PRODUCT_CATEGORIES } from '../services/api';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    const errors = validateProductData({
      ...formData,
      price: parseFloat(formData.price)
    });
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setValidationErrors([]);
      
      const productData = {
        ...formData,
        price: parseFloat(formData.price)
      };
      
      const response = await createProduct(productData);
      
      if (response.success) {
        // Redirect to admin dashboard with success message
        navigate('/admin', { 
          state: { 
            success: `Product "${productData.name}" created successfully!` 
          }
        });
      } else {
        setError(response.message || 'Failed to create product');
        if (response.errors) {
          setValidationErrors(response.errors);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUrlChange = (e) => {
    handleInputChange(e);
    
    // Preview image if URL is valid
    const url = e.target.value;
    if (url) {
      const img = new Image();
      img.onload = () => {
        // Image loaded successfully
        setError(null);
      };
      img.onerror = () => {
        // Image failed to load
        setError('Invalid image URL or image cannot be loaded');
      };
      img.src = url;
    }
  };

  return (
    <div className="main-content">
      <div className="container">
        <div className="form-container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="page-title mb-0">Add New Product</h1>
            <Link to="/admin" className="btn btn-outline">
              Back to Dashboard
            </Link>
          </div>

          {error && (
            <div className="alert alert-error">
              <p>{error}</p>
            </div>
          )}

          {validationErrors.length > 0 && (
            <div className="alert alert-error">
              <p>Please fix the following errors:</p>
              <ul>
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                className="form-textarea"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price" className="form-label">
                Price (USD) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                className="form-input"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category *
              </label>
              <select
                id="category"
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a category</option>
                {PRODUCT_CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="imageUrl" className="form-label">
                Image URL *
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                className="form-input"
                value={formData.imageUrl}
                onChange={handleImageUrlChange}
                placeholder="https://example.com/image.jpg"
                required
              />
              {formData.imageUrl && (
                <div className="image-preview mt-2">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    style={{ 
                      maxWidth: '200px', 
                      maxHeight: '200px', 
                      objectFit: 'cover',
                      border: '1px solid #e5e5e5'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                    onLoad={(e) => {
                      e.target.style.display = 'block';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Creating...
                  </>
                ) : (
                  'Create Product'
                )}
              </button>
              <Link to="/admin" className="btn btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
