import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import StudentLogin from './pages/student/StudentLogin.jsx'
import StudentSignup from './pages/student/StudentSignup.jsx'
import StudentDashboard from './pages/student/StudentDashboard.jsx'
import BrowseItems from './pages/student/BrowseItems.jsx'
import MyReports from './pages/student/MyReports.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/student/login" replace />} />
      <Route path="/student/login" element={<StudentLogin />} />
      <Route path="/student/signup" element={<StudentSignup />} />
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute requireAuth redirectTo="/student/login">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/browse"
        element={
          <ProtectedRoute requireAuth redirectTo="/student/login">
            <BrowseItems />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/my-reports"
        element={
          <ProtectedRoute requireAuth redirectTo="/student/login">
            <MyReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/*"
        element={
          <ProtectedRoute requireAuth redirectTo="/student/login">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requireAuth allowedRoles={['admin']} redirectTo="/admin/login">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  )
}

export default App
