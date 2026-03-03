/**
 * Dynamic API base URL configuration
 * - If running on localhost, use http://localhost:5000/api
 * - Otherwise, use VITE_API_URL environment variable (set in Vercel)
 */
const getApiBaseUrl = () => {
  // Check if running on localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  
  // Use VITE_API_URL from environment variables (set in Vercel)
  return import.meta.env.VITE_API_URL || '/api';
};

export const API_BASE_URL = getApiBaseUrl();

// Export a function to get the base URL (useful for dynamic checks)
export const getBaseUrl = () => API_BASE_URL;
