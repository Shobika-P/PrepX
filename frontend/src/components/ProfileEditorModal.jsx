import React, { useState, useEffect } from 'react';
import { AlertCircle, BookOpen, BriefcaseBusiness, CheckCircle2, Lightbulb, Trash2, X, Zap } from 'lucide-react';
import { useStudent } from '../context/StudentContext';

const POPULAR_SKILL_TAGS = [
  'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express.js',
  'Python', 'Django', 'FastAPI', 'Flask', 'SQL', 'MongoDB', 'PostgreSQL',
  'Docker', 'Kubernetes', 'AWS', 'Git', 'Pandas', 'NumPy', 'Scikit-Learn',
  'TensorFlow', 'PyTorch', 'REST APIs', 'GraphQL', 'Tailwind CSS', 'Figma'
];

export default function ProfileEditorModal() {
  const { profileModalOpen, setProfileModalOpen, activeStudent, updateProfile, careerRoles } = useStudent();
  const [activeTab, setActiveTab] = useState('academic'); // 'academic' | 'skills' | 'career'

  // Form State
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [attendance, setAttendance] = useState('');
  
  // Subjects State
  const [subjects, setSubjects] = useState([]);
  
  // Skills & Courses State
  const [technicalSkills, setTechnicalSkills] = useState([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [completedCourses, setCompletedCourses] = useState([]);
  const [newCourseInput, setNewCourseInput] = useState('');
  const [projects, setProjects] = useState('');
  const [certifications, setCertifications] = useState('');
  const [internships, setInternships] = useState('');

  // Career Goal State
  const [targetRole, setTargetRole] = useState('');
  const [salaryExpectation, setSalaryExpectation] = useState('');
  const [workPreference, setWorkPreference] = useState('');
  const [targetCompanies, setTargetCompanies] = useState('');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Pre-fill state when activeStudent changes
  useEffect(() => {
    if (activeStudent) {
      setName(activeStudent.name || '');
      setRollNumber(activeStudent.roll_number || '');
      setEmail(activeStudent.email || '');
      setDepartment(activeStudent.department || '');
      setSemester(activeStudent.semester || '');
      setAttendance(activeStudent.attendance_percentage ?? '');

      setSubjects(activeStudent.subjects ? [...activeStudent.subjects] : []);
      setTechnicalSkills(activeStudent.technical_skills ? [...activeStudent.technical_skills] : []);
      setCompletedCourses(activeStudent.completed_courses ? [...activeStudent.completed_courses] : []);
      setProjects((activeStudent.projects || []).join(', '));
      setCertifications((activeStudent.certifications || []).join(', '));
      setInternships((activeStudent.internships || []).join(', '));

      setTargetRole(activeStudent.target_role || '');

      const cg = activeStudent.career_goal || {};
      setSalaryExpectation(cg.salary_expectation || '');
      setWorkPreference(cg.work_preference || '');
      setTargetCompanies(
        Array.isArray(cg.target_companies)
          ? cg.target_companies.join(', ')
          : cg.target_companies || ''
      );
    }
  }, [activeStudent, profileModalOpen]);

  if (!profileModalOpen) return null;

  // Subject Handlers
  const handleSubjectChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index] = { ...updated[index], [field]: value };
    setSubjects(updated);
  };

  const handleAddSubject = () => {
    setSubjects([
      ...subjects,
      { code: `SUB${String(subjects.length + 1).padStart(2, '0')}`, name: '', marks: '', credits: 3 }
    ]);
  };

  const handleRemoveSubject = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  // Skill Handlers
  const handleAddSkill = (skillToAdd) => {
    const val = (skillToAdd || newSkillInput).trim();
    if (val && !technicalSkills.some(s => s.toLowerCase() === val.toLowerCase())) {
      setTechnicalSkills([...technicalSkills, val]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setTechnicalSkills(technicalSkills.filter(s => s !== skillToRemove));
  };

  // Course Handlers
  const handleAddCourse = () => {
    if (newCourseInput.trim() && !completedCourses.includes(newCourseInput.trim())) {
      setCompletedCourses([...completedCourses, newCourseInput.trim()]);
      setNewCourseInput('');
    }
  };

  const handleRemoveCourse = (courseToRemove) => {
    setCompletedCourses(completedCourses.filter(c => c !== courseToRemove));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      if (subjects.some((subject) => !subject.code?.trim() || !subject.name?.trim() || subject.marks === '' || subject.marks == null)) {
        throw new Error('Add the subject code, name, and marks, or remove the incomplete row.');
      }
      const companiesList = targetCompanies.split(',').map(c => c.trim()).filter(Boolean);

      await updateProfile({
        name,
        roll_number: rollNumber,
        email,
        department,
        semester: Number(semester),
        ...(attendance !== '' ? { attendance_percentage: Number(attendance) } : {}),
        subjects,
        technical_skills: technicalSkills,
        completed_courses: completedCourses,
        projects: projects.split(',').map((item) => item.trim()).filter(Boolean),
        certifications: certifications.split(',').map((item) => item.trim()).filter(Boolean),
        internships: internships.split(',').map((item) => item.trim()).filter(Boolean),
        target_role: targetRole,
        career_goal: {
          target_role: targetRole,
          salary_expectation: salaryExpectation,
          work_preference: workPreference,
          target_companies: companiesList
        }
      });

      setMessage({ type: 'success', text: 'Persistent memory updated! All AI analysis recalculated.' });
      setTimeout(() => {
        setProfileModalOpen(false);
      }, 800);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to save profile changes.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <span className="p-2.5 bg-indigo-600/20 text-indigo-300 rounded-xl"><BookOpen className="w-5 h-5" /></span>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Edit Student Profile & Career Memory</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Update academic details, skills, and goals. Changes instantly save and re-audit your performance.
              </p>
            </div>
          </div>
          <button
            onClick={() => setProfileModalOpen(false)}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-6 pt-2">
          <button
            onClick={() => setActiveTab('academic')}
            className={`inline-flex items-center gap-2 whitespace-nowrap px-4 py-3 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'academic'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Academic Details & Marks
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`inline-flex items-center gap-2 whitespace-nowrap px-4 py-3 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'skills'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> Tech Skills & Certifications
          </button>
          <button
            onClick={() => setActiveTab('career')}
            className={`inline-flex items-center gap-2 whitespace-nowrap px-4 py-3 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'career'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <BriefcaseBusiness className="w-3.5 h-3.5" /> Career Goal & Aspirations
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          {message.text && (
            <div className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{message.text}</span>
            </div>
          )}

          {/* TAB 1: ACADEMIC DETAILS */}
          {activeTab === 'academic' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Student Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Roll / Student ID</label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="profile-attendance" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Attendance percentage <span className="font-normal text-slate-400">(optional)</span></label>
                  <input
                    id="profile-attendance"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={attendance}
                    onChange={(e) => setAttendance(e.target.value)}
                    placeholder="0 to 100"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Subject Table */}
              <div className="pt-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Enrolled Subjects & Marks Audit
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddSubject}
                    className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1"
                  >
                    <span>+ Add Subject</span>
                  </button>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-3">Code</th>
                        <th className="p-3">Subject Name</th>
                        <th className="p-3 w-24">Marks (0-100)</th>
                        <th className="p-3 w-20">Credits</th>
                        <th className="p-3 w-12 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                      {subjects.length === 0 && <tr><td colSpan="5" className="p-6 text-center text-sm text-slate-500">No subjects added yet. Select Add Subject to enter a code, name, marks, and credits.</td></tr>}
                      {subjects.map((sub, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="p-2">
                            <input
                              type="text"
                              aria-label={`Subject ${idx + 1} code`}
                              placeholder="e.g. CS601"
                              required
                              value={sub.code || ''}
                              onChange={(e) => handleSubjectChange(idx, 'code', e.target.value)}
                              className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs font-mono uppercase"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              aria-label={`Subject ${idx + 1} name`}
                              placeholder="Enter subject name"
                              required
                              value={sub.name || ''}
                              onChange={(e) => handleSubjectChange(idx, 'name', e.target.value)}
                              className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={sub.marks !== undefined ? sub.marks : 0}
                              onChange={(e) => handleSubjectChange(idx, 'marks', Number(e.target.value))}
                              className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs font-bold text-indigo-600 dark:text-indigo-400"
                            />
                          </td>
                          <td className="p-2">
                            <select
                              value={sub.credits || 3}
                              onChange={(e) => handleSubjectChange(idx, 'credits', Number(e.target.value))}
                              className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs"
                            >
                              {[1, 2, 3, 4, 5].map(c => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveSubject(idx)}
                              className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-900/30"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TECHNICAL SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                  My Acquired Technical Skills
                </label>
                
                {/* Active Skill Badges */}
                <div className="flex flex-wrap gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 min-h-[70px]">
                  {technicalSkills.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No skills added yet. Select from below or type custom skills.</p>
                  ) : (
                    technicalSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-medium shadow-sm"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-rose-200 ml-1 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Input custom skill */}
                <div className="flex items-center space-x-2 mt-3">
                  <input
                    type="text"
                    placeholder="Add custom skill (e.g. Docker, GraphQL, PyTorch)"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill()}
                    className="px-4 py-2 bg-indigo-600 text-white font-semibold text-xs rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    + Add Skill
                  </button>
                </div>
              </div>

              {/* Quick Skill Selector Chips */}
              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  <Lightbulb className="w-3.5 h-3.5 inline mr-1" /> Popular Skill Suggestions (Click to Add):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_SKILL_TAGS.map(skill => {
                    const isAdded = technicalSkills.some(s => s.toLowerCase() === skill.toLowerCase());
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleAddSkill(skill)}
                        disabled={isAdded}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          isAdded
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 border border-transparent cursor-default'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:text-indigo-600'
                        }`}
                      >
                        {isAdded ? `✓ ${skill}` : `+ ${skill}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Completed Courses */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                  Completed Courses & Certifications
                </label>
                <div className="space-y-2 mb-3">
                  {completedCourses.map((c, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs border border-slate-200 dark:border-slate-700">
                      <span className="inline-flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200"><BookOpen className="w-3.5 h-3.5 text-slate-500" /> {c}</span>
                      <button type="button" onClick={() => handleRemoveCourse(c)} className="text-rose-500 font-bold hover:text-rose-700">✕</button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="e.g. Coursera Deep Learning Specialization"
                    value={newCourseInput}
                    onChange={(e) => setNewCourseInput(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCourse}
                    className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white font-semibold text-xs rounded-xl hover:bg-slate-700 transition-colors"
                  >
                    + Add Course
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Projects <span className="font-normal text-slate-400">(comma separated)</span><input value={projects} onChange={(e) => setProjects(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" /></label>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Certifications <span className="font-normal text-slate-400">(comma separated)</span><input value={certifications} onChange={(e) => setCertifications(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" /></label>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Internships and experience <span className="font-normal text-slate-400">(comma separated)</span><input value={internships} onChange={(e) => setInternships(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" /></label>
              </div>
            </div>
          )}

          {/* TAB 3: CAREER GOAL */}
          {activeTab === 'career' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">
                  Target Career Role
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {careerRoles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.title} ({role.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Salary Expectation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10-15 LPA"
                    value={salaryExpectation}
                    onChange={(e) => setSalaryExpectation(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Work Preference
                  </label>
                  <select
                    value={workPreference}
                    onChange={(e) => setWorkPreference(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Employers / Dream Companies
                </label>
                <input
                  type="text"
                  placeholder="e.g. Google, Microsoft, Amazon, Stripe"
                  value={targetCompanies}
                  onChange={(e) => setTargetCompanies(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setProfileModalOpen(false)}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {saving ? 'Saving Memory...' : 'Save & Recalculate AI Audit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
