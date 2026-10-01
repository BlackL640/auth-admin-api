import React, { useState, useEffect } from 'react';
import api from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('login'); // Default to login tab
  const [healthStatus, setHealthStatus] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // Form states...
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [dietitianData, setDietitianData] = useState({ first_name: '', last_name: '', email: '', password: '', qualification: '' });
  const [clientData, setClientData] = useState({ first_name: '', last_name: '', email: '', password: '', gender: '' });
  
  const [branches, setBranches] = useState([]);
  const [branchForm, setBranchForm] = useState({ name: '', location: '' });
  const [approvals, setApprovals] = useState([]);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const res = await api.get('/health');
      setHealthStatus(res.data);
    } catch (err) {
      setHealthStatus({ status: 'offline', service: 'Auth & Admin API' });
    }
  };

  // ... remaining functions stay the same

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Dietitian App - Auth & Admin Portal</h1>

      {/* System Health Banner */}
      <div style={{ background: '#f0f0f0', padding: '1rem', borderRadius: '5px', marginBottom: '1rem' }}>
        <strong>System Status:</strong>{' '}
        {healthStatus ? (
          <span style={{ color: healthStatus.status === 'healthy' ? 'green' : 'red', fontWeight: 'bold' }}>
            ● {healthStatus.status?.toUpperCase()}
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

      {/* Tab Navigation and Forms continue below... */}