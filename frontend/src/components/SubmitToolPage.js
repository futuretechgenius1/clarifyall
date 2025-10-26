import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from './SEO';
import { getCategories } from '../services/categoryService';
import { submitTool } from '../services/toolService';
import { PRICING_MODELS, PRICING_DESCRIPTIONS } from '../utils/constants';
import '../styles/SubmitToolPage.css';

function SubmitToolPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    websiteUrl: '',
    categoryIds: [],
    pricingModel: '',
    shortDescription: '',
    fullDescription: '',
    submitterEmail: '',
  });

  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (categoryId) => {
    const currentCategories = [...formData.categoryIds];
    const index = currentCategories.indexOf(categoryId);

    if (index > -1) {
      currentCategories.splice(index, 1);
    } else {
      if (currentCategories.length < 3) {
        currentCategories.push(categoryId);
      } else {
        setError('You can select a maximum of 3 categories');
        setTimeout(() => setError(''), 3000);
        return;
      }
    }

    setFormData({ ...formData, categoryIds: currentCategories });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        setTimeout(() => setError(''), 3000);
        return;
      }
      setLogoFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await submitTool(formData, logoFile);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit tool. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="submit-page">
        <div className="success-message">
          <h2>✓ Tool Submitted Successfully!</h2>
          <p>Thank you for your submission. Our team will review it within 48 hours.</p>
          <p>Redirecting to homepage...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="submit-page">
      <SEO 
        title="Submit Your AI Tool - Share with the Community | Clarifyall"
        description="Submit your AI tool to Clarifyall and reach thousands of users. Free submission with quick review process. Help others discover innovative AI solutions."
        keywords="submit AI tool, add AI tool, list AI tool, AI tool submission, share AI tool, promote AI tool, AI tool directory submission, add to AI directory, submit software"
        canonicalUrl="/submit"
      />
      <div className="submit-container">
        <div className="guidelines-column">
          <h2>Help Us Clarify: Add Your AI Tool</h2>
          
          <div className="guideline-section">
            <h3>Thanks for sharing!</h3>
            <p>
              Submitting a tool to Clarifyall helps thousands of users find the perfect AI solution. 
              We review every submission to ensure quality.
            </p>
          </div>

          <div className="guideline-section">
            <h3>Our Guidelines:</h3>
            <ul>
              <li><strong>✓ Be Clear:</strong> Provide a simple, one-line description.</li>
              <li><strong>✓ Be Honest:</strong> Select the correct pricing and categories.</li>
              <li><strong>✗ No Affiliates:</strong> Please link directly to the tool, not an affiliate link.</li>
            </ul>
          </div>

          <div className="guideline-section">
            <h3>What's Next?</h3>
            <p>
              Our team will review your submission. You'll receive an email if it's approved 
              (usually within 48 hours).
            </p>
          </div>
        </div>

        <div className="form-column">
          <form onSubmit={handleSubmit} className="submit-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label>Tool Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label>Tool Website (URL) *</label>
              <input
                type="url"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleInputChange}
                placeholder="https://..."
                required
              />
            </div>

            <div className="form-group">
              <label>Categories (Select up to 3) *</label>
              <div className="category-grid">
                {categories.map((category) => (
                  <label key={category.id} className="category-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.categoryIds.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                    />
                    <span>{category.name}</span>
                  </label>
                ))}
              </div>
              <small>{formData.categoryIds.length}/3 selected</small>
            </div>

            <div className="form-group">
              <label>Pricing Model *</label>
              <div className="pricing-options">
                {PRICING_MODELS.map((pricing) => (
                  <label key={pricing.value} className="pricing-option">
                    <input
                      type="radio"
                      name="pricingModel"
                      value={pricing.value}
                      checked={formData.pricingModel === pricing.value}
                      onChange={handleInputChange}
                      required
                    />
                    <div>
                      <strong>{pricing.label}</strong>
                      <p>{PRICING_DESCRIPTIONS[pricing.value]}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Short Description (Max 150 chars) *</label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                maxLength={150}
                required
              />
              <small>{formData.shortDescription.length}/150</small>
            </div>

            <div className="form-group">
              <label>Full Description (Optional)</label>
              <textarea
                name="fullDescription"
                value={formData.fullDescription}
                onChange={handleInputChange}
                rows={8}
                placeholder="Provide a detailed description of the tool, its features, capabilities, and use cases..."
              />
              <small>{formData.fullDescription.length} characters</small>
            </div>

            <div className="form-group">
              <label>Upload Logo (High-Res PNG) *</label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif"
                onChange={handleFileChange}
                required
              />
              <small>Max file size: 5MB</small>
            </div>

            <div className="form-group">
              <label>Your Email (For notification) *</label>
              <input
                type="email"
                name="submitterEmail"
                value={formData.submitterEmail}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Submitting...' : 'SUBMIT FOR REVIEW'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SubmitToolPage;
