import api from './api';

// Get all tools with filters
export const getTools = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
  if (filters.pricingModel) params.append('pricingModel', filters.pricingModel);
  if (filters.categoryId) params.append('categoryId', filters.categoryId);
  if (filters.page !== undefined) params.append('page', filters.page);
  if (filters.size !== undefined) params.append('size', filters.size);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  
  // Add platforms filter
  if (filters.platforms && filters.platforms.length > 0) {
    filters.platforms.forEach(platform => params.append('platforms', platform));
  }
  
  // Add feature tags filter
  if (filters.featureTags && filters.featureTags.length > 0) {
    filters.featureTags.forEach(tag => params.append('featureTags', tag));
  }

  const response = await api.get(`/tools?${params.toString()}`);
  return response.data;
};

// Get tool by ID
export const getToolById = async (id) => {
  const response = await api.get(`/tools/${id}`);
  return response.data;
};

// Submit a new tool
export const submitTool = async (toolData, logoFile) => {
  const formData = new FormData();
  
  // Create a blob for the JSON data
  const toolBlob = new Blob([JSON.stringify(toolData)], {
    type: 'application/json'
  });
  
  formData.append('tool', toolBlob);
  
  if (logoFile) {
    formData.append('logo', logoFile);
  }

  const response = await api.post('/tools/submit', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Increment view count
export const incrementViewCount = async (id) => {
  const response = await api.post(`/tools/${id}/view`);
  return response.data;
};

// Increment save count
export const incrementSaveCount = async (id) => {
  const response = await api.post(`/tools/${id}/save`);
  return response.data;
};

// Get popular tools
export const getPopularTools = async () => {
  const response = await api.get('/tools/popular');
  return response.data;
};

// Get recent tools
export const getRecentTools = async () => {
  const response = await api.get('/tools/recent');
  return response.data;
};

// Get similar tools
export const getSimilarTools = async (id) => {
  const response = await api.get(`/tools/${id}/similar`);
  return response.data;
};

// Export as default object as well for backward compatibility
export default {
  getTools,
  getToolById,
  submitTool,
  incrementViewCount,
  incrementSaveCount,
  getPopularTools,
  getRecentTools,
  getSimilarTools,
};
