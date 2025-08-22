import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI, handleApiError } from '../services/api';
import { CartContext } from '../contexts/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      
      try {
        const response = await productAPI.getProduct(id);
        
        if (response.data.success) {
          setProduct(response.data.data.product);
        } else {
          setError(response.data.message || 'Product not found');
        }
      } catch (error) {
        const errorInfo = handleApiError(error);
        setError(errorInfo.message);
        
        if (errorInfo.status === 404) {
          // Product not found, redirect to products page after a delay
          setTimeout(() => {
            navigate('/products');
          }, 3000);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      addToCart(product, quantity);
      alert(`${quantity} x ${product.name} added to cart!`);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    const qty = Math.max(1, Math.min(newQuantity, product.inventory.stock));
    setQuantity(qty);
  };

  const handleImageSelect = (index) => {
    setSelectedImage(index);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-page">
        <div className="alert alert-error">
          <h3>Error Loading Product</h3>
          <p>{error}</p>
          <div className="error-actions">
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/products')}
            >
              Back to Products
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="alert alert-error">
          <h3>Product Not Found</h3>
          <p>The product you're looking for doesn't exist or has been removed.</p>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/products')}
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <button onClick={() => navigate('/products')} className="breadcrumb-link">
          Products
        </button>
        <span className="breadcrumb-separator"> / </span>
        {product.category && (
          <>
            <span>{product.category.name?.en || product.category.name?.ka || product.category.name}</span>
            <span className="breadcrumb-separator"> / </span>
          </>
        )}
        <span className="breadcrumb-current">{product.name}</span>
      </div>

      <div className="product-detail-container">
        {/* Product Images */}
        <div className="product-images">
          <div className="main-image">
            {product.images && product.images.length > 0 ? (
              <img 
                src={product.images[selectedImage]?.url} 
                alt={product.images[selectedImage]?.alt || product.name}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="placeholder-image" 
              style={{ display: (!product.images || product.images.length === 0) ? 'flex' : 'none' }}
            >
              No Image Available
            </div>
          </div>
          
          {/* Image Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="image-thumbnails">
              {product.images.map((image, index) => (
                <div 
                  key={index}
                  className={`thumbnail ${index === selectedImage ? 'active' : ''}`}
                  onClick={() => handleImageSelect(index)}
                >
                  <img 
                    src={image.url} 
                    alt={image.alt || `${product.name} ${index + 1}`}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="product-info">
          <div className="product-header">
            <h1>{product.name}</h1>
            {product.featured && (
              <span className="product-badge featured">Featured</span>
            )}
          </div>

          <div className="product-price">
            <span className="price">{product.pricing.price} {product.pricing.currency}</span>
            {product.pricing.price2 && (
              <span className="price-secondary">Bulk: {product.pricing.price2} {product.pricing.currency}</span>
            )}
          </div>

          <div className="product-meta">
            <div className="meta-item">
              <strong>Product Code:</strong> {product.code}
            </div>
            {product.barcode && (
              <div className="meta-item">
                <strong>Barcode:</strong> {product.barcode}
              </div>
            )}
            {product.category && (
              <div className="meta-item">
                <strong>Category:</strong> {product.category.name?.en || product.category.name?.ka || product.category.name}
              </div>
            )}
            <div className="meta-item">
              <strong>Stock:</strong> 
              <span className={`stock-status ${product.inventory.inStock ? 'in-stock' : 'out-of-stock'}`}>
                {product.inventory.inStock ? `${product.inventory.stock} available` : 'Out of Stock'}
              </span>
            </div>
          </div>
          
          {/* Description */}
          {product.description && (
            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
          )}

          {/* Quantity Discounts */}
          {product.quantityDiscounts && product.quantityDiscounts.length > 0 && (
            <div className="quantity-discounts">
              <h3>Quantity Discounts</h3>
              <div className="discount-table">
                {product.quantityDiscounts.map((discount, index) => (
                  <div key={index} className="discount-row">
                    <span>
                      {discount.minQuantity}
                      {discount.maxQuantity ? `-${discount.maxQuantity}` : '+'} units
                    </span>
                    <span>{discount.price} {product.pricing.currency} each</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="product-specifications">
              <h3>Specifications</h3>
              <div className="specifications-grid">
                {Object.entries(product.specifications).map(([key, value]) => {
                  if (value && typeof value === 'object') {
                    return Object.entries(value).map(([subKey, subValue]) => (
                      subValue && (
                        <div key={`${key}-${subKey}`} className="spec-item">
                          <strong>{key} {subKey}:</strong> {subValue}
                        </div>
                      )
                    ));
                  }
                  return value && (
                    <div key={key} className="spec-item">
                      <strong>{key}:</strong> {value}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="product-tags">
              <h3>Tags</h3>
              <div className="tags-list">
                {product.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Section */}
          <div className="product-actions">
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <div className="quantity-controls">
                <button 
                  type="button"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="btn btn-secondary"
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={product.inventory.stock}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                />
                <button 
                  type="button"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.inventory.stock}
                  className="btn btn-secondary"
                >
                  +
                </button>
              </div>
            </div>

            <div className="action-buttons">
              <button 
                className="btn btn-primary"
                onClick={handleAddToCart}
                disabled={!product.inventory.inStock || quantity <= 0}
              >
                {product.inventory.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/products')}
              >
                Back to Products
              </button>
            </div>
          </div>

          {/* Product Rating */}
          {product.ratings && product.ratings.count > 0 && (
            <div className="product-rating">
              <h3>Customer Rating</h3>
              <div className="rating-display">
                <span className="rating-stars">
                  {'★'.repeat(Math.floor(product.ratings.average))}
                  {'☆'.repeat(5 - Math.floor(product.ratings.average))}
                </span>
                <span className="rating-text">
                  {product.ratings.average.toFixed(1)} out of 5 ({product.ratings.count} reviews)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <div className="related-products">
          <h3>Related Products</h3>
          <div className="related-products-grid">
            {product.relatedProducts.map((relatedProduct) => (
              <div 
                key={relatedProduct._id} 
                className="related-product-card"
                onClick={() => navigate(`/products/${relatedProduct.slug || relatedProduct._id}`)}
              >
                {relatedProduct.images && relatedProduct.images.length > 0 ? (
                  <img 
                    src={relatedProduct.images[0].url} 
                    alt={relatedProduct.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="placeholder-image" style={{ display: (!relatedProduct.images || relatedProduct.images.length === 0) ? 'flex' : 'none' }}>
                  No Image
                </div>
                <div className="related-product-info">
                  <h4>{relatedProduct.name}</h4>
                  <p className="related-product-price">
                    {relatedProduct.pricing?.price1} {relatedProduct.pricing?.currency}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
