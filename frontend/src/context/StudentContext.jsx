import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

const StudentContext = createContext();

export function StudentProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [activeStudentId, setActiveStudentId] = useState(null);
  const [careerRoles, setCareerRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  // Authentication & Persistent Session Memory State
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('campus_auth_token') || null);
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem('campus_auth_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isSignedIn, setIsSignedIn] = useState(() => Boolean(localStorage.getItem('campus_auth_token')));
  const [theme, setTheme] = useState(() => localStorage.getItem('campus_theme') || 'light');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Analytics State
  const [academicAudit, setAcademicAudit] = useState(null);
  const [skillGap, setSkillGap] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [reportData, setReportData] = useState(null);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [systemStatus, setSystemStatus] = useState({ online: false, dbMode: 'Connecting...' });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('campus_theme', theme);
  }, [theme]);

  // Save active student ID to localStorage
  useEffect(() => {
    if (activeStudentId) {
      localStorage.setItem('campus_active_student_id', activeStudentId);
    }
  }, [activeStudentId]);

  // Initial load: fetch all students, roles, and check stored session
  const initialize = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [healthRes, rolesRes] = await Promise.allSettled([
        api.getHealth(),
        api.getCareerRoles()
      ]);

      if (healthRes.status === 'fulfilled') {
        setSystemStatus({
          online: true,
          persistent: Boolean(healthRes.value.persistent_storage),
          dbMode: healthRes.value.persistent_storage ? 'MongoDB persistent' : 'Temporary in-memory storage'
        });
      } else {
        setSystemStatus({ online: false, persistent: false, dbMode: 'Backend disconnected' });
      }

      let fetchedRoles = [];
      if (rolesRes.status === 'fulfilled' && rolesRes.value.data) {
        fetchedRoles = rolesRes.value.data;
        setCareerRoles(fetchedRoles);
      }

      setStudents([]);

      // Check stored auth session
      const storedToken = localStorage.getItem('campus_auth_token');
      if (storedToken) {
        try {
          const userRes = await api.getCurrentUser(storedToken);
          if (userRes.status === 'success' && userRes.user) {
            setCurrentUser(userRes.user);
            setIsSignedIn(true);
            setAuthToken(storedToken);
            setActiveStudentId(userRes.user.id);
            setSelectedRoleId(userRes.user.target_role || null);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Session expired, logging out:', e.message);
          localStorage.removeItem('campus_auth_token');
          localStorage.removeItem('campus_auth_user');
          setAuthToken(null);
          setCurrentUser(null);
        }
      }

      // A previous frontend-only demo flag is not a real authenticated session.
      setIsSignedIn(false);
      localStorage.removeItem('campus_signed_in');

      setActiveStudentId(null);
    } catch (err) {
      console.error('Initialization error:', err);
      setError(err.message || 'Failed to initialize application.');
    } finally {
      setLoading(false);
    }
  }, [activeStudentId]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Fetch real-time analytics data for active student
  const loadStudentData = useCallback(async () => {
    if (!activeStudentId) return;

    setLoading(true);
    setError(null);
    try {
      if (!authToken || !currentUser) return;
      const activeStu = currentUser;
      const targetRole = selectedRoleId || activeStu?.target_role;
      if (!targetRole) throw new Error('Choose a career goal in your profile to load career analysis.');

      const [auditRes, gapRes, recRes, reportRes] = await Promise.all([
        api.getAcademicAudit(activeStudentId, authToken),
        api.getSkillGap(activeStudentId, targetRole, authToken),
        api.getRecommendations(activeStudentId, targetRole, authToken),
        api.getStudentReport(activeStudentId, targetRole, authToken)
      ]);

      setAcademicAudit(auditRes.audit);
      setSkillGap(gapRes.skill_gap);
      setRecommendations(recRes.recommendations);
      setReportData(reportRes);
    } catch (err) {
      console.error('Error fetching student analytics:', err);
      setError(err.message || 'Error fetching analytics data.');
    } finally {
      setLoading(false);
    }
  }, [activeStudentId, selectedRoleId, currentUser, authToken]);

  const refreshAcademicAudit = useCallback(async () => {
    if (!activeStudentId || !authToken) throw new Error('Sign in to refresh the academic audit.');
    const response = await api.getAcademicAudit(activeStudentId, authToken);
    setAcademicAudit(response.audit);
    return response.audit;
  }, [activeStudentId, authToken]);

  useEffect(() => {
    if (activeStudentId && authToken) {
      loadStudentData();
    }
  }, [activeStudentId, selectedRoleId, loadStudentData]);

  // Auth Functions
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.loginStudent(credentials);
      if (res.status === 'success' && res.user) {
        const token = res.token || res.user.token;
        setAuthToken(token);
        setCurrentUser(res.user);
        setIsSignedIn(true);
        localStorage.setItem('campus_signed_in', 'true');
        localStorage.setItem('campus_auth_token', token);
        localStorage.setItem('campus_auth_user', JSON.stringify(res.user));
        
        setActiveStudentId(res.user.id);
        if (res.user.target_role) {
          setSelectedRoleId(res.user.target_role);
        }

        // Refresh list of students
        setStudents([res.user]);
        setNotice('Your profile was created and saved.');

        setAuthModalOpen(false);
        return res;
      } else {
        throw new Error(res.message || 'Login failed.');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (studentData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.registerStudent(studentData);
      if (res.status === 'success' && res.user) {
        const token = res.token || res.user.token;
        setAuthToken(token);
        setCurrentUser(res.user);
        setIsSignedIn(true);
        localStorage.setItem('campus_signed_in', 'true');
        localStorage.setItem('campus_auth_token', token);
        localStorage.setItem('campus_auth_user', JSON.stringify(res.user));
        
        setActiveStudentId(res.user.id);
        if (res.user.target_role) {
          setSelectedRoleId(res.user.target_role);
        }

        // Refresh list of students
        setStudents([res.user]);

        setAuthModalOpen(false);
        return res;
      } else {
        throw new Error(res.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('campus_auth_token');
    localStorage.removeItem('campus_auth_user');
    setAuthToken(null);
    setCurrentUser(null);
    setIsSignedIn(false);
    localStorage.removeItem('campus_signed_in');
    localStorage.removeItem('campus_active_student_id');
    setActiveStudentId(null);
    setStudents([]);
    setAcademicAudit(null); setSkillGap(null); setRecommendations(null); setReportData(null);
    setNotice(null);
  };

  // Update profile and instantly refresh analytics memory
  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const activeStuId = activeStudentId || currentUser?.id;
      const profilePayload = {
        id: activeStuId,
        ...profileData
      };
      const res = authToken
        ? await api.updateStudentProfile(authToken, profilePayload)
        : await api.updateStudent(activeStuId, profilePayload);
      const updatedUser = res.user || res.data;

      if ((res.status === 'success' || res.data) && updatedUser) {
        // Update state
        if (currentUser && currentUser.id === updatedUser.id) {
          setCurrentUser(updatedUser);
          if (authToken) localStorage.setItem('campus_auth_user', JSON.stringify(updatedUser));
        }

        setStudents(prev => prev.map(s => (s.id === updatedUser.id ? updatedUser : s)));

        if (updatedUser.target_role) {
          setSelectedRoleId(updatedUser.target_role);
        }

        await loadStudentData();
        setNotice('Changes saved to your profile.');
        setProfileModalOpen(false);
        return updatedUser;
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Profile update failed: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-click helper: add a missing skill to persistent profile memory
  const addSkillToProfile = async (newSkill) => {
    const currentStu = students.find(s => s.id === activeStudentId) || currentUser;
    if (!currentStu) return;

    const existingSkills = currentStu.technical_skills || [];
    if (existingSkills.some(s => s.toLowerCase() === newSkill.toLowerCase())) return;

    const updatedSkills = [...existingSkills, newSkill];
    await updateProfile({ technical_skills: updatedSkills });
  };

  // Handler to switch active student
  const selectStudent = (studentId) => {
    const student = students.find(s => s.id === studentId || s.roll_number === studentId);
    setActiveStudentId(studentId);
    if (student?.target_role) {
      setSelectedRoleId(student.target_role);
    }
  };

  // Handler to switch target career role
  const selectRole = (roleId) => {
    setSelectedRoleId(roleId);
    if (currentUser && roleId !== currentUser.target_role) {
      updateProfile({ target_role: roleId, career_goal: { ...(currentUser.career_goal || {}), target_role: roleId } })
        .catch(() => setSelectedRoleId(currentUser.target_role || null));
    }
  };

  // Reload all students
  const refreshStudents = async () => {
    try {
      const res = await api.getStudents();
      setStudents((res.data || []).slice(0, 1));
      await loadStudentData();
    } catch (err) {
      console.error('Failed to refresh students:', err);
    }
  };

  // Reset database back to default seed dataset
  const resetToSeed = async () => {
    setLoading(true);
    try {
      await api.resetSeedData();
      await initialize();
    } catch (err) {
      setError('Failed to reset database: ' + err.message);
      setLoading(false);
    }
  };

  const activeStudent = currentUser;
  const activeRole = careerRoles.find(r => r.id === selectedRoleId) || null;

  const value = {
    students,
    activeStudent,
    activeStudentId,
    selectStudent,
    careerRoles,
    activeRole,
    selectedRoleId,
    selectRole,
    authToken,
    currentUser,
    isSignedIn,
    authModalOpen,
    setAuthModalOpen,
    profileModalOpen,
    setProfileModalOpen,
    login,
    register,
    logout,
    updateProfile,
    addSkillToProfile,
    academicAudit,
    skillGap,
    recommendations,
    reportData,
    activeTab,
    setActiveTab,
    loading,
    error,
    setError,
    notice,
    setNotice,
    systemStatus,
    theme,
    setTheme,
    refreshStudents,
    refreshStudentData: loadStudentData,
    refreshAcademicAudit,
    resetToSeed
  };

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
}
