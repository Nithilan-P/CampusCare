import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';
import StudentLayout from './layouts/StudentLayout';
import StaffLayout from './layouts/StaffLayout';
import AdminLayout from './layouts/AdminLayout';

import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Landing from './pages/public/Landing';

import StudentDashboard from './pages/student/Dashboard';
import NewComplaint from './pages/student/NewComplaint';
import MyComplaints from './pages/student/MyComplaints';
import StudentComplaintDetails from './pages/student/ComplaintDetails';
import StudentProfile from './pages/student/Profile';

import StaffDashboard from './pages/staff/Dashboard';
import AssignedComplaints from './pages/staff/AssignedComplaints';
import StaffComplaintDetails from './pages/staff/ComplaintDetails';
import StaffProfile from './pages/staff/Profile';

import AdminDashboard from './pages/admin/Dashboard';
import AllComplaints from './pages/admin/AllComplaints';
import AdminComplaintDetails from './pages/admin/ComplaintDetails';
import ManageStudents from './pages/admin/ManageStudents';
import ManageStaff from './pages/admin/ManageStaff';
import Reports from './pages/admin/Reports';
import AdminProfile from './pages/admin/Profile';

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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allowedRoles={['student']} />}>
            <Route element={<StudentLayout />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/complaints/new" element={<NewComplaint />} />
              <Route path="/student/complaints" element={<MyComplaints />} />
              <Route path="/student/complaints/:id" element={<StudentComplaintDetails />} />
              <Route path="/student/profile" element={<StudentProfile />} />
            </Route>
          </Route>

          <Route element={<RoleRoute allowedRoles={['staff']} />}>
            <Route element={<StaffLayout />}>
              <Route path="/staff/dashboard" element={<StaffDashboard />} />
              <Route path="/staff/complaints" element={<AssignedComplaints />} />
              <Route path="/staff/complaints/:id" element={<StaffComplaintDetails />} />
              <Route path="/staff/profile" element={<StaffProfile />} />
            </Route>
          </Route>

          <Route element={<RoleRoute allowedRoles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/complaints" element={<AllComplaints />} />
              <Route path="/admin/complaints/:id" element={<AdminComplaintDetails />} />
              <Route path="/admin/students" element={<ManageStudents />} />
              <Route path="/admin/staff" element={<ManageStaff />} />
              <Route path="/admin/reports" element={<Reports />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
            </Route>
          </Route>
        </Route>

        <Route path="/" element={<Landing />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;