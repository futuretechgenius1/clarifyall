import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Top Section */}
        <div className="footer-top">
          <div className="footer-column footer-brand">
            <Link to="/" className="footer-logo">
              <svg className="footer-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
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
                <line x1="7" y1="8" x2="7" y2="16" strokeWidth="1.5" strokeDasharray="2 2"/>
                <line x1="17" y1="8" x2="17" y2="16" strokeWidth="1.5" strokeDasharray="2 2"/>
              </svg>
              <div className="footer-logo-text">
                <span className="footer-logo-name">Clarifyall</span>
                <span className="footer-logo-tagline">Discover AI, Simplified</span>
              </div>
            </Link>
            <p className="footer-description">
              Your comprehensive directory for discovering, comparing, and mastering the best AI tools for every task.
            </p>
            <div className="footer-social">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Explore</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/categories">Categories</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/submit">Submit Tool</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Resources</h3>
            <ul className="footer-links">
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/guides">Guides</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Legal</h3>
            <ul className="footer-links">
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/cookies">Cookie Policy</Link></li>
              <li><Link to="/disclaimer">Disclaimer</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Newsletter</h3>
            <p className="footer-newsletter-text">
              Get weekly updates on new AI tools and features.
            </p>
            <form className="footer-newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="footer-newsletter-input"
                required
              />
              <button type="submit" className="footer-newsletter-button">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>© {currentYear} Clarifyall. All rights reserved.</p>
            <p className="footer-tagline">Discover AI, Simplified</p>
          </div>
          <div className="footer-bottom-links">
            <span>Made with</span>
            <svg className="footer-heart" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span>for AI enthusiasts</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
