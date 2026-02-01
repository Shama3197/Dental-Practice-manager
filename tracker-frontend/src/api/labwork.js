import axios from 'axios';
const API = axios.create({ baseURL: 'http://localhost:5000/api/labwork' });

// Get all labwork with pagination and filtering
export const getLabWorks = (params = {}) => API.get('/', { params });

// Get labwork statistics
export const getLabWorkStats = () => API.get('/stats');

// Get single labwork entry
export const getLabWork = (id) => API.get(`/${id}`);

// Create new labwork entry
export const addLabWork = (data) => API.post('/', data);

// Update labwork entry
export const updateLabWork = (id, data) => API.put(`/${id}`, data);

// Delete labwork entry
export const deleteLabWork = (id) => API.delete(`/${id}`);

// Upload file for labwork
export const uploadLabWorkFile = (id, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return API.post(`/${id}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// Add progress image
export const addProgressImage = (id, image, stage, description) => {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('stage', stage);
  formData.append('description', description);
  return API.post(`/${id}/progress`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// Update labwork status
export const updateLabWorkStatus = (id, status, notes) => API.patch(`/${id}/status`, { status, notes }); 