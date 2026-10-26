import { useState, useEffect } from 'react';
import { jobAPI, applicationAPI, studentAPI } from '../../api/client';
import { Search, MapPin, DollarSign, Clock, Building2, Briefcase, Filter } from 'lucide-react';

export default function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState('');
  const [selected, setSelected] = useState(null);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [studentProfile, setStudentProfile] = useState(null);
  const jobsPerPage = 8;

  useEffect(() => {
    Promise.all([
      jobAPI.getAll(),
      studentAPI.getProfile().catch(() => ({ data: null }))
    ]).then(([jobsRes, profileRes]) => {
      setJobs(jobsRes.data);
      setFiltered(jobsRes.data);
      if (profileRes?.data) setStudentProfile(profileRes.data);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let f = jobs;
    if (search) f = f.filter(j => j.title?.toLowerCase().includes(search.toLowerCase()) || j.company?.companyName?.toLowerCase().includes(search.toLowerCase()));
    if (jobType) f = f.filter(j => j.jobType === jobType);
    setFiltered(f);
    setCurrentPage(1); // Reset page to 1 when filters change
  }, [search, jobType, jobs]);

  const apply = async () => {
    if (!studentProfile?.resumeUrl) {
      setMsg('❌ You must upload a resume in your Profile before applying to jobs.');
      return;
    }
    setApplying(true);
    try {
      await applicationAPI.apply(selected.id, { coverLetter });
      setMsg('✅ Applied successfully!');
      setSelected(null);
    } catch (e) {
      setMsg('❌ ' + (e.response?.data?.message || e.message));
    } finally { setApplying(false); }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Job Listings</h1>
          <p className="text-secondary text-sm">{filtered.length} opportunities available</p>
        </div>
      </div>

      {msg && <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="search-bar flex-1" style={{ minWidth: 200 }}>
          <Search size={16} className="search-icon" />
          <input className="form-input" style={{ paddingLeft: 40 }} placeholder="Search jobs or companies..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-input form-select" style={{ width: 180 }} value={jobType} onChange={e => setJobType(e.target.value)}>
          <option value="">All Types</option>
          <option value="FULL_TIME">Full Time</option>
          <option value="INTERNSHIP">Internship</option>
          <option value="PART_TIME">Part Time</option>
        </select>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon">🔍</div><p>No jobs found</p></div>
      ) : (
        <>
          <div className="grid-auto">
            {filtered.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage).map(job => (
              <div key={job.id} className="job-card" onClick={() => { setSelected(job); setMsg(''); }}>
              <div className="flex items-center gap-3 mb-3">
                <div style={{ width: 42, height: 42, borderRadius: 10, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Building2 size={20} color="white" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{job.title}</div>
                  <div className="text-sm text-muted">{job.company?.companyName}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                {job.location && <span className="badge badge-gray"><MapPin size={10} /> {job.location}</span>}
                {job.jobType && <span className="badge badge-blue">{job.jobType.replace('_', ' ')}</span>}
                {job.sector && <span className="badge badge-purple">{job.sector}</span>}
                {job.ctcMin && <span className="badge badge-green"><DollarSign size={10} /> {job.ctcMin}–{job.ctcMax} LPA</span>}
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {job.description}
              </p>
              {job.applicationDeadline && (
                <div className="text-xs text-muted mt-2 flex items-center gap-1">
                  <Clock size={11} /> Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
          </div>

          {filtered.length > jobsPerPage && (
            <div className="flex justify-center gap-2 mt-8">
              <button 
                className="btn btn-ghost btn-sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <div className="flex items-center px-4 font-medium text-sm text-secondary">
                Page {currentPage} of {Math.ceil(filtered.length / jobsPerPage)}
              </div>
              <button 
                className="btn btn-ghost btn-sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filtered.length / jobsPerPage)))}
                disabled={currentPage === Math.ceil(filtered.length / jobsPerPage)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Apply Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Briefcase size={22} color="white" />
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>{selected.title}</h2>
                <p className="text-sm text-muted">{selected.company?.companyName}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {selected.location && <span className="badge badge-gray"><MapPin size={10} /> {selected.location}</span>}
              {selected.jobType && <span className="badge badge-blue">{selected.jobType.replace('_',' ')}</span>}
              {selected.sector && <span className="badge badge-purple">{selected.sector}</span>}
              {selected.ctcMin && <span className="badge badge-green">{selected.ctcMin}–{selected.ctcMax} LPA</span>}
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>{selected.description}</p>

            {selected.requiredSkills && (
              <div className="mb-4">
                <div className="form-label mb-2">Required Skills</div>
                <p className="text-sm text-secondary">{selected.requiredSkills}</p>
              </div>
            )}

            <div className="form-group mb-4">
              <label className="form-label">Cover Letter (Optional)</label>
              <textarea className="form-input" placeholder="Tell them why you're a great fit..." value={coverLetter} onChange={e => setCoverLetter(e.target.value)} rows={4} />
            </div>

            <div className="flex gap-3">
              <button className="btn btn-primary flex-1" onClick={apply} disabled={applying}>
                {applying ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : '🚀 Apply Now'}
              </button>
              <button className="btn btn-ghost" onClick={() => setSelected(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
