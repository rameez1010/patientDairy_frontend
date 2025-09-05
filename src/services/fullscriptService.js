import doctorApiService from './doctorApiService';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Service to handle all Fullscript API interactions
 */
class FullscriptService {
  /**
   * Get a secret token for Fullscript session
   * @returns {Promise<string>} The secret token
   */
  async getSessionGrantToken() {
    try {
      const token = doctorApiService.getAccessToken();
      const response = await fetch(`${API_URL}/fullscript/session-grant-token`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to refresh Fullscript token');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to get Fullscript token');
      }

      return result.data.secret_token;
    } catch (error) {
      console.error('Error getting Fullscript token:', error);
      throw error;
    }
  }

  async addPatientToFullscript(patientId) {
    try {
      const token = doctorApiService.getAccessToken();
      const response = await fetch(`${API_URL}/fullscript/patients/${patientId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to add patient to Fullscript');
      }

      return { success: true, data: result.data };
    } catch (error) {
      console.error('Error adding patient to Fullscript:', error);
      return { success: false, error: error.message || error };
    }
  }

  /**
   * Get all treatment plans for a patient
   * @param {string} patientId - The patient ID
   * @returns {Promise<Object>} Treatment plans data
   */
  async getTreatmentPlans(patientId) {
    try {
      const token = doctorApiService.getAccessToken();
      const response = await fetch(`${API_URL}/fullscript/patients/${patientId}/treatment-plans`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch treatment plans');
      }

      return { success: true, data: result.data };
    } catch (error) {
      console.error('Error fetching treatment plans:', error);
      return { success: false, error: error.message || error };
    }
  }

  /**
   * Get a single treatment plan
   * @param {string} patientId - The patient ID
   * @param {string} planId - The treatment plan ID
   * @returns {Promise<Object>} Treatment plan data
   */
  async getTreatmentPlan(patientId, planId) {
    try {
      const token = doctorApiService.getAccessToken();
      const response = await fetch(`${API_URL}/fullscript/patients/${patientId}/treatment-plans/${planId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch treatment plan');
      }

      return { success: true, data: result.data };
    } catch (error) {
      console.error('Error fetching treatment plan:', error);
      return { success: false, error: error.message || error };
    }
  }

  /**
   * Cancel a treatment plan
   * @param {string} patientId - The patient ID
   * @param {string} planId - The treatment plan ID
   * @returns {Promise<Object>} Response data
   */
  async cancelTreatmentPlan(patientId, planId) {
    try {
      const token = doctorApiService.getAccessToken();
      const response = await fetch(`${API_URL}/fullscript/patients/${patientId}/treatment-plans/${planId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to cancel treatment plan');
      }

      return { success: true, data: result.data };
    } catch (error) {
      console.error('Error cancelling treatment plan:', error);
      return { success: false, error: error.message || error };
    }
  }

  // Add more Fullscript API methods as needed
}

export default new FullscriptService();
