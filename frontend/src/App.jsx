import React, { useState, useEffect } from 'react';
import api from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('login');
  const [status, setStatus] = useState('Checking...');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Login state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  // Dietitian registration state
  const [dietitianForm, setDietitianForm] = useState({
    first_name: '', last_name: '', email: '', password: '', qualification: ''
  });

  // Client registration state
  const [clientForm, setClientForm] = useState({
    first_name: '', last_name: '', email: '', password: '', gender: 'Male'
  });

  useEffect(() => {
    api.get('/health')
      .then(res => setStatus(`${res.data.service} - ${res.data.status}`))
      .catch(() => setStatus('Backend Offline'));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');
    try {
      const res = await api.post('/login', loginForm);
      setMessage(`Login successful! Token: ${res.data.token}`);
    } catch (err) {
      setError('Login failed');
    }
  };

  const handleDietitianRegister = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');
    try {
      const res = await api.post('/register/dietitian', dietitianForm);
      setMessage(res.data.message);
    } catch (err) {
      setError('Dietitian registration failed');
    }
  };

  const handleClientRegister = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');
    try {
      const res = await api.post('/register/client', clientForm);
      setMessage(res.data.message);
    } catch (err) {
      setError('Client registration failed');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>Auth & Admin Management</h2>
      <p style={{ fontSize: '12px', textAlign: 'center', background: '#eef2f7', padding: '8px', borderRadius: '4px' }}>
        <strong>System Status:</strong> {status}
      </p>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #ccc' }}>
        <button onClick={() => { setActiveTab('login'); setMessage(''); setError(''); }} style={{ padding: '10px', flex: 1, border: 'none', background: activeTab === 'login' ? '#007bff' : '#eee', color: activeTab === 'login' ? '#fff' : '#000', cursor: 'pointer' }}>Login</button>
        <button onClick={() => { setActiveTab('dietitian'); setMessage(''); setError(''); }} style={{ padding: '10px', flex: 1, border: 'none', background: activeTab === 'dietitian' ? '#007bff' : '#eee', color: activeTab === 'dietitian' ? '#fff' : '#000', cursor: 'pointer' }}>Register Dietitian</button>
        <button onClick={() => { setActiveTab('client'); setMessage(''); setError(''); }} style={{ padding: '10px', flex: 1, border: 'none', background: activeTab === 'client' ? '#007bff' : '#eee', color: activeTab === 'client' ? '#fff' : '#000', cursor: 'pointer' }}>Register Client</button>
      </div>

      {message && <div style={{ color: 'green', padding: '10px', background: '#e6ffe6', marginBottom: '10px', borderRadius: '4px' }}>{message}</div>}
      {error && <div style={{ color: 'red', padding: '10px', background: '#ffe6e6', marginBottom: '10px', borderRadius: '4px' }}>{error}</div>}

      {activeTab === 'login' && (
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="email" placeholder="Email" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} required style={inputStyle} />
          <input type="password" placeholder="Password" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} required style={inputStyle} />
          <button type="submit" style={btnStyle}>Login</button>
        </form>
      )}

      {activeTab === 'dietitian' && (
        <form onSubmit={handleDietitianRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input placeholder="First Name" value={dietitianForm.first_name} onChange={e => setDietitianForm({...dietitianForm, first_name: e.target.value})} required style={inputStyle} />
          <input placeholder="Last Name" value={dietitianForm.last_name} onChange={e => setDietitianForm({...dietitianForm, last_name: e.target.value})} required style={inputStyle} />
          <input type="email" placeholder="Email" value={dietitianForm.email} onChange={e => setDietitianForm({...dietitianForm, email: e.target.value})} required style={inputStyle} />
          <input type="password" placeholder="Password" value={dietitianForm.password} onChange={e => setDietitianForm({...dietitianForm, password: e.target.value})} required style={inputStyle} />
          <input placeholder="Qualification" value={dietitianForm.qualification} onChange={e => setDietitianForm({...dietitianForm, qualification: e.target.value})} required style={inputStyle} />
          <button type="submit" style={btnStyle}>Register Dietitian</button>
        </form>
      )}

      {activeTab === 'client' && (
        <form onSubmit={handleClientRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input placeholder="First Name" value={clientForm.first_name} onChange={e => setClientForm({...clientForm, first_name: e.target.value})} required style={inputStyle} />
          <input placeholder="Last Name" value={clientForm.last_name} onChange={e => setClientForm({...clientForm, last_name: e.target.value})} required style={inputStyle} />
          <input type="email" placeholder="Email" value={clientForm.email} onChange={e => setClientForm({...clientForm, email: e.target.value})} required style={inputStyle} />
          <input type="password" placeholder="Password" value={clientForm.password} onChange={e => setClientForm({...clientForm, password: e.target.value})} required style={inputStyle} />
          <select value={clientForm.gender} onChange={e => setClientForm({...clientForm, gender: e.target.value})} style={inputStyle}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <button type="submit" style={btnStyle}>Register Client</button>
        </form>
      )}
    </div>
  );
}

const inputStyle = { padding: '10px', borderRadius: '4px', border: '1px solid #ccc' };
const btnStyle = { padding: '10px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };