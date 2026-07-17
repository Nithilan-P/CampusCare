import api from './axios';

export const createComplaint = (formData) =>
  api.post('/complaints', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getMyComplaints = (params) => api.get('/complaints/my', { params });

export const getAllComplaints = (params) => api.get('/complaints', { params });

export const getAssignedComplaints = () => api.get('/complaints/assigned');

export const getComplaintById = (id) => api.get(`/complaints/${id}`);

export const updateComplaint = (id, payload) => api.put(`/complaints/${id}`, payload);

export const deleteComplaint = (id) => api.delete(`/complaints/${id}`);

export const updateComplaintStatus = (id, formData) =>
  api.put(`/complaints/${id}/status`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const addStaffNotes = (id, payload) => api.put(`/complaints/${id}/notes`, payload);

export const assignComplaint = (id, payload) => api.put(`/complaints/${id}/assign`, payload);

export const updateComplaintPriority = (id, payload) => api.put(`/complaints/${id}/priority`, payload);