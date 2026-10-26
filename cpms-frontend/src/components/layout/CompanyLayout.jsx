import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../common/ThemeToggle';
import { Building2, LayoutDashboard, PlusCircle, Users, User, Briefcase, LogOut } from 'lucide-react';

const navItems = [
  { to: '/company/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/company/my-jobs', icon: Briefcase, label: 'My Job Postings' },
  { to: '/company/post-job', icon: PlusCircle, label: 'Post a Job' },
  { to: '/company/applicants', icon: Users, label: 'Applicants' },
  { to: '/company/profile', icon: User, label: 'Company Profile' },
];

export default function CompanyLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  return (
    <div className="dashboard-layout">
      <aside style={styles.sidebar}>
        <div style={{ ...styles.logo, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ ...styles.logoIcon, background: 'linear-gradient(135deg,#06b6d4,#3b82f6)' }}><Building2 size={22} color="white" /></div>
            <div><div style={styles.logoText}>CPMS</div><div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Company Portal</div></div>
          </div>
          <ThemeToggle />
        </div>
        <div style={styles.userCard}>
          <div style={{ ...styles.avatar, background: 'linear-gradient(135deg,#06b6d4,#3b82f6)' }}>{user?.name?.[0]?.toUpperCase() || 'C'}</div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
          </div>
        </div>
        <nav style={styles.nav}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({ ...styles.navLink, ...(isActive ? styles.navLinkActive : {}) })}>
              <Icon size={18} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button onClick={() => { logout(); navigate('/'); }} style={styles.logoutBtn}><LogOut size={16} /> Logout</button>
      </aside>
      <div className="dashboard-content"><Outlet /></div>
    </div>
  );
}

const styles = {
  sidebar: { position: 'fixed', top: 0, left: 0, width: 'var(--sidebar-width)', height: '100vh', background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', zIndex: 100, padding: '20px 12px', overflowY: 'auto' },
  logo: { display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px', marginBottom: 24 },
  logoIcon: { width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(6,182,212,0.3)' },
  logoText: { fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem' },
  userCard: { display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '10px 12px', marginBottom: 20 },
  avatar: { width: 36, height: 36, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.95rem', color: 'white' },
  nav: { display: 'flex', flexDirection: 'column', gap: 4, flex: 1 },
  navLink: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-secondary)', transition: 'all 0.2s', textDecoration: 'none' },
  navLinkActive: { background: 'rgba(6,182,212,0.15)', color: '#22d3ee', borderLeft: '3px solid #06b6d4' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, color: '#f87171', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 500, width: '100%', marginTop: 12, transition: 'all 0.2s' }
};
