import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { leadService } from '../../services/leadService';

const LeadCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: '',
    status: 'NEW',
    budget: '',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Name, Email, and Phone are required!');
      return;
    }

    setLoading(true);
    try {
      // Call Backend API
      await leadService.createLead(formData);
      alert('Lead created successfully!');
      navigate('/leads'); // Redirect back to list
    } catch (error) {
      console.error('Error creating lead:', error);
      alert('Failed to create lead. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>Add New Lead</h1>
        <button
          onClick={() => navigate('/leads')}
          style={{ background: 'none', border: '1px solid #d1d5db', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', color: '#6b7280' }}
        >
          ← Back to List
        </button>
      </div>

      {/* Form Card */}
      <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            {/* Name */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
              />
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
              />
            </div>

            {/* Phone */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+91 98765 43210"
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
              />
            </div>

            {/* Source */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>Lead Source</label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                placeholder="Website, Referral, Social Media..."
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
              />
            </div>

            {/* Status */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', background: '#fff' }}
              >
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="NEGOTIATION">Negotiation</option>
                <option value="WON">Won</option>
                <option value="LOST">Lost</option>
              </select>
            </div>

            {/* Budget */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>Estimated Budget (₹)</label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="50000"
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
              />
            </div>

            {/* Notes */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                placeholder="Add any additional information about this lead..."
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => navigate('/leads')}
              style={{ padding: '10px 24px', border: '1px solid #d1d5db', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontWeight: '500' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ padding: '10px 24px', border: 'none', borderRadius: '8px', background: '#6366f1', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '500', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Saving...' : 'Save Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadCreate;