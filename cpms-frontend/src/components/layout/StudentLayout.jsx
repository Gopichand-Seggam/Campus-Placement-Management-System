import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../common/ThemeToggle';
import { GraduationCap, LayoutDashboard, Briefcase, FileText, Calendar, User, LogOut, Zap, Users, BookOpen, Star } from 'lucide-react';

const navItems = [
  { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/student/jobs', icon: Briefcase, label: 'Job Listings' },
  { to: '/student/applications', icon: FileText, label: 'My Applications' },
  { to: '/student/interviews', icon: Calendar, label: 'Interviews' },
  { to: '/student/skill-gap', icon: Zap, label: 'Skill Gap', badge: 'AI' },
  { to: '/student/mock-interview', icon: BookOpen, label: 'Mock Interview', badge: 'AI' },
  { to: '/student/experiences', icon: Users, label: 'Experiences' },
  { to: '/student/reviews', icon: Star, label: 'Company Reviews' },
  { to: '/student/resume-builder', icon: FileText, label: 'Resume Builder', badge: 'AI' },
  { to: '/student/profile', icon: User, label: 'Profile' },
];

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="dashboard-layout">
      <aside style={styles.sidebar}>
        <div style={{ ...styles.logo, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={styles.logoIcon}><GraduationCap size={22} color="white" /></div>
            <div>
              <div style={styles.logoText}>CPMS</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Student Portal</div>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <div style={styles.userCard}>
          <div style={styles.avatar}>{user?.name?.[0]?.toUpperCase() || 'S'}</div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
          </div>
        </div>

        <nav style={styles.nav}>
          {navItems.map(({ to, icon: Icon, label, badge }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({ ...styles.navLink, ...(isActive ? styles.navLinkActive : {}) })}>
              <Icon size={18} />
              <span style={{ flex: 1 }}>{label}</span>
              {badge && <span style={styles.aiBadge}>{badge}</span>}
            </NavLink>
          ))}
        </nav>



        <button onClick={handleLogout} style={styles.logoutBtn}>
          <LogOut size={16} /> Logout
        </button>
      </aside>

      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
}

const styles = {
  sidebar: { position: 'fixed', top: 0, left: 0, width: 'var(--sidebar-width)', height: '100vh', background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', zIndex: 100, padding: '20px 12px', overflowY: 'auto' },
  logo: { display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px', marginBottom: 24 },
  logoIcon: { width: 40, height: 40, borderRadius: 10, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-glow-blue)' },
  logoText: { fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem' },
  userCard: { display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '10px 12px', marginBottom: 20 },
  avatar: { width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.95rem' },
  nav: { display: 'flex', flexDirection: 'column', gap: 4, flex: 1 },
  navLink: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-secondary)', transition: 'all 0.2s', textDecoration: 'none' },
  navLinkActive: { background: 'rgba(59, 130, 246,0.15)', color: 'var(--accent-blue-light)', borderLeft: '3px solid var(--accent-blue)' },
  aiBadge: { marginLeft: 'auto', fontSize: '0.62rem', fontWeight: 700, background: 'var(--gradient-primary)', color: 'white', padding: '2px 7px', borderRadius: 20 },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, color: '#f87171', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 500, width: '100%', marginTop: 12, transition: 'all 0.2s' },
};
