const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiService {
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

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Backend server is not responding correctly at ${API_BASE_URL}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);

      if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
        throw new Error(`Cannot connect to backend server at ${API_BASE_URL}. Ensure the server is running.`);
      }

      throw error;
    }
  }

  async getConfig() {
    return this.request('/api/config');
  }

  async updateConfig(config) {
    return this.request('/api/config', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async startDownload(url, downloadPath = null) {
    return this.request('/api/download', {
      method: 'POST',
      body: JSON.stringify({ url, download_path: downloadPath }),
    });
  }

  async getTasks() {
    return this.request('/api/tasks');
  }

  async retryTask(taskId) {
    return this.request(`/api/tasks/${taskId}/retry`, {
      method: 'POST',
    });
  }

  async cancelTask(taskId) {
    return this.request(`/api/tasks/${taskId}/cancel`, {
      method: 'POST',
    });
  }

  async deleteTask(taskId) {
    return this.request(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  async getTaskLogs(taskId) {
    return this.request(`/api/logs/${taskId}`);
  }
}

export default new ApiService();
