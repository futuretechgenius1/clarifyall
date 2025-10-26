import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { PRICING_LABELS, buildUploadUrl } from '../utils/constants';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [pendingTools, setPendingTools] = useState([]);
  const [approvedTools, setApprovedTools] = useState([]);
  const [rejectedTools, setRejectedTools] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [editingTool, setEditingTool] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });

  useEffect(() => {
    // Check if user is admin
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }
    
    loadTools();
    loadCategories();
  }, [navigate]);

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadTools = async () => {
    setLoading(true);
    try {
      // Load all tools
      const response = await api.get('/tools/all');
      const allTools = response.data;
      
      // Separate by status
      const pending = allTools.filter(tool => tool.status === 'PENDING_APPROVAL');
      const approved = allTools.filter(tool => tool.status === 'APPROVED');
      const rejected = allTools.filter(tool => tool.status === 'REJECTED');
      
      setPendingTools(pending);
      setApprovedTools(approved);
      setRejectedTools(rejected);
      
      setStats({
        pending: pending.length,
        approved: approved.length,
        rejected: rejected.length,
        total: allTools.length
      });
    } catch (error) {
      console.error('Error loading tools:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (toolId) => {
    if (!window.confirm('Are you sure you want to approve this tool?')) return;
    
    try {
      await api.put(`/tools/${toolId}/approve`);
      alert('Tool approved successfully!');
      loadTools();
    } catch (error) {
      alert('Error approving tool: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleReject = async (toolId) => {
    if (!window.confirm('Are you sure you want to reject this tool?')) return;
    
    try {
      await api.put(`/tools/${toolId}/reject`);
      alert('Tool rejected successfully!');
      loadTools();
    } catch (error) {
      alert('Error rejecting tool: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (toolId) => {
    if (!window.confirm('Are you sure you want to permanently delete this tool?')) return;
    
    try {
      await api.delete(`/tools/${toolId}`);
      alert('Tool deleted successfully!');
      loadTools();
    } catch (error) {
      alert('Error deleting tool: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEdit = (tool) => {
    setEditingTool(tool.id);
    setEditForm({
      name: tool.name,
      websiteUrl: tool.websiteUrl,
      shortDescription: tool.shortDescription,
      fullDescription: tool.fullDescription || '',
      pricingModel: tool.pricingModel,
      categoryIds: tool.categories.map(c => c.id)
    });
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleCancelEdit = () => {
    setEditingTool(null);
    setEditForm({});
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleSaveEdit = async (toolId) => {
    try {
      // If there's a new image, upload it first
      if (selectedFile) {
        const formData = new FormData();
        formData.append('logo', selectedFile);
        
        // Upload the image
        await api.post(`/tools/${toolId}/upload-logo`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      // Update tool details
      await api.put(`/tools/${toolId}`, editForm);
      alert('Tool updated successfully!');
      setEditingTool(null);
      setEditForm({});
      setSelectedFile(null);
      setImagePreview(null);
      loadTools();
    } catch (error) {
      alert('Error updating tool: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleApproveAndSave = async (toolId) => {
    try {
      // If there's a new image, upload it first
      if (selectedFile) {
        const formData = new FormData();
        formData.append('logo', selectedFile);
        
        await api.post(`/tools/${toolId}/upload-logo`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      // Save the edits
      await api.put(`/tools/${toolId}`, editForm);
      // Then approve
      await api.put(`/tools/${toolId}/approve`);
      alert('Tool updated and approved successfully!');
      setEditingTool(null);
      setEditForm({});
      setSelectedFile(null);
      setImagePreview(null);
      loadTools();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  const renderToolRow = (tool) => (
    <tr key={tool.id} className={editingTool === tool.id ? 'editing-row' : ''}>
      <td className="logo-cell">
        {editingTool === tool.id ? (
          <div className="logo-edit-container">
            <div className="current-logo">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="tool-logo-thumb" />
              ) : tool.logoUrl ? (
                <img src={buildUploadUrl(tool.logoUrl)} alt={tool.name} className="tool-logo-thumb" />
              ) : (
                <div className="tool-logo-placeholder">{tool.name.charAt(0)}</div>
              )}
            </div>
            <div className="logo-upload-controls">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                id={`file-input-${tool.id}`}
                style={{ display: 'none' }}
              />
              <label htmlFor={`file-input-${tool.id}`} className="btn-upload-logo" title="Upload new logo">
                📁
              </label>
              {(selectedFile || imagePreview) && (
                <button className="btn-remove-logo" onClick={handleRemoveImage} title="Remove selected image">
                  ✗
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {tool.logoUrl ? (
              <img src={buildUploadUrl(tool.logoUrl)} alt={tool.name} className="tool-logo-thumb" />
            ) : (
              <div className="tool-logo-placeholder">{tool.name.charAt(0)}</div>
            )}
          </>
        )}
      </td>
      <td>
        {editingTool === tool.id ? (
          <input
            type="text"
            value={editForm.name}
            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
            className="edit-input"
          />
        ) : (
          <strong>{tool.name}</strong>
        )}
      </td>
      <td>
        {editingTool === tool.id ? (
          <input
            type="text"
            value={editForm.websiteUrl}
            onChange={(e) => setEditForm({...editForm, websiteUrl: e.target.value})}
            className="edit-input"
          />
        ) : (
          <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer" className="tool-link">
            {tool.websiteUrl.length > 30 ? tool.websiteUrl.substring(0, 30) + '...' : tool.websiteUrl}
          </a>
        )}
      </td>
      <td>
        {editingTool === tool.id ? (
          <textarea
            value={editForm.shortDescription}
            onChange={(e) => setEditForm({...editForm, shortDescription: e.target.value})}
            className="edit-textarea"
            rows="2"
          />
        ) : (
          tool.shortDescription
        )}
      </td>
      <td>
        {editingTool === tool.id ? (
          <select
            value={editForm.pricingModel}
            onChange={(e) => setEditForm({...editForm, pricingModel: e.target.value})}
            className="edit-select"
          >
            <option value="FREE">Free</option>
            <option value="FREEMIUM">Freemium</option>
            <option value="FREE_TRIAL">Free Trial</option>
            <option value="PAID">Paid</option>
          </select>
        ) : (
          <span className={`pricing-badge-sm pricing-${tool.pricingModel.toLowerCase()}`}>
            {PRICING_LABELS[tool.pricingModel]}
          </span>
        )}
      </td>
      <td>
        {editingTool === tool.id ? (
          <select
            multiple
            value={editForm.categoryIds}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
              setEditForm({...editForm, categoryIds: selected});
            }}
            className="edit-select-multi"
            size="3"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        ) : (
          <div className="category-tags-sm">
            {tool.categories.slice(0, 2).map(cat => (
              <span key={cat.id} className="category-tag-sm">{cat.name}</span>
            ))}
            {tool.categories.length > 2 && <span className="category-tag-sm">+{tool.categories.length - 2}</span>}
          </div>
        )}
      </td>
      <td>
        <span className={`status-badge-sm status-${tool.status.toLowerCase()}`}>
          {tool.status.replace('_', ' ')}
        </span>
      </td>
      <td className="actions-cell">
        {editingTool === tool.id ? (
          <div className="edit-actions">
            <button className="btn-save-sm" onClick={() => handleSaveEdit(tool.id)} title="Save">
              💾
            </button>
            {tool.status === 'PENDING_APPROVAL' && (
              <button className="btn-approve-sm" onClick={() => handleApproveAndSave(tool.id)} title="Save & Approve">
                ✓
              </button>
            )}
            <button className="btn-cancel-sm" onClick={handleCancelEdit} title="Cancel">
              ✗
            </button>
          </div>
        ) : (
          <div className="action-buttons">
            <button className="btn-edit-sm" onClick={() => handleEdit(tool)} title="Edit">
              ✏️
            </button>
            {tool.status === 'PENDING_APPROVAL' && (
              <>
                <button className="btn-approve-sm" onClick={() => handleApprove(tool.id)} title="Approve">
                  ✓
                </button>
                <button className="btn-reject-sm" onClick={() => handleReject(tool.id)} title="Reject">
                  ✗
                </button>
              </>
            )}
            {tool.status === 'APPROVED' && (
              <button className="btn-reject-sm" onClick={() => handleReject(tool.id)} title="Reject">
                ✗
              </button>
            )}
            {tool.status === 'REJECTED' && (
              <button className="btn-approve-sm" onClick={() => handleApprove(tool.id)} title="Approve">
                ✓
              </button>
            )}
            <button className="btn-delete-sm" onClick={() => handleDelete(tool.id)} title="Delete">
              🗑
            </button>
          </div>
        )}
      </td>
    </tr>
  );

  const getCurrentTools = () => {
    switch (activeTab) {
      case 'pending':
        return pendingTools;
      case 'approved':
        return approvedTools;
      case 'rejected':
        return rejectedTools;
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>🛠 Admin Dashboard</h1>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.approved}</div>
          <div className="stat-label">Approved</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.rejected}</div>
          <div className="stat-label">Rejected</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total</div>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending ({stats.pending})
        </button>
        <button
          className={`tab-btn ${activeTab === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          Approved ({stats.approved})
        </button>
        <button
          className={`tab-btn ${activeTab === 'rejected' ? 'active' : ''}`}
          onClick={() => setActiveTab('rejected')}
        >
          Rejected ({stats.rejected})
        </button>
      </div>

      <div className="admin-content">
        {getCurrentTools().length === 0 ? (
          <div className="empty-state">
            <p>No {activeTab} tools found.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="admin-tools-table">
              <thead>
                <tr>
                  <th>Logo</th>
                  <th>Name</th>
                  <th>Website</th>
                  <th>Description</th>
                  <th>Pricing</th>
                  <th>Categories</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentTools().map(tool => renderToolRow(tool))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
