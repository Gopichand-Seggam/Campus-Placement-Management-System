import { useState, useEffect } from 'react';
import { applicationAPI } from '../../api/client';
import { FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

const STATUS_CONFIG = {
  APPLIED: { label: 'Applied', badge: 'badge-blue', icon: FileText },
  UNDER_REVIEW: { label: 'Under Review', badge: 'badge-yellow', icon: Clock },
  SHORTLISTED: { label: 'Shortlisted', badge: 'badge-purple', icon: CheckCircle },
  INTERVIEW_SCHEDULED: { label: 'Interview Scheduled', badge: 'badge-cyan', icon: Clock },
  OFFERED: { label: 'Offered 🎉', badge: 'badge-green', icon: CheckCircle },
  REJECTED: { label: 'Rejected', badge: 'badge-red', icon: XCircle },
  WITHDRAWN: { label: 'Withdrawn', badge: 'badge-gray', icon: XCircle },
};

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    applicationAPI.myApplications().then(r => setApps(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL' ? apps : apps.filter(a => a.status === filter);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Applications</h1>
          <p className="text-secondary text-sm">{apps.length} total applications</p>
        </div>
      </div>

      <div className="tabs">
        {['ALL', 'APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'OFFERED', 'REJECTED'].map(s => (
          <button key={s} className={`tab-btn ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s === 'ALL' ? 'All' : STATUS_CONFIG[s]?.label || s}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon">📋</div><p>No applications in this category</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map(app => {
            const cfg = STATUS_CONFIG[app.status] || { label: app.status, badge: 'badge-gray', icon: FileText };
            return (
              <div key={app.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileText size={20} color="white" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>{app.job?.title}</div>
                  <div className="text-sm text-muted">{app.job?.company?.companyName} · {app.job?.location}</div>
                  <div className="text-xs text-muted mt-1">Applied {new Date(app.appliedAt).toLocaleDateString()}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span className={`badge ${cfg.badge}`}>{cfg.label}</span>
                  {app.job?.ctcMin && <div className="text-xs text-muted mt-2">{app.job.ctcMin}–{app.job.ctcMax} LPA</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
