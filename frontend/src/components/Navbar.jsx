import React from 'react';
import { BookOpen, ChevronDown, LogOut, Moon, PencilLine, Printer, Sun } from 'lucide-react';
import { useStudent } from '../context/StudentContext';

export default function Navbar() {
  const { activeStudent, careerRoles, activeRole, selectRole, systemStatus, setActiveTab, setProfileModalOpen, logout, theme, setTheme } = useStudent();
  return (
    <header className="app-header no-print">
      <button className="brand-lockup" onClick={() => setActiveTab('dashboard')} aria-label="Go to dashboard">
        <span className="brand-mark small"><BookOpen size={19} /></span>
        <span><strong>PrepX</strong><small>Academic success, in focus</small></span>
      </button>
      <div className="header-actions">
        <label className="role-picker"><span>Career focus</span><select value={activeRole?.id || ''} onChange={(e) => selectRole(e.target.value)}>{careerRoles.map((role) => <option key={role.id} value={role.id}>{role.title}</option>)}</select><ChevronDown size={14} /></label>
        <span className={`system-pill ${systemStatus.online && systemStatus.persistent ? 'online' : systemStatus.online ? 'volatile' : ''}`} title={systemStatus.dbMode}><i />{systemStatus.online ? systemStatus.persistent ? 'Connected' : 'Temporary storage' : 'Offline'}</span>
        <div className="account-chip"><span className="avatar">{activeStudent?.name?.charAt(0) || '?'}</span><span><strong>{activeStudent?.name || 'Student'}</strong><small>Student account</small></span></div>
        <button className="icon-button profile-action" onClick={() => setProfileModalOpen(true)} title="Edit profile" aria-label="Edit profile"><PencilLine size={17} /></button>
        <button className="icon-button report-action" onClick={() => setActiveTab('report')} title="View report" aria-label="View report"><Printer size={17} /></button>
        <button className="icon-button theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>{theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}</button>
        <button className="icon-button logout-button" onClick={logout} title="Sign out" aria-label="Sign out"><LogOut size={17} /></button>
      </div>
    </header>
  );
}
