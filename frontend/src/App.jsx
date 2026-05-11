import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import UserHome from './pages/UserHome';
import AddData from './pages/AddData';
import AdminHome from './pages/AdminHome';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/user-home" element={<UserHome />} />
          <Route path="/add-phone" element={<AddData type="phone" />} />
          <Route path="/add-facebook" element={<AddData type="facebook" />} />
          <Route path="/admin-home" element={<AdminHome />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
