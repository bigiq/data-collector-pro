import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UserHome() {
  const navigate = useNavigate();
  const name = localStorage.getItem('name') || "User";
  const userId = localStorage.getItem('userId');
  const [newPassword, setNewPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await axios.put('https://data-collector-backend.onrender.com/api/users/password', { userId, newPassword });
      setPwdMsg("✅ Password updated successfully!");
      setNewPassword('');
    } catch (err) { setPwdMsg("❌ Failed to update password."); }
  };

  return (
    <div className="max-w-5xl mx-auto mt-12 p-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-white">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">{name}</span>! 👋</h1>
          <p className="text-slate-500 mt-2 text-lg">Select a category below to start collecting data.</p>
        </div>
        <button onClick={handleLogout} className="mt-4 md:mt-0 px-6 py-2 bg-red-50 text-red-600 font-bold rounded-full hover:bg-red-100 hover:text-red-700 transition-colors">
          Log Out
        </button>
      </div>

      {/* 💅 UI UPGRADE: Interactive Hover Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <button onClick={() => navigate('/add-phone')} className="group h-56 bg-white/80 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl flex flex-col items-center justify-center border border-white hover:bg-gradient-to-br hover:from-indigo-600 hover:to-blue-600 hover:text-white hover:shadow-xl hover:shadow-indigo-500/20 transform hover:-translate-y-2 transition-all duration-300">
          <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
            <span className="text-4xl group-hover:scale-110 transition-transform">📱</span>
          </div>
          <span className="text-2xl font-bold text-slate-800 group-hover:text-white">Add Phone Number</span>
        </button>
        
        <button onClick={() => navigate('/add-facebook')} className="group h-56 bg-white/80 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl flex flex-col items-center justify-center border border-white hover:bg-gradient-to-br hover:from-indigo-600 hover:to-blue-600 hover:text-white hover:shadow-xl hover:shadow-indigo-500/20 transform hover:-translate-y-2 transition-all duration-300">
          <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
            <span className="text-4xl group-hover:scale-110 transition-transform">🌐</span>
          </div>
          <span className="text-2xl font-bold text-slate-800 group-hover:text-white">Add Facebook Link</span>
        </button>
      </div>

      <div className="bg-white/70 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-white max-w-md">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center"><span className="mr-2">🔒</span> Account Settings</h2>
        {pwdMsg && <div className="mb-6 p-3 bg-slate-50 border border-slate-100 rounded-lg text-sm font-semibold">{pwdMsg}</div>}
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <input type="password" placeholder="Enter New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
            className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-700" />
          <button type="submit" className="w-full bg-slate-800 text-white p-4 rounded-xl font-bold hover:bg-slate-900 hover:shadow-lg transition-all duration-200">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}