import React from 'react';
import { formatPrice } from '../services/api';

const ProductCard = ({ product, showActions = false, onEdit, onDelete }) => {
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/400x500/f8f8f8/666666?text=No+Image';
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-image"
          onError={handleImageError}
          loading="lazy"
        />
        {!showActions && (
          <div className="product-overlay">
            <div className="product-actions">
              <button className="product-action-btn" title="Add to Wishlist">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
              <button className="product-action-btn" title="Add to Cart">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{formatPrice(product.price)}</p>
        
        {showActions && (
          <>
            <p className="product-description">{product.description}</p>
            <div className="admin-actions">
              <button 
                className="btn btn-outline"
                onClick={() => onEdit && onEdit(product)}
              >
                Edit
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => onDelete && onDelete(product)}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
