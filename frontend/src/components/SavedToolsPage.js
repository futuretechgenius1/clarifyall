import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { buildUploadUrl } from '../utils/constants';
import '../styles/SavedToolsPage.css';

const SavedToolsPage = () => {
  const { user } = useAuth();
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageErrors, setImageErrors] = useState({});

  const getDefaultLogo = (toolName) => {
    const firstLetter = toolName ? toolName.charAt(0).toUpperCase() : 'A';
    return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23667eea" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" fill="white" text-anchor="middle" dominant-baseline="middle"%3E${firstLetter}%3C/text%3E%3C/svg%3E`;
  };

  const getLogoUrl = (logoUrl) => {
    if (!logoUrl) return null;
    return buildUploadUrl(logoUrl);
  };

  const handleImageError = (toolId) => {
    setImageErrors(prev => ({ ...prev, [toolId]: true }));
  };

  useEffect(() => {
    loadSavedTools();
  }, []);

  const loadSavedTools = async () => {
    try {
      setLoading(true);
      const response = await userService.getSavedTools();
      setTools(response.tools || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load saved tools');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (toolId) => {
    try {
      await userService.unsaveTool(toolId);
      setTools(tools.filter(tool => tool.id !== toolId));
    } catch (err) {
      alert('Failed to unsave tool');
    }
  };

  if (loading) {
    return (
      <div className="saved-tools-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your saved tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-tools-page">
      <div className="saved-tools-container">
        <div className="page-header">
          <h1>My Saved Tools</h1>
          <p>Tools you've bookmarked for later</p>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {tools.length === 0 ? (
          <div className="no-saved-tools">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <path d="M60 15L75 45H105L81 63L90 93L60 75L30 93L39 63L15 45H45L60 15Z" stroke="#D1D5DB" strokeWidth="3" fill="none"/>
            </svg>
            <h2>No Saved Tools Yet</h2>
            <p>Start exploring and save your favorite AI tools</p>
            <Link to="/" className="btn-primary">
              Explore Tools
            </Link>
          </div>
        ) : (
          <div className="saved-tools-grid">
            {tools.map((tool) => (
              <div key={tool.id} className="saved-tool-card">
                <button
                  className="unsave-button"
                  onClick={() => handleUnsave(tool.id)}
                  title="Remove from saved"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 3.22l-.61-.6a5.5 5.5 0 0 0-7.78 7.77L10 18.78l8.39-8.4a5.5 5.5 0 0 0-7.78-7.77l-.61.61z"/>
                  </svg>
                </button>
                
                <div className="tool-card-content">
                  <div className="tool-header">
                    <img
                      src={imageErrors[tool.id] ? getDefaultLogo(tool.name) : (getLogoUrl(tool.logoUrl) || getDefaultLogo(tool.name))}
                      alt={`${tool.name} logo`}
                      className="tool-logo"
                      onError={() => handleImageError(tool.id)}
                    />
                    <div className="tool-header-info">
                      <h3>{tool.name}</h3>
                      <span className="tool-pricing">{tool.pricingModel}</span>
                    </div>
                  </div>
                  
                  <p className="tool-description">{tool.shortDescription}</p>
                  
                  {tool.categoryNames && (
                    <div className="tool-categories">
                      {tool.categoryNames.split(',').slice(0, 3).map((cat, idx) => (
                        <span key={idx} className="category-tag">{cat}</span>
                      ))}
                    </div>
                  )}
                  
                  <div className="tool-card-footer">
                    <span className="saved-date">
                      Saved {new Date(tool.savedAt).toLocaleDateString()}
                    </span>
                    <Link to={`/tool/${tool.id}`} className="btn-view">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedToolsPage;
