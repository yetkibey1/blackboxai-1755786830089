import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { adminAPI, handleApiError } from '../../services/api';

// Import admin components
import AdminOverview from './AdminOverview';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';
import AdminCategories from './AdminCategories';
import AdminSettings from './AdminSettings';
import AdminAnalytics from './AdminAnalytics';

const AdminDashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchDashboardStats();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      if (response.data.success) {
        setDashboardStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-access-denied">
        <div className="access-denied-content">
          <div className="access-denied-icon">🚫</div>
          <h2>Access Denied</h2>
          <p>You need administrator privileges to access this area.</p>
          <Link to="/login" className="btn btn-primary">
            Login as Admin
          </Link>
        </div>
      </div>
    );
  }

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/products', label: 'Products', icon: '📦' },
    { path: '/admin/categories', label: 'Categories', icon: '📁' },
    { path: '/admin/orders', label: 'Orders', icon: '🛒' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className={`admin-dashboard ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Admin Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="admin-logo">
            <span className="logo-icon">🏪</span>
            <span className="logo-text">KERVAN Admin</span>
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        <nav className="admin-nav">
          <ul className="nav-menu">
            {menuItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link 
                  to={item.path} 
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-user-info">
            <div className="user-avatar">
              {user.firstName?.charAt(0) || 'A'}
            </div>
            <div className="user-details">
              <div className="user-name">{user.firstName} {user.lastName}</div>
              <div className="user-role">Administrator</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            <button 
              className="mobile-menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <h1 className="page-title">
              {menuItems.find(item => item.path === location.pathname)?.label || 'Admin Panel'}
            </h1>
          </div>
          
          <div className="header-right">
            <div className="header-stats">
              {dashboardStats && (
                <>
                  <div className="stat-item">
                    <span className="stat-label">Products</span>
                    <span className="stat-value">{dashboardStats.totalProducts}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Orders</span>
                    <span className="stat-value">{dashboardStats.totalOrders}</span>
                  </div>
                </>
              )}
            </div>
            
            <div className="header-actions">
              <button className="btn btn-outline">
                <span>🔔</span>
                Notifications
              </button>
              <Link to="/" className="btn btn-outline">
                <span>🏠</span>
                View Site
              </Link>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <Routes>
            <Route path="/" element={<AdminOverview stats={dashboardStats} />} />
            <Route path="/products/*" element={<AdminProducts />} />
            <Route path="/categories/*" element={<AdminCategories />} />
            <Route path="/orders/*" element={<AdminOrders />} />
            <Route path="/users/*" element={<AdminUsers />} />
            <Route path="/analytics" element={<AdminAnalytics />} />
            <Route path="/settings/*" element={<AdminSettings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
