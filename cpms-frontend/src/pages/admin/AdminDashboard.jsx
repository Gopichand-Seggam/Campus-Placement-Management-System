import { useState, useEffect } from 'react';
import { applicationAPI, jobAPI, studentAPI, companyAPI } from '../../api/client';
import { Users, Briefcase, Building2, CheckCircle, BarChart3, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, companies: 0, jobs: 0, applications: 0, offers: 0 });
  const [appStats, setAppStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      studentAPI.getAll(),
      companyAPI.getAll(),
      jobAPI.getAllAdmin(),
      applicationAPI.getStats(),
    ]).then(([students, companies, jobs, appStatsData]) => {
      setStats({
        students: students.data.length,
        companies: companies.data.length,
        jobs: jobs.data.length,
        applications: appStatsData.data.total || 0,
        offers: appStatsData.data.offered || 0,
      });
      setAppStats([
        { name: 'Shortlisted', value: appStatsData.data.shortlisted || 0 },
        { name: 'Offered', value: appStatsData.data.offered || 0 },
        { name: 'Rejected', value: appStatsData.data.rejected || 0 },
        { name: 'Pending', value: (appStatsData.data.total || 0) - ((appStatsData.data.shortlisted || 0) + (appStatsData.data.offered || 0) + (appStatsData.data.rejected || 0)) }
      ]);
    }).finally(() => setLoading(false));
  }, []);

  const COLORS = ['#801336', '#10b981', '#ef4444', '#3b82f6'];

  const customTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '8px 12px', borderRadius: 8, fontSize: '0.85rem' }}>
          <p style={{ fontWeight: 600, margin: 0 }}>{payload[0].name}: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header mb-8">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="text-secondary text-sm">System analytics and overview</p>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 32 }}>
        {[
          { label: 'Total Students', value: stats.students, icon: Users, color: '#3b82f6', bg: 'rgba(59, 130, 246,0.15)' },
          { label: 'Companies', value: stats.companies, icon: Building2, color: '#801336', bg: 'rgba(139,92,246,0.15)' },
          { label: 'Job Postings', value: stats.jobs, icon: Briefcase, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
          { label: 'Offers Made', value: stats.offers, icon: CheckCircle, color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="stat-card" style={{ padding: '24px' }}>
            <div className="flex items-center justify-between mb-4">
              <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={22} color={color} />
              </div>
            </div>
            <div className="stat-value" style={{ color }}>{loading ? '—' : value}</div>
            <div className="stat-label mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={18} color="var(--accent-blue-light)" />
            <h2 className="font-heading text-lg">Application Status Distribution</h2>
          </div>
          {loading ? (
            <div className="flex justify-center p-8"><div className="spinner" /></div>
          ) : (
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={appStats} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={4} dataKey="value">
                    {appStats.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <RechartsTooltip content={customTooltip} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 flex-wrap mt-2">
                {appStats.map((entry, i) => (
                  <div key={entry.name} className="flex items-center gap-2 text-xs">
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i] }} />
                    <span className="text-secondary">{entry.name} ({entry.value})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={18} color="var(--accent-green)" />
            <h2 className="font-heading text-lg">System Quick Stats</h2>
          </div>
          
          <div className="flex-col gap-4">
            <div className="p-4" style={{ background: 'var(--bg-input)', borderRadius: 12, border: '1px solid var(--border)' }}>
              <div className="text-sm text-secondary mb-1">Total Applications</div>
              <div className="font-heading text-xl font-bold">{loading ? '—' : stats.applications}</div>
            </div>
            
            <div className="p-4" style={{ background: 'var(--bg-input)', borderRadius: 12, border: '1px solid var(--border)' }}>
              <div className="text-sm text-secondary mb-1">Placement Success Rate</div>
              <div className="font-heading text-xl font-bold text-success">
                {loading || stats.students === 0 ? '—' : Math.round((stats.offers / stats.students) * 100) + '%'}
              </div>
            </div>
            
            <div className="p-4" style={{ background: 'var(--bg-input)', borderRadius: 12, border: '1px solid var(--border)' }}>
              <div className="text-sm text-secondary mb-1">Applications Per Job Avg</div>
              <div className="font-heading text-xl font-bold text-accent">
                {loading || stats.jobs === 0 ? '—' : (stats.applications / stats.jobs).toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
