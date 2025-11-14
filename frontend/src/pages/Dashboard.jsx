// src/pages/Dashboard.jsx
import { useEffect, useState, useRef } from 'react';
import api from '../api/axios';

/* Icons (small inline SVGs for no deps) */
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M3 6h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconPencil = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M3 21v-3l11-11 3 3L6 21H3z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconSpinner = ({size=14}) => (
  <svg width={size} height={size} viewBox="0 0 50 50" aria-hidden>
    <circle cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="4" strokeOpacity="0.12" fill="none" />
    <path d="M45 25a20 20 0 00-5-12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
    <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.9s" repeatCount="indefinite" />
  </svg>
);

/* --- helpers for priority encoded in description --- */
function getPriorityFromDesc(desc=''){
  if (!desc) return null;
  const m = desc.match(/PRIORITY:([a-zA-Z]+)/);
  return m ? m[1] : null;
}
function buildDescWithPriority(origDesc='', priority){
  const without = (origDesc || '').replace(/PRIORITY:[^|]+(\s*\|\s*)?/, '').trim();
  if (!priority) return without.trim();
  const sep = without ? ' | ' : '';
  return `${without}${sep}PRIORITY:${priority}`;
}

/* Priority badge (small) */
function PriorityBadgeSmall({ level, onClick }) {
  const cls = level === 'high' ? 'priority-high' : level === 'med' ? 'priority-med' : 'priority-low';
  const label = level === 'high' ? 'High' : level === 'med' ? 'Medium' : 'Low';
  return (
    <button onClick={onClick} className={`priority-badge ${cls}`} title={`Priority: ${label}`} type="button" style={{padding:'6px 10px', fontSize:'0.82rem'}}>
      {label}
    </button>
  );
}

/* Play a pleasant completion sound using WebAudio (UI-only) */
function playCompletionSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = 880;
    g.gain.value = 0.0001;
    o.connect(g); g.connect(ctx.destination);
    const now = ctx.currentTime;
    o.start(now);
    g.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.40);
    o.stop(now + 0.45);
    setTimeout(()=> { try{ ctx.close(); } catch(e){} }, 600);
  } catch (e) { /* no-op */ }
}

/* ---------------------------
   Main Dashboard component
   --------------------------- */
export default function Dashboard(){
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const editRef = useRef(null);

  const [updatingIds, setUpdatingIds] = useState(new Set());
  const [deletingIds, setDeletingIds] = useState(new Set());
  const [completedAnimIds, setCompletedAnimIds] = useState(new Set());

  useEffect(()=>{ fetchTasks(); }, []);

  async function fetchTasks(){
    setLoading(true);
    try {
      const res = await api.get('/api/tasks');
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const leftCount = tasks.filter(t => t.status !== 'completed').length;
  const percent = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  /* create (unchanged) */
  async function handleCreate(e){
    e?.preventDefault();
    if (!newTitle.trim()) return;
    const temp = { _id:`temp-${Date.now()}`, title:newTitle.trim(), description:'', status:'pending', createdAt:new Date().toISOString(), temp:true };
    setTasks(prev => [temp, ...prev]);
    setNewTitle('');
    try {
      const res = await api.post('/api/tasks', { title: temp.title });
      setTasks(prev => prev.map(t => t._id === temp._id ? res.data.task : t));
    } catch (err) {
      console.error(err);
      setTasks(prev => prev.filter(t => t._id !== temp._id));
    }
  }

  /* toggle status — plays sound + animate */
  async function toggleStatus(id){
    if (updatingIds.has(id)) return;
    const t = tasks.find(x => x._id === id);
    if (!t) return;
    const nextStatus = t.status === 'pending' ? 'completed' : 'pending';

    const prevTasks = tasks;
    setTasks(prev => prev.map(p => p._id === id ? {...p, status: nextStatus } : p));
    setUpdatingIds(s => { const ns = new Set(s); ns.add(id); return ns; });

    const willComplete = nextStatus === 'completed';
    if (willComplete) {
      playCompletionSound();
      setCompletedAnimIds(s => { const ns = new Set(s); ns.add(id); return ns; });
      setTimeout(() => setCompletedAnimIds(s => { const ns = new Set(s); ns.delete(id); return ns; }), 900);
    }

    try {
      await api.put(`/api/tasks/${id}`, { status: nextStatus });
      setUpdatingIds(s => { const ns = new Set(s); ns.delete(id); return ns; });
    } catch (err) {
      console.error(err);
      setTasks(prevTasks);
      setUpdatingIds(s => { const ns = new Set(s); ns.delete(id); return ns; });
    }
  }

  /* delete with animation */
  async function deleteTask(id){
    if (!confirm('Delete this task?')) return;
    setDeletingIds(s => { const ns = new Set(s); ns.add(id); return ns; });
    setTimeout(async ()=>{
      try {
        await api.delete(`/api/tasks/${id}`);
        setTasks(prev => prev.filter(t => t._id !== id));
        setDeletingIds(s => { const ns = new Set(s); ns.delete(id); return ns; });
      } catch (err) {
        console.error(err);
        setDeletingIds(s => { const ns = new Set(s); ns.delete(id); return ns; });
        fetchTasks();
      }
    }, 260);
  }

  /* inline edit */
  function startEdit(t){
    setEditingId(t._id);
    setTimeout(()=> editRef.current?.select(), 60);
  }
  async function saveTitle(id, newTitleVal){
    setEditingId(null);
    const old = tasks.find(t => t._id === id);
    if (!old || !newTitleVal.trim() || newTitleVal.trim() === old.title) return;
    const backup = tasks;
    setTasks(prev => prev.map(p => p._id === id ? {...p, title: newTitleVal.trim()} : p));
    try {
      await api.put(`/api/tasks/${id}`, { title: newTitleVal.trim() });
    } catch (err) {
      console.error(err);
      setTasks(backup);
    }
  }

  async function cyclePriority(t){
    const current = getPriorityFromDesc(t.description) || 'low';
    const next = current === 'low' ? 'med' : current === 'med' ? 'high' : 'low';
    const newDesc = buildDescWithPriority(t.description, next);
    const backup = tasks;
    setTasks(prev => prev.map(p => p._id === t._id ? {...p, description: newDesc} : p));
    setUpdatingIds(s => { const ns = new Set(s); ns.add(t._id); return ns; });
    try {
      await api.put(`/api/tasks/${t._id}`, { description: newDesc });
      setUpdatingIds(s => { const ns = new Set(s); ns.delete(t._id); return ns; });
    } catch (err) {
      console.error(err);
      setTasks(backup);
      setUpdatingIds(s => { const ns = new Set(s); ns.delete(t._id); return ns; });
    }
  }

  return (
    <div className="container fade">
      {/* header + refined progress summary (no avatar here) */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:20, marginBottom:12}}>
        <div style={{flex:1}}>
          <div className="kicker">Welcome back</div>
          <h1 className="h1">Your Tasks</h1>

          {/* Professional progress panel (left) */}
          <div className="progress-panel" style={{marginTop:12, display:'flex', gap:16, alignItems:'center', maxWidth:720}}>
            <div className="progress-circle" aria-hidden>
              <svg viewBox="0 0 36 36" className="circular-chart" preserveAspectRatio="xMidYMid meet" width="84" height="84" role="img" aria-label={`${percent}% complete`}>
                <defs>
                  <linearGradient id="grad" x1="0%" x2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                  </linearGradient>
                </defs>

                <path className="circle-bg"
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                  strokeWidth="2.8"
                  fill="none"
                />

                <path
                  className="circle"
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                  stroke="url(#grad)"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={`${percent}, 100`}
                />

                <text className="percent-text" x="18" y="20.6" aria-hidden="true">
                  {percent}%
                </text>
              </svg>
            </div>

            <div style={{display:'flex', flexDirection:'column', gap:8}}>
              <div style={{display:'flex', gap:8, alignItems:'center'}}>
                <div className="stat-chip stat-done">
                  <div className="stat-num">{completedCount}</div>
                  <div className="stat-label">Completed</div>
                </div>

                <div className="stat-chip stat-left">
                  <div className="stat-num">{leftCount}</div>
                  <div className="stat-label">Remaining</div>
                </div>
              </div>

              <div style={{color:'var(--muted)', fontSize:13}}>Keep the streak — focus on one at a time.</div>
            </div>

            <div style={{marginLeft:'auto', minWidth:140}}>
              <div className="mini-progress-track" aria-hidden>
                <div className="mini-progress-fill" style={{width:`${percent}%`}} />
              </div>
            </div>
          </div>
        </div>

        {/* Right side: quick add (avatar removed here, only global top-right avatar remains) */}
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <form onSubmit={handleCreate} style={{display:'flex', gap:12, alignItems:'center'}}>
            <input className="quick-input" placeholder="Quick add task" value={newTitle} onChange={e=>setNewTitle(e.target.value)} />
            <button type="submit" className="btn-primary"><IconPlus /> <span style={{marginLeft:8}}>Add</span></button>
          </form>
        </div>
      </div>

      {/* tasks card */}
      <div className="page-card">
        <div className="grid">
          {loading ? (
            Array.from({length:6}).map((_,i) => <div key={i} className="task-card" style={{height:110}}/>)
          ) : tasks.length === 0 ? (
            <div style={{padding:20, color:'var(--muted)'}}>No tasks yet — add one above.</div>
          ) : tasks.map(task => {
            const priority = getPriorityFromDesc(task.description) || 'low';
            const isUpdating = updatingIds.has(task._id);
            const isDeleting = deletingIds.has(task._id);
            const isCompletedAnim = completedAnimIds.has(task._id);

            return (
              <div key={task._id} className={`task-card fade ${isCompletedAnim ? 'completed-animate' : ''} ${isDeleting ? 'shrink-out' : ''}`} style={{opacity: isDeleting ? 0.85 : 1}}>
                <div className="stripe" style={{ background: task.status === 'completed' ? 'linear-gradient(90deg,#94a3b8,#6b7280)' : 'linear-gradient(90deg,var(--accent),var(--accent-700))' }} />

                <div className="task-body">
                  <div style={{display:'flex', alignItems:'center', gap:12}}>
                    <div style={{flex:1, minWidth:0}}>
                      {editingId === task._id ? (
                        <input ref={editRef} className="inline-input" defaultValue={task.title} onBlur={e=>saveTitle(task._id, e.target.value)} onKeyDown={e=>{ if (e.key === 'Enter') saveTitle(task._id, e.target.value); }} />
                      ) : (
                        <h3 className="task-title" onDoubleClick={()=>startEdit(task)} style={{cursor:'text'}}>{task.title}</h3>
                      )}

                      <div className="task-desc" style={{marginTop:8}}>{(task.description || '').replace(/PRIORITY:[^|]+(\s*\|\s*)?/, '').trim() || <span style={{color:'var(--muted)'}}>No details</span>}</div>
                      <div className="task-date">{new Date(task.createdAt).toLocaleString()}</div>
                    </div>

                    <div style={{display:'flex', alignItems:'center', gap:8}}>
                      <PriorityBadgeSmall level={priority} onClick={()=>cyclePriority(task)} />
                    </div>
                  </div>
                </div>

                <div className="actions" aria-hidden={isDeleting}>
                  <button type="button" className="icon-btn" onClick={()=>toggleStatus(task._id)} title={task.status === 'completed' ? 'Mark pending' : 'Mark done'} aria-pressed={task.status === 'completed'} disabled={isUpdating || isDeleting} style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8, minWidth:44, background: task.status === 'completed' ? 'linear-gradient(90deg,#10b981,#059669)' : 'transparent', color: task.status === 'completed' ? '#041124' : 'var(--text)', border: task.status === 'completed' ? 'none' : undefined }}>{isUpdating ? <IconSpinner /> : <IconCheck />}</button>

                  <button type="button" className="icon-btn" onClick={()=>startEdit(task)} title="Edit" disabled={isDeleting}><IconPencil /></button>

                  <button type="button" className="icon-btn" onClick={()=>deleteTask(task._id)} title="Delete" disabled={isDeleting} style={{color:'var(--danger)'}}>{isDeleting ? <IconSpinner /> : <IconTrash />}</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
