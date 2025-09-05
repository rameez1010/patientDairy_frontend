import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

class DoctorApiService {
  constructor() {
    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor to add access token to headers
    axios.interceptors.request.use(
      (config) => {
        if (
          config.url?.includes('/doctors/') ||
          config.url?.includes('/patients/') ||
          config.url?.includes('/fullscript/') ||
          config.url?.includes('/ai-knowledge/')
        ) {
          const accessToken = localStorage.getItem('jwtToken');
          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor to handle token refresh and new response structure
    axios.interceptors.response.use(
      (response) => {
        const data = response?.data;
        const nestedData = data?.data;

        const hasNestedSuccess = nestedData !== null && typeof nestedData === 'object' && 'success' in nestedData;

        if (hasNestedSuccess && nestedData.success === false) {
          const error = new Error(nestedData.message || 'API request failed');
          error.response = response;
          error.statusCode = nestedData.statusCode;
          error.errors = nestedData.errors;
          return Promise.reject(error);
        }

        return response;
      },

      async (error) => {
        const originalRequest = error.config;

        // Check if it's a doctor API request and token is expired
        const isDoctorToken = localStorage.getItem('jwtToken') && !localStorage.getItem('jwtPatientToken');
        if (
          error.response?.status === 401 &&
          isDoctorToken &&
          (originalRequest.url?.includes('/doctors/') ||
            originalRequest.url?.includes('/patients/') ||
            originalRequest.url?.includes('/fullscript/') ||
            originalRequest.url?.includes('/ai-knowledge/')) &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          if (originalRequest.url?.includes('/doctors/refresh-token')) {
            throw new Error('Refresh token expired');
          }
          try {
            const refreshToken = localStorage.getItem('jwtRefreshToken');
            if (!refreshToken) throw new Error('No refresh token available');

            const response = await axios.post(`${API_URL}/doctors/refresh-token`, {
              refresh_token: refreshToken,
            });

            const tokenData = response?.data?.success ? response.data.data : response.data;
            const access_token = tokenData.access_token;
            const refresh_token = tokenData.refresh_token;

            localStorage.setItem('jwtToken', access_token);
            localStorage.setItem('jwtRefreshToken', refresh_token);

            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return axios(originalRequest);
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            this.logout();
            window.location.href = '/';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  // Store tokens after successful login/OTP verification
  storeTokens(accessToken, refreshToken) {
    localStorage.setItem('jwtToken', accessToken);
    localStorage.setItem('jwtRefreshToken', refreshToken);
  }

  // Get current access token
  getAccessToken() {
    return localStorage.getItem('jwtToken');
  }

  // Get current refresh token
  getRefreshToken() {
    return localStorage.getItem('jwtRefreshToken');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getAccessToken() && !!this.getRefreshToken();
  }

  // Logout user and clear tokens
  async logout() {
    const refreshToken = this.getRefreshToken();

    if (refreshToken) {
      try {
        // Call logout endpoint to invalidate refresh token on server
        await axios.post(`${API_URL}/doctors/logout`, {
          refresh_token: refreshToken,
        });
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }

    // Clear tokens from localStorage
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('jwtRefreshToken');
  }

  // Manually refresh token
  async refreshToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(`${API_URL}/doctors/refresh-token`, {
        refresh_token: refreshToken,
      });

      // Handle new response structure
      let access_token, refresh_token;
      if (response.data.success) {
        access_token = response.data.data.access_token;
        refresh_token = response.data.data.refresh_token;
      } else {
        // Fallback to old structure
        access_token = response.data.access_token;
        refresh_token = response.data.refresh_token;
      }

      this.storeTokens(access_token, refresh_token);

      return { access_token, refresh_token };
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.logout();
      throw error;
    }
  }

  // Make authenticated API requests
  async makeRequest(method, url, data = null, config = {}) {
    const response = await axios({
      method,
      url: `${API_URL}${url}`,
      data,
      ...config,
    });
    return response;
  }

  // Convenience methods for common HTTP methods
  async get(url, config = {}) {
    return this.makeRequest('GET', url, null, config);
  }

  async post(url, data, config = {}) {
    return this.makeRequest('POST', url, data, config);
  }

  async put(url, data, config = {}) {
    return this.makeRequest('PUT', url, data, config);
  }

  async delete(url, config = {}) {
    return this.makeRequest('DELETE', url, null, config);
  }
}

// Create and export a singleton instance
const doctorApiService = new DoctorApiService();
export default doctorApiService;
