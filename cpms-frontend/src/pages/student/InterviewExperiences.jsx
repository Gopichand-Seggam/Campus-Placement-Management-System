import { useState, useEffect } from 'react';
import { experienceAPI } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Users, Plus, X, Search, Building2, Briefcase, ChevronDown, ChevronUp } from 'lucide-react';

const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];
const OUTCOMES = ['SELECTED', 'REJECTED', 'PENDING'];
const OUTCOME_COLORS = { SELECTED: '#10b981', REJECTED: '#ef4444', PENDING: '#f59e0b' };

export default function InterviewExperiences() {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ companyName: '', jobRole: '', questionsAsked: '', tips: '', outcome: 'PENDING', difficulty: 'MEDIUM', offerReceived: false });

  const load = async () => {
    setLoading(true);
    try { const r = await experienceAPI.getAll(); setExperiences(r.data); }
    catch { setExperiences([]); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try { await experienceAPI.share(form); setShowForm(false); setForm({ companyName: '', jobRole: '', questionsAsked: '', tips: '', outcome: 'PENDING', difficulty: 'MEDIUM', offerReceived: false }); load(); }
    catch { alert('Failed to share experience. Please try again.'); }
    finally { setSubmitting(false); }
  };

  const del = async (id) => {
    if (!confirm('Delete this experience?')) return;
    await experienceAPI.delete(id);
    load();
  };

  const filtered = experiences.filter(e =>
    e.companyName?.toLowerCase().includes(search.toLowerCase()) ||
    e.jobRole?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Interview Experiences</h1>
          <p className="text-secondary">Learn from others and share yours to help the community</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={16} /> Share Experience
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 16, fontWeight: 600 }}>Share Your Experience</h3>
          <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label className="form-label">Company Name *</label><input required className="form-input" value={form.companyName} onChange={e => setForm(f => ({...f, companyName: e.target.value}))} /></div>
            <div><label className="form-label">Job Role *</label><input required className="form-input" value={form.jobRole} onChange={e => setForm(f => ({...f, jobRole: e.target.value}))} /></div>
            <div style={{ gridColumn: '1/-1' }}><label className="form-label">Questions Asked</label><textarea className="form-input" rows={3} placeholder="What questions were you asked?" value={form.questionsAsked} onChange={e => setForm(f => ({...f, questionsAsked: e.target.value}))} /></div>
            <div style={{ gridColumn: '1/-1' }}><label className="form-label">Tips & Advice</label><textarea className="form-input" rows={2} placeholder="Tips for future candidates..." value={form.tips} onChange={e => setForm(f => ({...f, tips: e.target.value}))} /></div>
            <div>
              <label className="form-label">Outcome</label>
              <select className="form-input" value={form.outcome} onChange={e => setForm(f => ({...f, outcome: e.target.value}))}>
                {OUTCOMES.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Difficulty</label>
              <select className="form-input" value={form.difficulty} onChange={e => setForm(f => ({...f, difficulty: e.target.value}))}>
                {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: 12 }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Sharing...' : 'Share Experience'}</button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="form-input" style={{ paddingLeft: 36 }} placeholder="Search by company or role..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: 40 }}><div className="spinner" /></div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.length === 0 && <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}><Users size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} /><p>No experiences shared yet. Be the first!</p></div>}
          {filtered.map(exp => (
            <div key={exp.id} className="card hover-card" style={{ cursor: 'pointer' }} onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--bg-card-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Building2 size={20} style={{ color: 'var(--accent-blue)' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{exp.companyName}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Briefcase size={12} />{exp.jobRole}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, background: `${OUTCOME_COLORS[exp.outcome]}20`, color: OUTCOME_COLORS[exp.outcome] }}>{exp.outcome}</span>
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', background: 'var(--bg-card-hover)', color: 'var(--text-muted)' }}>{exp.difficulty}</span>
                  {exp.student?.user?.id === user?.id && <button onClick={e => { e.stopPropagation(); del(exp.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={14} /></button>}
                  {expanded === exp.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>
              {expanded === exp.id && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  {exp.questionsAsked && <div style={{ marginBottom: 12 }}><h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'var(--accent-blue)' }}>Questions Asked:</h4><p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{exp.questionsAsked}</p></div>}
                  {exp.tips && <div><h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: '#10b981' }}>Tips & Advice:</h4><p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{exp.tips}</p></div>}
                  <p style={{ marginTop: 12, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Shared by {exp.student?.user?.name || 'Anonymous'} · {exp.createdAt ? new Date(exp.createdAt).toLocaleDateString() : ''}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
