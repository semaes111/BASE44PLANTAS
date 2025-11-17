/**
 * Base44 API Client - Vanilla JavaScript implementation
 * Provides authentication and API communication for Base44 apps
 */

const API_BASE_URL = 'https://api.base44.com';
const APP_ID = '691a4d93ce82cd0d020550b1';

class Base44Client {
  constructor(config = {}) {
    this.appId = config.appId || APP_ID;
    this.requiresAuth = config.requiresAuth !== false;
    this.baseUrl = config.baseUrl || API_BASE_URL;
    this.accessToken = null;
  }

  /**
   * Get the current access token from localStorage
   */
  getAccessToken() {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('base44_access_token');
    }
    return this.accessToken;
  }

  /**
   * Set the access token
   */
  setAccessToken(token) {
    this.accessToken = token;
    if (token) {
      localStorage.setItem('base44_access_token', token);
    } else {
      localStorage.removeItem('base44_access_token');
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getAccessToken();
  }

  /**
   * Make an authenticated request to the API
   */
  async request(endpoint, options = {}) {
    const token = this.getAccessToken();

    if (this.requiresAuth && !token) {
      throw new Error('Authentication required');
    }

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Create and export default client instance
export const base44Client = new Base44Client();

export default Base44Client;
