import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';
import StudentLayout from './layouts/StudentLayout';

import Login from './pages/public/Login';
import Register from './pages/public/Register';

import Dashboard from './pages/student/Dashboard';
import NewComplaint from './pages/student/NewComplaint';
import MyComplaints from './pages/student/MyComplaints';
import ComplaintDetails from './pages/student/ComplaintDetails';
import Profile from './pages/student/Profile';

function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-2 text-2xl font-semibold text-text-primary">Access Denied</h1>
        <p className="text-text-secondary">You don't have permission to view this page.</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected + role-scoped routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allowedRoles={['student']} />}>
            <Route element={<StudentLayout />}>
              <Route path="/student/dashboard" element={<Dashboard />} />
              <Route path="/student/complaints/new" element={<NewComplaint />} />
              <Route path="/student/complaints" element={<MyComplaints />} />
              <Route path="/student/complaints/:id" element={<ComplaintDetails />} />
              <Route path="/student/profile" element={<Profile />} />
            </Route>
          </Route>
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;