import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UserHome() {
  const navigate = useNavigate();
  const name = localStorage.getItem('name') || "User";
  const userId = localStorage.getItem('userId');
  
  const [newPassword, setNewPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await axios.put('https://data-collector-backend.onrender.com/api/users/password', { userId, newPassword });
      setPwdMsg("✅ Password updated successfully!");
      setNewPassword('');
    } catch (err) {
      setPwdMsg("❌ Failed to update password.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6">
      <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-lg shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {name}!</h1>
          <p className="text-gray-500 mt-1">Select a data type to start collecting.</p>
        </div>
        <button onClick={handleLogout} className="text-red-500 font-semibold hover:text-red-700 transition">
          Log Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <button 
          onClick={() => navigate('/add-phone')}
          className="h-40 bg-white shadow-md rounded-xl flex flex-col items-center justify-center text-2xl font-bold text-blue-600 hover:bg-blue-50 hover:scale-[1.02] transition duration-200 border-2 border-transparent hover:border-blue-200"
        >
          <span className="text-4xl mb-2">📱</span>
          Add Phone Number
        </button>
        <button 
          onClick={() => navigate('/add-facebook')}
          className="h-40 bg-white shadow-md rounded-xl flex flex-col items-center justify-center text-2xl font-bold text-blue-600 hover:bg-blue-50 hover:scale-[1.02] transition duration-200 border-2 border-transparent hover:border-blue-200"
        >
          <span className="text-4xl mb-2">🌐</span>
          Add Facebook Link
        </button>
      </div>

      {/* NEW: Change Password Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm max-w-md border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Account Settings</h2>
        {pwdMsg && <div className="mb-4 text-sm font-semibold">{pwdMsg}</div>}
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <input 
            type="password" 
            placeholder="Enter New Password" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded font-semibold hover:bg-gray-900 transition">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}