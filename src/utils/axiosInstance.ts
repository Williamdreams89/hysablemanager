// src/utils/axiosInstance.ts
import axios from 'axios';

// *** Your Django backend API base URL ***
const API_BASE_URL = 'https://server.schsms.xyz' ; 
// const API_BASE_URL = 'http://127.0.0.1:8000' ; 

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach the access token
instance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token'); // Get access token
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration (401 Unauthorized)
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 Unauthorized and not a refresh request, try to refresh token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark this request as retried
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          // *** Replace with your actual token refresh endpoint ***
          const refreshResponse = await axios.post(`${API_BASE_URL}/users/token/refresh/`, {
            refresh: refreshToken,
          });

          const newAccessToken = refreshResponse.data.access;
          // Update localStorage and AuthContext (assuming AuthContext is somehow accessible or updated by a global event)
          localStorage.setItem('accessToken', newAccessToken);
          // Recalculate and store new expiration if provided by backend, otherwise use default
          // For Django Simple JWT, a new expiration is implied by new access token, typically 5 mins.
          // You might need to decode the new access token to get its actual 'exp' claim.
          // For simplicity, we'll assume a fixed short duration for now if not provided directly.
          localStorage.setItem('accessTokenExpiration', new Date(new Date().getTime() + 5 * 606000 * 1000).toISOString()); // 5 minutes default

          // Retry the original request with the new access token
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return instance(originalRequest); // Use the configured instance to retry
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          // If refresh fails, log out the user
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('accessTokenExpiration');
          // You might want to navigate to login page here, or let AuthContext handle it
          window.location.href = '/login'; // Force redirect for now
        }
      } else {
        // No refresh token, force logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessTokenExpiration');
        window.location.href = '/login'; // Force redirect
      }
    }
    return Promise.reject(error);
  }
);

export default instance;