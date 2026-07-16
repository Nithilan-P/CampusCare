import api from './axios';

export const registerStudent = (payload) => api.post('/auth/register', payload);

export const loginUser = (payload) => api.post('/auth/login', payload);

export const getProfile = () => api.get('/auth/profile');

export const updateProfile = (payload) => api.put('/auth/profile', payload);

export const changePassword = (payload) => api.put('/auth/change-password', payload);