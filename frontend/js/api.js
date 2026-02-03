// API configuration
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : '/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Set token in localStorage
const setToken = (token) => localStorage.setItem('token', token);

// Remove token from localStorage
const removeToken = () => localStorage.removeItem('token');

// Get user from localStorage
const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Set user in localStorage
const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));

// Remove user from localStorage
const removeUser = () => localStorage.removeItem('user');

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Auth API
const authAPI = {
  register: (userData) => 
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  login: (credentials) => 
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  
  logout: () => {
    removeToken();
    removeUser();
  },
};

// User API
const userAPI = {
  getProfile: () => apiRequest('/users/profile'),
  
  updateProfile: (userData) => 
    apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
};

// Campaign API
const campaignAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/campaigns${queryString ? '?' + queryString : ''}`);
  },
  
  getById: (id) => apiRequest(`/campaigns/${id}`),
  
  create: (campaignData) => 
    apiRequest('/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData),
    }),
  
  update: (id, campaignData) => 
    apiRequest(`/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(campaignData),
    }),
  
  delete: (id) => 
    apiRequest(`/campaigns/${id}`, {
      method: 'DELETE',
    }),
};

// Donation API
const donationAPI = {
  getAll: () => apiRequest('/donations'),
  
  getById: (id) => apiRequest(`/donations/${id}`),
  
  getByCampaign: (campaignId) => apiRequest(`/donations/campaign/${campaignId}`),
  
  create: (donationData) => 
    apiRequest('/donations', {
      method: 'POST',
      body: JSON.stringify(donationData),
    }),
  
  delete: (id) => 
    apiRequest(`/donations/${id}`, {
      method: 'DELETE',
    }),
};

// Utility functions
const showAlert = (message, type = 'info') => {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  
  const container = document.querySelector('.container') || document.body;
  container.insertBefore(alertDiv, container.firstChild);
  
  setTimeout(() => alertDiv.remove(), 5000);
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
