import React, { useState } from 'react';
import { CheckCircle2, XCircle, Layers, PlusCircle } from 'lucide-react';
import { useStudent } from '../../context/StudentContext';

export default function MissingSkillsMatrix({ skillGap }) {
  const { addSkillToProfile } = useStudent();
  const [addingSkill, setAddingSkill] = useState(null);

  if (!skillGap) return null;

  const categories = Object.entries(skillGap.categories_breakdown || {}).filter(
    ([_, data]) => data.total > 0
  );

  const handleAddSkillClick = async (skillName) => {
    setAddingSkill(skillName);
    try {
      await addSkillToProfile(skillName);
    } catch (e) {
      console.error(e);
    } finally {
      setAddingSkill(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Category breakdown cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(([categoryName, data]) => {
          const categoryMatch = data.total > 0 ? Math.round((data.acquired / data.total) * 100) : 0;
          return (
            <div key={categoryName} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <h4 className="font-bold text-sm text-slate-900">{categoryName}</h4>
                </div>
                <span className="text-xs font-bold text-slate-700">
                  {data.acquired} / {data.total} ({categoryMatch}%)
                </span>
              </div>

              {/* Category Mini Progress Bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    categoryMatch >= 75 ? 'bg-emerald-500' : categoryMatch >= 40 ? 'bg-indigo-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${categoryMatch}%` }}
                ></div>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {data.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg border ${
                      skill.status === 'Acquired'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
                        : 'bg-rose-50 text-rose-800 border-rose-200/80'
                    }`}
                  >
                    {skill.status === 'Acquired' ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-3 h-3 text-rose-500 shrink-0" />
                    )}
                    <span>{skill.name}</span>
                    {skill.is_core && (
                      <span className="text-[9px] font-bold uppercase opacity-60 ml-0.5">• Core</span>
                    )}
                    {skill.status !== 'Acquired' && (
                      <button
                        onClick={() => handleAddSkillClick(skill.name)}
                        disabled={addingSkill === skill.name}
                        className="ml-1 text-indigo-600 hover:text-indigo-800 hover:underline font-semibold"
                        title={`Add ${skill.name} to persistent profile`}
                      >
                        {addingSkill === skill.name ? '...' : '+Add'}
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Core vs Missing Skills Detailed Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Missing Core Skills (Action Required) */}
        <div className="bg-rose-50/50 rounded-2xl border border-rose-200/80 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-600" />
              <div>
                <h4 className="font-bold text-sm text-rose-950">Missing Core Skills (Action Required)</h4>
                <p className="text-xs text-rose-700/80">Click "+ Add to Profile" once learned to update persistent memory</p>
              </div>
            </div>
            <span className="text-xs font-bold bg-rose-200 text-rose-900 px-2.5 py-0.5 rounded-full">
              {skillGap.missing_core_count} Missing
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {skillGap.missing_core_skills.length > 0 ? (
              skillGap.missing_core_skills.map((skill, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-rose-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                    <span className="text-xs font-bold text-slate-800">{skill.name}</span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {skill.category}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddSkillClick(skill.name)}
                    disabled={addingSkill === skill.name}
                    className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200 transition-colors flex items-center gap-1"
                  >
                    <PlusCircle className="w-3 h-3 text-indigo-600" />
                    <span>{addingSkill === skill.name ? 'Adding...' : 'Add to Profile'}</span>
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-emerald-700 font-semibold p-3 bg-white rounded-xl border border-emerald-200">
                All core industry skills verified and acquired!
              </p>
            )}
          </div>
        </div>

        {/* Verified Acquired Skills */}
        <div className="bg-emerald-50/50 rounded-2xl border border-emerald-200/80 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <h4 className="font-bold text-sm text-emerald-950">Verified Acquired Skills</h4>
                <p className="text-xs text-emerald-700/80">Proficiencies saved in student persistent memory</p>
              </div>
            </div>
            <span className="text-xs font-bold bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full">
              {skillGap.acquired_core_count} Verified
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {skillGap.acquired_core_skills.map((skill, idx) => (
              <div key={idx} className="bg-white p-3 rounded-xl border border-emerald-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-bold text-slate-800">{skill.name}</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {skill.category}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
