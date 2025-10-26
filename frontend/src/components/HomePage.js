import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEO from './SEO';
import SearchBar from './SearchBar';
import FilterSidebar from './FilterSidebar';
import ToolGrid from './ToolGrid';
import { getTools } from '../services/toolService';
import '../styles/HomePage.css';

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    pricingModel: '',
    categoryId: '',
    page: 0,
    size: 12
  });
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Handle URL parameters on mount
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setFilters(prev => ({ ...prev, categoryId: categoryFromUrl }));
    }
  }, [searchParams]);

  useEffect(() => {
    fetchTools();
  }, [filters]);

  const fetchTools = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTools(filters);
      setTools(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      setError('Failed to load tools. Please try again later.');
      console.error('Error fetching tools:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setFilters({ ...filters, searchTerm, page: 0 });
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 0 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="homepage">
      <SEO 
        title="Clarifyall - Discover the Best AI Tools | AI Tool Directory"
        description="Find and compare 1000+ AI tools for writing, design, coding, marketing, and more. Browse by category, filter by pricing, and discover free AI tools. Your complete AI tool directory."
        keywords="AI tools, artificial intelligence tools, AI tool directory, best AI tools, free AI tools, AI writing tools, AI image generator, AI coding tools, AI chatbot, machine learning tools, AI productivity tools, AI design tools, AI marketing tools, ChatGPT alternatives, AI tool comparison, AI software directory"
        canonicalUrl="/"
      />
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <svg className="hero-badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              {/* AI Brain/Neural Network Icon */}
              <circle cx="12" cy="12" r="3" strokeWidth="2" fill="currentColor" opacity="0.2"/>
              <circle cx="6" cy="6" r="2" strokeWidth="2"/>
              <circle cx="18" cy="6" r="2" strokeWidth="2"/>
              <circle cx="6" cy="18" r="2" strokeWidth="2"/>
              <circle cx="18" cy="18" r="2" strokeWidth="2"/>
              <line x1="8" y1="7" x2="10" y2="10" strokeWidth="1.5"/>
              <line x1="16" y1="7" x2="14" y2="10" strokeWidth="1.5"/>
              <line x1="8" y1="17" x2="10" y2="14" strokeWidth="1.5"/>
              <line x1="16" y1="17" x2="14" y2="14" strokeWidth="1.5"/>
            </svg>
            <span>Discover AI, Simplified</span>
          </div>
          <h1 className="hero-title">
            Find & Master Your
            <br />
            <span className="text-gradient">Perfect AI Tool</span>
          </h1>
          <p className="hero-subtitle">
            Discover, compare, and master the best AI tools for every task.
            <br />
            From writing to design, coding to marketing - <strong>{totalElements}+ tools</strong> at your fingertips!
          </p>
          
          {/* Search Bar in Hero */}
          <div className="hero-search">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Quick Stats */}
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">{totalElements}+</div>
              <div className="stat-label">AI Tools</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">25+</div>
              <div className="stat-label">Categories</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Free Access</div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="hero-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </section>

      {/* Main Content */}
      <div className="homepage-container">
        <div className="homepage-layout">
          {/* Filter Sidebar */}
          <aside className="sidebar-wrapper">
            <FilterSidebar 
              onFilterChange={handleFilterChange}
              currentFilters={filters}
            />
          </aside>

          {/* Tools Grid */}
          <main className="content-wrapper">
            {error && (
              <div className="error-message">
                <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading amazing AI tools...</p>
              </div>
            ) : (
              <>
                <div className="results-header">
                  <h2 className="results-title">
                    {filters.searchTerm ? `Search results for "${filters.searchTerm}"` : 'All AI Tools'}
                  </h2>
                  <p className="results-count">
                    Showing {tools.length} of {totalElements} tools
                  </p>
                </div>

                <ToolGrid 
                  tools={tools}
                  currentPage={filters.page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
