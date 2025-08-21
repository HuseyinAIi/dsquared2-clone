import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { fetchProducts, deleteProduct, formatDate } from '../services/api';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchProducts();
      
      if (response.success) {
        setProducts(response.data);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      
      const response = await deleteProduct(product.id);
      
      if (response.success) {
        setProducts(prev => prev.filter(p => p.id !== product.id));
        setSuccess(`Product "${product.name}" deleted successfully`);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to delete product');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete product');
    }
  };

  const handleEditProduct = (product) => {
    // This will be handled by React Router navigation
    window.location.href = `/admin/edit/${product.id}`;
  };

  const renderTableView = () => (
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/60x60/f8f8f8/666666?text=No+Image';
                  }}
                />
              </td>
              <td>
                <strong>{product.name}</strong>
                <br />
                <small className="text-muted">{product.description}</small>
              </td>
              <td>{product.category}</td>
              <td>${product.price}</td>
              <td>{formatDate(product.createdAt)}</td>
              <td>
                <div className="admin-actions">
                  <Link 
                    to={`/admin/edit/${product.id}`}
                    className="btn btn-outline"
                  >
                    Edit
                  </Link>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDeleteProduct(product)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderGridView = () => (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          showActions={true}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container">
        <div className="admin-header">
          <h1 className="page-title">Admin Dashboard</h1>
          <div className="d-flex gap-2">
            <div className="view-toggle">
              <button 
                className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setViewMode('grid')}
              >
                Grid
              </button>
              <button 
                className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setViewMode('table')}
              >
                Table
              </button>
            </div>
            <Link to="/admin/add" className="btn btn-primary">
              Add Product
            </Link>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <p>{error}</p>
            <button className="btn btn-primary" onClick={loadProducts}>
              Try Again
            </button>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <p>{success}</p>
          </div>
        )}

        <div className="admin-stats mb-4">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{products.length}</h3>
              <p>Total Products</p>
            </div>
            <div className="stat-card">
              <h3>{products.filter(p => p.category === 'READY TO WEAR').length}</h3>
              <p>Ready to Wear</p>
            </div>
            <div className="stat-card">
              <h3>{products.filter(p => p.category === 'NEW COLLECTION').length}</h3>
              <p>New Collection</p>
            </div>
            <div className="stat-card">
              <h3>{products.filter(p => p.category === 'SHOES').length}</h3>
              <p>Shoes</p>
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center">
            <h2>No Products Found</h2>
            <p>Start by adding your first product.</p>
            <Link to="/admin/add" className="btn btn-primary">
              Add First Product
            </Link>
          </div>
        ) : (
          <>
            {viewMode === 'table' ? renderTableView() : renderGridView()}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
