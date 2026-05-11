import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import UserHome from './pages/UserHome';
import AddData from './pages/AddData';
import AdminHome from './pages/AdminHome';

// --- THE BOUNCER (Protected Route Wrapper) ---
// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children, requireAdmin }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // 1. If they have no token (not logged in), kick them to the login screen
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // 2. If the page requires Admin access, but they are just a "general" boy, kick them to their user home
  if (requireAdmin && role !== 'admin') {
    return <Navigate to="/user-home" replace />;
  }

  // 3. If they pass the checks, let them see the page!
  return children;
};

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Login />} />

          {/* Protected Routes for Everyone (Admin & General) */}
          <Route path="/user-home" element={
            <ProtectedRoute>
              <UserHome />
            </ProtectedRoute>
          } />
          <Route path="/add-phone" element={
            <ProtectedRoute>
              <AddData type="phone" />
            </ProtectedRoute>
          } />
          <Route path="/add-facebook" element={
            <ProtectedRoute>
              <AddData type="facebook" />
            </ProtectedRoute>
          } />

          {/* Protected Route for Admin ONLY */}
          <Route path="/admin-home" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminHome />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;