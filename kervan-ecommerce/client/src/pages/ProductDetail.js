import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    // Mock data for now - replace with actual API call
    setTimeout(() => {
      setProduct({
        _id: id,
        name: `Product ${id}`,
        description: 'This is a detailed product description with more information about the product features, specifications, and benefits.',
        price: 29.99,
        category: 'Electronics',
        inStock: true,
        stockQuantity: 50,
        images: [],
        specifications: {
          'Brand': 'KERVAN',
          'Model': `KRV-${id}`,
          'Warranty': '1 Year',
          'Color': 'Black'
        }
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      alert('Product added to cart!');
    }
  };

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

  if (!product) {
    return (
      <div className="alert alert-error">
        Product not found
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-images">
          <div className="main-image">
            <div className="placeholder-image">
              No Image Available
            </div>
          </div>
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>
          <div className="product-price">
            <span className="price">${product.price}</span>
          </div>
          
          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-specifications">
            <h3>Specifications</h3>
            <ul>
              {Object.entries(product.specifications).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {value}
                </li>
              ))}
            </ul>
          </div>

          <div className="product-actions">
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                min="1"
                max={product.stockQuantity}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
            </div>

            <div className="action-buttons">
              <button 
                className="btn btn-primary"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>

          <div className="product-meta">
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Stock:</strong> {product.stockQuantity} available</p>
            <p><strong>SKU:</strong> KRV-{product._id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
