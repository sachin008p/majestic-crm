import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

/* ─── Helpers ─────────────────────────────────────────────── */
const formatDate = (d) => {
  if (!d) return '—';
  const date = new Date(d);
  if (isNaN(date)) return '—';
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((date - today) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
};

const isOverdue = (d, status) => {
  if (!d || status === 'COMPLETED' || status === 'CANCELLED') return false;
  return new Date(d) < new Date();
};

const PRIORITY_META = {
  HIGH:   { label: 'High',   dot: '#ef4444', badge: '#fef2f2', text: '#b91c1c' },
  MEDIUM: { label: 'Medium', dot: '#f59e0b', badge: '#fffbeb', text: '#b45309' },
  LOW:    { label: 'Low',    dot: '#22c55e', badge: '#f0fdf4', text: '#15803d' },
};

const STATUS_META = {
  PENDING:     { label: 'Pending',     bg: '#f1f5f9', text: '#475569' },
  IN_PROGRESS: { label: 'In Progress', bg: '#eff6ff', text: '#2563eb' },
  COMPLETED:   { label: 'Completed',   bg: '#f0fdf4', text: '#15803d' },
  CANCELLED:   { label: 'Cancelled',   bg: '#fef2f2', text: '#b91c1c' },
};

const initials = (name = '') =>
  name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();

const AVATAR_COLORS = ['#4f46e5','#7c3aed','#db2777','#0891b2','#16a34a','#d97706'];
const avatarColor = (name = '') => AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];

/* ─── Sub-components ──────────────────────────────────────── */
const Skeleton = () => (
  <div style={sk.card}>
    <div style={{ display:'flex', gap:12, marginBottom:14 }}>
      <div style={{...sk.pill, width:64}} />
      <div style={{...sk.pill, width:96}} />
    </div>
    <div style={{...sk.line, width:'70%', marginBottom:8}} />
    <div style={{...sk.line, width:'45%'}} />
    <div style={{ display:'flex', gap:8, marginTop:16 }}>
      <div style={{...sk.btn}} /><div style={{...sk.btn}} />
    </div>
  </div>
);

const sk = {
  base: { background:'var(--tl-border,#eaecf0)', borderRadius:8, overflow:'hidden', position:'relative', animation:'tl-shimmer 1.3s infinite' },
  card: { background:'var(--tl-card,#fff)', border:'1px solid var(--tl-border,#eaecf0)', borderRadius:18, padding:20 },
  pill: { height:22, borderRadius:999, background:'var(--tl-border,#eaecf0)', animation:'tl-shimmer 1.3s infinite' },
  line: { height:14, borderRadius:6, background:'var(--tl-border,#eaecf0)', animation:'tl-shimmer 1.3s infinite' },
  btn:  { height:34, width:70, borderRadius:10, background:'var(--tl-border,#eaecf0)', animation:'tl-shimmer 1.3s infinite' },
};

const TaskCard = ({ task, onDelete, navigate }) => {
  const p = PRIORITY_META[task.priority] || PRIORITY_META.LOW;
  const s = STATUS_META[task.status] || STATUS_META.PENDING;
  const overdue = isOverdue(task.dueDate, task.status);
  const [hovered, setHovered] = useState(false);

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--tl-card,#fff)',
        border: `1px solid ${overdue ? '#fca5a5' : 'var(--tl-border,#eaecf0)'}`,
        borderRadius: 18,
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform .22s ease, box-shadow .22s ease',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? '0 16px 40px rgba(16,24,40,.11)' : '0 1px 2px rgba(16,24,40,.04)',
      }}
      onClick={() => navigate(`/tasks/${task.id}/edit`)}
    >
      {/* top accent line */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background: task.status === 'COMPLETED' ? 'linear-gradient(90deg,#22c55e,#16a34a)' : overdue ? 'linear-gradient(90deg,#ef4444,#f97316)' : 'linear-gradient(90deg,#4f46e5,#7c3aed)' }} />

      {/* header row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:10, marginBottom:12 }}>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {/* Priority badge */}
          <span style={{ display:'inline-flex', alignItems:'center', gap:5, height:22, padding:'0 9px', borderRadius:999, background:p.badge, color:p.text, fontSize:11, fontWeight:600 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:p.dot, display:'inline-block' }} />
            {p.label}
          </span>
          {/* Status badge */}
          <span style={{ display:'inline-flex', alignItems:'center', height:22, padding:'0 9px', borderRadius:999, background:s.bg, color:s.text, fontSize:11, fontWeight:600 }}>
            {s.label}
          </span>
          {overdue && (
            <span style={{ display:'inline-flex', alignItems:'center', height:22, padding:'0 9px', borderRadius:999, background:'#fef2f2', color:'#b91c1c', fontSize:11, fontWeight:700 }}>
              ⚠ Overdue
            </span>
          )}
        </div>
        <span style={{ fontSize:12, color:'var(--tl-muted,#667085)', whiteSpace:'nowrap', fontWeight:600, color: overdue ? '#ef4444' : 'var(--tl-muted,#667085)' }}>
          📅 {formatDate(task.dueDate)}
        </span>
      </div>

      {/* title */}
      <h3 style={{ margin:0, fontSize:16, fontWeight:650, color:'var(--tl-text,#101828)', lineHeight:1.3, marginBottom:6 }}>
        {task.title || '—'}
      </h3>

      {/* lead info */}
      {task.leadName && (
        <div style={{ fontSize:12, color:'var(--tl-muted,#667085)', marginBottom:10, display:'flex', alignItems:'center', gap:6 }}>
          <span>👤</span>
          <span style={{ fontWeight:600 }}>{task.leadName}</span>
        </div>
      )}

      {task.description && (
        <p style={{ margin:'0 0 12px', fontSize:12, color:'var(--tl-muted,#667085)', lineHeight:1.6, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
          {task.description}
        </p>
      )}

      {/* footer */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:14, paddingTop:12, borderTop:'1px solid var(--tl-border,#eaecf0)' }}
        onClick={e => e.stopPropagation()}
      >
        {task.assignedToName ? (
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background: avatarColor(task.assignedToName), display:'grid', placeItems:'center', color:'#fff', fontSize:11, fontWeight:700, flexShrink:0 }}>
              {initials(task.assignedToName)}
            </div>
            <span style={{ fontSize:12, fontWeight:600, color:'var(--tl-muted,#667085)' }}>{task.assignedToName}</span>
          </div>
        ) : <div />}

        <div style={{ display:'flex', gap:8 }}>
          <Link
            to={`/tasks/${task.id}/edit`}
            style={{ height:32, padding:'0 13px', borderRadius:9, fontSize:12, fontWeight:650, cursor:'pointer', display:'inline-flex', alignItems:'center', background:'transparent', border:'1px solid var(--tl-border,#eaecf0)', color:'var(--tl-primary,#4f46e5)', textDecoration:'none' }}
            onClick={e => e.stopPropagation()}
          >
            Edit
          </Link>
          <button
            style={{ height:32, padding:'0 13px', borderRadius:9, fontSize:12, fontWeight:650, cursor:'pointer', display:'inline-flex', alignItems:'center', background:'transparent', border:'1px solid #fca5a5', color:'#b91c1c' }}
            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
};

/* ─── Main ─────────────────────────────────────────────────── */
const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const navigate = useNavigate();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/tasks');
      setTasks(Array.isArray(res.data) ? res.data : []);
      setError('');
    } catch { setError('Failed to load tasks'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/api/tasks/${id}`);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch { setError('Failed to delete task'); }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return tasks.filter(t => {
      const matchSearch = !q || (t.title||'').toLowerCase().includes(q) || (t.leadName||'').toLowerCase().includes(q) || (t.description||'').toLowerCase().includes(q);
      const matchPriority = priority === 'ALL' || t.priority === priority;
      const matchStatus = status === 'ALL' || t.status === status;
      return matchSearch && matchPriority && matchStatus;
    });
  }, [tasks, search, priority, status]);

  const stats = useMemo(() => [
    { label: 'Total', value: tasks.length, color: '#4f46e5' },
    { label: 'Pending', value: tasks.filter(t => t.status === 'PENDING').length, color: '#f59e0b' },
    { label: 'In Progress', value: tasks.filter(t => t.status === 'IN_PROGRESS').length, color: '#2563eb' },
    { label: 'Completed', value: tasks.filter(t => t.status === 'COMPLETED').length, color: '#16a34a' },
    { label: 'Overdue', value: tasks.filter(t => isOverdue(t.dueDate, t.status)).length, color: '#ef4444' },
  ], [tasks]);

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg,#f6f8fb)', color:'var(--text,#101828)', paddingBottom:40 }}>
      <style>{`
        @keyframes tl-shimmer { 0%{background-position:-200px 0} 100%{background-position:calc(200px + 100%) 0} }
        .tl-input { width:100%; border:1px solid var(--tl-border,#eaecf0); border-radius:11px; background:var(--tl-card,#fff); color:var(--tl-text,#101828); font-size:14px; outline:none; padding:0 12px; height:42px; font-family:inherit; }
        .tl-input:focus { border-color:#4f46e5; box-shadow:0 0 0 3px rgba(79,70,229,.12); }
        .tl-select { border:1px solid var(--tl-border,#eaecf0); border-radius:11px; background:var(--tl-card,#fff); color:var(--tl-text,#101828); font-size:13px; font-weight:600; outline:none; padding:0 12px; height:42px; cursor:pointer; font-family:inherit; }
        .tl-select:focus { border-color:#4f46e5; }
        :root { --tl-bg:var(--bg,#f6f8fb); --tl-card:var(--card,#fff); --tl-text:var(--text,#101828); --tl-muted:var(--muted,#667085); --tl-border:var(--border,#eaecf0); --tl-primary:var(--primary,#4f46e5); }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16, marginBottom:20 }}>
        <div>
          <span style={{ display:'block', color:'#4f46e5', fontSize:12, textTransform:'uppercase', letterSpacing:'.08em', fontWeight:650, marginBottom:6 }}>CRM Workspace</span>
          <h1 style={{ margin:0, fontSize:30, fontWeight:650, letterSpacing:'-.03em', color:'var(--tl-text,#101828)' }}>Tasks</h1>
          <p style={{ margin:'6px 0 0', color:'var(--tl-muted,#667085)', fontSize:14 }}>{loading ? 'Loading…' : `${tasks.length} total tasks`}</p>
        </div>
        <Link
          to="/tasks/create"
          style={{ height:42, display:'inline-flex', alignItems:'center', gap:8, padding:'0 20px', borderRadius:12, background:'linear-gradient(90deg,#4f46e5,#7c3aed)', color:'#fff', fontWeight:650, fontSize:14, textDecoration:'none', boxShadow:'0 8px 20px rgba(79,70,229,.22)', whiteSpace:'nowrap' }}
        >
          + Add Task
        </Link>
      </div>

      {/* ── Stats ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,minmax(0,1fr))', gap:12, marginBottom:18 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background:'var(--tl-card,#fff)', border:'1px solid var(--tl-border,#eaecf0)', borderRadius:16, padding:'14px 16px', position:'relative', overflow:'hidden', boxShadow:'0 1px 2px rgba(16,24,40,.04)' }}>
            <div style={{ position:'absolute', left:0, top:0, width:4, height:'100%', background:s.color, borderRadius:'4px 0 0 4px' }} />
            <div style={{ fontSize:26, fontWeight:700, color:s.color, letterSpacing:'-.04em' }}>{loading ? '…' : s.value}</div>
            <div style={{ fontSize:12, color:'var(--tl-muted,#667085)', fontWeight:600, marginTop:5 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div style={{ display:'flex', gap:10, background:'var(--tl-card,#fff)', border:'1px solid var(--tl-border,#eaecf0)', borderRadius:16, padding:12, marginBottom:18, flexWrap:'wrap', boxShadow:'0 1px 2px rgba(16,24,40,.04)' }}>
        <div style={{ flex:1, minWidth:240, position:'relative', display:'flex', alignItems:'center' }}>
          <svg style={{ position:'absolute', left:12, color:'var(--tl-muted,#667085)', width:16, height:16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.2-4.2M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z" /></svg>
          <input className="tl-input" style={{ paddingLeft:40 }} placeholder="Search tasks, leads, descriptions…" value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch('')} style={{ position:'absolute', right:10, background:'transparent', border:'none', color:'var(--tl-muted,#667085)', cursor:'pointer', fontSize:16, lineHeight:1 }}>✕</button>}
        </div>
        <select className="tl-select" value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="ALL">All Priorities</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
        <select className="tl-select" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <button onClick={fetchTasks} style={{ height:42, padding:'0 14px', borderRadius:11, border:'1px solid var(--tl-border,#eaecf0)', background:'var(--tl-card,#fff)', color:'var(--tl-text,#101828)', fontWeight:650, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:8, fontSize:13 }}>
          ↻ Refresh
        </button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{ background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.25)', color:'#b91c1c', borderRadius:14, padding:'12px 16px', marginBottom:18, fontSize:14, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span>⚠️ {error}</span>
          <button onClick={fetchTasks} style={{ background:'transparent', border:'none', color:'#b91c1c', fontWeight:650, textDecoration:'underline', cursor:'pointer' }}>Retry</button>
        </div>
      )}

      {/* ── Grid ── */}
      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,minmax(0,1fr))', gap:18 }}>
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background:'var(--tl-card,#fff)', border:'1px solid var(--tl-border,#eaecf0)', borderRadius:18, padding:'60px 20px', textAlign:'center' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>📋</div>
          <h2 style={{ margin:'0 0 8px', fontSize:19, fontWeight:650, color:'var(--tl-text,#101828)' }}>{search || priority !== 'ALL' || status !== 'ALL' ? 'No matching tasks' : 'No tasks yet'}</h2>
          <p style={{ margin:'0 0 18px', color:'var(--tl-muted,#667085)' }}>{search || priority !== 'ALL' || status !== 'ALL' ? 'Try a different search or filter.' : 'Create your first task to get started.'}</p>
          <Link to="/tasks/create" style={{ color:'#4f46e5', fontWeight:650, fontSize:14, textDecoration:'none' }}>Create a task →</Link>
        </div>
      ) : (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,minmax(0,1fr))', gap:18 }}>
            {filtered.map(task => (
              <TaskCard key={task.id} task={task} onDelete={handleDelete} navigate={navigate} />
            ))}
          </div>
          <div style={{ marginTop:16, background:'var(--tl-card,#fff)', border:'1px solid var(--tl-border,#eaecf0)', borderRadius:12, padding:'11px 16px', color:'var(--tl-muted,#667085)', fontSize:13 }}>
            Showing {filtered.length} of {tasks.length} tasks
          </div>
        </>
      )}

      <style>{`
        @media(max-width:1100px) { .tl-grid { grid-template-columns:repeat(2,minmax(0,1fr)) !important; } }
        @media(max-width:700px) { .tl-grid { grid-template-columns:1fr !important; } }
      `}</style>
    </div>
  );
};

export default TaskList;