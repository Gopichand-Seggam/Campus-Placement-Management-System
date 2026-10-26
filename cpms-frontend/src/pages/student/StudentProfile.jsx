import { useState, useEffect } from 'react';
import { studentAPI } from '../../api/client';
import { User, Mail, GraduationCap, MapPin, Code, Link as LinkIcon, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function StudentProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    college: '', branch: '', cgpa: '', graduationYear: '',
    skills: '', phone: '', linkedinUrl: '', githubUrl: '', resumeUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    studentAPI.getProfile().then(r => setProfile(r.data || {})).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg('');
    try {
      await studentAPI.updateProfile(profile);
      setMsg('✅ Profile updated successfully!');
    } catch (err) {
      setMsg('❌ Failed to update profile');
    } finally { setSaving(false); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true); setMsg('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const r = await studentAPI.uploadResume(formData);
      setProfile(prev => ({ ...prev, resumeUrl: r.data.resumeUrl }));
      setMsg('✅ Resume uploaded successfully!');
    } catch (err) {
      setMsg('❌ Failed to upload resume');
    } finally { setUploading(false); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>;

  return (
    <div className="page-container animate-fade-in" style={{ maxWidth: 900 }}>
      <h1 className="page-title mb-6">My Profile</h1>

      {msg && <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}

      <div className="grid-2">
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800 }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>{user?.name}</h2>
              <div className="text-secondary flex items-center gap-1 text-sm mt-1"><Mail size={12} /> {user?.email}</div>
            </div>
          </div>

          

          <div className="card">
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div><h3 className="text-sm text-accent mb-3 uppercase tracking-wider font-bold">Education</h3></div>
              <div className="form-group">
                <label className="form-label">College/University</label>
                <div className="search-bar"><GraduationCap size={16} className="search-icon" /><input className="form-input w-full" style={{ paddingLeft: 40 }} value={profile.college || ''} onChange={e => setProfile({...profile, college: e.target.value})} placeholder="e.g. Stanford University" /></div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Branch/Major</label>
                  <input className="form-input" value={profile.branch || ''} onChange={e => setProfile({...profile, branch: e.target.value})} placeholder="e.g. Computer Science" />
                </div>
                <div className="form-group">
                  <label className="form-label">Graduation Year</label>
                  <input type="number" className="form-input" value={profile.graduationYear || ''} onChange={e => setProfile({...profile, graduationYear: e.target.value})} placeholder="e.g. 2024" />
                </div>
              </div>
              <div className="form-group w-1/2">
                <label className="form-label">CGPA</label>
                <input type="number" step="0.01" className="form-input" value={profile.cgpa || ''} onChange={e => setProfile({...profile, cgpa: e.target.value})} placeholder="e.g. 8.5" />
              </div>

              <div className="divider" />
              <div><h3 className="text-sm text-accent mb-3 uppercase tracking-wider font-bold">Professional</h3></div>

              <div className="form-group">
                <label className="form-label">Skills (comma separated)</label>
                <div className="search-bar"><Code size={16} className="search-icon" /><input className="form-input w-full" style={{ paddingLeft: 40 }} value={profile.skills || ''} onChange={e => setProfile({...profile, skills: e.target.value})} placeholder="Java, React, MySQL..." /></div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">LinkedIn URL</label>
                  <div className="search-bar"><LinkIcon size={16} className="search-icon" /><input className="form-input w-full" style={{ paddingLeft: 40 }} value={profile.linkedinUrl || ''} onChange={e => setProfile({...profile, linkedinUrl: e.target.value})} placeholder="https://linkedin.com/in/..." /></div>
                </div>
                <div className="form-group">
                  <label className="form-label">GitHub URL</label>
                  <div className="search-bar"><LinkIcon size={16} className="search-icon" /><input className="form-input w-full" style={{ paddingLeft: 40 }} value={profile.githubUrl || ''} onChange={e => setProfile({...profile, githubUrl: e.target.value})} placeholder="https://github.com/..." /></div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" value={profile.phone || ''} onChange={e => setProfile({...profile, phone: e.target.value})} placeholder="+1 234 567 8900" />
              </div>

              <button type="submit" className="btn btn-primary mt-4" disabled={saving}>
                {saving ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : 'Save Changes'}
              </button>
            </form>
          </div>

          <div className="grid-2" style={{ marginTop: 20, gap: 20 }}>
            <div className="card">
              <h3 className="font-heading text-lg mb-4">Resume</h3>
              {profile.resumeUrl ? (
                <div style={{ padding: 16, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div className="flex items-center gap-3">
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={18} color="white" /></div>
                    <div>
                      <div className="font-semibold text-sm">Resume Uploaded</div>
                      <div className="text-xs text-success">Verified</div>
                    </div>
                  </div>
                  <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">View</a>
                </div>
              ) : (
                <div style={{ padding: 16, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, marginBottom: 16 }}>
                  <p className="text-sm" style={{ color: '#fbbf24' }}>No resume uploaded yet. Companies won't be able to process your applications.</p>
                </div>
              )}

              <div className="form-group">
                <label className="btn btn-secondary btn-full" style={{ cursor: 'pointer', position: 'relative' }}>
                  {uploading ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <><Upload size={16} /> Upload New Resume (PDF)</>}
                  <input type="file" accept=".pdf,.doc,.docx" style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} onChange={handleFileUpload} disabled={uploading} />
                </label>
              </div>
              <p className="text-xs text-muted text-center mt-3">Max file size: 10MB</p>
            </div>
          
            {/* Profile Completion Card */}
            <div className="card" style={{ padding: 20 }}>
              <h3 className="font-heading text-lg mb-4">Profile Status</h3>
              <div style={{ background: 'var(--bg-tertiary)', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
                <div style={{ width: profile.resumeUrl && profile.skills ? '100%' : profile.resumeUrl || profile.skills ? '60%' : '30%', height: '100%', background: 'var(--gradient-primary)', transition: 'width 0.4s ease' }} />
              </div>
              <p className="text-sm text-secondary">
                {(profile.resumeUrl && profile.skills) ? 'Your profile is looking great! You are ready to apply for jobs.' : 'Complete your profile and upload a resume to increase your chances!'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
