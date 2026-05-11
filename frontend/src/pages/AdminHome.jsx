import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminHome() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('phones'); 
  
  const [phones, setPhones] = useState([]);
  const [facebook, setFacebook] = useState([]);
  const [workers, setWorkers] = useState([]); // New state for workers
  
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [userMsg, setUserMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const phoneRes = await axios.get('http://localhost:5000/api/phones');
      const fbRes = await axios.get('http://localhost:5000/api/facebook');
      const workerRes = await axios.get('http://localhost:5000/api/users'); // Fetch workers
      setPhones(phoneRes.data);
      setFacebook(fbRes.data);
      setWorkers(workerRes.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users', {
        username: newUsername,
        password: newPassword,
        assignedName: newName
      });
      setUserMsg("✅ User created successfully!");
      setNewUsername(''); setNewPassword(''); setNewName('');
      fetchData(); // Refresh the list instantly
    } catch (err) {
      setUserMsg("❌ " + (err.response?.data?.error || "Error creating user"));
    }
  };

  // New Delete Function
  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}'s account?`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      fetchData(); // Refresh the list instantly
    } catch (error) {
      alert("Failed to delete user");
    }
  };

  const downloadPhoneCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Number,Collected By,Date\n";
    phones.forEach(p => {
      const date = new Date(p.createdAt).toLocaleDateString();
      csvContent += `="${p.number}",${p.addedByName},${date}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "collected_phones.csv");
    document.body.appendChild(link);
    link.click();
  };

  const downloadFacebookCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Facebook Link,Collected By,Date\n";
    facebook.forEach(fb => {
      const date = new Date(fb.createdAt).toLocaleDateString();
      csvContent += `${fb.link},${fb.addedByName},${date}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "collected_facebook_links.csv");
    document.body.appendChild(link);
    link.click();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800">Admin Master Dashboard</h1>
        <button onClick={handleLogout} className="text-red-500 font-bold hover:underline">Log Out</button>
      </div>

      <div className="flex space-x-4 mb-6">
        <button onClick={() => setActiveTab('phones')} className={`px-4 py-2 rounded font-bold ${activeTab === 'phones' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 shadow'}`}>Phones ({phones.length})</button>
        <button onClick={() => setActiveTab('facebook')} className={`px-4 py-2 rounded font-bold ${activeTab === 'facebook' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 shadow'}`}>Facebook ({facebook.length})</button>
        <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded font-bold ${activeTab === 'users' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 shadow'}`}>Manage Workers ({workers.length})</button>
      </div>

      {activeTab === 'phones' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Collected Phone Numbers</h2>
            <button onClick={downloadPhoneCSV} className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700">Download CSV</button>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100"><th className="p-3 border-b">Number</th><th className="p-3 border-b">Collected By</th><th className="p-3 border-b">Date</th></tr>
            </thead>
            <tbody>
              {phones.map((p, index) => (
                <tr key={index} className="hover:bg-gray-50"><td className="p-3 border-b font-mono">{p.number}</td><td className="p-3 border-b">{p.addedByName}</td><td className="p-3 border-b text-sm text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'facebook' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Collected Facebook Links</h2>
            <button onClick={downloadFacebookCSV} className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700">Download CSV</button>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100"><th className="p-3 border-b">Link</th><th className="p-3 border-b">Collected By</th><th className="p-3 border-b">Date</th></tr>
            </thead>
            <tbody>
              {facebook.map((fb, index) => (
                <tr key={index} className="hover:bg-gray-50"><td className="p-3 border-b text-blue-500 hover:underline"><a href={fb.link} target="_blank" rel="noreferrer">{fb.link}</a></td><td className="p-3 border-b">{fb.addedByName}</td><td className="p-3 border-b text-sm text-gray-500">{new Date(fb.createdAt).toLocaleDateString()}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* NEW: Upgraded Worker Management Tab */}
      {activeTab === 'users' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Current Workers</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100"><th className="p-3 border-b">Name</th><th className="p-3 border-b">Username</th><th className="p-3 border-b">Action</th></tr>
              </thead>
              <tbody>
                {workers.map((w, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-3 border-b font-semibold">{w.assignedName}</td>
                    <td className="p-3 border-b text-gray-600">{w.username}</td>
                    <td className="p-3 border-b">
                      <button onClick={() => handleDeleteUser(w._id, w.assignedName)} className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-2 py-1 rounded">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white p-6 rounded-lg shadow h-fit">
            <h2 className="text-xl font-bold mb-4">Create New Worker</h2>
            {userMsg && <div className="mb-4 font-bold text-blue-600">{userMsg}</div>}
            <form onSubmit={handleCreateUser} className="space-y-4">
              <input type="text" placeholder="Actual Name (e.g., John)" value={newName} onChange={e => setNewName(e.target.value)} required className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500" />
              <input type="text" placeholder="Login Username" value={newUsername} onChange={e => setNewUsername(e.target.value)} required className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500" />
              <input type="password" placeholder="Login Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500" />
              <button type="submit" className="w-full bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700">Create Account</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}