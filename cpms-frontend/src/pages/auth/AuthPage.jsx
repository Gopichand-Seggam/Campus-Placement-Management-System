import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap, Mail, Lock, User, Building2, Eye, EyeOff,
  Phone, Link, Github, Linkedin, MapPin, Globe, BookOpen,
  Award, ChevronRight, ChevronLeft, Briefcase,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   InputRow and TextAreaRow defined at module
   level so they are never re-mounted on re-render
───────────────────────────────────────────── */
const InputRow = ({ icon: Icon, label, type = 'text', placeholder, value, onChange, required, min, max, step: stepVal }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    <div style={styles.inputWrap}>
      <Icon size={16} style={styles.inputIcon} />
      <input
        type={type}
        className="form-input"
        style={{ paddingLeft: 40 }}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        min={min}
        max={max}
        step={stepVal}
      />
    </div>
  </div>
);

const TextAreaRow = ({ icon: Icon, label, placeholder, value, onChange }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    <div style={styles.inputWrap}>
      <Icon size={16} style={{ ...styles.inputIcon, top: 14 }} />
      <textarea
        className="form-input"
        style={{ paddingLeft: 40, resize: 'vertical', minHeight: 80 }}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={3}
      />
    </div>
  </div>
);

/* ── Step 2 – Student fields (module-level, receives props) ── */
const StudentFields = ({ form, set }) => (
  <>
    <div style={styles.stepLabel}>📚 Academic Details</div>
    <InputRow icon={BookOpen} label="College / University" placeholder="MIT, IIT Delhi…" value={form.college} onChange={v => set('college', v)} />
    <InputRow icon={BookOpen} label="Branch / Major" placeholder="Computer Science, ECE…" value={form.branch} onChange={v => set('branch', v)} />

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <div className="form-group">
        <label className="form-label">CGPA</label>
        <div style={styles.inputWrap}>
          <Award size={16} style={styles.inputIcon} />
          <input type="number" className="form-input" style={{ paddingLeft: 40 }} placeholder="8.5"
            value={form.cgpa} onChange={e => set('cgpa', e.target.value)}
            min="0" max="10" step="0.01" />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Graduation Year</label>
        <div style={styles.inputWrap}>
          <GraduationCap size={16} style={styles.inputIcon} />
          <input type="number" className="form-input" style={{ paddingLeft: 40 }} placeholder="2025"
            value={form.graduationYear} onChange={e => set('graduationYear', e.target.value)}
            min="2020" max="2035" />
        </div>
      </div>
    </div>

    <div className="form-group">
      <label className="form-label">Skills <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.8rem' }}>(comma-separated)</span></label>
      <div style={styles.inputWrap}>
        <Award size={16} style={styles.inputIcon} />
        <input className="form-input" style={{ paddingLeft: 40 }} placeholder="React, Java, SQL, Python…"
          value={form.skills} onChange={e => set('skills', e.target.value)} />
      </div>
    </div>

    <div style={styles.stepLabel}>🔗 Contact &amp; Links</div>
    <InputRow icon={Phone} label="Phone Number" type="tel" placeholder="+91 9876543210" value={form.phone} onChange={v => set('phone', v)} />
    <InputRow icon={Linkedin} label="LinkedIn URL" placeholder="linkedin.com/in/you" value={form.linkedinUrl} onChange={v => set('linkedinUrl', v)} />
    <InputRow icon={Github} label="GitHub URL" placeholder="github.com/you" value={form.githubUrl} onChange={v => set('githubUrl', v)} />
  </>
);

/* ── Step 2 – Company / Recruiter fields (module-level, receives props) ── */
const CompanyFields = ({ form, set }) => (
  <>
    <div style={styles.stepLabel}>🏢 Company Details</div>
    <InputRow icon={Building2} label="Company Name" placeholder="Acme Corp" value={form.companyName} onChange={v => set('companyName', v)} required />
    <InputRow icon={Briefcase} label="Industry" placeholder="Technology, Finance, Healthcare…" value={form.industry} onChange={v => set('industry', v)} />
    <InputRow icon={Globe} label="Company Website" type="url" placeholder="https://acme.com" value={form.website} onChange={v => set('website', v)} />
    <InputRow icon={MapPin} label="Location" placeholder="Bangalore, Mumbai, Remote…" value={form.location} onChange={v => set('location', v)} />
    <InputRow icon={Phone} label="Phone Number" type="tel" placeholder="+91 9876543210" value={form.phone} onChange={v => set('phone', v)} />
    <TextAreaRow icon={Link} label="About Company" placeholder="Brief description of your company, culture, and what you do…" value={form.description} onChange={v => set('description', v)} />
  </>
);

/* ─────────────────────────────────────────────
   Main AuthPage component
───────────────────────────────────────────── */
export default function AuthPage({ mode }) {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState(searchParams.get('role') || 'STUDENT');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    // Step 1 – common
    name: '', email: '', password: '',
    // Step 2 – student
    college: '', branch: '', cgpa: '', skills: '', graduationYear: '',
    phone: '', linkedinUrl: '', githubUrl: '',
    // Step 2 – company
    companyName: '', industry: '', website: '', location: '', description: '',
  });

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleStep1Next = (e) => {
    e.preventDefault();
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      let user;
      if (isLogin) {
        user = await login(form.email, form.password);
      } else {
        const payload = {
          name: form.name,
          email: form.email,
          password: form.password,
          role,
          college: form.college || undefined,
          branch: form.branch || undefined,
          cgpa: form.cgpa ? parseFloat(form.cgpa) : undefined,
          skills: form.skills || undefined,
          graduationYear: form.graduationYear ? parseInt(form.graduationYear) : undefined,
          phone: form.phone || undefined,
          linkedinUrl: form.linkedinUrl || undefined,
          githubUrl: form.githubUrl || undefined,
          companyName: form.companyName || undefined,
          industry: form.industry || undefined,
          website: form.website || undefined,
          location: form.location || undefined,
          description: form.description || undefined,
        };
        user = await register(payload);
      }
      if (user.role === 'STUDENT') navigate('/student/dashboard');
      else if (user.role === 'COMPANY') navigate('/company/dashboard');
      else navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => { setIsLogin(!isLogin); setStep(1); setError(''); };

  return (
    <div style={styles.page}>
      <div style={styles.aurora1} />
      <div style={styles.aurora2} />

      <div style={{ ...styles.card, maxWidth: !isLogin && step === 2 ? 560 : 440 }}>
        {/* Logo */}
        <div style={styles.logoArea}>
          <div style={styles.logoIcon}><GraduationCap size={24} color="white" /></div>
          <span style={styles.logoText}>CPMS</span>
        </div>

        <h1 style={styles.title}>{isLogin ? 'Welcome back' : step === 1 ? 'Create account' : `${role === 'STUDENT' ? 'Your Profile' : 'Company Info'}`}</h1>
        <p style={styles.subtitle}>{isLogin ? 'Sign in to your portal' : step === 1 ? 'Join the placement platform' : 'Fill in the details below — you can update later'}</p>

        {/* Progress dots (register only) */}
        {!isLogin && (
          <div style={styles.progress}>
            <div style={{ ...styles.dot, background: 'var(--accent-blue)' }} />
            <div style={{ ...styles.progressLine, background: step === 2 ? 'var(--accent-blue)' : 'var(--border)' }} />
            <div style={{ ...styles.dot, background: step === 2 ? 'var(--accent-blue)' : 'var(--border)' }} />
          </div>
        )}

        {error && <div className="alert alert-error" style={{ marginTop: 12 }}>{error}</div>}

        {/* ── LOGIN FORM ── */}
        {isLogin && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={styles.inputWrap}>
                <Mail size={16} style={styles.inputIcon} />
                <input type="email" className="form-input" style={{ paddingLeft: 40 }}
                  placeholder="you@example.com" value={form.email}
                  onChange={e => set('email', e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={styles.inputWrap}>
                <Lock size={16} style={styles.inputIcon} />
                <input type={showPassword ? 'text' : 'password'} className="form-input"
                  style={{ paddingLeft: 40, paddingRight: 40 }} placeholder="••••••••"
                  value={form.password} onChange={e => set('password', e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Sign In'}
            </button>
          </form>
        )}

        {/* ── REGISTER STEP 1 ── */}
        {!isLogin && step === 1 && (
          <form onSubmit={handleStep1Next} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
            {/* Role selector */}
            <div>
              <label className="form-label" style={{ marginBottom: 8, display: 'block' }}>I am a</label>
              <div style={styles.roleSelector}>
                {[
                  { value: 'STUDENT', icon: User, label: 'Student' },
                  { value: 'COMPANY', icon: Building2, label: 'Recruiter' }
                ].map(({ value, icon: Icon, label }) => (
                  <button key={value} type="button" onClick={() => setRole(value)}
                    style={{ ...styles.roleBtn, ...(role === value ? styles.roleBtnActive : {}) }}>
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={styles.inputWrap}>
                <User size={16} style={styles.inputIcon} />
                <input className="form-input" style={{ paddingLeft: 40 }} placeholder="John Doe"
                  value={form.name} onChange={e => set('name', e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={styles.inputWrap}>
                <Mail size={16} style={styles.inputIcon} />
                <input type="email" className="form-input" style={{ paddingLeft: 40 }}
                  placeholder="you@example.com" value={form.email}
                  onChange={e => set('email', e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={styles.inputWrap}>
                <Lock size={16} style={styles.inputIcon} />
                <input type={showPassword ? 'text' : 'password'} className="form-input"
                  style={{ paddingLeft: 40, paddingRight: 40 }} placeholder="••••••••"
                  value={form.password} onChange={e => set('password', e.target.value)}
                  minLength={6} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              Next <ChevronRight size={18} />
            </button>
          </form>
        )}

        {/* ── REGISTER STEP 2 ── */}
        {!isLogin && step === 2 && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
            {role === 'STUDENT'
              ? <StudentFields form={form} set={set} />
              : <CompanyFields form={form} set={set} />
            }

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="button" onClick={() => setStep(1)}
                className="btn btn-lg"
                style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 4, background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 18px', cursor: 'pointer', fontWeight: 600 }}>
                <ChevronLeft size={18} /> Back
              </button>
              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Create Account'}
              </button>
            </div>
          </form>
        )}

        <div className="divider" />

        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button type="button" onClick={switchMode}
            style={{ background: 'none', border: 'none', color: 'var(--accent-blue-light)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>

        <button type="button" onClick={() => navigate('/')}
          style={{ display: 'block', margin: '12px auto 0', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.82rem' }}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: 24 },
  aurora1: { position: 'fixed', top: '-20%', left: '-10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(59, 130, 246,0.2) 0%, transparent 70%)', pointerEvents: 'none' },
  aurora2: { position: 'fixed', bottom: '-20%', right: '-10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', pointerEvents: 'none' },
  card: { position: 'relative', zIndex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: 24, padding: '40px 40px', width: '100%', boxShadow: '0 0 60px rgba(59, 130, 246,0.12)', animation: 'slideUp 0.4s ease', transition: 'max-width 0.3s ease' },
  logoArea: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 },
  logoIcon: { width: 40, height: 40, borderRadius: 10, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoText: { fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.3rem' },
  title: { fontFamily: 'var(--font-heading)', fontSize: '1.6rem', marginBottom: 4 },
  subtitle: { color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 4 },
  progress: { display: 'flex', alignItems: 'center', gap: 0, margin: '16px 0 0' },
  dot: { width: 10, height: 10, borderRadius: '50%', transition: 'background 0.3s' },
  progressLine: { flex: 1, height: 2, transition: 'background 0.3s', margin: '0 6px' },
  roleSelector: { display: 'flex', gap: 8 },
  roleBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 16px', border: '1.5px solid var(--border)', borderRadius: 10, background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600, transition: 'all 0.2s' },
  roleBtnActive: { border: '1.5px solid var(--accent-blue)', background: 'rgba(59, 130, 246,0.12)', color: 'var(--accent-blue-light)' },
  inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: 13, color: 'var(--text-muted)', pointerEvents: 'none' },
  eyeBtn: { position: 'absolute', right: 12, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  stepLabel: { fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4, marginBottom: 2 },
};
