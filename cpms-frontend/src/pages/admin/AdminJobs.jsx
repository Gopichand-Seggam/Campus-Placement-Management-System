import { useState, useEffect } from 'react';
import { jobAPI } from '../../api/client';
import { Search, Briefcase, MapPin, Calendar, Users } from 'lucide-react';

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobAPI.getAllAdmin()
      .then(r => { setJobs(r.data); setFiltered(r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let list = jobs;
    if (statusFilter !== 'ALL') list = list.filter(j => j.status === statusFilter);
    const q = search.toLowerCase();
    if (q) list = list.filter(j =>
      j.title?.toLowerCase().includes(q) ||
      j.company?.companyName?.toLowerCase().includes(q) ||
      j.location?.toLowerCase().includes(q) ||
      j.jobType?.toLowerCase().includes(q)
    );
    setFiltered(list);
  }, [search, statusFilter, jobs]);

  const statusBadge = { ACTIVE: 'badge-green', CLOSED: 'badge-red', DRAFT: 'badge-yellow' };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">All Job Postings</h1>
          <p className="text-secondary text-sm">{jobs.length} total job postings</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" style={{ paddingLeft: 40 }} placeholder="Search jobs..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['ALL', 'ACTIVE', 'CLOSED', 'DRAFT'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-ghost'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="flex justify-center p-12"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state p-12"><div className="empty-state-icon">💼</div><p>No jobs found</p></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-tertiary)' }}>
                  {['Job Title', 'Company', 'Type', 'Location', 'CTC Range', 'Openings', 'Deadline', 'Status'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(j => (
                  <tr key={j.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{j.title}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>Posted by admin</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.85rem', fontWeight: 500 }}>{j.company?.companyName || '—'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${j.jobType === 'FULL_TIME' ? 'badge-blue' : j.jobType === 'INTERNSHIP' ? 'badge-cyan' : 'badge-purple'}`}>
                        {(j.jobType || '—').replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.85rem' }}>
                      {j.location ? <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={13} />{j.location}</span> : '—'}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.82rem' }}>
                      {j.ctcMin || j.ctcMax ? `₹${j.ctcMin || 0}–${j.ctcMax || '?'}L` : '—'}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.85rem', textAlign: 'center' }}>{j.openings || '—'}</td>
                    <td style={{ padding: '14px 16px', fontSize: '0.82rem' }}>
                      {j.applicationDeadline ? new Date(j.applicationDeadline).toLocaleDateString() : '—'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${statusBadge[j.status] || 'badge-gray'}`}>{j.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="text-xs text-muted mt-3">Showing {filtered.length} of {jobs.length} jobs</p>
    </div>
  );
}
