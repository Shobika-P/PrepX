import React, { useState, useEffect } from 'react';
import { useStudent } from '../../context/StudentContext';
import { api } from '../../api/client';
import { 
  X, 
  Plus, 
  Trash2, 
  UserPlus, 
  Check, 
  AlertCircle,
  BookOpen
} from 'lucide-react';

export default function StudentFormModal({ isOpen, onClose, studentToEdit = null }) {
  const { careerRoles, refreshStudents, selectStudent } = useStudent();

  const [formData, setFormData] = useState({
    name: '',
    roll_number: '',
    email: '',
    semester: '',
    department: '',
    target_role: '',
    attendance_percentage: '',
    technical_skills: '',
    completed_courses: '',
    subjects: []
  });

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        name: studentToEdit.name || '',
        roll_number: studentToEdit.roll_number || '',
        email: studentToEdit.email || '',
        semester: studentToEdit.semester || '',
        department: studentToEdit.department || '',
        target_role: studentToEdit.target_role || '',
        attendance_percentage: studentToEdit.attendance_percentage ?? '',
        technical_skills: Array.isArray(studentToEdit.technical_skills)
          ? studentToEdit.technical_skills.join(', ')
          : studentToEdit.technical_skills || '',
        completed_courses: Array.isArray(studentToEdit.completed_courses)
          ? studentToEdit.completed_courses.join(', ')
          : studentToEdit.completed_courses || '',
        subjects: studentToEdit.subjects || []
      });
    } else {
      setFormData({
        name: '',
        roll_number: '',
        email: '',
        semester: '',
        department: '',
        target_role: '',
        attendance_percentage: '',
        technical_skills: '',
        completed_courses: '',
        subjects: []
      });
    }
    setError(null);
  }, [studentToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubjectChange = (index, field, value) => {
    const updated = [...formData.subjects];
    updated[index] = {
      ...updated[index],
      [field]: field === 'marks' || field === 'credits' ? Number(value) : value
    };
    setFormData({ ...formData, subjects: updated });
  };

  const addSubjectRow = () => {
    setFormData({
      ...formData,
      subjects: [
        ...formData.subjects,
        { code: `SUB0${formData.subjects.length + 1}`, name: '', marks: '', credits: 3 }
      ]
    });
  };

  const removeSubjectRow = (index) => {
    if (formData.subjects.length <= 1) {
      setError('At least one subject is required.');
      return;
    }
    const updated = formData.subjects.filter((_, i) => i !== index);
    setFormData({ ...formData, subjects: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (!formData.name.trim()) throw new Error('Student name is required.');
      if (!formData.roll_number.trim()) throw new Error('Roll number is required.');

      const payload = {
        name: formData.name.trim(),
        roll_number: formData.roll_number.trim(),
        email: formData.email.trim(),
        semester: Number(formData.semester),
        department: formData.department.trim(),
        target_role: formData.target_role,
        attendance_percentage: Number(formData.attendance_percentage),
        technical_skills: formData.technical_skills.split(',').map(s => s.trim()).filter(Boolean),
        completed_courses: formData.completed_courses.split(',').map(c => c.trim()).filter(Boolean),
        subjects: formData.subjects
      };

      if (payload.subjects.length === 0 || payload.subjects.some((subject) => !subject.code.trim() || !subject.name.trim())) {
        throw new Error('Each subject needs both a course code and a subject name.');
      }

      let res;
      if (studentToEdit) {
        res = await api.updateStudent(studentToEdit.id, payload);
      } else {
        res = await api.createStudent(payload);
      }

      await refreshStudents();
      if (res.data?.id) {
        selectStudent(res.data.id);
      }
      onClose();
    } catch (err) {
      console.error('Save student error:', err);
      setError(err.message || 'Failed to save student profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {studentToEdit ? 'Edit Student Profile' : 'Add New Student Record'}
              </h2>
              <p className="text-xs text-slate-500">
                {studentToEdit ? 'Update marks, skills, and target career path' : 'Register student for automated academic & skill audit'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Core Demographics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Student Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Aarav Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Roll / Student ID *</label>
              <input
                type="text"
                required
                value={formData.roll_number}
                onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
                placeholder="e.g. 21CS042"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="student@campus.edu"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="Computer Science & Engineering"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Semester (1 - 8)</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Attendance Percentage (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                required
                value={formData.attendance_percentage}
                onChange={(e) => setFormData({ ...formData, attendance_percentage: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Target Role & Skills */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Career Pathway</label>
              <select
                value={formData.target_role}
                onChange={(e) => setFormData({ ...formData, target_role: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white font-medium text-slate-800"
              >
                {careerRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.title} ({role.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Technical Skills (Comma-separated)
              </label>
              <input
                type="text"
                value={formData.technical_skills}
                onChange={(e) => setFormData({ ...formData, technical_skills: e.target.value })}
                placeholder="e.g. HTML, CSS, JavaScript, React, Node.js, Python, Git"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">Skills are automatically normalized and compared against the target career role.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Completed Certifications / Online Courses
              </label>
              <input
                type="text"
                value={formData.completed_courses}
                onChange={(e) => setFormData({ ...formData, completed_courses: e.target.value })}
                placeholder="e.g. Meta Front-End Developer, SQL for Data Science"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Subjects & Marks Entry */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Academic Subjects & Marks
                </h3>
                <p className="text-[11px] text-slate-500">Provide course codes, names, credits, and percentage marks (0-100)</p>
              </div>
              <button
                type="button"
                onClick={addSubjectRow}
                className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Subject
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {formData.subjects.map((subj, index) => (
                <div key={index} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <input
                    type="text"
                    required
                    aria-label={`Subject ${index + 1} code`}
                    placeholder="Code (e.g. CS601)"
                    value={subj.code}
                    onChange={(e) => handleSubjectChange(index, 'code', e.target.value)}
                    className="w-20 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-mono uppercase"
                  />
                  <input
                    type="text"
                    required
                    aria-label={`Subject ${index + 1} name`}
                    placeholder="Subject Name (e.g. Data Structures)"
                    value={subj.name}
                    onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium"
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400 font-semibold">Cred:</span>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={subj.credits}
                      onChange={(e) => handleSubjectChange(index, 'credits', e.target.value)}
                      className="w-14 px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-center"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400 font-semibold">Marks:</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      required
                      value={subj.marks}
                      onChange={(e) => handleSubjectChange(index, 'marks', e.target.value)}
                      className="w-16 px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-center font-bold text-slate-800"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSubjectRow(index)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {submitting ? 'Saving...' : studentToEdit ? 'Update Student Profile' : 'Save & Run Audit'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
