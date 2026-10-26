import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { portfolioAPI } from '../api/client';
import { Github, Linkedin, Download, Globe, GraduationCap, Code2, Award, Phone, Mail, Loader } from 'lucide-react';

export default function PublicPortfolio() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    portfolioAPI.get(userId).then(r => setProfile(r.data)).catch(() => setError(true)).finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><Loader size={36} className="spin" /></div>;
  if (error) return <div style={{ textAlign: 'center', padding: 80 }}><h2>Portfolio not found</h2><p style={{ color: 'var(--text-muted)' }}>This student profile doesn't exist or isn't public.</p></div>;

  const skills = profile.skills ? profile.skills.split(',').map(s => s.trim()) : [];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '40px 20px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Hero */}
        <div className="card" style={{ textAlign: 'center', padding: 40, marginBottom: 20, background: 'linear-gradient(135deg, rgba(59, 130, 246,0.12), rgba(139,92,246,0.12))', borderColor: 'rgba(59, 130, 246,0.3)' }}>
          <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '2.2rem', fontWeight: 800, color: 'white' }}>
            {profile.name?.[0]?.toUpperCase()}
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 4, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{profile.name}</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>{profile.branch} · {profile.college}</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: '0.9rem' }}>Class of {profile.graduationYear} · CGPA: <strong style={{ color: 'var(--accent-blue)' }}>{profile.cgpa}</strong></p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Mail size={14} /> {profile.email}
              </a>
            )}
            {profile.linkedInUrl && (
              <a href={profile.linkedInUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#C72C41' }}>
                <Linkedin size={14} /> LinkedIn
              </a>
            )}
            {profile.githubUrl && (
              <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Github size={14} /> GitHub
              </a>
            )}
            {profile.resumeUrl && (
              <a href={`http://localhost:8080${profile.resumeUrl}`} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Download size={14} /> Resume
              </a>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="card" style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Code2 size={18} style={{ color: 'var(--accent-blue)' }} /> Technical Skills
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {skills.map(sk => (
                <span key={sk} style={{ padding: '6px 16px', borderRadius: 20, background: 'rgba(59, 130, 246,0.12)', border: '1px solid rgba(59, 130, 246,0.25)', color: 'var(--accent-blue-light)', fontWeight: 500, fontSize: '0.88rem' }}>
                  {sk}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        <div className="card" style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <GraduationCap size={18} style={{ color: '#10b981' }} /> Education
          </h2>
          <div style={{ padding: '14px 18px', background: 'var(--bg-card-hover)', borderRadius: 12, borderLeft: '3px solid #10b981' }}>
            <div style={{ fontWeight: 600, fontSize: '1rem' }}>{profile.college}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{profile.branch}</div>
            <div style={{ marginTop: 6, display: 'flex', gap: 16, fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Graduation: <strong style={{ color: 'var(--text-primary)' }}>{profile.graduationYear}</strong></span>
              <span style={{ color: 'var(--text-muted)' }}>CGPA: <strong style={{ color: profile.cgpa >= 8 ? '#10b981' : profile.cgpa >= 6 ? '#f59e0b' : '#ef4444' }}>{profile.cgpa}</strong></span>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 30, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <Globe size={12} style={{ display: 'inline', marginRight: 4 }} />
          Public portfolio powered by CPMS
        </div>
      </div>
    </div>
  );
}
