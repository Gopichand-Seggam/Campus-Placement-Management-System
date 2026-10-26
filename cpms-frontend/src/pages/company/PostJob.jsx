import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobAPI } from '../../api/client';
import { Briefcase, MapPin, DollarSign, Calendar } from 'lucide-react';

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', requiredSkills: '', jobType: 'FULL_TIME',
    location: '', sector: '', ctcMin: '', ctcMax: '', openings: 1, minCgpa: 6.0,
    applicationDeadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg('');
    try {
      await jobAPI.create({ ...form, status: 'ACTIVE' });
      setMsg('✅ Job posted successfully!');
      setTimeout(() => navigate('/company/dashboard'), 1500);
    } catch (err) {
      setMsg('❌ Failed to post job. Please ensure your company profile is complete.');
    } finally { setLoading(false); }
  };

  return (
    <div className="page-container animate-fade-in" style={{ maxWidth: 840 }}>
      <h1 className="page-title mb-6">Create Job Posting</h1>

      {msg && <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}

      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="grid-3">
            <div className="form-group flex-1">
              <label className="form-label">Job Title <span className="text-danger">*</span></label>
              <div className="search-bar">
                <Briefcase size={16} className="search-icon" />
                <input required className="form-input w-full" style={{ paddingLeft: 40 }} value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Senior Frontend Engineer" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Job Type <span className="text-danger">*</span></label>
              <select className="form-input form-select" value={form.jobType} onChange={e => setForm({...form, jobType: e.target.value})}>
                <option value="FULL_TIME">Full Time</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="PART_TIME">Part Time</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Sector</label>
              <input className="form-input w-full" value={form.sector} onChange={e => setForm({...form, sector: e.target.value})} placeholder="e.g. IT, Finance, Retail" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Job Description <span className="text-danger">*</span></label>
            <textarea required className="form-input" rows={6} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe the role, responsibilities, and requirements in detail..." />
          </div>

          <div className="form-group">
            <label className="form-label">Required Skills</label>
            <input className="form-input" value={form.requiredSkills} onChange={e => setForm({...form, requiredSkills: e.target.value})} placeholder="e.g. React, Node.js, TypeScript (comma separated)" />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Location</label>
              <div className="search-bar">
                <MapPin size={16} className="search-icon" />
                <input className="form-input w-full" style={{ paddingLeft: 40 }} value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="e.g. Bangalore, Remote" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Application Deadline <span className="text-danger">*</span></label>
              <div className="search-bar">
                <Calendar size={16} className="search-icon" />
                <input type="date" required className="form-input w-full" style={{ paddingLeft: 40 }} value={form.applicationDeadline} onChange={e => setForm({...form, applicationDeadline: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Min CTC (LPA)</label>
              <div className="search-bar">
                <span className="search-icon" style={{ fontSize: '1.1rem', fontWeight: 500, top: 12 }}>₹</span>
                <input type="number" step="0.5" className="form-input w-full" style={{ paddingLeft: 40 }} value={form.ctcMin} onChange={e => setForm({...form, ctcMin: e.target.value})} placeholder="8.0" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Max CTC (LPA)</label>
              <div className="search-bar">
                <span className="search-icon" style={{ fontSize: '1.1rem', fontWeight: 500, top: 12 }}>₹</span>
                <input type="number" step="0.5" className="form-input w-full" style={{ paddingLeft: 40 }} value={form.ctcMax} onChange={e => setForm({...form, ctcMax: e.target.value})} placeholder="12.0" />
              </div>
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
               <label className="form-label">Openings</label>
               <input type="number" min="1" className="form-input w-full" value={form.openings} onChange={e => setForm({...form, openings: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Min CGPA</label>
              <input type="number" step="0.1" max="10" className="form-input" value={form.minCgpa} onChange={e => setForm({...form, minCgpa: e.target.value})} placeholder="6.0" />
            </div>
          </div>

          <div className="divider" />
          <div className="flex justify-end gap-3">
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/company/dashboard')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: 140 }}>
              {loading ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : 'Publish Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
