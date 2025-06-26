// Environment configuration
const config = {
  // Backend URL - will be set from environment variable
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  
  // AI API Key
  TOGETHER_API: import.meta.env.VITE_TOGETHER_API || '',
  
  // Environment
  NODE_ENV: import.meta.env.MODE || 'development',
  
  // App configuration
  APP_NAME: 'NexBrief',
  APP_VERSION: '1.0.0',
  
  // API endpoints
  API_ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      LOGOUT: '/api/auth/logout'
    },
    PROFILE: {
      GET: '/api/profile/me',
      UPDATE: '/api/profile'
    },
    NEWS: {
      GET: '/api/news',
      BREAKING: '/api/news/breaking',
      CATEGORY: (category) => `/api/news/${category}`,
      SEARCH: '/api/news/search'
    },
    BOOKMARKS: {
      GET: '/api/bookmarks',
      CREATE: '/api/bookmarks',
      DELETE: (id) => `/api/bookmarks/${id}`
    },
    AI: {
      SUMMARY: '/api/ai/summary'
    }
  },
  
  // Validation
  isValidBackendUrl() {
    return this.BACKEND_URL && this.BACKEND_URL !== 'undefined';
  },
  
  // Get full API URL
  getApiUrl(endpoint) {
    if (!this.isValidBackendUrl()) {
      console.error('Backend URL not configured. Please set VITE_BACKEND_URL environment variable.');
      return null;
    }
    return `${this.BACKEND_URL}${endpoint}`;
  }
};

export default config; 