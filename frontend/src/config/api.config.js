// API Configuration
// Change this URL when deploying to production or different servers

const API_CONFIG = {
  // Development (local)
  development: {
    BASE_URL: 'http://localhost:5000/api',
    UPLOADS_URL: 'http://localhost:5000/uploads'
  },
  
  // Production (update these URLs for your production server)
  production: {
    BASE_URL: 'https://your-backend-domain.com/api',
    UPLOADS_URL: 'https://your-backend-domain.com/uploads'
  }
};

// Automatically detect environment
const ENV = process.env.NODE_ENV || 'development';

// Export the current environment configuration
export const API_BASE_URL = API_CONFIG[ENV].BASE_URL;
export const UPLOADS_BASE_URL = API_CONFIG[ENV].UPLOADS_URL;

// Helper function to build full API endpoint
export const buildApiUrl = (endpoint) => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Helper function to build upload URL
export const buildUploadUrl = (path) => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${UPLOADS_BASE_URL}/${cleanPath}`;
};

export default {
  API_BASE_URL,
  UPLOADS_BASE_URL,
  buildApiUrl,
  buildUploadUrl
};
