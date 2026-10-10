import React from 'react';
import { useStudent } from '../../context/StudentContext';
import { 
  Code2, 
  Layout, 
  Server, 
  BarChart3, 
  BrainCircuit, 
  Cloud, 
  Check 
} from 'lucide-react';

export default function CareerRoleSelector() {
  const { careerRoles, activeRole, selectRole } = useStudent();

  const getRoleIcon = (roleId) => {
    switch (roleId) {
      case 'full_stack_dev':
        return Code2;
      case 'frontend_dev':
        return Layout;
      case 'backend_dev':
        return Server;
      case 'data_analyst':
        return BarChart3;
      case 'ml_engineer':
        return BrainCircuit;
      case 'devops_cloud_engineer':
        return Cloud;
      default:
        return Code2;
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-bold text-sm text-slate-900">Target Career Role Pathway</h3>
        <p className="text-xs text-slate-500">Select an industry career path to audit required technical competencies</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {careerRoles.map((role) => {
          const Icon = getRoleIcon(role.id);
          const isSelected = activeRole?.id === role.id;

          return (
            <button
              key={role.id}
              onClick={() => selectRole(role.id)}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all relative ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20 ring-2 ring-indigo-600/30'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20'
              }`}
            >
              {isSelected && (
                <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-white text-indigo-600 flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              )}

              <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${
                isSelected ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
              }`}>
                <Icon className="w-4 h-4" />
              </div>

              <div>
                <p className="font-bold text-xs leading-tight">{role.title}</p>
                <p className={`text-[10px] mt-1 ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {role.category}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
