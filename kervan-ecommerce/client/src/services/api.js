import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const productAPI = {
  // Get all products with filters and pagination
  getProducts: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    
    return api.get(`/products?${queryParams.toString()}`);
  },
  
  // Get single product by ID or slug
  getProduct: (id) => api.get(`/products/${id}`),
  
  // Create product (admin only)
  createProduct: (productData) => api.post('/products', productData),
  
  // Update product (admin only)
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  
  // Delete product (admin only)
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

export const categoryAPI = {
  // Get all categories
  getCategories: () => api.get('/categories'),
  
  // Get single category
  getCategory: (id) => api.get(`/categories/${id}`),
  
  // Create category (admin only)
  createCategory: (categoryData) => api.post('/categories', categoryData),
  
  // Update category (admin only)
  updateCategory: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  
  // Delete category (admin only)
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

export const authAPI = {
  // Login
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Register
  register: (userData) => api.post('/auth/register', userData),
  
  // Get current user
  getMe: () => api.get('/auth/me'),
  
  // Update profile
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  
  // Change password
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
  
  // Logout
  logout: () => api.post('/auth/logout'),
};

export const orderAPI = {
  // Get user orders
  getOrders: () => api.get('/orders'),
  
  // Get single order
  getOrder: (id) => api.get(`/orders/${id}`),
  
  // Create order
  createOrder: (orderData) => api.post('/orders', orderData),
  
  // Update order status (admin only)
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard'),
  
  // Products
  getAllProducts: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    return api.get(`/admin/products?${queryParams.toString()}`);
  },
  getLowStockProducts: () => api.get('/admin/products/low-stock'),
  
  // Orders
  getAllOrders: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    return api.get(`/admin/orders?${queryParams.toString()}`);
  },
  updateOrderStatus: (orderId, status) => api.put(`/admin/orders/${orderId}/status`, { status }),
  
  // Users
  getAllUsers: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    return api.get(`/admin/users?${queryParams.toString()}`);
  },
  updateUserStatus: (userId, status) => api.put(`/admin/users/${userId}/status`, { status }),
  updateUserRole: (userId, role) => api.put(`/admin/users/${userId}/role`, { role }),
  
  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (settings) => api.put('/admin/settings', settings),
  
  // Analytics
  getAnalytics: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    return api.get(`/admin/analytics?${queryParams.toString()}`);
  }
};

// Utility functions
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || 'An error occurred';
    return {
      success: false,
      message,
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      status: 0
    };
  } else {
    // Something else happened
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      status: 0
    };
  }
};

export default api;
