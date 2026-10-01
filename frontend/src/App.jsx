import React, { useState, useEffect } from 'react';
import api from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('login');
  const [healthStatus, setHealthStatus] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // Form states
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [dietitianData, setDietitianData] = useState({ first_name: '', last_name: '', email: '', password: '', qualification: '' });
  const [clientData, setClientData] = useState({ first_name: '', last_name: '', email: '', password: '', gender: '' });
  
  // States for Additional Features
  const [branches, setBranches] = useState([]);
  const [branchForm, setBranchForm] = useState({ name: '', location: '' });
  const [approvals, setApprovals] = useState([]);

  useEffect(() => {
    checkHealth();
  }, []);

  const handleSetToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  };

  const checkHealth = async () => {
    try {
      const res = await api.get('/health');
      setHealthStatus(res.data);
    } catch (err) {
      setHealthStatus({ status: 'offline', service: 'Auth & Admin API' });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', loginData);
      const authToken = res.data.access_token || res.data.token || 'logged-in';
      handleSetToken(authToken);
      setMessage({ type: 'success', text: 'Login successful!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Login failed' });
    }
  };

  const handleRegisterDietitian = async (e) => {
    e.preventDefault();
    try {
      await api.post('/register/dietitian', dietitianData);
      setMessage({ type: 'success', text: 'Dietitian registered successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Registration failed' });
    }
  };

  const handleRegisterClient = async (e) => {
    e.preventDefault();
    try {
      await api.post('/register/client', clientData);
      setMessage({ type: 'success', text: 'Client registered successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Registration failed' });
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await api.get('/branches');
      setBranches(res.data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to fetch branches' });
    }
  };

  const handleCreateBranch = async (e) => {
    e.preventDefault();
    try {
      await api.post('/branches', branchForm);
      setMessage({ type: 'success', text: 'Branch created successfully!' });
      setBranchForm({ name: '', location: '' });
      fetchBranches();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to create branch' });
    }
  };

  const fetchApprovals = async () => {
    try {
      const res = await api.get('/admin/approvals');
      setApprovals(res.data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to fetch admin approvals' });
    }
  };

  const handleProcessApproval = async (id, status) => {
    try {
      await api.post('/admin/approvals', { approval_id: id, status });
      setMessage({ type: 'success', text: `Approval set to ${status}` });
      fetchApprovals();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to process approval' });
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Dietitian App - Auth & Admin Portal</h1>

      {/* System Health Banner */}
      <div style={{ background: '#f0f0f0', padding: '1rem', borderRadius: '5px', marginBottom: '1rem' }}>
        <strong>System Status:</strong>{' '}
        {healthStatus ? (
          <span style={{ color: healthStatus.status === 'healthy' ? '#155724' : '#721c24', fontWeight: 'bold' }}>
            ● {healthStatus.status?.toUpperCase()} ({healthStatus.service})
          </span>
        ) : (
          'Checking...'
        )}
        {token && (
          <button 
            onClick={() => handleSetToken('')} 
            style={{ float: 'right', background: '#dc3545', color: '#fff', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '3px', cursor: 'pointer' }}
          >
            Logout
          </button>
        )}
      </div>

      {/* Notification Message */}
      {message.text && (
        <div style={{ 
          padding: '0.8rem', 
          marginBottom: '1rem', 
          borderRadius: '4px',
          backgroundColor: message.type === 'error' ? '#f8d7da' : '#d4edda',
          color: message.type === 'error' ? '#721c24' : '#155724'
        }}>
          {message.text}
        </div>
      )}

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['login', 'register-dietitian', 'register-client', 'branches', 'admin-approvals'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setMessage({ type: '', text: '' });
              if (tab === 'branches') fetchBranches();
              if (tab === 'admin-approvals') fetchApprovals();
            }}
            style={{
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              backgroundColor: activeTab === tab ? '#007bff' : '#e0e0e0',
              color: activeTab === tab ? '#fff' : '#000',
              border: 'none',
              borderRadius: '4px',
              textTransform: 'capitalize'
            }}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Tab Views */}
      {activeTab === 'login' && (
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <h2>Login</h2>
          <input type="email" placeholder="Email" value={loginData.email} onChange={(e) => setLoginData({...loginData, email: e.target.value})} required />
          <input type="password" placeholder="Password" value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} required />
          <button type="submit">Login</button>
        </form>
      )}

      {activeTab === 'register-dietitian' && (
        <form onSubmit={handleRegisterDietitian} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <h2>Register Dietitian</h2>
          <input type="text" placeholder="First Name" value={dietitianData.first_name} onChange={(e) => setDietitianData({...dietitianData, first_name: e.target.value})} required />
          <input type="text" placeholder="Last Name" value={dietitianData.last_name} onChange={(e) => setDietitianData({...dietitianData, last_name: e.target.value})} required />
          <input type="email" placeholder="Email" value={dietitianData.email} onChange={(e) => setDietitianData({...dietitianData, email: e.target.value})} required />
          <input type="password" placeholder="Password" value={dietitianData.password} onChange={(e) => setDietitianData({...dietitianData, password: e.target.value})} required />
          <input type="text" placeholder="Qualification" value={dietitianData.qualification} onChange={(e) => setDietitianData({...dietitianData, qualification: e.target.value})} required />
          <button type="submit">Register Dietitian</button>
        </form>
      )}

      {activeTab === 'register-client' && (
        <form onSubmit={handleRegisterClient} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <h2>Register Client</h2>
          <input type="text" placeholder="First Name" value={clientData.first_name} onChange={(e) => setClientData({...clientData, first_name: e.target.value})} required />
          <input type="text" placeholder="Last Name" value={clientData.last_name} onChange={(e) => setClientData({...clientData, last_name: e.target.value})} required />
          <input type="email" placeholder="Email" value={clientData.email} onChange={(e) => setClientData({...clientData, email: e.target.value})} required />
          <input type="password" placeholder="Password" value={clientData.password} onChange={(e) => setClientData({...clientData, password: e.target.value})} required />
          <input type="text" placeholder="Gender" value={clientData.gender} onChange={(e) => setClientData({...clientData, gender: e.target.value})} required />
          <button type="submit">Register Client</button>
        </form>
      )}

      {activeTab === 'branches' && (
        <div>
          <h2>Branches</h2>
          <form onSubmit={handleCreateBranch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input type="text" placeholder="Branch Name" value={branchForm.name} onChange={(e) => setBranchForm({...branchForm, name: e.target.value})} required />
            <input type="text" placeholder="Location" value={branchForm.location} onChange={(e) => setBranchForm({...branchForm, location: e.target.value})} required />
            <button type="submit">Add Branch</button>
          </form>
          <ul>
            {Array.isArray(branches) && branches.map((b, i) => (
              <li key={i}>{b.name || b.branch_name} - {b.location}</li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'admin-approvals' && (
        <div>
          <h2>Admin Approvals</h2>
          <button onClick={fetchApprovals} style={{ marginBottom: '1rem' }}>Refresh List</button>
          <ul>
            {Array.isArray(approvals) && approvals.map((app, i) => (
              <li key={i} style={{ marginBottom: '0.5rem' }}>
                {app.email || app.user_id} - Status: <strong>{app.status}</strong>
                <button onClick={() => handleProcessApproval(app.id, 'approved')} style={{ marginLeft: '0.5rem' }}>Approve</button>
                <button onClick={() => handleProcessApproval(app.id, 'rejected')} style={{ marginLeft: '0.5rem' }}>Reject</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}