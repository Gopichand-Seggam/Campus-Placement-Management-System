import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { applicationAPI, jobAPI, studentAPI } from '../../api/client';
import { Briefcase, FileText, Calendar, CheckCircle, ArrowRight, TrendingUp } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ applications: 0, interviews: 0, offers: 0, jobs: 0 });
  const [recentApps, setRecentApps] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      applicationAPI.myApplications(),
      applicationAPI.myInterviews(),
      jobAPI.getAll(),
    ]).then(([appsRes, interviewsRes, jobsRes]) => {
      const apps = appsRes.data;
      const interviews = interviewsRes.data;
      setStats({
        applications: apps.length,
        interviews: interviews.length,
        offers: apps.filter(a => a.status === 'OFFERED').length,
        jobs: jobsRes.data.length,
      });
      setRecentApps(apps.slice(0, 4));
      setUpcomingInterviews(interviews.slice(0, 3));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statusColors = { APPLIED: 'badge-blue', UNDER_REVIEW: 'badge-yellow', SHORTLISTED: 'badge-purple', INTERVIEW_SCHEDULED: 'badge-cyan', OFFERED: 'badge-green', REJECTED: 'badge-red', WITHDRAWN: 'badge-gray' };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-secondary text-sm mt-1">Here's your placement journey at a glance</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/student/jobs')}>
          Browse Jobs <ArrowRight size={16} />
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        {[
          { label: 'Jobs Available', value: stats.jobs, icon: Briefcase, color: '#3b82f6', bg: 'rgba(59, 130, 246,0.15)' },
          { label: 'Applications', value: stats.applications, icon: FileText, color: '#801336', bg: 'rgba(139,92,246,0.15)' },
          { label: 'Interviews', value: stats.interviews, icon: Calendar, color: '#06b6d4', bg: 'rgba(6,182,212,0.15)' },
          { label: 'Offers Received', value: stats.offers, icon: CheckCircle, color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="stat-card">
            <div className="stat-icon" style={{ background: bg }}>
              <Icon size={22} color={color} />
            </div>
            <div className="stat-value" style={{ color }}>{loading ? '—' : value}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Recent Applications */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem' }}>Recent Applications</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/student/applications')}>View All</button>
          </div>
          {recentApps.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <p>No applications yet</p>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/student/jobs')}>Apply Now</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recentApps.map(app => (
                <div key={app.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{app.job?.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{app.job?.company?.companyName}</div>
                  </div>
                  <span className={`badge ${statusColors[app.status] || 'badge-gray'}`}>{app.status?.replace(/_/g, ' ')}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Interviews */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem' }}>Upcoming Interviews</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/student/interviews')}>View All</button>
          </div>
          {upcomingInterviews.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📅</div>
              <p>No interviews scheduled</p>
              <p className="text-xs text-muted">Keep applying to get shortlisted!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {upcomingInterviews.map(iv => (
                <div key={iv.id} style={{ background: 'var(--bg-input)', borderRadius: 10, padding: '12px 16px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{iv.application?.job?.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    {iv.scheduledAt ? new Date(iv.scheduledAt).toLocaleString() : 'TBD'} · {iv.mode}
                  </div>
                  <div style={{ marginTop: 6 }}><span className={`badge ${iv.mode === 'ONLINE' ? 'badge-cyan' : 'badge-purple'}`}>{iv.mode}</span></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card mt-6">
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', marginBottom: 16 }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { label: '🤖 Ask AI Assistant', action: () => window.dispatchEvent(new CustomEvent('open-chatbot')), variant: 'btn-primary' },
            { label: '📄 Update Resume', action: () => navigate('/student/profile'), variant: 'btn-secondary' },
            { label: '💼 Browse All Jobs', action: () => navigate('/student/jobs'), variant: 'btn-ghost' },
            { label: '📊 Skill Gap', action: () => navigate('/student/skill-gap'), variant: 'btn-ghost' },
          ].map(({ label, action, variant }) => (
            <button key={label} className={`btn ${variant}`} onClick={action}>{label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
