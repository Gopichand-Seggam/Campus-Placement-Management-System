import { useState, useEffect } from 'react';
import { portfolioAPI } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Trophy, Star, Code2, GraduationCap, Search, ExternalLink } from 'lucide-react';

export default function StudentRanking() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    portfolioAPI.getRanking()
      .then(r => setRanking(r.data))
      .catch(() => setRanking([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = ranking.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.college?.toLowerCase().includes(search.toLowerCase()) ||
    s.branch?.toLowerCase().includes(search.toLowerCase()) ||
    s.skills?.toLowerCase().includes(search.toLowerCase())
  );

  const getRowStyle = (rank) => {
    if (rank === 1) return { background: 'rgba(251,191,36,0.08)', borderColor: 'rgba(251,191,36,0.3)' };
    if (rank === 2) return { background: 'rgba(156,163,175,0.08)', borderColor: 'rgba(156,163,175,0.3)' };
    if (rank === 3) return { background: 'rgba(180,83,9,0.08)', borderColor: 'rgba(180,83,9,0.3)' };
    return {};
  };

  const getMedalColor = (rank) => {
    if (rank === 1) return '#fbbf24';
    if (rank === 2) return '#9ca3af';
    if (rank === 3) return '#b45309';
    return 'var(--text-muted)';
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Skill Ranking</h1>
          <p className="text-secondary">Top students ranked by skills, CGPA, and overall placement readiness</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', padding: '6px 14px', borderRadius: 20 }}>
          <Trophy size={14} style={{ color: '#fbbf24' }} />
          <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 600 }}>{ranking.length} Students</span>
        </div>
      </div>

      {/* Top 3 Podium */}
      {ranking.length >= 3 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
          {[ranking[1], ranking[0], ranking[2]].map((s, i) => {
            const actualRank = i === 0 ? 2 : i === 1 ? 1 : 3;
            const sizes = [110, 130, 100];
            return (
              <div key={s.id} className="card" style={{ textAlign: 'center', ...getRowStyle(actualRank), padding: '20px 12px', order: i === 1 ? -1 : i }}>
                <div style={{ fontSize: sizes[i === 1 ? 1 : i === 0 ? 0 : 2] / 10 + 'rem', marginBottom: 4, color: getMedalColor(actualRank) }}>
                  {actualRank === 1 ? '🥇' : actualRank === 2 ? '🥈' : '🥉'}
                </div>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>
                  {s.name?.[0]?.toUpperCase()}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{s.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 6 }}>{s.branch}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-blue)' }}>Score: {s.score}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>CGPA {s.cgpa} · {s.skillCount} skills</div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="form-input" style={{ paddingLeft: 36 }} placeholder="Search by name, college, skills..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: 40 }}><div className="spinner" /></div> : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-card-hover)' }}>
                {['Rank', 'Student', 'College / Branch', 'Skills', 'CGPA', 'Score', 'Portfolio'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border)', ...getRowStyle(s.rank), transition: 'background 0.15s' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: getMedalColor(s.rank), fontSize: '1.1rem' }}>
                    {s.rank <= 3 ? (s.rank === 1 ? '🥇' : s.rank === 2 ? '🥈' : '🥉') : `#${s.rank}`}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', color: 'white', flexShrink: 0 }}>{s.name?.[0]?.toUpperCase()}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <div>{s.college}</div><div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.branch}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxWidth: 200 }}>
                      {s.skills?.split(',').slice(0, 3).map(sk => (
                        <span key={sk} style={{ padding: '2px 8px', borderRadius: 20, background: 'rgba(59, 130, 246,0.12)', color: 'var(--accent-blue-light)', fontSize: '0.72rem', fontWeight: 500 }}>{sk.trim()}</span>
                      ))}
                      {s.skillCount > 3 && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>+{s.skillCount - 3}</span>}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: s.cgpa >= 8 ? '#10b981' : s.cgpa >= 6 ? '#f59e0b' : '#ef4444' }}>{s.cgpa}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--accent-blue)' }}>{s.score}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <a href={`/portfolio/${s.userId}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: 'var(--accent-blue)', textDecoration: 'none' }}>
                      View <ExternalLink size={12} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No students found</div>}
        </div>
      )}
    </div>
  );
}
