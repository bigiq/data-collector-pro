import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminHome() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('phones'); 
  const [phones, setPhones] = useState([]);
  const [facebook, setFacebook] = useState([]);
  const [workers, setWorkers] = useState([]); 
  
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [userMsg, setUserMsg] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [phoneRes, fbRes, workerRes] = await Promise.all([
        axios.get('https://data-collector-backend.onrender.com/api/phones'),
        axios.get('https://data-collector-backend.onrender.com/api/facebook'),
        axios.get('https://data-collector-backend.onrender.com/api/users')
      ]);
      setPhones(phoneRes.data); setFacebook(fbRes.data); setWorkers(workerRes.data);
    } catch (error) { console.error("Error fetching data", error); }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://data-collector-backend.onrender.com/api/users', { username: newUsername, password: newPassword, assignedName: newName });
      setUserMsg("✅ Worker created successfully!");
      setNewUsername(''); setNewPassword(''); setNewName('');
      fetchData(); 
    } catch (err) { setUserMsg("❌ " + (err.response?.data?.error || "Error creating user")); }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}'s account?`)) return;
    try { await axios.delete(`https://data-collector-backend.onrender.com/api/users/${id}`); fetchData(); } 
    catch (error) { alert("Failed to delete user"); }
  };

  const downloadCSV = (data, filename, type) => {
    let csvContent = `data:text/csv;charset=utf-8,${type},Collected By,Date\n`;
    data.forEach(item => {
      const date = new Date(item.createdAt).toLocaleDateString();
      const val = type === 'Number' ? `="${item.number}"` : item.link;
      csvContent += `${val},${item.addedByName},${date}\n`;
    });
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
  };

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold mr-4 shadow-lg shadow-indigo-200">A</div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Master Dashboard</h1>
        </div>
        <button onClick={handleLogout} className="mt-4 md:mt-0 px-6 py-2 bg-red-50 text-red-600 font-bold rounded-full hover:bg-red-100 hover:text-red-700 transition-colors">
          Log Out
        </button>
      </div>

      {/* 💅 UI UPGRADE: Pill-shaped elegant tabs */}
      <div className="flex space-x-2 mb-8 bg-white/50 backdrop-blur-sm p-2 rounded-2xl w-fit border border-white shadow-sm">
        <button onClick={() => setActiveTab('phones')} className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'phones' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>Phones ({phones.length})</button>
        <button onClick={() => setActiveTab('facebook')} className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'facebook' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>Facebook ({facebook.length})</button>
        <button onClick={() => setActiveTab('users')} className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'users' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>Manage Workers</button>
      </div>

      {/* 💅 UI UPGRADE: Beautiful soft tables */}
      {(activeTab === 'phones' || activeTab === 'facebook') && (
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-extrabold text-slate-800">Collected Data</h2>
            <button onClick={() => downloadCSV(activeTab === 'phones' ? phones : facebook, `collected_${activeTab}.csv`, activeTab === 'phones' ? 'Number' : 'Facebook Link')} 
              className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/30 transform hover:-translate-y-0.5 transition-all flex items-center">
              <span className="mr-2">📥</span> Download CSV
            </button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                  <th className="p-5 font-bold">{activeTab === 'phones' ? 'Phone Number' : 'Facebook Link'}</th>
                  <th className="p-5 font-bold">Collected By</th>
                  <th className="p-5 font-bold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(activeTab === 'phones' ? phones : facebook).map((item, index) => (
                  <tr key={index} className="hover:bg-indigo-50/50 transition-colors bg-white">
                    <td className="p-5 font-mono text-slate-700">{activeTab === 'phones' ? item.number : <a href={item.link} target="_blank" rel="noreferrer" className="text-indigo-500 hover:underline">{item.link}</a>}</td>
                    <td className="p-5 font-semibold text-slate-700">
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm">{item.addedByName}</span>
                    </td>
                    <td className="p-5 text-sm text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
            <h2 className="text-2xl font-extrabold text-slate-800 mb-8">Active Team</h2>
            <div className="overflow-hidden rounded-2xl border border-slate-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider"><th className="p-5 font-bold">Name</th><th className="p-5 font-bold">Username</th><th className="p-5 font-bold text-right">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {workers.map((w, index) => (
                    <tr key={index} className="bg-white hover:bg-slate-50 transition-colors">
                      <td className="p-5 font-bold text-slate-800 flex items-center"><div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3 text-xs">{w.assignedName.charAt(0)}</div>{w.assignedName}</td>
                      <td className="p-5 font-mono text-slate-500">{w.username}</td>
                      <td className="p-5 text-right"><button onClick={() => handleDeleteUser(w._id, w.assignedName)} className="text-red-500 hover:text-white hover:bg-red-500 font-bold text-sm bg-red-50 px-4 py-2 rounded-xl transition-colors">Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white h-fit">
            <h2 className="text-2xl font-extrabold text-slate-800 mb-6">Add Worker</h2>
            {userMsg && <div className="mb-6 p-4 rounded-xl font-bold bg-indigo-50 text-indigo-600 text-sm">{userMsg}</div>}
            <form onSubmit={handleCreateUser} className="space-y-4">
              <input type="text" placeholder="Actual Name (e.g., John)" value={newName} onChange={e => setNewName(e.target.value)} required className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-700" />
              <input type="text" placeholder="Login Username" value={newUsername} onChange={e => setNewUsername(e.target.value)} required className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-700" />
              <input type="password" placeholder="Login Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-700" />
              <button type="submit" className="w-full bg-slate-800 text-white p-4 rounded-xl font-bold hover:bg-slate-900 hover:shadow-lg transition-all mt-2">Create Account</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}