import { API_BASE_URL } from './api';

const API_URL = API_BASE_URL;

export const getPatients = async () => {
  const response = await fetch(`${API_URL}/patients`);
  if (!response.ok) throw new Error('Failed to fetch patients');
  return await response.json();
};

export const getPatientById = async (id) => {
  const response = await fetch(`${API_URL}/patients/${id}`);
  if (!response.ok) throw new Error('Failed to fetch patient');
  return await response.json();
};

export const patientService = {
  // Get all patients
  getAllPatients: async () => {
    try {
      const response = await fetch(`${API_URL}/patients`);
      if (!response.ok) throw new Error('Failed to fetch patients');
      return await response.json();
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  },

  // Get single patient
  getPatientById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/patients/${id}`);
      if (!response.ok) throw new Error('Failed to fetch patient');
      return await response.json();
    } catch (error) {
      console.error('Error fetching patient:', error);
      throw error;
    }
  },

  // Create new patient
  createPatient: async (patientData) => {
    try {
      const response = await fetch(`${API_URL}/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });
      if (!response.ok) throw new Error('Failed to create patient');
      return await response.json();
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  },

  // Update patient
  updatePatient: async (id, patientData) => {
    try {
      const response = await fetch(`${API_URL}/patients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });
      if (!response.ok) throw new Error('Failed to update patient');
      return await response.json();
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
  },

  // Delete patient
  deletePatient: async (id) => {
    try {
      const response = await fetch(`${API_URL}/patients/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete patient');
      return await response.json();
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw error;
    }
  },

  // Upload file for patient
  uploadPatientFile: async (patientId, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/patients/${patientId}/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload file');
      return await response.json();
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },
}; 