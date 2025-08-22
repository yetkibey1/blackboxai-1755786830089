import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { productAPI, categoryAPI, handleApiError } from '../services/api';
import { CartContext } from '../contexts/CartContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
    page: 1,
    limit: 12
  });

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useContext(CartContext);

  // Initialize filters from URL params
  useEffect(() => {
    const urlFilters = {
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sort: searchParams.get('sort') || 'newest',
      page: parseInt(searchParams.get('page')) || 1,
      limit: parseInt(searchParams.get('limit')) || 12
    };
    setFilters(urlFilters);
  }, [searchParams]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getCategories();
        if (response.data.success) {
          setCategories(response.data.data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      
      try {
        const response = await productAPI.getProducts(filters);
        
        if (response.data.success) {
          setProducts(response.data.data.products);
          setPagination(response.data.data.pagination);
        } else {
          setError(response.data.message || 'Failed to fetch products');
        }
      } catch (error) {
        const errorInfo = handleApiError(error);
        setError(errorInfo.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  // Update URL when filters change
  const updateFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    
    // Update URL
    const params = new URLSearchParams();
    Object.keys(updatedFilters).forEach(key => {
      if (updatedFilters[key] && updatedFilters[key] !== '') {
        params.set(key, updatedFilters[key]);
      }
    });
    setSearchParams(params);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    const updatedFilters = { ...filters, page: newPage };
    setFilters(updatedFilters);
    
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage);
    setSearchParams(params);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle add to cart
  const handleAddToCart = (product) => {
    addToCart(product, 1);
    // Show success message (you can implement a toast notification here)
    alert(`${product.name} added to cart!`);
  };

  // Handle view details
  const handleViewDetails = (product) => {
    navigate(`/products/${product.slug || product._id}`);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page">
        <div className="alert alert-error">
          <h3>Error Loading Products</h3>
          <p>{error}</p>
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Our Products</h1>
        <p>Discover our wide range of wholesale products</p>
      </div>

      {/* Filters Section */}
      <div className="products-filters card">
        <div className="filters-row">
          <div className="filter-group">
            <label htmlFor="search">Search Products:</label>
            <input
              type="text"
              id="search"
              placeholder="Search by name, code, or description..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              value={filters.category}
              onChange={(e) => updateFilters({ category: e.target.value })}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name?.en || category.name?.ka || category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort">Sort By:</label>
            <select
              id="sort"
              value={filters.sort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name_asc">Name A-Z</option>
              <option value="name_desc">Name Z-A</option>
              <option value="price_asc">Price Low to High</option>
              <option value="price_desc">Price High to Low</option>
              <option value="featured">Featured</option>
            </select>
          </div>
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <label htmlFor="minPrice">Min Price:</label>
            <input
              type="number"
              id="minPrice"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => updateFilters({ minPrice: e.target.value })}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="maxPrice">Max Price:</label>
            <input
              type="number"
              id="maxPrice"
              placeholder="1000"
              value={filters.maxPrice}
              onChange={(e) => updateFilters({ maxPrice: e.target.value })}
            />
          </div>

          <div className="filter-group">
            <button 
              className="btn btn-secondary"
              onClick={() => {
                setFilters({
                  search: '',
                  category: '',
                  minPrice: '',
                  maxPrice: '',
                  sort: 'newest',
                  page: 1,
                  limit: 12
                });
                setSearchParams({});
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Info */}
      {pagination.totalItems > 0 && (
        <div className="products-info">
          <p>
            Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} products
          </p>
        </div>
      )}

      {/* Products Grid */}
      <div className="products-grid grid grid-3">
        {products.map(product => (
          <div key={product._id} className="product-card card">
            <div className="product-image">
              {product.images && product.images.length > 0 ? (
                <img 
                  src={product.images.find(img => img.isPrimary)?.url || product.images[0]?.url} 
                  alt={product.images.find(img => img.isPrimary)?.alt || product.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="placeholder-image" style={{ display: (!product.images || product.images.length === 0) ? 'flex' : 'none' }}>
                No Image
              </div>
              {product.featured && (
                <div className="product-badge featured">Featured</div>
              )}
              {!product.inStock && (
                <div className="product-badge out-of-stock">Out of Stock</div>
              )}
            </div>
            
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              
              <div className="product-price">
                {product.price} {product.currency || 'GEL'}
              </div>
              
              {product.category && (
                <div className="product-category">
                  Category: {product.category.name?.en || product.category.name?.ka || product.category.name}
                </div>
              )}
              
              <div className="product-meta">
                <span className="product-code">Code: {product.code}</span>
                {product.stock !== undefined && (
                  <span className="product-stock">Stock: {product.stock}</span>
                )}
              </div>
              
              <div className="product-actions">
                <button 
                  className={`btn ${product.inStock ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                >
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => handleViewDetails(product)}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Products Message */}
      {products.length === 0 && !loading && (
        <div className="no-products text-center">
          <h3>No products found</h3>
          <p>Try adjusting your search criteria or browse all products.</p>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setFilters({
                search: '',
                category: '',
                minPrice: '',
                maxPrice: '',
                sort: 'newest',
                page: 1,
                limit: 12
              });
              setSearchParams({});
            }}
          >
            View All Products
          </button>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button 
            className="btn btn-secondary"
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage}
          >
            Previous
          </button>
          
          <div className="pagination-info">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
          
          <button 
            className="btn btn-secondary"
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
