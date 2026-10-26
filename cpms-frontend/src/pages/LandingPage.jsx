import { useNavigate } from 'react-router-dom';
import { GraduationCap, Briefcase, Calendar, MessageSquare, ArrowRight, CheckCircle, Zap, Shield } from 'lucide-react';
import heroBg from '../assets/hero-bg.png';

const features = [
  { icon: Briefcase, title: 'Smart Job Listings', desc: 'Browse and apply to hundreds of curated job opportunities from top companies.', color: '#3b82f6' },
  { icon: Calendar, title: 'Interview Scheduling', desc: 'Auto-schedule and track your interviews with real-time status updates.', color: '#801336' },
  { icon: MessageSquare, title: 'AI Career Assistant', desc: 'Get personalized interview tips, resume reviews, and career guidance from our AI chatbot.', color: '#06b6d4' },
  { icon: Shield, title: 'Application Tracking', desc: 'Monitor every application from submission to offer with a clear visual tracker.', color: '#10b981' },
];



export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      {/* Graphical background */}
      <div style={styles.bgImage} />
      <div style={styles.bgOverlay} />

      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.navBrand}>
          <div style={styles.navLogo}><GraduationCap size={20} color="white" /></div>
          <span style={styles.navTitle}>CPMS</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>Sign In</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroBadge}>
          <Zap size={12} color="#fbbf24" />
          <span>AI-Powered Campus Placement Platform</span>
        </div>

        <h1 style={styles.heroTitle}>
          Land Your Dream Job<br />
          <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>with CPMS</span>
        </h1>

        <p style={styles.heroDesc}>
          The most advanced campus placement management system. Connect with top companies,
          track applications, ace interviews with AI guidance, and streamline your entire placement journey.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
            Start Your Journey <ArrowRight size={18} />
          </button>
          <button className="btn btn-ghost btn-lg" onClick={() => navigate('/login')}>
            Sign In
          </button>
        </div>

        <div style={styles.checks}>
          {['Free to join', 'No hidden fees', 'AI-powered guidance'].map(c => (
            <div key={c} style={styles.checkItem}><CheckCircle size={14} color="#10b981" /><span>{c}</span></div>
          ))}
        </div>
      </section>



      {/* Features */}
      <section style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Everything you need to get placed</h2>
        <p style={styles.sectionDesc}>A complete ecosystem designed for modern campus recruitment</p>

        <div className="grid-2" style={{ maxWidth: 900, margin: '0 auto', gap: 20 }}>
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} style={styles.featureCard} className="card">
              <div style={{ ...styles.featureIcon, background: `${color}20`, border: `1px solid ${color}40` }}>
                <Icon size={22} color={color} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', marginBottom: 8 }}>{title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={styles.cta}>
        <div style={styles.ctaCard}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: 12 }}>Ready to get placed?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>Join thousands of students who landed their dream jobs through CPMS</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/register?role=STUDENT')}>I'm a Student</button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/register?role=COMPANY')}>I'm a Recruiter</button>
          </div>
        </div>
      </section>

      <footer style={styles.footer}>
        <p>© 2026 CPMS — Campus Placement Management System. Built with ❤️ for students.</p>
      </footer>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', overflowX: 'hidden', position: 'relative', backgroundColor: '#020617' },
  bgImage: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', opacity: 0.35, pointerEvents: 'none', zIndex: 0 },
  bgOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(2,6,23,0.3) 0%, rgba(2,6,23,0.9) 70%, #020617 100%)', pointerEvents: 'none', zIndex: 0 },
  nav: { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', height: 64, background: 'rgba(5,10,20,0.8)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)' },
  navBrand: { display: 'flex', alignItems: 'center', gap: 10 },
  navLogo: { width: 36, height: 36, borderRadius: 8, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem' },
  hero: { position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '160px 24px 80px', gap: 24 },
  heroBadge: { display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 20, padding: '4px 14px', fontSize: '0.8rem', color: '#fbbf24', fontWeight: 600 },
  heroTitle: { fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, lineHeight: 1.1 },
  heroDesc: { color: 'var(--text-secondary)', maxWidth: 560, fontSize: '1.05rem', lineHeight: 1.7 },
  checks: { display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' },
  checkItem: { display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--text-secondary)' },

  featuresSection: { position: 'relative', zIndex: 1, padding: '80px 24px', textAlign: 'center' },
  sectionTitle: { fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: 12 },
  sectionDesc: { color: 'var(--text-secondary)', marginBottom: 48 },
  featureCard: { textAlign: 'left', transition: 'all 0.25s' },
  featureIcon: { width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  cta: { position: 'relative', zIndex: 1, padding: '40px 24px 80px', display: 'flex', justifyContent: 'center' },
  ctaCard: { background: 'var(--bg-card)', border: '1px solid rgba(59, 130, 246,0.3)', borderRadius: 24, padding: '60px 40px', textAlign: 'center', maxWidth: 640, width: '100%', boxShadow: '0 0 60px rgba(59, 130, 246,0.15)' },
  footer: { position: 'relative', zIndex: 1, textAlign: 'center', padding: '24px', borderTop: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.85rem' },
};
