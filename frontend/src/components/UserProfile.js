import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import '../styles/UserProfile.css';

const UserProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('submitted'); // submitted or saved

  const isOwnProfile = currentUser && currentUser.id === parseInt(userId);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await userService.getUserProfile(userId);
      setProfile(profileData.user);
      
      // Load user's submitted tools
      const toolsData = await userService.getUserTools(userId);
      setTools(toolsData.tools || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const loadSavedTools = async () => {
    try {
      const savedData = await userService.getSavedTools();
      setTools(savedData.tools || []);
    } catch (err) {
      setError('Failed to load saved tools');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'saved' && isOwnProfile) {
      loadSavedTools();
    } else {
      loadProfile();
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-error">
        <h2>User Not Found</h2>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar-large">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} />
            ) : (
              <span>{profile.name?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="profile-info">
            <h1>{profile.name}</h1>
            <p className="profile-email">{profile.email}</p>
            {profile.bio && <p className="profile-bio">{profile.bio}</p>}
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-value">{tools.length}</span>
                <span className="stat-label">Tools Submitted</span>
              </div>
              <div className="stat">
                <span className="stat-value">{profile.saveCount || 0}</span>
                <span className="stat-label">Tools Saved</span>
              </div>
            </div>
            {isOwnProfile && (
              <Link to="/profile/edit" className="btn-edit-profile">
                Edit Profile
              </Link>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === 'submitted' ? 'active' : ''}`}
            onClick={() => handleTabChange('submitted')}
          >
            Submitted Tools
          </button>
          {isOwnProfile && (
            <button
              className={`tab ${activeTab === 'saved' ? 'active' : ''}`}
              onClick={() => handleTabChange('saved')}
            >
              Saved Tools
            </button>
          )}
        </div>

        {/* Tools Grid */}
        <div className="profile-tools">
          {tools.length === 0 ? (
            <div className="no-tools">
              <p>
                {activeTab === 'submitted'
                  ? 'No tools submitted yet'
                  : 'No saved tools yet'}
              </p>
              {isOwnProfile && activeTab === 'submitted' && (
                <Link to="/submit" className="btn-primary">
                  Submit Your First Tool
                </Link>
              )}
            </div>
          ) : (
            <div className="tools-grid">
              {tools.map((tool) => (
                <div key={tool.id} className="tool-card">
                  <div className="tool-card-header">
                    <img
                      src={tool.logoUrl || '/default-logo.png'}
                      alt={tool.name}
                      className="tool-logo"
                    />
                    <h3>{tool.name}</h3>
                  </div>
                  <p className="tool-description">{tool.shortDescription}</p>
                  <div className="tool-card-footer">
                    <span className="tool-pricing">{tool.pricingModel}</span>
                    <Link to={`/tool/${tool.id}`} className="btn-view">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
