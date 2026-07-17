import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import Login from '../pages/Login.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Students from '../pages/Students.jsx';
import StudentForm from '../pages/StudentForm.jsx';
import Attendance from '../pages/Attendance.jsx';
import Payments from '../pages/Payments.jsx';
import Users from '../pages/Users.jsx';
import Profile from '../pages/Profile.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute />}>
        <Route index element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="students/new" element={<StudentForm />} />
        <Route path="students/:id" element={<StudentForm />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="payments" element={<Payments />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="/users" element={<ProtectedRoute allowedRoles={['Admin']} />}> 
        <Route index element={<Users />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
