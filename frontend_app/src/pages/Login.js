import React, { useState } from 'react';
import Card from '../components/Layout/Card';
import Header from '../components/Layout/Header';
import { login as authLogin, saveUserProfile } from '../utils/auth';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Login - A centered, themed login page that collects a display name and an anime selection.
 * Accessibility: Proper labels, aria-invalid, error messages with aria-live, and keyboard-friendly controls.
 * On submit, persists { isAuthed: true, name, anime } to client-side auth storage and routes via existing gating.
 */
function Login() {
  const [theme, setTheme] = useState('light');
  const [name, setName] = useState('');
  const [anime, setAnime] = useState('');
  const [touched, setTouched] = useState({ name: false, anime: false });
  const [submitted, setSubmitted] = useState(false);
  const [announce, setAnnounce] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Simple validation rules: non-empty trimmed name, and one anime selected
  const nameError = (touched.name || submitted) ? (!name.trim() ? 'Please enter your name.' : '') : '';
  const animeError = (touched.anime || submitted) ? (!anime ? 'Please select your favorite anime.' : '') : '';

  const hasErrors = Boolean(nameError || animeError);

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
      if (nameError) {
        const el = document.getElementById('name');
        if (el) el.focus();
      } else if (animeError) {
        const el = document.getElementById('anime');
        if (el) el.focus();
      }
      return;
    }
    // Persist profile and set auth flag
    saveUserProfile({ name: name.trim(), anime });
    authLogin();
    setAnnounce('Welcome! Profile saved. Redirecting to the game.');
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

  // Available anime options (can be extended easily)
  const animeOptions = [
    { value: '', label: 'Select an anime...', disabled: true },
    { value: 'naruto', label: 'Naruto' },
    { value: 'one-piece', label: 'One Piece' },
    { value: 'demon-slayer', label: 'Demon Slayer' },
    { value: 'attack-on-titan', label: 'Attack on Titan' },
    { value: 'my-hero-academia', label: 'My Hero Academia' },
  ];

  return (
    <div className="App">
      <Header title="Login" actions={headerActions} />
      <main className="App__main container-center">
        <Card className="animate-pop">
          <div className="rps-card__header">
            <div>
              <h2 className="rps-card__title" id="login-title">Welcome</h2>
              <p className="rps-card__subtitle" id="login-desc">Enter your name and pick an anime to continue</p>
            </div>
            <div aria-hidden />
          </div>

          <div aria-live="polite" aria-atomic="true" className="visually-hidden">
            {announce}
          </div>

          <form onSubmit={handleSubmit} aria-labelledby="login-title" aria-describedby="login-desc" noValidate>
            <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
              <div>
                <label htmlFor="name" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="nickname"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                  aria-invalid={nameError ? 'true' : 'false'}
                  aria-describedby={nameError ? 'name-error' : undefined}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.75rem',
                    borderRadius: '10px',
                    border: `1px solid ${nameError ? 'var(--color-error)' : 'rgba(0,0,0,0.1)'}`,
                    background: 'var(--color-surface)',
                    color: 'var(--color-text)',
                    minHeight: 44,
                  }}
                />
                <div
                  id="name-error"
                  role="alert"
                  aria-live="polite"
                  style={{
                    marginTop: 6,
                    color: 'var(--color-error)',
                    minHeight: '1em',
                    fontSize: '0.9rem',
                  }}
                >
                  {nameError}
                </div>
              </div>

              <div>
                <label htmlFor="anime" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
                  Favorite Anime
                </label>
                <select
                  id="anime"
                  name="anime"
                  value={anime}
                  onChange={(e) => setAnime(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, anime: true }))}
                  aria-invalid={animeError ? 'true' : 'false'}
                  aria-describedby={animeError ? 'anime-error' : undefined}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.75rem',
                    borderRadius: '10px',
                    border: `1px solid ${animeError ? 'var(--color-error)' : 'rgba(0,0,0,0.1)'}`,
                    background: 'var(--color-surface)',
                    color: 'var(--color-text)',
                    minHeight: 44,
                  }}
                >
                  {animeOptions.map(opt => (
                    <option key={opt.value || 'placeholder'} value={opt.value} disabled={opt.disabled}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div
                  id="anime-error"
                  role="alert"
                  aria-live="polite"
                  style={{
                    marginTop: 6,
                    color: 'var(--color-error)',
                    minHeight: '1em',
                    fontSize: '0.9rem',
                  }}
                >
                  {animeError}
                </div>
              </div>

              <button
                type="submit"
                className="btn"
                style={{ width: '100%' }}
                aria-label="Submit profile"
                title="Submit profile"
              >
                Continue
              </button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}

export default Login;
