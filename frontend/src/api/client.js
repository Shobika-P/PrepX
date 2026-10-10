/**
 * AI Campus Companion - Frontend API Client
 * Centralized service layer for communicating with Flask backend REST endpoints.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function fetchJson(url, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // System Health & Status
  async getHealth() {
    return fetchJson('/health');
  },

  // Authentication & Persistent Memory
  async registerStudent(studentData) {
    return fetchJson('/auth/register', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  },

  async loginStudent(credentials) {
    return fetchJson('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async getCurrentUser(token) {
    return fetchJson('/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async updateStudentProfile(token, profileData) {
    return fetchJson('/auth/profile', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(profileData),
    });
  },

  // Student Management
  async getStudents() {
    return fetchJson('/students');
  },

  async getStudentById(studentId) {
    return fetchJson(`/students/${studentId}`);
  },

  async createStudent(studentData) {
    return fetchJson('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  },

  async updateStudent(studentId, studentData) {
    return fetchJson(`/students/${studentId}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
  },

  async deleteStudent(studentId) {
    return fetchJson(`/students/${studentId}`, {
      method: 'DELETE',
    });
  },

  async resetSeedData() {
    return fetchJson('/students/reset', {
      method: 'POST',
    });
  },

  // Academic Audit
  async getAcademicAudit(studentId) {
    return fetchJson(`/academic/audit/${studentId}`);
  },

  // Skill Gap Analysis
  async getSkillGap(studentId, roleId = null) {
    const query = roleId ? `?role=${encodeURIComponent(roleId)}` : '';
    return fetchJson(`/skills/gap-analysis/${studentId}${query}`);
  },

  // Career Roles
  async getCareerRoles() {
    return fetchJson('/careers/roles');
  },

  async getCareerRoleById(roleId) {
    return fetchJson(`/careers/roles/${roleId}`);
  },

  async addCareerRole(roleData) {
    return fetchJson('/careers/roles', {
      method: 'POST',
      body: JSON.stringify(roleData),
    });
  },

  // Personalized Recommendations
  async getRecommendations(studentId, roleId = null) {
    const query = roleId ? `?role=${encodeURIComponent(roleId)}` : '';
    return fetchJson(`/recommendations/${studentId}${query}`);
  },

  // Consolidated Student Report
  async getStudentReport(studentId, roleId = null) {
    const query = roleId ? `?role=${encodeURIComponent(roleId)}` : '';
    return fetchJson(`/reports/student/${studentId}${query}`);
  },
};
