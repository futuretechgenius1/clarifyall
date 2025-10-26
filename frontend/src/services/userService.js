import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const API_URL = API_BASE_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const userService = {
  // Get user profile by ID
  getUserProfile: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Update user profile
  updateProfile: async (updates) => {
    const response = await api.put('/users/profile', updates);
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Get user's submitted tools
  getUserTools: async (userId, page = 1, limit = 10) => {
    const response = await api.get(`/users/${userId}/tools`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Save/bookmark a tool
  saveTool: async (toolId) => {
    const response = await api.post(`/users/saved-tools/${toolId}`);
    return response.data;
  },

  // Unsave/unbookmark a tool
  unsaveTool: async (toolId) => {
    const response = await api.delete(`/users/saved-tools/${toolId}`);
    return response.data;
  },

  // Get user's saved tools
  getSavedTools: async (page = 1, limit = 10) => {
    const response = await api.get('/users/saved-tools', {
      params: { page, limit }
    });
    return response.data;
  },

  // Check if user has saved a tool
  checkSavedTool: async (toolId) => {
    const response = await api.get(`/users/saved-tools/${toolId}/check`);
    return response.data;
  },

  // Delete user account
  deleteAccount: async (password) => {
    const response = await api.delete('/users/account', {
      data: { password }
    });
    return response.data;
  }
};

export default userService;
