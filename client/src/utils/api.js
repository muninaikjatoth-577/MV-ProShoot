// Centralized API configuration for Local Dev and Production (Vercel -> Render)
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? ''
    : 'https://mv-proshoot-backend.onrender.com')
).replace(/\/$/, '');

export const apiUrl = (endpoint) => {
  if (endpoint.startsWith('http')) return endpoint;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};

export default apiUrl;
