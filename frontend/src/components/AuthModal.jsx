import React, { useState } from 'react';
import { ArrowRight, BookOpen, LockKeyhole } from 'lucide-react';
import { useStudent } from '../context/StudentContext';

const STARTER_SUBJECTS = [
  { code: 'CS601', name: 'Data Structures & Algorithms', marks: 82, credits: 4 },
  { code: 'CS602', name: 'Database Management Systems', marks: 76, credits: 4 },
  { code: 'CS603', name: 'Operating Systems', marks: 79, credits: 3 },
  { code: 'CS604', name: 'Computer Networks', marks: 74, credits: 3 },
  { code: 'CS605', name: 'Web Technologies', marks: 88, credits: 3 },
];

export default function AuthModal() {
  const { isSignedIn, login, register, loading } = useStudent();
  const [mode, setMode] = useState('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roll, setRoll] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isSignedIn) return null;

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login({ identifier: identifier.trim(), password });
      } else {
        await register({
          name: name.trim(), email: email.trim(), roll_number: roll.trim(), password,
          department: 'Computer Science & Engineering', semester: 6,
          target_role: 'full_stack_dev', attendance_percentage: 85,
          technical_skills: ['HTML', 'CSS', 'JavaScript', 'Python', 'Git'],
          completed_courses: [], subjects: STARTER_SUBJECTS,
          career_goal: { target_role: 'full_stack_dev', salary_expectation: '', work_preference: '', target_companies: [] },
        });
      }
    } catch (err) {
      setError(err.message || (mode === 'login' ? 'Unable to sign in.' : 'Unable to create your profile.'));
    } finally { setSubmitting(false); }
  };

  return (
    <main className="login-page">
      <section className="login-shell">
        <div className="login-intro">
          <div className="login-brand">
            <span className="brand-mark"><BookOpen size={22} strokeWidth={1.8} /></span>
            <span>PrepX</span>
          </div>
          <p className="eyebrow">STUDENT SUCCESS PLATFORM</p>
          <h1>Make your next<br />semester count.</h1>
          <p className="intro-copy">A clear view of your academic progress, career readiness, and what to focus on next.</p>
          <div className="login-proof"><span className="proof-line" /> Academic insights · Skill planning · Progress reports</div>
        </div>
        <div className="login-card">
          <div className="login-card-heading">
            <div className="login-lock"><LockKeyhole size={18} /></div>
            <div><p className="eyebrow">YOUR CAMPUS SPACE</p><h2>{mode === 'login' ? 'Sign in to continue' : 'Create your student profile'}</h2></div>
          </div>
          <div className="auth-tabs" role="tablist" aria-label="Account options">
            <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError(''); }}>Sign in</button>
            <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setError(''); }}>Create profile</button>
          </div>
          <form onSubmit={submit} className="login-form">
            {mode === 'register' ? <>
              <label htmlFor="new-name">Full name</label>
              <input id="new-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" required />
              <label htmlFor="new-email">Campus email</label>
              <input id="new-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@campus.edu" autoComplete="email" required />
              <label htmlFor="new-roll">Student ID</label>
              <input id="new-roll" value={roll} onChange={(e) => setRoll(e.target.value)} placeholder="e.g. 24CS042" required />
            </> : <>
              <label htmlFor="login-email">Email or student ID</label>
              <input id="login-email" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="name@campus.edu" autoComplete="username" required />
            </>}
            <label htmlFor="login-password">Password</label>
            <input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={mode === 'register' ? 'Create a password' : 'Enter your password'} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} required />
            {error && <p className="login-error" role="alert">{error}</p>}
            <button className="solid-button" type="submit" disabled={submitting || loading}>{submitting ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create profile'} <ArrowRight size={16} /></button>
          </form>
        </div>
      </section>
      <footer className="login-footer">PrepX <span>·</span> Academic progress, made actionable</footer>
    </main>
  );
}
