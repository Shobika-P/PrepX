import React from 'react';
import { useStudent } from '../../context/StudentContext';
import StatCard from './StatCard';
import AcademicOverviewCard from './AcademicOverviewCard';
import SkillGapOverviewCard from './SkillGapOverviewCard';
import AttendanceWidget from './AttendanceWidget';
import TopRecommendationsCard from './TopRecommendationsCard';
import { 
  GraduationCap, 
  Compass, 
  Sparkles,
  BookOpen,
  UserRoundCheck,
  ListChecks
} from 'lucide-react';

export default function DashboardView() {
  const { 
    activeStudent, 
    academicAudit, 
    skillGap, 
    recommendations, 
    activeRole, 
    setActiveTab,
    loading 
  } = useStudent();

  if (loading && !academicAudit) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-slate-500">Auditing academic records and computing skill gaps...</p>
        </div>
      </div>
    );
  }

  const avgMarks = academicAudit?.average_marks;
  const gpa = academicAudit?.weighted_gpa;
  const attendance = academicAudit?.attendance_analysis?.percentage;
  const readiness = skillGap?.overall_readiness_score;
  const targetRoleTitle = skillGap?.role_title || activeRole?.title || 'your selected role';
  const profileSections = [
    Boolean(activeStudent?.name), Boolean(activeStudent?.email), Boolean(activeStudent?.department),
    Boolean(activeStudent?.semester), activeStudent?.cgpa != null, Boolean(activeStudent?.target_role),
    Boolean(activeStudent?.technical_skills?.length), Boolean(activeStudent?.subjects?.length)
  ];
  const completedProfileSections = profileSections.filter(Boolean).length;
  const profileCompletion = Math.round((completedProfileSections / profileSections.length) * 100);
  const roadmap = recommendations?.thirty_day_plan || [];
  const completedRoadmap = new Set(activeStudent?.roadmap_progress || []);
  const completedRoadmapCount = roadmap.filter((step) => completedRoadmap.has(`${step.day}:${step.focus}`)).length;
  const learningProgress = roadmap.length ? Math.round((completedRoadmapCount / roadmap.length) * 100) : null;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Welcome Hero Banner */}
      <div className="dashboard-hero rounded-2xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        {/* Subtle Decorative Backdrop Elements */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute right-1/4 bottom-0 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md border border-white/10 text-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>YOUR ACADEMIC OVERVIEW</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome, {activeStudent?.name || 'Student'}!
            </h1>

            <p className="text-sm text-indigo-200/90 leading-relaxed">
              Enrolled in <span className="font-semibold text-white">{activeStudent?.department || 'department not provided'}</span> (Semester {activeStudent?.semester || 'not provided'}).
              Targeting career pathway as <span className="font-semibold text-indigo-300 underline decoration-indigo-400 decoration-2 underline-offset-2">{targetRoleTitle}</span>.
            </p>
          </div>

          {/* Quick Actions in Banner */}
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('academic')}
              className="px-4 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-xs sm:text-sm hover:bg-indigo-50 shadow-md transition-all flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" /> Academic Audit
            </button>
            <button
              onClick={() => setActiveTab('skillgap')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 border border-indigo-400/40 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition-all flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4" /> Skill Gap Matrix
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        <StatCard
          title="Overall Average"
          value={avgMarks == null ? 'No records' : `${avgMarks}%`}
          badge={academicAudit?.performance_category || 'Awaiting data'}
          color={
            avgMarks == null ? 'blue' : avgMarks >= 85 ? 'emerald' : avgMarks >= 70 ? 'indigo' : avgMarks >= 55 ? 'amber' : 'rose'
          }
          icon={GraduationCap}
          subtitle={gpa == null ? 'Add subject marks to calculate GPA' : `Weighted GPA: ${gpa} / 10.0`}
        />

        <StatCard
          title="Career Match"
          value={readiness == null ? 'Not assessed' : `${readiness}%`}
          badge={skillGap?.readiness_badge || 'Awaiting data'}
          color={readiness == null ? 'blue' : readiness >= 75 ? 'emerald' : readiness >= 50 ? 'indigo' : 'amber'}
          icon={Compass}
          subtitle={`For ${targetRoleTitle}`}
        />

        <StatCard
          title="Profile completion"
          value={`${profileCompletion}%`}
          badge={`${completedProfileSections}/${profileSections.length} details`}
          color="blue"
          icon={UserRoundCheck}
          subtitle="Add profile data for more useful analysis"
          progress={profileCompletion}
        />

        <StatCard
          title="Learning progress"
          value={learningProgress == null ? 'No plan' : `${learningProgress}%`}
          badge={roadmap.length ? `${completedRoadmapCount}/${roadmap.length} complete` : 'Awaiting analysis'}
          color="emerald"
          icon={ListChecks}
          subtitle={roadmap.length ? 'Roadmap tasks saved to your profile' : 'A plan appears when career data loads'}
          progress={learningProgress}
        />
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Academic Breakdown & Attendance Widget */}
        <div className="space-y-6">
          <AcademicOverviewCard />
          <AttendanceWidget />
        </div>

        {/* Right Column: Skill-Gap Matrix & Recommendations */}
        <div className="space-y-6">
          <SkillGapOverviewCard />
          <TopRecommendationsCard />
        </div>
      </div>

    </div>
  );
}
