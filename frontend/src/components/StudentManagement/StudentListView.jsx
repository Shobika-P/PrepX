import React, { useState } from 'react';
import { useStudent } from '../../context/StudentContext';
import { api } from '../../api/client';
import StudentFormModal from './StudentFormModal';
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  GraduationCap, 
  ExternalLink,
  BookOpen
} from 'lucide-react';

export default function StudentListView() {
  const { 
    students, 
    activeStudent, 
    selectStudent, 
    refreshStudents, 
    setActiveTab 
  } = useStudent();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const filteredStudents = students.filter((stu) => {
    const matchesSearch = 
      stu.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stu.roll_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stu.department?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSem = selectedSemester === 'All' || String(stu.semester) === String(selectedSemester);

    return matchesSearch && matchesSem;
  });

  const handleOpenAdd = () => {
    setStudentToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student, e) => {
    e.stopPropagation();
    setStudentToEdit(student);
    setIsModalOpen(true);
  };

  const handleDelete = async (studentId, e) => {
    e.stopPropagation();
    if (students.length <= 1) {
      alert('Cannot delete the last remaining student record.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete this student record?`)) {
      return;
    }

    setDeletingId(studentId);
    try {
      await api.deleteStudent(studentId);
      await refreshStudents();
    } catch (err) {
      alert('Failed to delete student: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Student Data Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              {students.length} Profiles
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Store, update, and manage academic transcripts, attendance figures, and technical skills.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all shrink-0"
        >
          <UserPlus className="w-4 h-4" /> Add New Student
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, roll number, or department..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs font-medium text-slate-500">Semester:</span>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-medium text-slate-700 outline-none cursor-pointer"
          >
            <option value="All">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student) => {
          const isActive = activeStudent?.id === student.id;
          const subjectsCount = student.subjects?.length || 0;
          const skillsCount = student.technical_skills?.length || 0;

          return (
            <div
              key={student.id}
              onClick={() => selectStudent(student.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                isActive
                  ? 'bg-indigo-50/40 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                  : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm'
              }`}
            >
              <div>
                {/* Card Top: Avatar, Name, Status Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl font-bold text-sm flex items-center justify-center ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-snug">{student.name}</h3>
                      <p className="text-xs text-slate-500">Roll: {student.roll_number}</p>
                    </div>
                  </div>

                  {isActive ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                      Active
                    </span>
                  ) : null}
                </div>

                {/* Info Pills */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Semester & Dept</span>
                    <span className="font-bold text-slate-800">Sem {student.semester}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Attendance</span>
                    <span className={`font-bold ${
                      student.attendance_percentage < 75 ? 'text-rose-600' : 'text-emerald-600'
                    }`}>
                      {student.attendance_percentage}%
                    </span>
                  </div>
                </div>

                {/* Skills Preview */}
                <div className="mt-3">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Skills ({skillsCount}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(student.technical_skills || []).slice(0, 4).map((skill, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        {skill}
                      </span>
                    ))}
                    {(student.technical_skills || []).length > 4 && (
                      <span className="text-[10px] text-slate-400 font-semibold px-1 py-0.5">
                        +{student.technical_skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    selectStudent(student.id);
                    setActiveTab('dashboard');
                  }}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5" /> View Dashboard
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleOpenEdit(student, e)}
                    title="Edit Student Data"
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(student.id, e)}
                    disabled={deletingId === student.id}
                    title="Delete Student"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal for Add / Edit */}
      <StudentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        studentToEdit={studentToEdit}
      />

    </div>
  );
}
