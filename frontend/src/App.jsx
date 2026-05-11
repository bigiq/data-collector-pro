import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import UserHome from './pages/UserHome';
import AddData from './pages/AddData';
import AdminHome from './pages/AdminHome';

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children, requireAdmin }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) return <Navigate to="/" replace />;
  if (requireAdmin && role !== 'admin') return <Navigate to="/user-home" replace />;
  return children;
};

function App() {
  return (
    <HashRouter>
      {/* 💅 UI UPGRADE: Beautiful soft ambient gradient background */}
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 text-slate-800 font-sans selection:bg-indigo-100">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/user-home" element={<ProtectedRoute><UserHome /></ProtectedRoute>} />
          <Route path="/add-phone" element={<ProtectedRoute><AddData type="phone" /></ProtectedRoute>} />
          <Route path="/add-facebook" element={<ProtectedRoute><AddData type="facebook" /></ProtectedRoute>} />
          <Route path="/admin-home" element={<ProtectedRoute requireAdmin={true}><AdminHome /></ProtectedRoute>} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;