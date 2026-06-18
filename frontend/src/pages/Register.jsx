import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Ensure this path is correct for your api instance

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    role: 'ROLE_ADMIN' // Default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // API Call to your Backend
      const response = await api.post('/api/auth/register', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role
      });
      
      alert('Registration Successful! Please Login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f3f4f6' }}>
      <div style={{ background: '#fff', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Create Account</h2>
        
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input name="fullName" placeholder="Full Name" onChange={handleChange} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
          <input name="phone" placeholder="Phone" onChange={handleChange} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
          
          <select name="role" onChange={handleChange} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
            <option value="ROLE_ADMIN">Admin</option>
            <option value="ROLE_USER">User</option>
          </select>

          <button type="submit" disabled={loading} style={{ padding: '10px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.9rem' }}>
          Already have an account? <span onClick={() => navigate('/login')} style={{ color: '#4f46e5', cursor: 'pointer', fontWeight: 'bold' }}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Register;