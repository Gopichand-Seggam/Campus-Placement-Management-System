import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobAPI } from '../../api/client';
import { Plus, Edit2, Trash2, Eye, MapPin, Calendar, Users, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const fetchJobs = () => {
    setLoading(true);
    jobAPI.getMyJobs()
      .then(r => setJobs(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    setDeletingId(id);
    try {
      await jobAPI.delete(id);
      setJobs(j => j.filter(x => x.id !== id));
    } catch (e) {
      alert('Failed to delete job');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (job) => {
    const newStatus = job.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
    try {
      const updated = await jobAPI.update(job.id, { ...job, status: newStatus });
      setJobs(prev => prev.map(j => j.id === job.id ? updated.data : j));
    } catch {
      alert('Failed to update job status');
    }
  };

  const statusBadge = { ACTIVE: 'badge-green', CLOSED: 'badge-red', DRAFT: 'badge-yellow' };
  const statusIcon = { ACTIVE: CheckCircle, CLOSED: XCircle, DRAFT: Clock };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Job Postings</h1>
          <p className="text-secondary text-sm">{jobs.length} job{jobs.length !== 1 ? 's' : ''} posted</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/company/post-job')}>
          <Plus size={16} /> Post New Job
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="spinner" /></div>
      ) : jobs.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">💼</div>
            <p>No job postings yet</p>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/company/post-job')}>
              Post Your First Job
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {jobs.map(job => {
            const Icon = statusIcon[job.status] || Clock;
            return (
              <div key={job.id} className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700 }}>{job.title}</h3>
                      <span className={`badge ${statusBadge[job.status] || 'badge-gray'}`}>{job.status}</span>
                      <span className={`badge ${job.jobType === 'FULL_TIME' ? 'badge-blue' : job.jobType === 'INTERNSHIP' ? 'badge-cyan' : 'badge-purple'}`}>
                        {(job.jobType || '').replace('_', ' ')}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
                      {job.location && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={13} />{job.location}</span>
                      )}
                      {job.openings && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={13} />{job.openings} openings</span>
                      )}
                      {job.applicationDeadline && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Calendar size={13} />Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                        </span>
                      )}
                      {(job.ctcMin || job.ctcMax) && (
                        <span style={{ color: '#10b981', fontWeight: 600 }}>₹{job.ctcMin || 0}–{job.ctcMax || '?'}L CTC</span>
                      )}
                    </div>

                    {job.requiredSkills && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {job.requiredSkills.split(',').slice(0, 5).map(s => (
                          <span key={s} className="badge badge-blue" style={{ fontSize: '0.72rem' }}>{s.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={() => handleToggleStatus(job)}
                      className="btn btn-sm btn-ghost"
                      style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                      title={job.status === 'ACTIVE' ? 'Close this job' : 'Reopen this job'}>
                      <Icon size={14} />
                      {job.status === 'ACTIVE' ? 'Close' : 'Reopen'}
                    </button>
                    <button className="btn btn-sm btn-ghost" onClick={() => navigate('/company/post-job', { state: { editJob: job } })} title="Edit">
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                      onClick={() => handleDelete(job.id)}
                      disabled={deletingId === job.id}>
                      {deletingId === job.id ? <span className="spinner" style={{ width: 14, height: 14 }} /> : <Trash2 size={14} />}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
