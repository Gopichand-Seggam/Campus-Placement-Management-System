import { useState, useEffect } from 'react';
import { applicationAPI } from '../../api/client';
import { Calendar, MapPin, Video, Building2 } from 'lucide-react';

export default function MyInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationAPI.myInterviews().then(r => setInterviews(r.data)).finally(() => setLoading(false));
  }, []);

  const resultBadge = { PENDING: 'badge-yellow', PASSED: 'badge-green', FAILED: 'badge-red', NO_SHOW: 'badge-gray' };
  const modeBadge = { ONLINE: 'badge-cyan', OFFLINE: 'badge-purple', HYBRID: 'badge-blue' };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Interviews</h1>
          <p className="text-secondary text-sm">{interviews.length} interviews total</p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>
      ) : interviews.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <p style={{ fontWeight: 600 }}>No interviews yet</p>
          <p className="text-sm text-muted">Keep applying! Interviews will appear here once scheduled.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {interviews.map(iv => (
            <div key={iv.id} className="card" style={{ background: 'linear-gradient(135deg, var(--bg-card), var(--bg-card-hover))', borderColor: iv.mode === 'ONLINE' ? 'rgba(6,182,212,0.3)' : 'var(--border)' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div style={{ width: 44, height: 44, borderRadius: 11, background: iv.mode === 'ONLINE' ? 'linear-gradient(135deg,#06b6d4,#3b82f6)' : 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {iv.mode === 'ONLINE' ? <Video size={20} color="white" /> : <Building2 size={20} color="white" />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{iv.application?.job?.title}</div>
                    <div className="text-sm text-muted">{iv.application?.job?.company?.companyName}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className={`badge ${modeBadge[iv.mode] || 'badge-gray'}`}>{iv.mode}</span>
                  <span className={`badge ${resultBadge[iv.result] || 'badge-gray'}`}>{iv.result}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                <div className="flex items-center gap-2 text-sm text-secondary">
                  <Calendar size={14} color="var(--accent-blue-light)" />
                  {iv.scheduledAt ? new Date(iv.scheduledAt).toLocaleString() : 'Date TBD'}
                </div>
                {iv.venue && <div className="flex items-center gap-2 text-sm text-secondary"><MapPin size={14} color="var(--accent-purple)" />{iv.venue}</div>}
              </div>
              {iv.meetingLink && (
                <a href={iv.meetingLink} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm mt-3" style={{ display: 'inline-flex' }}>
                  <Video size={14} /> Join Meeting
                </a>
              )}
              {iv.notes && <p className="text-sm text-secondary mt-2" style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>{iv.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
