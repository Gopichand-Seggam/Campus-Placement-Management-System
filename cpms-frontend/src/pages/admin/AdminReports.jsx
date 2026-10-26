import { useState, useEffect } from 'react';
import api from '../../api/client';
import { studentAPI, companyAPI, jobAPI, applicationAPI } from '../../api/client';
import { TrendingUp, Users, Building2, Briefcase, CheckCircle, BarChart3, PieChart as PieIcon } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line
} from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#ef4444', '#801336', '#f59e0b', '#06b6d4'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '8px 14px', borderRadius: 8, fontSize: '0.82rem' }}>
        {label && <p style={{ fontWeight: 700, marginBottom: 4 }}>{label}</p>}
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color, margin: 0 }}>{p.name}: <b>{p.value}</b></p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminReports() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/reports/summary')
      .then(r => setSummary(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center" style={{ paddingTop: 80 }}><div className="spinner" /></div>;
  if (!summary) return <div className="empty-state"><div className="empty-state-icon">📊</div><p>No data available</p></div>;

  const pieData = [
    { name: 'Offered', value: summary.offered || 0 },
    { name: 'Shortlisted', value: summary.shortlisted || 0 },
    { name: 'Interview', value: summary.interviewScheduled || 0 },
    { name: 'Rejected', value: summary.rejected || 0 },
  ];

  const barData = [
    { name: 'Students', count: summary.totalStudents || 0 },
    { name: 'Companies', count: summary.totalCompanies || 0 },
    { name: 'Jobs', count: summary.totalJobs || 0 },
    { name: 'Applications', count: summary.totalApplications || 0 },
  ];

  const statCards = [
    { label: 'Total Students', value: summary.totalStudents, icon: Users, color: '#3b82f6', bg: 'rgba(59, 130, 246,0.15)' },
    { label: 'Total Companies', value: summary.totalCompanies, icon: Building2, color: '#801336', bg: 'rgba(139,92,246,0.15)' },
    { label: 'Active Jobs', value: summary.totalJobs, icon: Briefcase, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
    { label: 'Offers Made', value: summary.offered, icon: CheckCircle, color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  ];

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header mb-8">
        <div>
          <h1 className="page-title">Placement Reports & Analytics</h1>
          <p className="text-secondary text-sm">Live statistics across the entire system</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="stat-card">
            <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Icon size={22} color={color} />
            </div>
            <div className="stat-value" style={{ color }}>{value ?? '—'}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Placement Rate Banner */}
      <div className="card mb-6" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(59, 130, 246,0.08))', border: '1px solid rgba(16,185,129,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 4 }}>Overall Placement Rate</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, color: '#10b981' }}>
              {summary.placementRate || 0}%
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {summary.offered} students placed out of {summary.totalStudents} registered
            </div>
          </div>
          <TrendingUp size={64} color="rgba(16,185,129,0.3)" />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Pie Chart */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <PieIcon size={18} color="var(--accent-blue-light)" />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem' }}>Application Status Breakdown</h2>
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 8 }}>
            {pieData.map((d, i) => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i] }} />
                <span className="text-secondary">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <BarChart3 size={18} color="var(--accent-purple)" />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem' }}>System Overview</h2>
          </div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Count" radius={[6, 6, 0, 0]}>
                  {barData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="card">
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', marginBottom: 16 }}>Key Metrics Summary</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {[
            { label: 'Total Applications', value: summary.totalApplications, color: '#3b82f6' },
            { label: 'Shortlisted', value: summary.shortlisted, color: '#801336' },
            { label: 'Interviews Scheduled', value: summary.interviewScheduled, color: '#06b6d4' },
            { label: 'Offers Given', value: summary.offered, color: '#10b981' },
            { label: 'Rejected', value: summary.rejected, color: '#ef4444' },
            { label: 'Avg Apps / Job', value: summary.totalJobs > 0 ? (summary.totalApplications / summary.totalJobs).toFixed(1) : '—', color: '#f59e0b' },
          ].map(m => (
            <div key={m.label} style={{ background: 'var(--bg-input)', borderRadius: 12, padding: '14px 16px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6 }}>{m.label}</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
