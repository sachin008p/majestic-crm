import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { leadService } from '../../services/leadService';

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLead = async () => {
      try {
        setLead(await leadService.getLead(id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load lead');
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [id]);

  if (loading) return <div className="p-6 text-slate-500 animate-pulse text-center">Loading lead details...</div>;
  if (error) return <div className="p-6 text-red-600 text-center font-medium">⚠️ {error}</div>;
  if (!lead) return <div className="p-6 text-slate-500 text-center">Lead not found.</div>;

  const inr = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-10 space-y-6">

      {/* HEADER BAR */}
      <div className="flex flex-wrap justify-between items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center text-2xl font-bold shadow-md">
            {lead.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              {lead.name}
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200">
                {lead.dealStage || lead.status}
              </span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {lead.jobTitle} {lead.companyName ? `at ${lead.companyName}` : ''}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/leads')} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            Back to List
          </button>
          <button onClick={() => navigate(`/leads/${id}/edit`)} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-sm">
            Edit Lead
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN: Overview & Contact */}
        <div className="space-y-6 lg:col-span-2">

          {/* Basic Info */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Basic Contact Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailField label="Email" value={<a href={`mailto:${lead.email}`} className="text-indigo-600 hover:underline">{lead.email}</a>} />
              <DetailField label="Phone" value={<a href={`tel:${lead.phone}`} className="text-indigo-600 hover:underline">{lead.phone}</a>} />
              <DetailField label="Company" value={lead.companyName} />
              <DetailField label="Location" value={[lead.city, lead.state, lead.country].filter(Boolean).join(', ') || '-'} />
              <DetailField label="LinkedIn" value={lead.linkedinUrl ? <a href={lead.linkedinUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">View Profile</a> : '-'} />
              <DetailField label="Assigned To" value={lead.assignedToName || 'Unassigned'} />
            </div>
          </div>

          {/* Qualification & Need */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Qualification Data</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <DetailField label="Industry" value={lead.industry} />
              <DetailField label="Company Size" value={lead.companySize} />
              <DetailField label="Annual Revenue" value={lead.annualRevenue ? inr(lead.annualRevenue) : '-'} />
              <DetailField label="Budget" value={lead.budget ? inr(lead.budget) : '-'} />
              <DetailField label="Timeline" value={lead.timeline ? lead.timeline.replace(/_/g, ' ') : '-'} />
              <DetailField label="Lead Score" value={lead.leadScore ? `${lead.leadScore} / 100` : '-'} />
            </div>
            {lead.painPoints && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs uppercase text-slate-500 font-semibold mb-1">Pain Points / Requirements</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{lead.painPoints}</p>
              </div>
            )}
            {lead.notes && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs uppercase text-slate-500 font-semibold mb-1">General Notes</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{lead.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Pipeline, Tracking, Metadata */}
        <div className="space-y-6">

          {/* Pipeline Info */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Pipeline Info</h2>
            <div className="space-y-4">
              <DetailField label="Deal Stage" value={lead.dealStage || lead.status} />
              <DetailField label="Probability to Close" value={lead.probability ? `${lead.probability}%` : '0%'} />

              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-1 mb-4 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all" style={{ width: `${lead.probability || 0}%` }}></div>
              </div>

              <DetailField label="Next Follow-Up" value={lead.nextFollowUp ? new Date(lead.nextFollowUp).toLocaleString() : 'Not scheduled'} />
              <DetailField label="Last Contacted" value={lead.lastContacted ? new Date(lead.lastContacted).toLocaleString() : 'Never'} />
            </div>
          </div>

          {/* Tracking */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Source & Tracking</h2>
            <div className="space-y-4">
              <DetailField label="Lead Source" value={lead.source} />
              <DetailField label="Campaign Name" value={lead.campaignName} />
              <div className="grid grid-cols-2 gap-2">
                <DetailField label="UTM Source" value={lead.utmSource} />
                <DetailField label="UTM Medium" value={lead.utmMedium} />
              </div>
              <DetailField label="Date Created" value={lead.createdAt ? new Date(lead.createdAt).toLocaleString() : '-'} />
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Metadata</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase text-slate-500 font-semibold mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {lead.tags && JSON.parse(lead.tags).length > 0 ? (
                    JSON.parse(lead.tags).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-xs border border-slate-200 dark:border-slate-700">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-400">No tags</span>
                  )}
                </div>
              </div>
              <DetailField label="GDPR Consent" value={lead.gdprConsent ? "✅ Provided" : "❌ Not Provided"} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Helper component for fields
const DetailField = ({ label, value }) => (
  <div>
    <p className="text-xs uppercase text-slate-500 font-semibold mb-1">{label}</p>
    <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">{value || '-'}</p>
  </div>
);

export default LeadDetails;
