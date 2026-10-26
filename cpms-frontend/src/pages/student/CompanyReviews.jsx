import { useState, useEffect } from 'react';
import { reviewAPI, companyAPI } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Star, Building2, MessageSquare, Plus } from 'lucide-react';

function Stars({ rating, size = 16 }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <Star key={n} size={size} fill={n <= rating ? '#fbbf24' : 'none'} color={n <= rating ? '#fbbf24' : 'var(--border)'} />
      ))}
    </div>
  );
}

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 4, cursor: 'pointer' }}>
      {[1, 2, 3, 4, 5].map(n => (
        <Star key={n} size={28} fill={n <= (hover || value) ? '#fbbf24' : 'none'} color={n <= (hover || value) ? '#fbbf24' : 'var(--border)'}
          onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} onClick={() => onChange(n)} />
      ))}
    </div>
  );
}

export default function CompanyReviews() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ rating: 5, reviewText: '', jobRole: '', difficulty: 'MEDIUM' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    companyAPI.getAll().then(r => setCompanies(r.data)).catch(() => {});
  }, []);

  const loadReviews = async (company) => {
    setSelectedCompany(company);
    try {
      const r = await reviewAPI.getByCompany(company.id);
      setReviews(r.data.reviews || []);
      setAvgRating(r.data.averageRating || 0);
    } catch { setReviews([]); setAvgRating(0); }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!selectedCompany) return alert('Please select a company first');
    setSubmitting(true);
    try {
      await reviewAPI.submit({ ...form, companyId: selectedCompany.id });
      setShowForm(false);
      setForm({ rating: 5, reviewText: '', jobRole: '', difficulty: 'MEDIUM' });
      loadReviews(selectedCompany);
    } catch { alert('Failed to submit review. Have you applied to this company?'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Company Reviews</h1>
          <p className="text-secondary">Honest ratings and interview experiences from students</p>
        </div>
        {selectedCompany && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={16} /> Write Review
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
        {/* Company List */}
        <div>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 10, color: 'var(--text-secondary)' }}>SELECT COMPANY</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {companies.map(c => (
              <div key={c.id} onClick={() => loadReviews(c)}
                style={{ padding: '12px 14px', borderRadius: 10, border: `1px solid ${selectedCompany?.id === c.id ? 'var(--accent-blue)' : 'var(--border)'}`, background: selectedCompany?.id === c.id ? 'rgba(59, 130, 246,0.1)' : 'var(--bg-card)', cursor: 'pointer', transition: 'all 0.15s' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.companyName}</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{c.industry}</div>
              </div>
            ))}
            {companies.length === 0 && <p className="text-muted text-sm">No companies found</p>}
          </div>
        </div>

        {/* Reviews Panel */}
        <div>
          {!selectedCompany ? (
            <div className="card" style={{ textAlign: 'center', padding: 60 }}>
              <Building2 size={48} style={{ margin: '0 auto 16px', display: 'block', opacity: 0.3 }} />
              <p className="text-muted">Select a company to view reviews</p>
            </div>
          ) : (
            <>
              {/* Company Header */}
              <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 4 }}>{selectedCompany.companyName}</h2>
                    <Stars rating={Math.round(avgRating)} size={18} />
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fbbf24' }}>{avgRating.toFixed(1)}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{reviews.length} reviews</div>
                  </div>
                </div>
              </div>

              {/* Submit Review Form */}
              {showForm && (
                <div className="card" style={{ marginBottom: 16 }}>
                  <h3 style={{ marginBottom: 14, fontWeight: 600 }}>Your Review for {selectedCompany.companyName}</h3>
                  <form onSubmit={submit}>
                    <div style={{ marginBottom: 14 }}>
                      <label className="form-label">Rating *</label>
                      <StarPicker value={form.rating} onChange={v => setForm(f => ({...f, rating: v}))} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                      <div><label className="form-label">Job Role *</label><input required className="form-input" value={form.jobRole} onChange={e => setForm(f => ({...f, jobRole: e.target.value}))} placeholder="e.g. Software Engineer" /></div>
                      <div>
                        <label className="form-label">Interview Difficulty</label>
                        <select className="form-input" value={form.difficulty} onChange={e => setForm(f => ({...f, difficulty: e.target.value}))}>
                          <option>EASY</option><option>MEDIUM</option><option>HARD</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ marginBottom: 14 }}><label className="form-label">Your Review</label><textarea className="form-input" rows={3} value={form.reviewText} onChange={e => setForm(f => ({...f, reviewText: e.target.value}))} placeholder="Share your interview experience..." /></div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Review'}</button>
                      <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              {/* Reviews List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {reviews.length === 0 && (
                  <div className="card" style={{ textAlign: 'center', padding: 40 }}>
                    <MessageSquare size={36} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
                    <p className="text-muted">No reviews yet for this company. Be the first!</p>
                  </div>
                )}
                {reviews.map(r => (
                  <div key={r.id} className="card hover-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.student?.user?.name || 'Student'}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.jobRole} · {r.difficulty}</div>
                      </div>
                      <Stars rating={r.rating} />
                    </div>
                    {r.reviewText && <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{r.reviewText}</p>}
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 8 }}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
