import React, { useState, useEffect } from 'react';
import { categoryAPI, handleApiError } from '../../services/api';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: { en: '', ka: '', tr: '' },
    description: { en: '', ka: '', tr: '' },
    slug: '',
    parent: '',
    status: 'active',
    featured: false,
    sortOrder: 0
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryAPI.getCategories();
      if (response.data.success) {
        setCategories(response.data.data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryAPI.updateCategory(editingCategory._id, formData);
      } else {
        await categoryAPI.createCategory(formData);
      }
      
      setShowForm(false);
      setEditingCategory(null);
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.nameMultilingual || { en: category.name, ka: '', tr: '' },
      description: category.descriptionMultilingual || { en: category.description || '', ka: '', tr: '' },
      slug: category.slug,
      parent: category.parent?._id || '',
      status: category.status,
      featured: category.featured || false,
      sortOrder: category.sortOrder || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryAPI.deleteCategory(categoryId);
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: { en: '', ka: '', tr: '' },
      description: { en: '', ka: '', tr: '' },
      slug: '',
      parent: '',
      status: 'active',
      featured: false,
      sortOrder: 0
    });
  };

  const generateSlug = (name) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (lang, value) => {
    setFormData(prev => ({
      ...prev,
      name: { ...prev.name, [lang]: value },
      slug: lang === 'en' ? generateSlug(value) : prev.slug
    }));
  };

  return (
    <div className="admin-categories">
      <div className="section-header">
        <h2>Categories Management</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          <span>➕</span> Add New Category
        </button>
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
              <button 
                onClick={() => {
                  setShowForm(false);
                  setEditingCategory(null);
                  resetForm();
                }}
                className="modal-close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="category-form">
              <div className="form-section">
                <h4>Category Names</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>English Name *</label>
                    <input
                      type="text"
                      value={formData.name.en}
                      onChange={(e) => handleNameChange('en', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Georgian Name</label>
                    <input
                      type="text"
                      value={formData.name.ka}
                      onChange={(e) => handleNameChange('ka', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Turkish Name</label>
                    <input
                      type="text"
                      value={formData.name.tr}
                      onChange={(e) => handleNameChange('tr', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Category Descriptions</h4>
                <div className="form-group">
                  <label>English Description</label>
                  <textarea
                    value={formData.description.en}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      description: { ...prev.description, en: e.target.value }
                    }))}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Georgian Description</label>
                  <textarea
                    value={formData.description.ka}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      description: { ...prev.description, ka: e.target.value }
                    }))}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Turkish Description</label>
                  <textarea
                    value={formData.description.tr}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      description: { ...prev.description, tr: e.target.value }
                    }))}
                    rows="3"
                  />
                </div>
              </div>

              <div className="form-section">
                <h4>Category Settings</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Parent Category</label>
                    <select
                      value={formData.parent}
                      onChange={(e) => setFormData(prev => ({ ...prev, parent: e.target.value }))}
                    >
                      <option value="">No Parent</option>
                      {categories
                        .filter(cat => cat._id !== editingCategory?._id)
                        .map(category => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Sort Order</label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    />
                    Featured Category
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingCategory(null);
                    resetForm();
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Table */}
      <div className="categories-table card">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading categories...</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Parent</th>
                  <th>Products</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Sort Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <tr key={category._id}>
                    <td>
                      <div className="category-info">
                        <div className="category-name">{category.name}</div>
                        <div className="category-slug">/{category.slug}</div>
                      </div>
                    </td>
                    <td>
                      {category.parent ? category.parent.name : '—'}
                    </td>
                    <td>
                      <span className="product-count">
                        {category.productCount || 0}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-${category.status}`}>
                        {category.status}
                      </span>
                    </td>
                    <td>
                      {category.featured ? (
                        <span className="featured-badge">⭐ Featured</span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>{category.sortOrder || 0}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleEdit(category)}
                          className="btn btn-sm btn-secondary"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(category._id)}
                          className="btn btn-sm btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {categories.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">📁</div>
                <h3>No categories found</h3>
                <p>Create your first category to get started.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
