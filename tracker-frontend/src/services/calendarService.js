import axios from 'axios';
import { API_BASE_URL } from './api';

/**
 * Calendar Service
 * Handles Google Calendar integration and event management
 */
class CalendarService {
  /**
   * Fetch calendar events for a specific date
   * @param {Date|string} date - Date to fetch events for
   * @returns {Promise<Array>} Array of calendar events
   */
  async getEvents(date) {
    try {
      const dateStr = date instanceof Date ? date.toISOString() : date;
      const response = await axios.get(`${API_BASE_URL}/calendar`, {
        params: { date: dateStr }
      });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }
  }

  /**
   * Fetch calendar events for a date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Array>} Array of calendar events
   */
  async getEventsRange(startDate, endDate) {
    try {
      const response = await axios.get(`${API_BASE_URL}/calendar/range`, {
        params: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        }
      });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching calendar events range:', error);
      return [];
    }
  }

  /**
   * Create a new calendar event
   * @param {Object} eventData - Event data
   * @returns {Promise<Object>} Created event
   */
  async createEvent(eventData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/calendar`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }

  /**
   * Update an existing calendar event
   * @param {string} eventId - Event ID
   * @param {Object} eventData - Updated event data
   * @returns {Promise<Object>} Updated event
   */
  async updateEvent(eventId, eventData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/calendar/${eventId}`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }
  }

  /**
   * Delete a calendar event
   * @param {string} eventId - Event ID
   * @returns {Promise<void>}
   */
  async deleteEvent(eventId) {
    try {
      await axios.delete(`${API_BASE_URL}/calendar/${eventId}`);
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  }

  /**
   * Initialize Google Calendar OAuth
   * @returns {Promise<string>} Authorization URL
   */
  async initiateAuth() {
    try {
      console.log('Initiating Google Calendar auth, API URL:', `${API_BASE_URL}/calendar/auth`);
      const response = await axios.get(`${API_BASE_URL}/calendar/auth`, {
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.data || !response.data.authUrl) {
        throw new Error('Invalid response from server: missing authUrl');
      }
      
      console.log('Auth URL received:', response.data.authUrl);
      return response.data.authUrl;
    } catch (error) {
      console.error('Error initiating Google Calendar auth:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      
      // Provide more specific error messages
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        throw new Error('Cannot connect to backend server. Please ensure the backend is running on port 5000.');
      }
      if (error.response?.status === 500) {
        throw new Error(error.response.data?.error || 'Server error. Please check backend logs.');
      }
      throw error;
    }
  }

  /**
   * Check if Google Calendar is connected
   * @returns {Promise<boolean>}
   */
  async isConnected() {
    try {
      const response = await axios.get(`${API_BASE_URL}/calendar/status`);
      return response.data.connected || false;
    } catch (error) {
      console.error('Error checking calendar connection status:', error);
      return false;
    }
  }
}

export default new CalendarService();
