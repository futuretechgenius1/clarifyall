import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import SEO from './SEO';
import { getToolById, incrementViewCount } from '../services/toolService';
import { PRICING_MODELS } from '../utils/constants';
import { FEATURE_TAGS, PLATFORMS, SOCIAL_PLATFORMS } from '../utils/filterConstants';
import '../styles/ToolDetailPage.css';

function ToolDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tool, setTool] = useState(null);
  const [similarTools, setSimilarTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadTool();
  }, [id]);

  const loadTool = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get tool details
      const toolData = await getToolById(id);
      setTool(toolData);
      
      // Increment view count
      await incrementViewCount(id);
      
      // Load similar tools
      if (toolData.categories && toolData.categories.length > 0) {
        const response = await fetch(`/api/v1/tools/${id}/similar`);
        if (response.ok) {
          const similar = await response.json();
          setSimilarTools(similar);
        }
      }
    } catch (err) {
      setError('Failed to load tool details');
      console.error('Error loading tool:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPricingLabel = (model) => {
    const pricing = PRICING_MODELS.find(p => p.value === model);
    return pricing ? pricing.label : model;
  };

  const getFeatureTagLabel = (tag) => {
    const feature = FEATURE_TAGS.find(f => f.value === tag);
    return feature ? feature.label : tag;
  };

  const getPlatformLabel = (platform) => {
    const p = PLATFORMS.find(pl => pl.value === platform);
    return p ? p.label : platform;
  };

  const getSocialIcon = (key) => {
    const social = SOCIAL_PLATFORMS.find(s => s.key === key);
    return social ? social.icon : '🔗';
  };

  const extractVideoId = (url) => {
    if (!url) return null;
    
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (youtubeMatch) return { type: 'youtube', id: youtubeMatch[1] };
    
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return { type: 'vimeo', id: vimeoMatch[1] };
    
    return null;
  };

  if (loading) {
    return (
      <div className="tool-detail-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading tool details...</p>
        </div>
      </div>
    );
  }

  if (error || !tool) {
    return (
      <div className="tool-detail-page">
        <div className="error-container">
          <h2>Tool Not Found</h2>
          <p>{error || 'The tool you are looking for does not exist.'}</p>
          <button onClick={() => navigate('/')} className="back-button">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const videoData = extractVideoId(tool.videoUrl);

  // Generate Schema.org structured data for SEO
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "description": tool.shortDescription,
    "url": tool.websiteUrl,
    "image": tool.logoUrl,
    "applicationCategory": "AI Tool",
    "operatingSystem": tool.platforms?.map(p => getPlatformLabel(p)).join(', ') || "Web",
    "offers": {
      "@type": "Offer",
      "price": tool.pricingModel === 'FREE' ? "0" : "varies",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    ...(tool.rating && tool.rating > 0 && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": tool.rating,
        "reviewCount": tool.reviewCount || 0,
        "bestRating": "5",
        "worstRating": "1"
      }
    }),
    "author": {
      "@type": "Organization",
      "name": "Clarifyall"
    },
    "datePublished": tool.createdAt,
    "keywords": [
      tool.name,
      ...tool.categories?.map(c => c.name) || [],
      ...tool.featureTags?.map(t => getFeatureTagLabel(t)) || [],
      getPricingLabel(tool.pricingModel)
    ].join(', ')
  };

  return (
    <div className="tool-detail-page">
      <SEO 
        title={`${tool.name} - AI Tool Details | Clarifyall`}
        description={tool.shortDescription}
        keywords={`${tool.name}, AI tool, artificial intelligence, ${tool.categories.map(c => c.name).join(', ')}, ${getPricingLabel(tool.pricingModel)}, ${tool.featureTags?.map(t => getFeatureTagLabel(t)).join(', ') || ''}`}
        canonicalUrl={`/tool/${tool.id}`}
        ogImage={tool.logoUrl}
        schemaData={schemaData}
      />

      {/* Hero Section */}
      <section className="tool-hero">
        <div className="tool-hero-content">
          <button onClick={() => navigate(-1)} className="back-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="tool-header">
            <div className="tool-logo-large">
              <img src={tool.logoUrl} alt={`${tool.name} logo`} />
            </div>
            
            <div className="tool-header-info">
              <h1 className="tool-name">{tool.name}</h1>
              <p className="tool-tagline">{tool.shortDescription}</p>
              
              <div className="tool-meta">
                <div className="tool-categories">
                  {tool.categories.map(category => (
                    <Link 
                      key={category.id} 
                      to={`/?category=${category.id}`}
                      className="category-badge"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
                
                <div className="tool-pricing-badge">
                  {getPricingLabel(tool.pricingModel)}
                </div>
              </div>

              <div className="tool-stats">
                <div className="stat">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{tool.viewCount} views</span>
                </div>
                
                {tool.rating > 0 && (
                  <div className="stat">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>{tool.rating.toFixed(1)} ({tool.reviewCount} reviews)</span>
                  </div>
                )}
              </div>

              <div className="tool-actions">
                <a 
                  href={tool.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="primary-button"
                >
                  Visit Website
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                
                <button className="secondary-button">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Save
                </button>
                
                <button className="secondary-button">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="tool-tabs">
        <div className="tabs-container">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          {tool.features && tool.features.length > 0 && (
            <button 
              className={`tab ${activeTab === 'features' ? 'active' : ''}`}
              onClick={() => setActiveTab('features')}
            >
              Features
            </button>
          )}
          {tool.pricingDetails && (
            <button 
              className={`tab ${activeTab === 'pricing' ? 'active' : ''}`}
              onClick={() => setActiveTab('pricing')}
            >
              Pricing
            </button>
          )}
          {tool.screenshots && tool.screenshots.length > 0 && (
            <button 
              className={`tab ${activeTab === 'screenshots' ? 'active' : ''}`}
              onClick={() => setActiveTab('screenshots')}
            >
              Screenshots
            </button>
          )}
        </div>
      </section>

      {/* Tab Content */}
      <section className="tool-content">
        <div className="content-container">
          <div className="main-content">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="tab-content">
                <h2>About {tool.name}</h2>
                <div className="tool-description">
                  {(tool.fullDescription || tool.shortDescription)
                    .split(/\n+/)
                    .filter(paragraph => paragraph.trim() !== '')
                    .map((paragraph, index) => (
                      <p key={index}>{paragraph.trim()}</p>
                    ))}
                </div>

                {videoData && (
                  <div className="video-container">
                    <h3>Demo Video</h3>
                    {videoData.type === 'youtube' && (
                      <iframe
                        src={`https://www.youtube.com/embed/${videoData.id}`}
                        title={`${tool.name} demo`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    )}
                    {videoData.type === 'vimeo' && (
                      <iframe
                        src={`https://player.vimeo.com/video/${videoData.id}`}
                        title={`${tool.name} demo`}
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    )}
                  </div>
                )}

                {tool.featureTags && tool.featureTags.length > 0 && (
                  <div className="feature-tags-section">
                    <h3>Key Features</h3>
                    <div className="feature-tags">
                      {tool.featureTags.map((tag, index) => (
                        <span key={index} className="feature-tag">
                          {getFeatureTagLabel(tag)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {tool.platforms && tool.platforms.length > 0 && (
                  <div className="platforms-section">
                    <h3>Available On</h3>
                    <div className="platforms">
                      {tool.platforms.map((platform, index) => (
                        <span key={index} className="platform-badge">
                          {getPlatformLabel(platform)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Features Tab */}
            {activeTab === 'features' && tool.features && (
              <div className="tab-content">
                <h2>Features</h2>
                <ul className="features-list">
                  {tool.features.map((feature, index) => (
                    <li key={index}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pricing Tab */}
            {activeTab === 'pricing' && tool.pricingDetails && (
              <div className="tab-content">
                <h2>Pricing Plans</h2>
                <div className="pricing-grid">
                  {Object.entries(tool.pricingDetails).map(([planName, planDetails]) => (
                    <div key={planName} className="pricing-card">
                      <h3>{planName.charAt(0).toUpperCase() + planName.slice(1)}</h3>
                      {typeof planDetails === 'string' ? (
                        <p>{planDetails}</p>
                      ) : (
                        <>
                          <div className="price">{planDetails.price}</div>
                          {planDetails.features && (
                            <ul>
                              {planDetails.features.map((feature, index) => (
                                <li key={index}>{feature}</li>
                              ))}
                            </ul>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Screenshots Tab */}
            {activeTab === 'screenshots' && tool.screenshots && (
              <div className="tab-content">
                <h2>Screenshots</h2>
                <div className="screenshots-grid">
                  {tool.screenshots.map((screenshot, index) => (
                    <div key={index} className="screenshot-item">
                      <img src={screenshot} alt={`${tool.name} screenshot ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="sidebar-content">
            {/* Tool Info Card */}
            <div className="info-card">
              <h3>Tool Information</h3>
              <div className="info-item">
                <span className="info-label">Pricing</span>
                <span className="info-value">{getPricingLabel(tool.pricingModel)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Categories</span>
                <span className="info-value">
                  {tool.categories.map(c => c.name).join(', ')}
                </span>
              </div>
              {tool.platforms && tool.platforms.length > 0 && (
                <div className="info-item">
                  <span className="info-label">Platforms</span>
                  <span className="info-value">
                    {tool.platforms.map(p => getPlatformLabel(p)).join(', ')}
                  </span>
                </div>
              )}
            </div>

            {/* Social Links */}
            {tool.socialLinks && Object.keys(tool.socialLinks).length > 0 && (
              <div className="info-card">
                <h3>Connect</h3>
                <div className="social-links">
                  {Object.entries(tool.socialLinks).map(([key, value]) => (
                    value && (
                      <a 
                        key={key} 
                        href={value.startsWith('http') ? value : `https://${key}.com/${value}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                      >
                        <span className="social-icon">{getSocialIcon(key)}</span>
                        <span className="social-name">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                      </a>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Similar Tools */}
            {similarTools.length > 0 && (
              <div className="info-card">
                <h3>Similar Tools</h3>
                <div className="similar-tools">
                  {similarTools.map(similarTool => (
                    <Link 
                      key={similarTool.id} 
                      to={`/tool/${similarTool.id}`}
                      className="similar-tool-item"
                    >
                      <img src={similarTool.logoUrl} alt={similarTool.name} />
                      <div className="similar-tool-info">
                        <h4>{similarTool.name}</h4>
                        <p>{similarTool.shortDescription.substring(0, 60)}...</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}

export default ToolDetailPage;
