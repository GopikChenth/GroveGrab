/**
 * API Service - Communication with Flask backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiService {
  /**
   * Make API request
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Backend server is not responding correctly. Make sure the server is running on http://localhost:5000');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      
      // Provide more helpful error messages
      if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
        throw new Error('Cannot connect to backend server. Please make sure the Flask server is running on port 5000.');
      }
      
      throw error;
    }
  }

  /**
   * Get server health status
   */
  async healthCheck() {
    return this.request('/health');
  }

  /**
   * Get configuration
   */
  async getConfig() {
    return this.request('/api/config');
  }

  /**
   * Update configuration
   */
  async updateConfig(config) {
    return this.request('/api/config', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  /**
   * Validate Spotify URL
   */
  async validateUrl(url) {
    return this.request('/api/validate-url', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
  }

  /**
   * Preload metadata
   */
  async preloadMetadata(url) {
    return this.request('/api/preload', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
  }

  /**
   * Start download
   */
  async startDownload(url, downloadPath = null) {
    return this.request('/api/download', {
      method: 'POST',
      body: JSON.stringify({ url, download_path: downloadPath }),
    });
  }

  /**
   * Get all tasks
   */
  async getTasks() {
    return this.request('/api/tasks');
  }

  /**
   * Get specific task
   */
  async getTask(taskId) {
    return this.request(`/api/tasks/${taskId}`);
  }

  /**
   * Retry failed tracks
   */
  async retryTask(taskId) {
    return this.request(`/api/tasks/${taskId}/retry`, {
      method: 'POST',
    });
  }

  /**
   * Cancel task
   */
  async cancelTask(taskId) {
    return this.request(`/api/tasks/${taskId}/cancel`, {
      method: 'POST',
    });
  }

  /**
   * Delete task
   */
  async deleteTask(taskId) {
    return this.request(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get task logs
   */
  async getTaskLogs(taskId) {
    return this.request(`/api/logs/${taskId}`);
  }
}

export default new ApiService();
