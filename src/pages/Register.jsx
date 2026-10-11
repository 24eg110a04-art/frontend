import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthAside } from './Login.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { register } from '../services/authService.js';
import { hasErrors, validateEmail, validateName, validatePassword } from '../utils/validators.js';

export default function Register() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirm: !form.confirm ? 'Confirm your password' : form.confirm !== form.password ? 'Passwords do not match' : '',
    };
    setErrors(found);
    setServerError('');
    if (hasErrors(found)) return;
    setLoading(true);
    try {
      await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      toast.success('Account created. Please log in.');
      navigate('/login', { replace: true, state: { registered: true, email: form.email.trim() } });
    } catch (err) {
      setServerError(err.userMessage || 'Registration failed');
      setLoading(false);
    }
  };

  const field = (id, label, type, autoComplete) => (
    <div className={`field ${errors[id] ? 'invalid' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <input id={id} className="input" type={type} autoComplete={autoComplete} value={form[id]} onChange={set(id)} />
      {errors[id] && <span className="field-error">{errors[id]}</span>}
    </div>
  );

  return (
    <div className="auth-page">
      <AuthAside />
      <main className="auth-main">
        <div className="auth-card">
          <div>
            <h1>Create your account</h1>
            <p className="sub">It takes under a minute.</p>
          </div>
          {serverError && <div className="alert alert-error" role="alert">{serverError}</div>}
          <form onSubmit={handleSubmit} noValidate>
            {field('name', 'Full name', 'text', 'name')}
            {field('email', 'Email', 'email', 'email')}
            {field('password', 'Password', 'password', 'new-password')}
            <span className="sub" style={{ marginTop: -6, fontSize: '0.82rem' }}>At least 8 characters with a letter and a number.</span>
            {field('confirm', 'Confirm password', 'password', 'new-password')}
            <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
              {loading ? <span className="spinner" aria-label="Creating account" /> : 'Create account'}
            </button>
          </form>
          <p className="sub">Already registered? <Link to="/login">Log in</Link></p>
        </div>
      </main>
    </div>
  );
}
