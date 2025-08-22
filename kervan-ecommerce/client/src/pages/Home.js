import React from 'react';

const Home = () => {
  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to KERVAN</h1>
          <p>Your Complete Wholesale E-commerce Platform</p>
          <div className="hero-buttons">
            <a href="/products" className="btn btn-primary">
              Browse Products
            </a>
            <a href="/register" className="btn btn-secondary">
              Get Started
            </a>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2>Why Choose KERVAN?</h2>
          <div className="grid grid-3">
            <div className="feature-card card">
              <h3>Wholesale Pricing</h3>
              <p>Get the best wholesale prices for bulk orders with competitive rates.</p>
            </div>
            <div className="feature-card card">
              <h3>Multi-Language Support</h3>
              <p>Available in Georgian, English, and Turkish for your convenience.</p>
            </div>
            <div className="feature-card card">
              <h3>Secure Platform</h3>
              <p>Advanced security features to protect your business transactions.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="container">
          <div className="grid grid-4">
            <div className="stat-item text-center">
              <h3>1000+</h3>
              <p>Products</p>
            </div>
            <div className="stat-item text-center">
              <h3>500+</h3>
              <p>Happy Customers</p>
            </div>
            <div className="stat-item text-center">
              <h3>50+</h3>
              <p>Categories</p>
            </div>
            <div className="stat-item text-center">
              <h3>24/7</h3>
              <p>Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
