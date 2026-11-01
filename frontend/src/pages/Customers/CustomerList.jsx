import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

/* ─── Helpers ─────────────────────────────────────────────── */
const initials = (name = '') =>
  name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();

const AVATAR_COLORS = ['#4f46e5','#7c3aed','#db2777','#0891b2','#16a34a','#d97706','#0e7490','#be185d'];
const avatarColor = (name = '') => AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const STATUS_META = {
  ACTIVE:   { label: 'Active',   bg: '#f0fdf4', color: '#15803d', dot: '#22c55e' },
  INACTIVE: { label: 'Inactive', bg: '#fef2f2', color: '#b91c1c', dot: '#ef4444' },
  VIP:      { label: 'VIP',      bg: '#fdf4ff', color: '#7e22ce', dot: '#a855f7' },
};

const CustomerCard = ({ customer, onDelete }) => {
  const [hovered, setHovered] = useState(false);
  const sm = STATUS_META[customer.status] || STATUS_META.ACTIVE;
  const avg = customer.totalValue ? '₹' + Number(customer.totalValue).toLocaleString('en-IN') : null;

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--cl-card,#fff)',
        border: '1px solid var(--cl-border,#eaecf0)',
        borderRadius: 18,
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform .22s ease, box-shadow .22s ease',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? '0 16px 40px rgba(16,24,40,.11)' : '0 1px 2px rgba(16,24,40,.04)',
      }}
    >
      {/* top gradient line */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,#4f46e5,#7c3aed,#db2777)' }} />

      {/* Avatar + name row */}
      <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:14 }}>
        <div style={{ width:48, height:48, borderRadius:14, background: avatarColor(customer.name || ''), display:'grid', placeItems:'center', color:'#fff', fontWeight:700, fontSize:16, flexShrink:0 }}>
          {initials(customer.name || '?')}
        </div>
        <div style={{ minWidth:0, flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
            <h3 style={{ margin:0, fontSize:16, fontWeight:650, color:'var(--cl-text,#101828)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
              {customer.name || '—'}
            </h3>
            <span style={{ flexShrink:0, display:'inline-flex', alignItems:'center', gap:5, height:22, padding:'0 9px', borderRadius:999, background:sm.bg, color:sm.color, fontSize:11, fontWeight:600 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:sm.dot, display:'inline-block' }} />
              {sm.label}
            </span>
          </div>
          {customer.company && (
            <p style={{ margin:'3px 0 0', fontSize:12, color:'var(--cl-muted,#667085)', fontWeight:600 }}>
              🏢 {customer.company}
            </p>
          )}
        </div>
      </div>

      {/* Info grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
        {customer.email && (
          <div style={{ background:'var(--cl-bg,#f6f8fb)', border:'1px solid var(--cl-border,#eaecf0)', borderRadius:11, padding:10, minWidth:0, overflow:'hidden' }}>
            <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'.05em', color:'var(--cl-muted,#667085)', fontWeight:650, marginBottom:4 }}>✉ Email</div>
            <div style={{ fontSize:12, fontWeight:650, color:'var(--cl-primary,#4f46e5)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
              <a href={`mailto:${customer.email}`} style={{ color:'inherit', textDecoration:'none' }}>{customer.email}</a>
            </div>
          </div>
        )}
        {customer.phone && (
          <div style={{ background:'var(--cl-bg,#f6f8fb)', border:'1px solid var(--cl-border,#eaecf0)', borderRadius:11, padding:10, minWidth:0, overflow:'hidden' }}>
            <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'.05em', color:'var(--cl-muted,#667085)', fontWeight:650, marginBottom:4 }}>📱 Phone</div>
            <div style={{ fontSize:12, fontWeight:650, color:'var(--cl-text,#101828)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
              <a href={`tel:${customer.phone}`} style={{ color:'inherit', textDecoration:'none' }}>{customer.phone}</a>
            </div>
          </div>
        )}
        {avg && (
          <div style={{ background:'var(--cl-bg,#f6f8fb)', border:'1px solid var(--cl-border,#eaecf0)', borderRadius:11, padding:10 }}>
            <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'.05em', color:'var(--cl-muted,#667085)', fontWeight:650, marginBottom:4 }}>💰 Total Value</div>
            <div style={{ fontSize:12, fontWeight:700, color:'#15803d' }}>{avg}</div>
          </div>
        )}
        {customer.createdAt && (
          <div style={{ background:'var(--cl-bg,#f6f8fb)', border:'1px solid var(--cl-border,#eaecf0)', borderRadius:11, padding:10 }}>
            <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'.05em', color:'var(--cl-muted,#667085)', fontWeight:650, marginBottom:4 }}>📅 Created</div>
            <div style={{ fontSize:12, fontWeight:650, color:'var(--cl-text,#101828)' }}>{formatDate(customer.createdAt)}</div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display:'flex', gap:8, paddingTop:12, borderTop:'1px solid var(--cl-border,#eaecf0)' }}>
        <Link
          to={`/customers/${customer.id}/edit`}
          style={{ flex:1, height:34, borderRadius:10, fontSize:12, fontWeight:650, cursor:'pointer', display:'inline-flex', alignItems:'center', justifyContent:'center', background:'transparent', border:'1px solid var(--cl-border,#eaecf0)', color:'var(--cl-primary,#4f46e5)', textDecoration:'none' }}
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(customer.id)}
          style={{ height:34, padding:'0 14px', borderRadius:10, fontSize:12, fontWeight:650, cursor:'pointer', display:'inline-flex', alignItems:'center', background:'transparent', border:'1px solid #fca5a5', color:'#b91c1c' }}
        >
          Delete
        </button>
      </div>
    </article>
  );
};

const Skeleton = () => (
  <div style={{ background:'var(--cl-card,#fff)', border:'1px solid var(--cl-border,#eaecf0)', borderRadius:18, padding:20 }}>
    <div style={{ display:'flex', gap:12, marginBottom:14 }}>
      <div style={{ width:48, height:48, borderRadius:14, background:'var(--cl-border,#eaecf0)', animation:'cl-shimmer 1.3s infinite' }} />
      <div style={{ flex:1 }}>
        <div style={{ height:18, borderRadius:8, background:'var(--cl-border,#eaecf0)', marginBottom:8, width:'70%', animation:'cl-shimmer 1.3s infinite' }} />
        <div style={{ height:14, borderRadius:6, background:'var(--cl-border,#eaecf0)', width:'50%', animation:'cl-shimmer 1.3s infinite' }} />
      </div>
    </div>
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
      {[0,1,2,3].map(i => <div key={i} style={{ height:56, borderRadius:11, background:'var(--cl-border,#eaecf0)', animation:'cl-shimmer 1.3s infinite' }} />)}
    </div>
    <div style={{ height:34, borderRadius:10, background:'var(--cl-border,#eaecf0)', animation:'cl-shimmer 1.3s infinite' }} />
  </div>
);

/* ─── Main ─────────────────────────────────────────────────── */
const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/customers');
      setCustomers(Array.isArray(res.data) ? res.data : []);
      setError('');
    } catch { setError('Failed to load customers'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer?')) return;
    try {
      await api.delete(`/api/customers/${id}`);
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch { setError('Failed to delete customer'); }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return customers.filter(c => {
      const matchSearch = !q || (c.name||'').toLowerCase().includes(q) || (c.email||'').toLowerCase().includes(q) || (c.phone||'').toLowerCase().includes(q) || (c.company||'').toLowerCase().includes(q);
      const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [customers, search, statusFilter]);

  const stats = useMemo(() => [
    { label: 'Total', value: customers.length, color: '#4f46e5' },
    { label: 'Active', value: customers.filter(c => c.status === 'ACTIVE').length, color: '#16a34a' },
    { label: 'Inactive', value: customers.filter(c => c.status === 'INACTIVE').length, color: '#ef4444' },
    { label: 'VIP', value: customers.filter(c => c.status === 'VIP').length, color: '#7c3aed' },
  ], [customers]);

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg,#f6f8fb)', color:'var(--text,#101828)', paddingBottom:40 }}>
      <style>{`
        @keyframes cl-shimmer { 0%{opacity:.6} 50%{opacity:1} 100%{opacity:.6} }
        :root { --cl-bg:var(--bg,#f6f8fb); --cl-card:var(--card,#fff); --cl-text:var(--text,#101828); --cl-muted:var(--muted,#667085); --cl-border:var(--border,#eaecf0); --cl-primary:var(--primary,#4f46e5); }
        .cl-input { width:100%; border:1px solid var(--cl-border,#eaecf0); border-radius:11px; background:var(--cl-card,#fff); color:var(--cl-text,#101828); font-size:14px; outline:none; padding:0 12px; height:42px; font-family:inherit; }
        .cl-input:focus { border-color:#4f46e5; box-shadow:0 0 0 3px rgba(79,70,229,.12); }
        .cl-select { border:1px solid var(--cl-border,#eaecf0); border-radius:11px; background:var(--cl-card,#fff); color:var(--cl-text,#101828); font-size:13px; font-weight:600; outline:none; padding:0 12px; height:42px; cursor:pointer; font-family:inherit; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16, marginBottom:20 }}>
        <div>
          <span style={{ display:'block', color:'#4f46e5', fontSize:12, textTransform:'uppercase', letterSpacing:'.08em', fontWeight:650, marginBottom:6 }}>CRM Workspace</span>
          <h1 style={{ margin:0, fontSize:30, fontWeight:650, letterSpacing:'-.03em', color:'var(--cl-text,#101828)' }}>Customers</h1>
          <p style={{ margin:'6px 0 0', color:'var(--cl-muted,#667085)', fontSize:14 }}>{loading ? 'Loading…' : `${customers.length} total customers`}</p>
        </div>
        <Link
          to="/customers/create"
          style={{ height:42, display:'inline-flex', alignItems:'center', gap:8, padding:'0 20px', borderRadius:12, background:'linear-gradient(90deg,#4f46e5,#7c3aed)', color:'#fff', fontWeight:650, fontSize:14, textDecoration:'none', boxShadow:'0 8px 20px rgba(79,70,229,.22)', whiteSpace:'nowrap' }}
        >
          + Add Customer
        </Link>
      </div>

      {/* ── Stats ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,minmax(0,1fr))', gap:12, marginBottom:18 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background:'var(--cl-card,#fff)', border:'1px solid var(--cl-border,#eaecf0)', borderRadius:16, padding:'14px 16px', position:'relative', overflow:'hidden', boxShadow:'0 1px 2px rgba(16,24,40,.04)' }}>
            <div style={{ position:'absolute', left:0, top:0, width:4, height:'100%', background:s.color }} />
            <div style={{ fontSize:26, fontWeight:700, color:s.color, letterSpacing:'-.04em' }}>{loading ? '…' : s.value}</div>
            <div style={{ fontSize:12, color:'var(--cl-muted,#667085)', fontWeight:600, marginTop:5 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div style={{ display:'flex', gap:10, background:'var(--cl-card,#fff)', border:'1px solid var(--cl-border,#eaecf0)', borderRadius:16, padding:12, marginBottom:18, flexWrap:'wrap', boxShadow:'0 1px 2px rgba(16,24,40,.04)' }}>
        <div style={{ flex:1, minWidth:240, position:'relative', display:'flex', alignItems:'center' }}>
          <svg style={{ position:'absolute', left:12, width:16, height:16, color:'var(--cl-muted,#667085)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.2-4.2M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z" /></svg>
          <input className="cl-input" style={{ paddingLeft:40 }} placeholder="Search by name, email, phone, company…" value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch('')} style={{ position:'absolute', right:10, background:'transparent', border:'none', color:'var(--cl-muted,#667085)', cursor:'pointer', fontSize:16 }}>✕</button>}
        </div>
        <select className="cl-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="VIP">VIP</option>
        </select>
        <button onClick={fetchCustomers} style={{ height:42, padding:'0 14px', borderRadius:11, border:'1px solid var(--cl-border,#eaecf0)', background:'var(--cl-card,#fff)', color:'var(--cl-text,#101828)', fontWeight:650, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:8, fontSize:13 }}>
          ↻ Refresh
        </button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{ background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.25)', color:'#b91c1c', borderRadius:14, padding:'12px 16px', marginBottom:18, fontSize:14, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span>⚠️ {error}</span>
          <button onClick={fetchCustomers} style={{ background:'transparent', border:'none', color:'#b91c1c', fontWeight:650, textDecoration:'underline', cursor:'pointer' }}>Retry</button>
        </div>
      )}

      {/* ── Cards Grid ── */}
      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,minmax(0,1fr))', gap:18 }}>
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background:'var(--cl-card,#fff)', border:'1px solid var(--cl-border,#eaecf0)', borderRadius:18, padding:'60px 20px', textAlign:'center' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>👥</div>
          <h2 style={{ margin:'0 0 8px', fontSize:19, fontWeight:650, color:'var(--cl-text,#101828)' }}>{search || statusFilter !== 'ALL' ? 'No matching customers' : 'No customers yet'}</h2>
          <p style={{ margin:'0 0 18px', color:'var(--cl-muted,#667085)' }}>{search || statusFilter !== 'ALL' ? 'Try a different search or filter.' : 'Add your first customer to get started.'}</p>
          <Link to="/customers/create" style={{ color:'#4f46e5', fontWeight:650, fontSize:14, textDecoration:'none' }}>Add a customer →</Link>
        </div>
      ) : (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,minmax(0,1fr))', gap:18 }}>
            {filtered.map(c => <CustomerCard key={c.id} customer={c} onDelete={handleDelete} />)}
          </div>
          <div style={{ marginTop:16, background:'var(--cl-card,#fff)', border:'1px solid var(--cl-border,#eaecf0)', borderRadius:12, padding:'11px 16px', color:'var(--cl-muted,#667085)', fontSize:13 }}>
            Showing {filtered.length} of {customers.length} customers
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerList;