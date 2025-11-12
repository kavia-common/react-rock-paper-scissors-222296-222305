import React, { useState } from 'react';
import Card from '../components/Layout/Card';
import Header from '../components/Layout/Header';
import { isValidEmail, isValidPassword } from '../utils/validation';
import { login as authLogin } from '../utils/auth';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Login - A centered, themed login page with email/password fields and client-side validation.
 * Accessibility: Proper labels, aria-invalid, error messages with aria-live, and keyboard-friendly controls.
 * After successful submit, sets a local auth flag and navigates to the game route.
 */
function Login() {
  const [theme, setTheme] = useState('light');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitted, setSubmitted] = useState(false);
  const [announce, setAnnounce] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const emailError = touched.email || submitted ? (!isValidEmail(email) ? 'Enter a valid email address.' : '') : '';
  const passwordError = touched.password || submitted ? (!isValidPassword(password) ? 'Password must be at least 6 characters.' : '') : '';

  const hasErrors = Boolean(emailError || passwordError);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    const next = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (hasErrors) {
      // focus first invalid field
      if (emailError) {
        const el = document.getElementById('email');
        if (el) el.focus();
      } else if (passwordError) {
        const el = document.getElementById('password');
        if (el) el.focus();
      }
      return;
    }
    // Set auth flag and navigate to intended page or home
    authLogin();
    setAnnounce('Login successful. Redirecting to the game.');
    const redirectTo = location?.state?.from || '/';
    navigate(redirectTo, { replace: true });
  };

  const headerActions = (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} mode`}
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} mode`}
    >
      <span className="theme-toggle__icon" aria-hidden>
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
      {theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );

  return (
    <div className="App">
      <Header title="Login" actions={headerActions} />
      <main className="App__main container-center">
        <Card className="animate-pop">
          <div className="rps-card__header">
            <div>
              <h2 className="rps-card__title" id="login-title">Welcome back</h2>
              <p className="rps-card__subtitle" id="login-desc">Sign in to continue</p>
            </div>
            <div aria-hidden />
          </div>

          <div aria-live="polite" aria-atomic="true" className="visually-hidden">
            {announce}
          </div>

          <form onSubmit={handleSubmit} aria-labelledby="login-title" aria-describedby="login-desc" noValidate>
            <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
              <div>
                <label htmlFor="email" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  aria-invalid={emailError ? 'true' : 'false'}
                  aria-describedby={emailError ? 'email-error' : undefined}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.75rem',
                    borderRadius: '10px',
                    border: `1px solid ${emailError ? 'var(--color-error)' : 'rgba(0,0,0,0.1)'}`,
                    background: 'var(--color-surface)',
                    color: 'var(--color-text)',
                    minHeight: 44,
                  }}
                />
                <div
                  id="email-error"
                  role="alert"
                  aria-live="polite"
                  style={{
                    marginTop: 6,
                    color: 'var(--color-error)',
                    minHeight: '1em',
                    fontSize: '0.9rem',
                  }}
                >
                  {emailError}
                </div>
              </div>

              <div>
                <label htmlFor="password" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  aria-invalid={passwordError ? 'true' : 'false'}
                  aria-describedby={passwordError ? 'password-error' : undefined}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.75rem',
                    borderRadius: '10px',
                    border: `1px solid ${passwordError ? 'var(--color-error)' : 'rgba(0,0,0,0.1)'}`,
                    background: 'var(--color-surface)',
                    color: 'var(--color-text)',
                    minHeight: 44,
                  }}
                />
                <div
                  id="password-error"
                  role="alert"
                  aria-live="polite"
                  style={{
                    marginTop: 6,
                    color: 'var(--color-error)',
                    minHeight: '1em',
                    fontSize: '0.9rem',
                  }}
                >
                  {passwordError}
                </div>
              </div>

              <button
                type="submit"
                className="btn"
                style={{ width: '100%' }}
                aria-label="Submit login"
                title="Submit login"
              >
                Sign In
              </button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}

export default Login;
