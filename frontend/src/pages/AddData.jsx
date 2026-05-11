import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
export default function AddData({ type }) {
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const isPhone = type === 'phone';
  const title = isPhone ? "Add Phone Number" : "Add Facebook Link";
  const placeholder = isPhone ? "e.g., 01712345678 or +88017..." : "https://www.facebook.com/profile...";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('name');

    const endpoint = isPhone ? '/api/phones' : '/api/facebook';
    const payload = isPhone 
      ? { number: inputValue, userId, userName } 
      : { link: inputValue, userId, userName };

    try {
      const res = await axios.post(`http://localhost:5000${endpoint}`, payload);
      setMessage(res.data.message);
      setIsError(false);
      setInputValue(''); // Clear input for the next entry
    } catch (err) {
      setMessage(err.response?.data?.error || "An error occurred");
      setIsError(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6">
      <button onClick={() => navigate('/user-home')} className="text-blue-500 hover:underline mb-6 font-semibold">
        &larr; Back to Dashboard
      </button>

      <div className="bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>

        {message && (
          <div className={`p-4 rounded mb-6 font-medium ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            required
            className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition font-bold text-lg">
            Submit Entry
          </button>
        </form>
      </div>
    </div>
  );
}