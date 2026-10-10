import React from 'react';
import { StudentProvider, useStudent } from './context/StudentContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AuthModal from './components/AuthModal';
import ProfileEditorModal from './components/ProfileEditorModal';
import DashboardView from './components/Dashboard/DashboardView';
import AcademicAuditView from './components/AcademicAudit/AcademicAuditView';
import SkillGapView from './components/SkillGap/SkillGapView';
import RecommendationsView from './components/Recommendations/RecommendationsView';
import StudentListView from './components/StudentManagement/StudentListView';
import StudentReportView from './components/Reports/StudentReportView';
import { BookOpen, Bookmark, PencilLine, Ruler } from 'lucide-react';

function AppContent() {
  const { activeTab, error, isSignedIn } = useStudent();

  if (!isSignedIn) return <AuthModal />;

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'academic':
        return <AcademicAuditView />;
      case 'skillgap':
        return <SkillGapView />;
      case 'recommendations':
        return <RecommendationsView />;
      case 'students':
        return <StudentListView />;
      case 'report':
        return <StudentReportView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="app-root min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors">
      <div className="ambient-stationery no-print" aria-hidden="true">
        <BookOpen className="stationery-book" />
        <PencilLine className="stationery-pencil" />
        <Bookmark className="stationery-bookmark" />
        <Ruler className="stationery-ruler" />
      </div>
      <Navbar />

      <div className="app-shell flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <div className="no-print">
          <Sidebar />
        </div>

        <main className="app-main flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {error && (
            <div className="no-print mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between shadow-sm">
              <span>{error}</span>
            </div>
          )}
          <div key={activeTab} className="section-enter">
            {renderActiveTab()}
          </div>
        </main>
      </div>

      {/* Global Modals for Auth & Persistent Profile Memory */}
      <ProfileEditorModal />
    </div>
  );
}

export default function App() {
  return (
    <StudentProvider>
      <AppContent />
    </StudentProvider>
  );
}
