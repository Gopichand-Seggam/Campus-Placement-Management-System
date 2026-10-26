import { useState, useEffect } from 'react';
import { companyAPI } from '../../api/client';
import { Building2, Mail, Globe, MapPin, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function CompanyProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    companyName: '', industry: '', website: '', location: '', description: '', phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    companyAPI.getProfile().then(r => setProfile(r.data || {})).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg('');
    try {
      await companyAPI.updateProfile(profile);
      setMsg('✅ Company profile updated successfully!');
    } catch (err) {
      setMsg('❌ Failed to update profile');
    } finally { setSaving(false); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>;

  return (
    <div className="page-container animate-fade-in" style={{ maxWidth: 800 }}>
      <h1 className="page-title mb-6">Company Profile</h1>

      {msg && <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(6,182,212,0.3)' }}>
            <Building2 size={28} color="white" />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>{profile.companyName || user?.name}</h2>
            <div className="text-secondary flex items-center gap-1 text-sm mt-1"><Mail size={12} /> {user?.email}</div>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Company Name</label>
            <div className="search-bar">
              <Building2 size={16} className="search-icon" />
              <input className="form-input w-full" style={{ paddingLeft: 40 }} required value={profile.companyName || ''} onChange={e => setProfile({...profile, companyName: e.target.value})} />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Industry</label>
              <input className="form-input" value={profile.industry || ''} onChange={e => setProfile({...profile, industry: e.target.value})} placeholder="e.g. Information Technology, FinTech" />
            </div>
            <div className="form-group">
              <label className="form-label">Location / Headquarters</label>
              <div className="search-bar">
                <MapPin size={16} className="search-icon" />
                <input className="form-input w-full" style={{ paddingLeft: 40 }} value={profile.location || ''} onChange={e => setProfile({...profile, location: e.target.value})} placeholder="e.g. San Francisco, Remote" />
              </div>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Website</label>
              <div className="search-bar">
                <Globe size={16} className="search-icon" />
                <input type="url" className="form-input w-full" style={{ paddingLeft: 40 }} value={profile.website || ''} onChange={e => setProfile({...profile, website: e.target.value})} placeholder="https://example.com" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number / Contact</label>
              <div className="search-bar">
                <Phone size={16} className="search-icon" />
                <input className="form-input w-full" style={{ paddingLeft: 40 }} value={profile.phone || ''} onChange={e => setProfile({...profile, phone: e.target.value})} placeholder="+1 234 567 8900" />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Company Description</label>
            <textarea className="form-input" rows={5} value={profile.description || ''} onChange={e => setProfile({...profile, description: e.target.value})} placeholder="Tell students about your company, mission, and culture..." />
          </div>

          <div className="flex justify-end mt-4">
            <button type="submit" className="btn btn-primary" disabled={saving} style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
              {saving ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
