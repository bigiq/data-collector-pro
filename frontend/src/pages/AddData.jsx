import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddData({ type }) {
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const isPhone = type === 'phone';
  const title = isPhone ? "Add Phone Number" : "Add Facebook Link";
  const placeholder = isPhone ? "e.g., 01712345678 or +88017..." : "https://www.facebook.com/profile...";
  const icon = isPhone ? "📱" : "🌐";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('name');
    const endpoint = isPhone ? '/api/phones' : '/api/facebook';
    const payload = isPhone ? { number: inputValue, userId, userName } : { link: inputValue, userId, userName };

    try {
      const res = await axios.post(`https://data-collector-backend.onrender.com${endpoint}`, payload);
      setMessage(`✅ ${res.data.message}`);
      setIsError(false);
      setInputValue(''); 
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.error || "An error occurred"}`);
      setIsError(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6">
      <button onClick={() => navigate('/user-home')} className="flex items-center text-indigo-600 hover:text-indigo-800 font-bold mb-8 transition-colors group">
        <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Dashboard
      </button>

      <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
        <div className="flex items-center mb-8">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mr-4 text-2xl">{icon}</div>
          <h2 className="text-3xl font-extrabold text-slate-800">{title}</h2>
        </div>

        {message && (
          <div className={`p-5 rounded-2xl mb-8 font-bold flex items-center ${isError ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={placeholder} required
            className="w-full p-6 bg-slate-50/50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-xl placeholder-slate-400" />
          <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-5 rounded-2xl hover:shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5 transition-all duration-200 font-bold text-xl">
            Submit Data
          </button>
        </form>
      </div>
    </div>
  );
}