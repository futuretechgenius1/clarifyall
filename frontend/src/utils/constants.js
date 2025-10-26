// API Configuration - Centralized in one place
// For development: http://localhost:8080/api/v1
// For production: Update this URL to your production backend server
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

// Uploads URL - For accessing uploaded files (logos, images, etc.)
export const UPLOADS_BASE_URL = process.env.REACT_APP_UPLOADS_URL || 'http://localhost:8080/uploads';

// Helper function to build full API endpoint
export const buildApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Helper function to build upload URL for images
export const buildUploadUrl = (path) => {
  if (!path) return '';
  // If path already includes full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${UPLOADS_BASE_URL}/${cleanPath}`;
};

export const PRICING_MODELS = [
  { value: 'FREE', label: 'Free' },
  { value: 'FREEMIUM', label: 'Freemium' },
  { value: 'FREE_TRIAL', label: 'Free Trial' },
  { value: 'PAID', label: 'Paid' }
];

export const PRICING_MODEL_VALUES = {
  FREE: 'FREE',
  FREEMIUM: 'FREEMIUM',
  FREE_TRIAL: 'FREE_TRIAL',
  PAID: 'PAID'
};

export const PRICING_LABELS = {
  FREE: 'Free',
  FREEMIUM: 'Freemium',
  FREE_TRIAL: 'Free Trial',
  PAID: 'Paid'
};

export const PRICING_DESCRIPTIONS = {
  FREE: '100% free to use',
  FREEMIUM: 'Offers a permanent free plan with optional paid upgrades',
  FREE_TRIAL: 'Requires a credit card or has a time limit (e.g., 7 days)',
  PAID: 'No free plan or trial available'
};
