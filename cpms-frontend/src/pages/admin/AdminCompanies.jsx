import { useState, useEffect } from 'react';
import { companyAPI } from '../../api/client';
import { Search, Building2, Globe, MapPin, Phone } from 'lucide-react';

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading,] = useState(true);

  useEffect(() => {
    companyAPI.getAll()
      .then(r => { setCompanies(r.data); setFiltered(r.data); })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(companies.filter(c =>
      c.companyName?.toLowerCase().includes(q) ||
      c.industry?.toLowerCase().includes(q) ||
      c.location?.toLowerCase().includes(q) ||
      c.user?.email?.toLowerCase().includes(q)
    ));
  }, [search, companies]);

  const industryColors = {
    'Technology': 'badge-blue', 'Finance': 'badge-green', 'Healthcare': 'badge-cyan',
    'Education': 'badge-purple', 'Manufacturing': 'badge-yellow', 'Consulting': 'badge-orange',
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Companies</h1>
          <p className="text-secondary text-sm">{companies.length} registered companies</p>
        </div>
      </div>

      <div className="card mb-6">
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="form-input" style={{ paddingLeft: 40 }} placeholder="Search by company name, industry, location..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon">🏢</div><p>No companies found</p></div>
      ) : (
        <div className="grid-2" style={{ gap: 16 }}>
          {filtered.map(c => (
            <div key={c.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Building2 size={22} color="white" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{c.companyName}</div>
                  <span className={`badge ${industryColors[c.industry] || 'badge-gray'}`}>{c.industry || 'General'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                {c.location && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={13} /> {c.location}
                  </div>
                )}
                {c.website && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Globe size={13} />
                    <a href={c.website} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-blue-light)', textDecoration: 'none' }}>
                      {c.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                {c.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Phone size={13} /> {c.phone}
                  </div>
                )}
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  {c.user?.email}
                </div>
              </div>

              {c.description && (
                <p style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                  {c.description.length > 120 ? c.description.slice(0, 120) + '…' : c.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted mt-4">Showing {filtered.length} of {companies.length} companies</p>
    </div>
  );
}
