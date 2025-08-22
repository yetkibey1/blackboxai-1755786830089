import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI, handleApiError } from '../../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllOrders(filters);
      if (response.data.success) {
        setOrders(response.data.data.orders);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
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
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-orders">
      <div className="section-header">
        <h2>Orders Management</h2>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-label">Total Orders</span>
            <span className="stat-value">{pagination.totalItems || 0}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section card">
        <div className="filters-row">
          <div className="filter-group">
            <input
              type="text"
              placeholder="Search orders..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
            />
          </div>
          
          <div className="filter-group">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-table card">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading orders...</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>
                      <Link to={`/admin/orders/${order._id}`} className="order-link">
                        #{order.orderNumber}
                      </Link>
                    </td>
                    <td>
                      <div className="customer-info">
                        <div className="customer-name">
                          {order.customer?.firstName} {order.customer?.lastName}
                        </div>
                        <div className="customer-email">{order.customer?.email}</div>
                      </div>
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{order.items?.length || 0} items</td>
                    <td className="order-total">
                      {formatCurrency(order.pricing?.total || 0)}
                    </td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className={`status-select status-${order.status}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/admin/orders/${order._id}`} className="btn btn-sm btn-secondary">
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {orders.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No orders found</h3>
                <p>No orders match your current filters.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={!pagination.hasPrevPage}
            className="btn btn-secondary"
          >
            Previous
          </button>
          
          <span className="pagination-info">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button 
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={!pagination.hasNextPage}
            className="btn btn-secondary"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
