import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../services/api';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [displayedCount, setDisplayedCount] = useState(0);

  const ITEMS_PER_LOAD = 12;

  useEffect(() => {
    loadInitialProducts();
  }, []);

  const loadInitialProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchProducts({ limit: ITEMS_PER_LOAD, offset: 0 });
      
      if (response.success) {
        setProducts(response.data);
        setDisplayedCount(response.data.length);
        setHasMore(response.data.length < response.total);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreProducts = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      setError(null);
      
      const response = await fetchProducts({ 
        limit: ITEMS_PER_LOAD, 
        offset: displayedCount 
      });
      
      if (response.success) {
        setProducts(prev => [...prev, ...response.data]);
        setDisplayedCount(prev => prev + response.data.length);
        setHasMore(displayedCount + response.data.length < response.total);
      } else {
        setError('Failed to load more products');
      }
    } catch (err) {
      setError(err.message || 'Failed to load more products');
    } finally {
      setLoadingMore(false);
    }
  };

  const groupProductsByCategory = (products) => {
    const grouped = products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {});

    return grouped;
  };

  const renderProductSection = (title, products) => {
    if (!products || products.length === 0) return null;

    return (
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
          <a href="#" className="view-all">VIEW ALL</a>
        </div>
        <div className="product-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    );
  };

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

  if (error && products.length === 0) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="alert alert-error">
            <p>{error}</p>
            <button className="btn btn-primary" onClick={loadInitialProducts}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const groupedProducts = groupProductsByCategory(products);
  const totalProducts = products.length;

  return (
    <div className="main-content">
      <div className="container">
        <h1 className="page-title">MEN</h1>
        
        {error && (
          <div className="alert alert-error">
            <p>{error}</p>
          </div>
        )}

        {/* Ready to Wear Section */}
        {renderProductSection('READY TO WEAR', groupedProducts['READY TO WEAR'])}

        {/* New Collection Section */}
        {renderProductSection('NEW COLLECTION', groupedProducts['NEW COLLECTION'])}

        {/* Shoes Section */}
        {renderProductSection('SHOES', groupedProducts['SHOES'])}

        {/* Load More Section */}
        {totalProducts > 0 && (
          <div className="load-more-container">
            <p className="products-count">
              YOU'VE VIEWED {displayedCount} OF {totalProducts} PRODUCTS
            </p>
            
            {hasMore && (
              <button 
                className="btn btn-primary"
                onClick={loadMoreProducts}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <>
                    <span className="loading-spinner"></span>
                    LOADING...
                  </>
                ) : (
                  `LOAD ${Math.min(ITEMS_PER_LOAD, totalProducts - displayedCount)} MORE`
                )}
              </button>
            )}
          </div>
        )}

        {/* Empty State */}
        {totalProducts === 0 && !loading && (
          <div className="text-center">
            <h2>No Products Available</h2>
            <p>Check back later for new arrivals.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
