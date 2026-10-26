import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobAPI, applicationAPI } from '../../api/client';
import { Users, Briefcase, PlusCircle, CheckCircle, TrendingUp } from 'lucide-react';

export default function CompanyDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ jobs: 0, applicants: 0, hired: 0 });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobAPI.getMyJobs().then(async r => {
      const myJobs = r.data;
      setJobs(myJobs.slice(0, 5));
      let totalApp = 0; let totalHire = 0;
      for (const j of myJobs) {
        try {
          const apps = await applicationAPI.byJob(j.id);
          totalApp += apps.data.length;
          totalHire += apps.data.filter(a => a.status === 'OFFERED').length;
        } catch(e) {}
      }
      setStats({ jobs: myJobs.length, applicants: totalApp, hired: totalHire });
      setLoading(false);
    });
  }, []);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Company Overview</h1>
          <p className="text-secondary text-sm">Welcome back, {user?.name}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/company/post-job')}>
          <PlusCircle size={16} /> Post New Job
        </button>
      </div>

      <div className="grid-3" style={{ marginBottom: 32 }}>
        {[
          { label: 'Active Postings', value: stats.jobs, icon: Briefcase, color: '#06b6d4', bg: 'rgba(6,182,212,0.15)' },
          { label: 'Total Applicants', value: stats.applicants, icon: Users, color: '#3b82f6', bg: 'rgba(59, 130, 246,0.15)' },
          { label: 'Candidates Hired', value: stats.hired, icon: CheckCircle, color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="stat-card" style={{ padding: '24px 30px' }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="stat-label mb-2 text-sm">{label}</div>
                <div className="stat-value" style={{ color }}>{loading ? '—' : value}</div>
              </div>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={28} color={color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>Recent Postings</h2>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/company/applicants')}>View All</button>
        </div>

        {loading ? (
          <div className="flex justify-center p-8"><div className="spinner" /></div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <p>You haven't posted any jobs yet</p>
            <button className="btn btn-primary btn-sm mt-2" onClick={() => navigate('/company/post-job')}>Create First Job</button>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Type</th>
                  <th>Posted On</th>
                  <th>Status</th>
                  <th>Applicants</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id}>
                    <td className="font-semibold">{job.title}</td>
                    <td><span className="badge badge-gray">{job.jobType?.replace('_', ' ') ?? '—'}</span></td>
                    <td className="text-secondary text-sm">{new Date(job.postedAt).toLocaleDateString()}</td>
                    <td><span className={`badge ${job.status === 'ACTIVE' ? 'badge-green' : 'badge-gray'}`}>{job.status}</span></td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/company/applicants?jobId=${job.id}`)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
