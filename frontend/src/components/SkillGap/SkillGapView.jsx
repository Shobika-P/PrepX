import React from 'react';
import { useStudent } from '../../context/StudentContext';
import CareerRoleSelector from './CareerRoleSelector';
import SkillReadinessGauge from './SkillReadinessGauge';
import MissingSkillsMatrix from './MissingSkillsMatrix';
import { 
  Compass, 
  BookOpen, 
  ExternalLink, 
  FolderGit2, 
  Lightbulb,
  Sparkles
} from 'lucide-react';

export default function SkillGapView() {
  const { skillGap, activeRole, loading } = useStudent();

  if (loading && !skillGap) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-slate-500">Calculating career skill gaps...</p>
        </div>
      </div>
    );
  }

  if (!skillGap) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <p className="text-slate-500">No skill gap data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Personalized Skill-Gap Analysis
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
            Role Competency Matrix
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Compare student skills against industry job descriptions, detect technical deficits, and generate tailored roadmaps.
        </p>
      </div>

      {/* Role Selector */}
      <CareerRoleSelector />

      {/* Main Readiness Gauge & Role Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Readiness Gauge */}
        <SkillReadinessGauge skillGap={skillGap} />

        {/* Role Profile & Core Competencies */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-lg text-slate-900">{skillGap.role_title}</h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {skillGap.role_category}
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {skillGap.role_description}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-bold text-slate-800 mb-2">Core Industry Requirements:</p>
              <div className="flex flex-wrap gap-1.5">
                {(activeRole?.core_skills || []).map((skill, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="font-bold text-slate-800 mb-2">Advanced Specializations:</p>
              <div className="flex flex-wrap gap-1.5">
                {(activeRole?.advanced_skills || []).map((skill, idx) => (
                  <span key={idx} className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-md font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Student's additional skills not in this role */}
          {skillGap.extra_student_skills && skillGap.extra_student_skills.length > 0 && (
            <div className="pt-3 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-500 block mb-1.5">
                Additional Student Proficiencies (Cross-Disciplinary Assets):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {skillGap.extra_student_skills.map((skill, idx) => (
                  <span key={idx} className="bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded-md text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Missing Skills & Category Matrix */}
      <MissingSkillsMatrix skillGap={skillGap} />

      {/* Curated Resources and Capstone Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Curated Learning Resources */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="font-bold text-sm text-slate-900">Curated Learning Resources</h3>
              <p className="text-xs text-slate-500">Official documentation and university coursework</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {(skillGap.learning_resources || []).map((res, idx) => (
              <a
                key={idx}
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 flex items-center justify-between transition-all group"
              >
                <div>
                  <p className="font-semibold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {res.title}
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium">{res.type}</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0" />
              </a>
            ))}
          </div>
        </div>

        {/* Portfolio & Capstone Projects */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-purple-600" />
            <div>
              <h3 className="font-bold text-sm text-slate-900">Recommended Capstone Projects</h3>
              <p className="text-xs text-slate-500">Projects designed to bridge your missing skills</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {(skillGap.project_ideas || []).map((idea, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-slate-800 leading-relaxed">
                  {idea}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
