import React, { useState, useEffect } from 'react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Mock data for now - replace with actual API call
    setTimeout(() => {
      setProducts([
        {
          _id: '1',
          name: 'Sample Product 1',
          description: 'This is a sample product description',
          price: 29.99,
          category: 'Electronics',
          inStock: true
        },
        {
          _id: '2',
          name: 'Sample Product 2',
          description: 'Another sample product description',
          price: 49.99,
          category: 'Clothing',
          inStock: true
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        {error}
      </div>
    );
  }

  return (
    <div className="products-page">
      <h1>Our Products</h1>
      
      <div className="products-grid grid grid-3">
        {products.map(product => (
          <div key={product._id} className="product-card card">
            <div className="product-image">
              <div className="placeholder-image">
                No Image
              </div>
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="product-price">
                ${product.price}
              </div>
              <div className="product-category">
                Category: {product.category}
              </div>
              <div className="product-actions">
                <button className="btn btn-primary">
                  Add to Cart
                </button>
                <button className="btn btn-secondary">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center">
          <p>No products available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default Products;
