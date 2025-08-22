import React, { useState, useEffect } from 'react';
import { adminAPI, handleApiError } from '../../services/api';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    overview: {},
    sales: [],
    topProducts: [],
    topCategories: [],
    userGrowth: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAnalytics({ period: dateRange });
      if (response.data.success) {
        setAnalytics(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
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

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="admin-analytics loading">
        <div className="loading-spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="admin-analytics">
      <div className="section-header">
        <h2>Analytics & Reports</h2>
        <div className="date-range-selector">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="analytics-overview">
        <div className="metrics-grid">
          <div className="metric-card revenue">
            <div className="metric-icon">💰</div>
            <div className="metric-content">
              <div className="metric-value">
                {formatCurrency(analytics.overview.totalRevenue || 0)}
              </div>
              <div className="metric-label">Total Revenue</div>
              <div className={`metric-change ${analytics.overview.revenueChange >= 0 ? 'positive' : 'negative'}`}>
                {formatPercentage(analytics.overview.revenueChange || 0)} vs previous period
              </div>
            </div>
          </div>

          <div className="metric-card orders">
            <div className="metric-icon">🛒</div>
            <div className="metric-content">
              <div className="metric-value">{analytics.overview.totalOrders || 0}</div>
              <div className="metric-label">Total Orders</div>
              <div className={`metric-change ${analytics.overview.ordersChange >= 0 ? 'positive' : 'negative'}`}>
                {formatPercentage(analytics.overview.ordersChange || 0)} vs previous period
              </div>
            </div>
          </div>

          <div className="metric-card customers">
            <div className="metric-icon">👥</div>
            <div className="metric-content">
              <div className="metric-value">{analytics.overview.newCustomers || 0}</div>
              <div className="metric-label">New Customers</div>
              <div className={`metric-change ${analytics.overview.customersChange >= 0 ? 'positive' : 'negative'}`}>
                {formatPercentage(analytics.overview.customersChange || 0)} vs previous period
              </div>
            </div>
          </div>

          <div className="metric-card conversion">
            <div className="metric-icon">📈</div>
            <div className="metric-content">
              <div className="metric-value">{(analytics.overview.conversionRate || 0).toFixed(1)}%</div>
              <div className="metric-label">Conversion Rate</div>
              <div className={`metric-change ${analytics.overview.conversionChange >= 0 ? 'positive' : 'negative'}`}>
                {formatPercentage(analytics.overview.conversionChange || 0)} vs previous period
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="analytics-content">
        {/* Sales Chart */}
        <div className="analytics-card sales-chart">
          <div className="card-header">
            <h3>Sales Overview</h3>
          </div>
          <div className="card-content">
            <div className="chart-placeholder">
              <div className="chart-info">
                <p>📊 Sales chart visualization would be implemented here</p>
                <p>Integration with Chart.js or similar library recommended</p>
              </div>
              
              {/* Simple data display for now */}
              <div className="sales-summary">
                <div className="summary-item">
                  <span className="label">Average Order Value:</span>
                  <span className="value">{formatCurrency(analytics.overview.averageOrderValue || 0)}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Total Products Sold:</span>
                  <span className="value">{analytics.overview.totalProductsSold || 0}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Return Rate:</span>
                  <span className="value">{(analytics.overview.returnRate || 0).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="analytics-card top-products">
          <div className="card-header">
            <h3>Top Selling Products</h3>
          </div>
          <div className="card-content">
            {analytics.topProducts && analytics.topProducts.length > 0 ? (
              <div className="top-items-list">
                {analytics.topProducts.map((product, index) => (
                  <div key={product._id} className="top-item">
                    <div className="item-rank">#{index + 1}</div>
                    <div className="item-info">
                      <div className="item-name">{product.name}</div>
                      <div className="item-stats">
                        {product.totalSold} sold • {formatCurrency(product.totalRevenue)}
                      </div>
                    </div>
                    <div className="item-progress">
                      <div 
                        className="progress-bar"
                        style={{ width: `${(product.totalSold / analytics.topProducts[0].totalSold) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No sales data available for this period</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Categories */}
        <div className="analytics-card top-categories">
          <div className="card-header">
            <h3>Top Categories</h3>
          </div>
          <div className="card-content">
            {analytics.topCategories && analytics.topCategories.length > 0 ? (
              <div className="top-items-list">
                {analytics.topCategories.map((category, index) => (
                  <div key={category._id} className="top-item">
                    <div className="item-rank">#{index + 1}</div>
                    <div className="item-info">
                      <div className="item-name">{category.name}</div>
                      <div className="item-stats">
                        {category.totalOrders} orders • {formatCurrency(category.totalRevenue)}
                      </div>
                    </div>
                    <div className="item-progress">
                      <div 
                        className="progress-bar"
                        style={{ width: `${(category.totalRevenue / analytics.topCategories[0].totalRevenue) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No category data available for this period</p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Insights */}
        <div className="analytics-card customer-insights">
          <div className="card-header">
            <h3>Customer Insights</h3>
          </div>
          <div className="card-content">
            <div className="insights-grid">
              <div className="insight-item">
                <div className="insight-icon">🎯</div>
                <div className="insight-content">
                  <div className="insight-value">{analytics.overview.repeatCustomerRate || 0}%</div>
                  <div className="insight-label">Repeat Customer Rate</div>
                </div>
              </div>
              
              <div className="insight-item">
                <div className="insight-icon">⏱️</div>
                <div className="insight-content">
                  <div className="insight-value">{analytics.overview.avgSessionDuration || 0}m</div>
                  <div className="insight-label">Avg Session Duration</div>
                </div>
              </div>
              
              <div className="insight-item">
                <div className="insight-icon">📱</div>
                <div className="insight-content">
                  <div className="insight-value">{analytics.overview.mobileTraffic || 0}%</div>
                  <div className="insight-label">Mobile Traffic</div>
                </div>
              </div>
              
              <div className="insight-item">
                <div className="insight-icon">🌍</div>
                <div className="insight-content">
                  <div className="insight-value">{analytics.overview.topCountry || 'N/A'}</div>
                  <div className="insight-label">Top Country</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="analytics-card recent-activity">
          <div className="card-header">
            <h3>Recent Activity</h3>
          </div>
          <div className="card-content">
            {analytics.recentActivity && analytics.recentActivity.length > 0 ? (
              <div className="activity-list">
                {analytics.recentActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">
                      {activity.type === 'order' && '🛒'}
                      {activity.type === 'user' && '👤'}
                      {activity.type === 'product' && '📦'}
                      {activity.type === 'review' && '⭐'}
                    </div>
                    <div className="activity-content">
                      <div className="activity-description">{activity.description}</div>
                      <div className="activity-time">{activity.timeAgo}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
