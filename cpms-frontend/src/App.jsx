import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import FloatingChatbot from './components/FloatingChatbot';

// Auth / Public
import AuthPage from './pages/auth/AuthPage';
import LandingPage from './pages/LandingPage';
import PublicPortfolio from './pages/PublicPortfolio';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import JobListings from './pages/student/JobListings';
import MyApplications from './pages/student/MyApplications';
import MyInterviews from './pages/student/MyInterviews';
import StudentProfile from './pages/student/StudentProfile';
import SkillGapAnalysis from './pages/student/SkillGapAnalysis';
import MockInterview from './pages/student/MockInterview';
import InterviewExperiences from './pages/student/InterviewExperiences';
import CompanyReviews from './pages/student/CompanyReviews';
import ResumeBuilder from './pages/student/ResumeBuilder';

// Company pages
import CompanyDashboard from './pages/company/CompanyDashboard';
import PostJob from './pages/company/PostJob';
import ManageApplicants from './pages/company/ManageApplicants';
import CompanyProfile from './pages/company/CompanyProfile';
import MyJobs from './pages/company/MyJobs';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminCompanies from './pages/admin/AdminCompanies';
import AdminJobs from './pages/admin/AdminJobs';
import AdminReports from './pages/admin/AdminReports';
import StudentRanking from './pages/admin/StudentRanking';

// Layouts
import StudentLayout from './components/layout/StudentLayout';
import CompanyLayout from './components/layout/CompanyLayout';
import AdminLayout from './components/layout/AdminLayout';

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div className="spinner" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={getDashboard(user.role)} replace />;
  return children;
}

function getDashboard(role) {
  if (role === 'STUDENT') return '/student/dashboard';
  if (role === 'COMPANY') return '/company/dashboard';
  if (role === 'ADMIN') return '/admin/dashboard';
  return '/';
}

export default function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={user ? <Navigate to={getDashboard(user.role)} replace /> : <LandingPage />} />
        <Route path="/login" element={user ? <Navigate to={getDashboard(user.role)} replace /> : <AuthPage mode="login" />} />
        <Route path="/register" element={user ? <Navigate to={getDashboard(user.role)} replace /> : <AuthPage mode="register" />} />
        <Route path="/portfolio/:userId" element={<PublicPortfolio />} />

        {/* Student routes */}
        <Route path="/student" element={<ProtectedRoute role="STUDENT"><StudentLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="jobs" element={<JobListings />} />
          <Route path="applications" element={<MyApplications />} />
          <Route path="interviews" element={<MyInterviews />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="skill-gap" element={<SkillGapAnalysis />} />
          <Route path="mock-interview" element={<MockInterview />} />
          <Route path="experiences" element={<InterviewExperiences />} />
          <Route path="reviews" element={<CompanyReviews />} />
          <Route path="resume-builder" element={<ResumeBuilder />} />
        </Route>

        {/* Company routes */}
        <Route path="/company" element={<ProtectedRoute role="COMPANY"><CompanyLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<CompanyDashboard />} />
          <Route path="my-jobs" element={<MyJobs />} />
          <Route path="post-job" element={<PostJob />} />
          <Route path="applicants" element={<ManageApplicants />} />
          <Route path="profile" element={<CompanyProfile />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="companies" element={<AdminCompanies />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="ranking" element={<StudentRanking />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Floating Chatbot — always visible when logged in */}
      <FloatingChatbot />
    </BrowserRouter>
  );
}
