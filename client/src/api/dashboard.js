import api from './axios';

export const getStudentDashboard = () => api.get('/dashboard/student');

export const getStaffDashboard = () => api.get('/dashboard/staff');

export const getAdminDashboard = () => api.get('/dashboard/admin');