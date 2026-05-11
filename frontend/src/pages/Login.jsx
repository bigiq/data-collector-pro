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
      const res = await axios.post('https://data-collector-backend.onrender.com/api/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('name', res.data.name);
      localStorage.setItem('userId', res.data.userId);
      
      if (res.data.role === 'admin') navigate('/admin-home');
      else navigate('/user-home');
    } catch (err) {
      setError(err.response?.data?.error || "Login Failed. Check your credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen px-4">
      {/* 💅 UI UPGRADE: Glassmorphism Card */}
      <div className="bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white w-full max-w-md">
        
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-tr from-indigo-600 to-blue-500 p-3 rounded-2xl mb-4 shadow-lg shadow-indigo-200">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">DataFlow Pro</h2>
          <p className="text-slate-500 mt-2">Sign in to your account</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm border border-red-100 flex items-center"><span className="mr-2">⚠️</span>{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <input type="text" placeholder="Username" required onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-700 placeholder-slate-400" />
          </div>
          <div>
            <input type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-700 placeholder-slate-400" />
          </div>
          
          {/* 💅 UI UPGRADE: Glowing animated button */}
          <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5 transition-all duration-200 font-bold text-lg mt-2">
            Sign In &rarr;
          </button>
        </form>
      </div>
    </div>
  );
}