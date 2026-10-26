import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobAPI, applicationAPI } from '../../api/client';
import { Users, FileText, Calendar, CheckCircle, XCircle } from 'lucide-react';

export default function ManageApplicants() {
  const [searchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId');
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(initialJobId || '');
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [interviewForm, setInterviewForm] = useState({ scheduledAt: '', mode: 'ONLINE', venue: '', meetingLink: '', notes: '' });

  useEffect(() => {
    jobAPI.getMyJobs().then(r => {
      setJobs(r.data);
      if (r.data.length > 0 && !selectedJob) setSelectedJob(String(r.data[0].id));
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedJob) {
      setLoading(true);
      applicationAPI.byJob(selectedJob).then(r => setApps(r.data)).finally(() => setLoading(false));
    }
  }, [selectedJob]);

  const updateStatus = async (appId, status) => {
    try {
      await applicationAPI.updateStatus(appId, status);
      setApps(apps.map(a => a.id === appId ? { ...a, status } : a));
      setMsg('✅ Status updated to ' + status);
    } catch { setMsg('❌ Failed to update status'); }
  };

  const scheduleInterview = async (e) => {
    e.preventDefault();
    try {
      await applicationAPI.scheduleInterview(selectedApp.id, interviewForm);
      setApps(apps.map(a => a.id === selectedApp.id ? { ...a, status: 'INTERVIEW_SCHEDULED' } : a));
      setMsg('✅ Interview scheduled successfully!');
      setSelectedApp(null);
    } catch { setMsg('❌ Failed to schedule interview'); }
  };

  const APP_STATUSES = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'OFFERED', 'REJECTED'];

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div>
          <h1 className="page-title">Manage Applicants</h1>
          <p className="text-secondary text-sm">Review applications and schedule interviews</p>
        </div>
      </div>

      {msg && <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}

      <div className="card mb-6 flex gap-4 items-center">
        <label className="font-semibold" style={{ width: 120 }}>Select Job:</label>
        <select className="form-input form-select flex-1" value={selectedJob} onChange={e => setSelectedJob(e.target.value)}>
          {jobs.length === 0 && <option value="">No active jobs</option>}
          {jobs.map(j => <option key={j.id} value={j.id}>{j.title} ({j.jobType})</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center p-8"><div className="spinner" /></div>
      ) : apps.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon">👥</div><p>No applicants for this job yet.</p></div>
      ) : (
        <div className="grid-auto">
          {apps.map(app => (
            <div key={app.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 700 }}>
                    {app.student?.user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-lg leading-tight">{app.student?.user?.name}</div>
                    <div className="text-secondary text-sm">{app.student?.user?.email}</div>
                  </div>
                </div>
                <span className={`badge ${app.status === 'APPLIED' ? 'badge-blue' : app.status === 'REJECTED' ? 'badge-red' : app.status === 'OFFERED' ? 'badge-green' : 'badge-yellow'}`}>
                  {app.status.replace('_', ' ')}
                </span>
              </div>

              <div className="grid-2 gap-2 text-sm text-secondary mb-4">
                <div>🎓 {app.student?.college}</div>
                <div>📚 {app.student?.branch} · {app.student?.graduationYear}</div>
                <div>⭐ {app.student?.cgpa} CGPA</div>
                {app.student?.phone && <div>📞 {app.student.phone}</div>}
              </div>

              {app.student?.skills && (
                <div className="mb-4">
                  <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {app.student.skills.split(',').slice(0, 4).map((s,i) => <span key={i} className="badge badge-gray">{s.trim()}</span>)}
                    {app.student.skills.split(',').length > 4 && <span className="text-xs text-muted">+{app.student.skills.split(',').length - 4} more</span>}
                  </div>
                </div>
              )}

              <div className="divider" />

              <div className="flex gap-2 flex-wrap">
                {app.student?.resumeUrl ? (
                  <a href={app.student.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm flex-1"><FileText size={14}/> Resume</a>
                ) : (
                  <button className="btn btn-secondary btn-sm flex-1" disabled><FileText size={14}/> No Resume</button>
                )}
                <button className="btn btn-primary btn-sm flex-1" onClick={() => setSelectedApp(app)}><Calendar size={14}/> Interview</button>
              </div>

              <div className="mt-3">
                <select className="form-input form-select w-full" style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                  value={app.status} onChange={e => updateStatus(app.id, e.target.value)}>
                  {APP_STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Interview Modal */}
      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="font-heading text-xl mb-2">Schedule Interview</h2>
            <p className="text-secondary text-sm mb-6">Candidate: <span className="font-semibold text-white">{selectedApp.student?.user?.name}</span></p>

            <form onSubmit={scheduleInterview} className="flex-col gap-4">
              <div className="form-group">
                <label className="form-label">Date & Time</label>
                <input type="datetime-local" required className="form-input" value={interviewForm.scheduledAt} onChange={e => setInterviewForm({...interviewForm, scheduledAt: e.target.value})} />
              </div>

              <div className="grid-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Mode</label>
                  <select className="form-input form-select" value={interviewForm.mode} onChange={e => setInterviewForm({...interviewForm, mode: e.target.value})}>
                    <option value="ONLINE">Online</option>
                    <option value="OFFERED">Offline</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Venue / Room</label>
                  <input className="form-input" value={interviewForm.venue} onChange={e => setInterviewForm({...interviewForm, venue: e.target.value})} placeholder="e.g. Conference Room A" />
                </div>
              </div>

              {(interviewForm.mode === 'ONLINE' || interviewForm.mode === 'HYBRID') && (
                <div className="form-group">
                  <label className="form-label">Meeting Link</label>
                  <input className="form-input" required={interviewForm.mode === 'ONLINE'} value={interviewForm.meetingLink} onChange={e => setInterviewForm({...interviewForm, meetingLink: e.target.value})} placeholder="https://zoom.us/j/..." />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Additional Notes for Candidate</label>
                <textarea className="form-input" value={interviewForm.notes} onChange={e => setInterviewForm({...interviewForm, notes: e.target.value})} placeholder="e.g. Please bring a laptop and a valid ID." rows={3}></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" className="btn btn-ghost" onClick={() => setSelectedApp(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Schedule Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
