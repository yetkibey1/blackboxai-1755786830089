import React, { useContext } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-dashboard">
        <div className="alert alert-error">
          Access denied. Admin privileges required.
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user.firstName}!</p>
      </div>

      <div className="admin-content">
        <div className="admin-sidebar">
          <nav className="admin-nav">
            <ul>
              <li><Link to="/admin">Overview</Link></li>
              <li><Link to="/admin/products">Products</Link></li>
              <li><Link to="/admin/orders">Orders</Link></li>
              <li><Link to="/admin/users">Users</Link></li>
              <li><Link to="/admin/categories">Categories</Link></li>
              <li><Link to="/admin/settings">Settings</Link></li>
            </ul>
          </nav>
        </div>

        <div className="admin-main">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/products" element={<AdminProducts />} />
            <Route path="/orders" element={<AdminOrders />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/categories" element={<AdminCategories />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const AdminOverview = () => {
  return (
    <div className="admin-overview">
      <h2>Dashboard Overview</h2>
      
      <div className="stats-grid grid grid-4">
        <div className="stat-card card">
          <h3>Total Products</h3>
          <div className="stat-number">1,234</div>
          <div className="stat-change">+12% from last month</div>
        </div>
        
        <div className="stat-card card">
          <h3>Total Orders</h3>
          <div className="stat-number">567</div>
          <div className="stat-change">+8% from last month</div>
        </div>
        
        <div className="stat-card card">
          <h3>Total Users</h3>
          <div className="stat-number">890</div>
          <div className="stat-change">+15% from last month</div>
        </div>
        
        <div className="stat-card card">
          <h3>Revenue</h3>
          <div className="stat-number">$12,345</div>
          <div className="stat-change">+20% from last month</div>
        </div>
      </div>

      <div className="recent-activity">
        <div className="card">
          <h3>Recent Activity</h3>
          <ul>
            <li>New order #1234 received</li>
            <li>Product "Sample Item" updated</li>
            <li>New user registered: john@example.com</li>
            <li>Order #1233 shipped</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const AdminProducts = () => {
  return (
    <div className="admin-products">
      <div className="section-header">
        <h2>Products Management</h2>
        <button className="btn btn-primary">Add New Product</button>
      </div>
      
      <div className="card">
        <p>Product management interface will be implemented here.</p>
        <p>Features to include:</p>
        <ul>
          <li>Product listing with search and filters</li>
          <li>Add/Edit/Delete products</li>
          <li>Bulk operations</li>
          <li>Image upload</li>
          <li>Inventory management</li>
        </ul>
      </div>
    </div>
  );
};

const AdminOrders = () => {
  return (
    <div className="admin-orders">
      <h2>Orders Management</h2>
      
      <div className="card">
        <p>Order management interface will be implemented here.</p>
        <p>Features to include:</p>
        <ul>
          <li>Order listing with status filters</li>
          <li>Order details view</li>
          <li>Status updates</li>
          <li>Shipping management</li>
          <li>Invoice generation</li>
        </ul>
      </div>
    </div>
  );
};

const AdminUsers = () => {
  return (
    <div className="admin-users">
      <h2>Users Management</h2>
      
      <div className="card">
        <p>User management interface will be implemented here.</p>
        <p>Features to include:</p>
        <ul>
          <li>User listing with search</li>
          <li>User details and edit</li>
          <li>Role management</li>
          <li>Account activation/deactivation</li>
          <li>User analytics</li>
        </ul>
      </div>
    </div>
  );
};

const AdminCategories = () => {
  return (
    <div className="admin-categories">
      <div className="section-header">
        <h2>Categories Management</h2>
        <button className="btn btn-primary">Add New Category</button>
      </div>
      
      <div className="card">
        <p>Category management interface will be implemented here.</p>
        <p>Features to include:</p>
        <ul>
          <li>Category tree view</li>
          <li>Add/Edit/Delete categories</li>
          <li>Drag and drop reordering</li>
          <li>Category images</li>
          <li>SEO settings</li>
        </ul>
      </div>
    </div>
  );
};

const AdminSettings = () => {
  return (
    <div className="admin-settings">
      <h2>System Settings</h2>
      
      <div className="card">
        <p>System settings interface will be implemented here.</p>
        <p>Features to include:</p>
        <ul>
          <li>General site settings</li>
          <li>Payment gateway configuration</li>
          <li>Email settings</li>
          <li>Tax and shipping settings</li>
          <li>Security settings</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
