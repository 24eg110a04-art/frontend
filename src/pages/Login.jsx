import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { hasErrors, validateEmail } from '../utils/validators.js';

export function AuthAside() {
  return (
    <aside className="auth-aside">
      <div className="brand"><span className="brand-mark">₹</span>Expense Tracker</div>
      <div>
        <h1>Know where your money goes.</h1>
        <p style={{ marginTop: 12 }}>Log income and spending, set a monthly budget, and see the month at a glance.</p>
      </div>
      <div aria-hidden="true">
        <div className="split-bar"><span className="in" style={{ width: '68%' }} /><span className="out" style={{ width: '32%' }} /></div>
      </div>
    </aside>
  );
}

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const location = useLocation();
  const [form, setForm] = useState({ email: location.state?.email || '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to={location.state?.from || '/'} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = {
      email: validateEmail(form.email),
      password: form.password ? '' : 'Password is required',
    };
    setErrors(found);
    setServerError('');
    if (hasErrors(found)) return;
    setLoading(true);
    try {
      await login(form.email.trim(), form.password);
    } catch (err) {
      setServerError(err.userMessage || err.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <AuthAside />
      <main className="auth-main">
        <div className="auth-card">
          <div>
            <h1>Log in</h1>
            <p className="sub">Welcome back. Enter your details to continue.</p>
          </div>
          {location.state?.registered && (
            <div className="alert alert-success" role="status">Account created. You can log in now.</div>
          )}
          {serverError && <div className="alert alert-error" role="alert">{serverError}</div>}
          <form onSubmit={handleSubmit} noValidate>
            <div className={`field ${errors.email ? 'invalid' : ''}`}>
              <label htmlFor="email">Email</label>
              <input id="email" className="input" type="email" autoComplete="email" value={form.email}
                     onChange={(e) => setForm({ ...form, email: e.target.value })} />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
            <div className={`field ${errors.password ? 'invalid' : ''}`}>
              <label htmlFor="password">Password</label>
              <input id="password" className="input" type="password" autoComplete="current-password" value={form.password}
                     onChange={(e) => setForm({ ...form, password: e.target.value })} />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>
            <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
              {loading ? <span className="spinner" aria-label="Logging in" /> : 'Log in'}
            </button>
          </form>
          <p className="sub">New here? <Link to="/register">Create an account</Link></p>
        </div>
      </main>
    </div>
  );
}
