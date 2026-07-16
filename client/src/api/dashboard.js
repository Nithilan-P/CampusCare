import api from './axios';

export const getStudentDashboard = () => api.get('/dashboard/student');