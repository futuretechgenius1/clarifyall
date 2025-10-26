import api from './api';

// Get all categories
export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

// Get category by ID
export const getCategoryById = async (id) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

// Get category by slug
export const getCategoryBySlug = async (slug) => {
  const response = await api.get(`/categories/slug/${slug}`);
  return response.data;
};

// Export as default object as well for backward compatibility
export default {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
};
