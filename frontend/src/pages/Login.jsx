import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/login', { username, password });
      
      // Save user details to browser memory
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('name', res.data.name);
      localStorage.setItem('userId', res.data.userId);
      
      if (res.data.role === 'admin') {
        navigate('/admin-home'); // We will build this later
      } else {
        navigate('/user-home');
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login Failed. Check your credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">DataFlow Pro</h2>
        {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-center text-sm">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-5">
          <input 
            type="text" placeholder="Username" required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input 
            type="password" placeholder="Password" required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition font-semibold">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}