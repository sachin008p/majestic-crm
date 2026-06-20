import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { leadService } from '../../services/leadService';

const LeadCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    jobTitle: '',
    city: '',
    state: '',
    country: '',
    linkedinUrl: '',

    source: '',
    campaignName: '',
    utmMedium: '',
    utmSource: '',
    utmCampaign: '',

    status: 'NEW',
    leadScore: 0,
    industry: '',
    companySize: '',
    annualRevenue: '',
    budget: '',
    timeline: '',
    painPoints: '',

    dealStage: 'PROSPECTING',
    probability: 0,
    nextFollowUp: '',
    
    notes: '',
    assignedToId: '',
    tags: '',
    gdprConsent: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...formData,
        budget: formData.budget ? Number(formData.budget) : null,
        annualRevenue: formData.annualRevenue ? Number(formData.annualRevenue) : null,
        leadScore: formData.leadScore ? Number(formData.leadScore) : 0,
        probability: formData.probability ? Number(formData.probability) : 0,
        assignedToId: formData.assignedToId ? Number(formData.assignedToId) : null,
        nextFollowUp: formData.nextFollowUp ? new Date(formData.nextFollowUp).toISOString() : null,
        tags: formData.tags ? JSON.stringify(formData.tags.split(',').map(t => t.trim())) : null,
      };
      await leadService.createLead(payload);
      navigate('/leads');
    } catch (error) {
      console.error('Error creating lead:', error);
      setError(error.response?.data?.message || 'Failed to create lead');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'qualification', label: 'Qualification & Need' },
    { id: 'tracking', label: 'Source & Tracking' },
    { id: 'pipeline', label: 'Pipeline & Pipeline' },
  ];

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Add New Lead</h1>
          <p className="text-sm text-slate-500 mt-1">Create a comprehensive lead profile</p>
        </div>
        <button
          onClick={() => navigate('/leads')}
          className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl transition-all"
        >
          ← Back to List
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      <div className="glass rounded-2xl shadow-sm overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
        
        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto hide-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* ============ BASIC INFO ============ */}
          <div className={activeTab === 'basic' ? 'block' : 'hidden'}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
                <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="VP of Sales" className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+1 234 567 8900" className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Acme Corp" className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">LinkedIn URL</label>
                <input type="url" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} placeholder="https://linkedin.com/in/johndoe" className="form-input" />
              </div>
              <div className="grid grid-cols-3 gap-3 md:col-span-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="San Francisco" className="form-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="CA" className="form-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Country</label>
                  <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="USA" className="form-input" />
                </div>
              </div>
            </div>
          </div>

          {/* ============ QUALIFICATION ============ */}
          <div className={activeTab === 'qualification' ? 'block' : 'hidden'}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Industry</label>
                <input type="text" name="industry" value={formData.industry} onChange={handleChange} placeholder="Technology, Healthcare..." className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Size</label>
                <select name="companySize" value={formData.companySize} onChange={handleChange} className="form-input">
                  <option value="">Select Size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501+">501+ employees</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Annual Revenue ($)</label>
                <input type="number" name="annualRevenue" value={formData.annualRevenue} onChange={handleChange} placeholder="1000000" className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Budget ($)</label>
                <input type="number" name="budget" value={formData.budget} onChange={handleChange} placeholder="50000" className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Timeline to Buy</label>
                <select name="timeline" value={formData.timeline} onChange={handleChange} className="form-input">
                  <option value="">Select Timeline</option>
                  <option value="IMMEDIATE">Immediate</option>
                  <option value="1-3_MONTHS">1-3 Months</option>
                  <option value="3-6_MONTHS">3-6 Months</option>
                  <option value="6_MONTHS_PLUS">6+ Months</option>
                  <option value="UNKNOWN">Unknown</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pain Points / Requirements</label>
                <textarea name="painPoints" value={formData.painPoints} onChange={handleChange} rows={3} placeholder="What problems are they trying to solve?" className="form-input resize-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">General Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} placeholder="Any other notes..." className="form-input resize-none" />
              </div>
            </div>
          </div>

          {/* ============ TRACKING ============ */}
          <div className={activeTab === 'tracking' ? 'block' : 'hidden'}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Lead Source</label>
                <select name="source" value={formData.source} onChange={handleChange} className="form-input">
                  <option value="">Select Source</option>
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Cold Call">Cold Call</option>
                  <option value="Event">Event</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Campaign Name</label>
                <input type="text" name="campaignName" value={formData.campaignName} onChange={handleChange} placeholder="Summer Promo 2026" className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">UTM Source</label>
                <input type="text" name="utmSource" value={formData.utmSource} onChange={handleChange} placeholder="google" className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">UTM Medium</label>
                <input type="text" name="utmMedium" value={formData.utmMedium} onChange={handleChange} placeholder="cpc" className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tags (comma separated)</label>
                <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="enterprise, urgent, software" className="form-input" />
              </div>
              <div className="flex items-center gap-3 mt-6">
                <input type="checkbox" name="gdprConsent" id="gdprConsent" checked={formData.gdprConsent} onChange={handleChange} className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                <label htmlFor="gdprConsent" className="text-sm font-medium text-slate-700 dark:text-slate-300">Has provided GDPR/Data Consent</label>
              </div>
            </div>
          </div>

          {/* ============ PIPELINE ============ */}
          <div className={activeTab === 'pipeline' ? 'block' : 'hidden'}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Lead Status *</label>
                <select name="status" value={formData.status} onChange={handleChange} required className="form-input font-semibold">
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="QUALIFIED">Qualified</option>
                  <option value="NEGOTIATION">Negotiation</option>
                  <option value="WON">Closed Won</option>
                  <option value="LOST">Closed Lost</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Deal Stage</label>
                <select name="dealStage" value={formData.dealStage} onChange={handleChange} className="form-input">
                  <option value="PROSPECTING">Prospecting</option>
                  <option value="DEMO_SCHEDULED">Demo Scheduled</option>
                  <option value="PROPOSAL_SENT">Proposal Sent</option>
                  <option value="NEGOTIATION">Negotiation</option>
                  <option value="CLOSED_WON">Closed Won</option>
                  <option value="CLOSED_LOST">Closed Lost</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Lead Score (0-100)</label>
                <input type="number" min="0" max="100" name="leadScore" value={formData.leadScore} onChange={handleChange} className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Probability to Close (%)</label>
                <input type="number" min="0" max="100" name="probability" value={formData.probability} onChange={handleChange} className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Next Follow-up Date</label>
                <input type="datetime-local" name="nextFollowUp" value={formData.nextFollowUp} onChange={handleChange} className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assigned User ID</label>
                <input type="number" name="assignedToId" value={formData.assignedToId} onChange={handleChange} placeholder="Optional user ID" className="form-input" />
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-6 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => navigate('/leads')}
              className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50 shadow-md"
            >
              {loading ? 'Saving...' : 'Save Lead'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .form-input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--border);
          background-color: var(--card);
          color: var(--text);
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .form-input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }
      `}</style>
    </div>
  );
};

export default LeadCreate;
