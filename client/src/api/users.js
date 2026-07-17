import api from './axios';

export const createStaff = (payload) => api.post('/users/staff', payload);

export const getUsers = (params) => api.get('/users', { params });

export const updateUser = (id, payload) => api.put(`/users/${id}`, payload);

export const deleteUser = (id) => api.delete(`/users/${id}`);