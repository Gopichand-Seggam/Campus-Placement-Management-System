import { useState, useEffect } from 'react';
import { studentAPI } from '../../api/client';
import { Users, Search, GraduationCap, BookOpen, Award } from 'lucide-react';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentAPI.getAll()
      .then(r => { setStudents(r.data); setFiltered(r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(students.filter(s =>
      s.user?.name?.toLowerCase().includes(q) ||
      s.user?.email?.toLowerCase().includes(q) ||
      s.college?.toLowerCase().includes(q) ||
      s.branch?.toLowerCase().includes(q)
    ));
  }, [search, students]);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Students</h1>
          <p className="text-secondary text-sm">{students.length} total registered students</p>
        </div>
      </div>

      {/* Search */}
      <div className="card mb-6">
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="form-input" style={{ paddingLeft: 40 }} placeholder="Search by name, email, college, branch..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="flex justify-center p-12"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state p-12">
            <div className="empty-state-icon">👥</div>
            <p>No students found</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-tertiary)' }}>
                  {['Student', 'College', 'Branch', 'CGPA', 'Grad Year', 'Skills', 'Phone'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: 700 }}>{s.user?.name?.[0] || 'S'}</span>
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{s.user?.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.85rem' }}>{s.college || <span className="text-muted">—</span>}</td>
                    <td style={{ padding: '14px 16px', fontSize: '0.85rem' }}>{s.branch || <span className="text-muted">—</span>}</td>
                    <td style={{ padding: '14px 16px' }}>
                      {s.cgpa ? <span className="badge badge-green">{s.cgpa}</span> : <span className="text-muted">—</span>}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.85rem' }}>{s.graduationYear || <span className="text-muted">—</span>}</td>
                    <td style={{ padding: '14px 16px', maxWidth: 180 }}>
                      {s.skills ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {s.skills.split(',').slice(0, 3).map(sk => (
                            <span key={sk} className="badge badge-blue" style={{ fontSize: '0.7rem' }}>{sk.trim()}</span>
                          ))}
                          {s.skills.split(',').length > 3 && <span className="badge badge-gray" style={{ fontSize: '0.7rem' }}>+{s.skills.split(',').length - 3}</span>}
                        </div>
                      ) : <span className="text-muted">—</span>}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.85rem' }}>{s.phone || <span className="text-muted">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-muted mt-3">Showing {filtered.length} of {students.length} students</p>
    </div>
  );
}
