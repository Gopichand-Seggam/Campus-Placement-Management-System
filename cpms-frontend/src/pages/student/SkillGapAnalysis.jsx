import { useState, useEffect } from 'react';
import { portfolioAPI, jobAPI } from '../../api/client';
import { Zap, CheckCircle, XCircle, AlertCircle, ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const RESOURCES = {
  react: 'https://react.dev',
  java: 'https://dev.java',
  python: 'https://docs.python.org',
  sql: 'https://www.w3schools.com/sql/',
  javascript: 'https://developer.mozilla.org',
  'node.js': 'https://nodejs.org/docs/',
  'spring boot': 'https://spring.io/projects/spring-boot',
  docker: 'https://docs.docker.com',
  kubernetes: 'https://kubernetes.io/docs/',
  aws: 'https://aws.amazon.com/getting-started/',
  git: 'https://git-scm.com/doc',
  mongodb: 'https://www.mongodb.com/docs/',
  typescript: 'https://www.typescriptlang.org/docs/',
  flutter: 'https://flutter.dev/docs',
  kotlin: 'https://kotlinlang.org/docs/',
};

export default function SkillGapAnalysis() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [gap, setGap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    jobAPI.getAll().then(r => setJobs(r.data)).catch(() => {});
  }, []);

  const analyze = async () => {
    if (!selectedJob) return;
    setLoading(true);
    try {
      const r = await portfolioAPI.getSkillGap(selectedJob);
      setGap(r.data);
    } catch { setGap(null); }
    finally { setLoading(false); }
  };

  const filtered = jobs.filter(j => j.title?.toLowerCase().includes(search.toLowerCase()) || j.companyName?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page-container animate-fade-in" style={{ maxWidth: 860 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Skill Gap Analysis</h1>
          <p className="text-secondary">See exactly which skills you have and which you need for any job</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', padding: '6px 14px', borderRadius: 20 }}>
          <Zap size={14} style={{ color: 'var(--accent-purple)' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', fontWeight: 600 }}>AI Powered</span>
        </div>
      </div>

      {/* Job Selector */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 12, fontSize: '1rem', fontWeight: 600 }}>Select a Job to Analyze</h3>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" style={{ paddingLeft: 36 }} placeholder="Search jobs..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div style={{ maxHeight: 220, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.length === 0 && <p className="text-muted text-sm" style={{ padding: 10 }}>No active jobs found. Make sure the backend is running.</p>}
          {filtered.slice(0, 20).map(job => (
            <div key={job.id} onClick={() => setSelectedJob(job.id)}
              style={{ padding: '10px 14px', borderRadius: 10, border: `1px solid ${selectedJob === job.id ? 'var(--accent-blue)' : 'var(--border)'}`, background: selectedJob === job.id ? 'rgba(59, 130, 246,0.1)' : 'var(--bg-card)', cursor: 'pointer', transition: 'all 0.15s' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{job.title}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{job.companyName || 'Company'} · {job.location}</div>
            </div>
          ))}
        </div>
        <button className="btn btn-primary" style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}
          onClick={analyze} disabled={!selectedJob || loading}>
          {loading ? 'Analyzing...' : <><Zap size={16} /> Analyze Skill Gap</>}
        </button>
      </div>

      {/* Results */}
      {gap && (
        <div style={{ display: 'grid', gap: 16 }}>
          {/* Match Score */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{gap.jobTitle}</h2>
                <p className="text-secondary text-sm">{gap.companyName}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{gap.matchPercentage}%</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Match</div>
              </div>
            </div>
            <div style={{ height: 8, borderRadius: 8, background: 'var(--border)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${gap.matchPercentage}%`, background: 'var(--gradient-primary)', borderRadius: 8, transition: 'width 1s ease' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Matched Skills */}
            <div className="card">
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={16} style={{ color: '#10b981' }} /> You Have ({gap.matchedSkills?.length || 0})
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {(gap.matchedSkills?.length > 0) ? gap.matchedSkills.map(s => (
                  <span key={s} style={{ padding: '4px 12px', borderRadius: 20, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', fontSize: '0.8rem', fontWeight: 500 }}>{s}</span>
                )) : <p className="text-muted text-sm">No matching skills yet</p>}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="card">
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <XCircle size={16} style={{ color: '#ef4444' }} /> Skills Needed ({gap.missingSkills?.length || 0})
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {(gap.missingSkills?.length > 0) ? gap.missingSkills.map(s => (
                  <div key={s}>
                    {RESOURCES[s.toLowerCase()] ? (
                      <a href={RESOURCES[s.toLowerCase()]} target="_blank" rel="noreferrer"
                        style={{ padding: '4px 12px', borderRadius: 20, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: '0.8rem', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                        {s} <ArrowRight size={10} />
                      </a>
                    ) : (
                      <span style={{ padding: '4px 12px', borderRadius: 20, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: '0.8rem', fontWeight: 500 }}>{s}</span>
                    )}
                  </div>
                )) : <p style={{ color: '#10b981', fontSize: '0.85rem' }}>✅ You meet all requirements!</p>}
              </div>
            </div>
          </div>

          {(gap.missingSkills?.length > 0) && (
            <div className="card" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertCircle size={16} style={{ color: 'var(--accent-purple)' }} /> Click any red skill above to find learning resources!
              </h3>
              <p className="text-secondary text-sm">Links with → go directly to official documentation or beginner-friendly tutorials.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
