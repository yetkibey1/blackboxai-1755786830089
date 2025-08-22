import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI, handleApiError } from '../../services/api';

const AdminOverview = ({ stats }) => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      
      // Fetch recent orders
      const ordersResponse = await adminAPI.getAllOrders({ limit: 5, sort: 'newest' });
      if (ordersResponse.data.success) {
        setRecentOrders(ordersResponse.data.data.orders);
      }

      // Fetch recent users
      const usersResponse = await adminAPI.getAllUsers({ limit: 5, sort: 'newest' });
      if (usersResponse.data.success) {
        setRecentUsers(usersResponse.data.data.users);
      }

      // Fetch low stock products
      const productsResponse = await adminAPI.getLowStockProducts();
      if (productsResponse.data.success) {
        setLowStockProducts(productsResponse.data.data.products);
      }
    } catch (error) {
      console.error('Error fetching overview data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ka-GE', {
      style: 'currency',
      currency: 'GEL'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="admin-overview loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-overview">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h2>Welcome back! 👋</h2>
          <p>Here's what's happening with your store today.</p>
        </div>
        <div className="quick-actions">
          <Link to="/admin/products/new" className="btn btn-primary">
            <span>➕</span> Add Product
          </Link>
          <Link to="/admin/orders" className="btn btn-outline">
            <span>📋</span> View Orders
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(stats?.totalRevenue || 0)}</div>
            <div className="stat-label">Total Revenue</div>
            <div className="stat-change positive">
              <span>📈</span> +12.5% from last month
            </div>
          </div>
        </div>

        <div className="stat-card orders">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <div className="stat-value">{stats?.totalOrders || 0}</div>
            <div className="stat-label">Total Orders</div>
            <div className="stat-change positive">
              <span>📈</span> +8.3% from last month
            </div>
          </div>
        </div>

        <div className="stat-card products">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-value">{stats?.totalProducts || 0}</div>
            <div className="stat-label">Total Products</div>
            <div className="stat-change neutral">
              <span>➡️</span> +2 new this week
            </div>
          </div>
        </div>

        <div className="stat-card users">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{stats?.totalUsers || 0}</div>
            <div className="stat-label">Total Users</div>
            <div className="stat-change positive">
              <span>📈</span> +15.2% from last month
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Recent Orders */}
        <div className="overview-card recent-orders">
          <div className="card-header">
            <h3>Recent Orders</h3>
            <Link to="/admin/orders" className="view-all-link">View All</Link>
          </div>
          <div className="card-content">
            {recentOrders.length > 0 ? (
              <div className="orders-list">
                {recentOrders.map((order) => (
                  <div key={order._id} className="order-item">
                    <div className="order-info">
                      <div className="order-number">#{order.orderNumber}</div>
                      <div className="order-customer">{order.customer?.name || 'Guest'}</div>
                      <div className="order-date">{formatDate(order.createdAt)}</div>
                    </div>
                    <div className="order-details">
                      <div className="order-total">{formatCurrency(order.pricing?.total || 0)}</div>
                      <div className={`order-status status-${order.status}`}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <p>No recent orders</p>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="overview-card low-stock">
          <div className="card-header">
            <h3>Low Stock Alert</h3>
            <Link to="/admin/products?filter=low-stock" className="view-all-link">View All</Link>
          </div>
          <div className="card-content">
            {lowStockProducts.length > 0 ? (
              <div className="stock-list">
                {lowStockProducts.slice(0, 5).map((product) => (
                  <div key={product._id} className="stock-item">
                    <div className="product-info">
                      <div className="product-name">{product.name}</div>
                      <div className="product-code">Code: {product.code}</div>
                    </div>
                    <div className="stock-info">
                      <div className={`stock-level ${product.inventory.stock <= 5 ? 'critical' : 'low'}`}>
                        {product.inventory.stock} left
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">✅</div>
                <p>All products are well stocked</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="overview-card recent-users">
          <div className="card-header">
            <h3>New Users</h3>
            <Link to="/admin/users" className="view-all-link">View All</Link>
          </div>
          <div className="card-content">
            {recentUsers.length > 0 ? (
              <div className="users-list">
                {recentUsers.map((user) => (
                  <div key={user._id} className="user-item">
                    <div className="user-avatar">
                      {user.firstName?.charAt(0) || 'U'}
                    </div>
                    <div className="user-info">
                      <div className="user-name">{user.firstName} {user.lastName}</div>
                      <div className="user-email">{user.email}</div>
                      <div className="user-date">{formatDate(user.createdAt)}</div>
                    </div>
                    <div className={`user-status status-${user.status}`}>
                      {user.status}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <p>No new users</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="overview-card quick-stats">
          <div className="card-header">
            <h3>Today's Summary</h3>
          </div>
          <div className="card-content">
            <div className="quick-stats-grid">
              <div className="quick-stat">
                <div className="quick-stat-icon">🛒</div>
                <div className="quick-stat-content">
                  <div className="quick-stat-value">{stats?.todayOrders || 0}</div>
                  <div className="quick-stat-label">Orders Today</div>
                </div>
              </div>
              
              <div className="quick-stat">
                <div className="quick-stat-icon">💰</div>
                <div className="quick-stat-content">
                  <div className="quick-stat-value">{formatCurrency(stats?.todayRevenue || 0)}</div>
                  <div className="quick-stat-label">Revenue Today</div>
                </div>
              </div>
              
              <div className="quick-stat">
                <div className="quick-stat-icon">👥</div>
                <div className="quick-stat-content">
                  <div className="quick-stat-value">{stats?.todayUsers || 0}</div>
                  <div className="quick-stat-label">New Users</div>
                </div>
              </div>
              
              <div className="quick-stat">
                <div className="quick-stat-icon">📦</div>
                <div className="quick-stat-content">
                  <div className="quick-stat-value">{stats?.pendingOrders || 0}</div>
                  <div className="quick-stat-label">Pending Orders</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
