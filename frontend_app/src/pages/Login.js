import React, { useState, useMemo } from 'react';
import Card from '../components/Layout/Card';
import Header from '../components/Layout/Header';
import { login as authLogin, saveUserProfile } from '../utils/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import aiBlue from '../assets/anime/ai-bot-blue.png';
import aiGold from '../assets/anime/ai-bot-gold.png';
import aiRed from '../assets/anime/ai-bot-red.png';
import placeholderImg from '../assets/anime/placeholder.png';

/**
 * PUBLIC_INTERFACE
 * Login - A centered, themed login page that collects a display name and an AI avatar selection.
 * Presents AI-themed avatars as selectable image cards with full keyboard accessibility.
 * On submit, persists { id, name, imageUrl } to client-side auth storage via saveUserProfile for downstream use.
 */
function Login() {
  const [theme, setTheme] = useState('light');
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null); // { id, name, imageUrl }
  const [touched, setTouched] = useState({ name: false, avatar: false });
  const [submitted, setSubmitted] = useState(false);
  const [announce, setAnnounce] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    const next = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
  };

  // Grid options with images (AI avatars)
  const avatarOptions = useMemo(
    () => [
      { id: 'ai-blue', name: 'AI Bot - Blue', imageUrl: aiBlue || placeholderImg },
      { id: 'ai-gold', name: 'AI Bot - Gold', imageUrl: aiGold || placeholderImg },
      { id: 'ai-red', name: 'AI Bot - Red', imageUrl: aiRed || placeholderImg },
    ],
    []
  );

  // Validation
  const nameError =
    touched.name || submitted ? (!name.trim() ? 'Please enter your name.' : '') : '';
  const avatarError =
    touched.avatar || submitted ? (!selectedAvatar ? 'Please select an AI avatar.' : '') : '';
  const hasErrors = Boolean(nameError || avatarError);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (hasErrors) {
      if (nameError) {
        const el = document.getElementById('name');
        if (el) el.focus();
      } else if (avatarError) {
        const el = document.getElementById('avatar-grid');
        if (el) el.focus();
      }
      return;
    }
    // Persist profile and set auth flag using new structure
    // saveUserProfile historically stored { name, anime, animeImageUrl }.
    // We now store: { id, name, imageUrl } while maintaining keys used by the rest of the app.
    saveUserProfile({
      name: name.trim(),
      anime: selectedAvatar?.id || '', // kept for backward compatibility in storage
      animeImageUrl: selectedAvatar?.imageUrl || '', // kept for header image until header is fully migrated
      id: selectedAvatar?.id || '',
      imageUrl: selectedAvatar?.imageUrl || '',
    });
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

  // Keyboard handlers for cards
  const handleCardKeyDown = (e, opt) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedAvatar(opt);
      setTouched((t) => ({ ...t, avatar: true }));
      setAnnounce(`${opt.name} selected`);
    }
  };

  return (
    <div className="App">
      <Header title="Login" actions={headerActions} />
      <main className="App__main container-center">
        <Card className="animate-pop">
          <div className="rps-card__header">
            <div>
              <h2 className="rps-card__title" id="login-title">Welcome</h2>
              <p className="rps-card__subtitle" id="login-desc">
                Enter your name and choose an AI avatar to continue
              </p>
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

              <fieldset
                id="avatar-grid"
                aria-label="AI Avatar"
                style={{ border: 'none', padding: 0, margin: 0 }}
              >
                <legend style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
                  AI Avatar
                </legend>
                <div
                  role="listbox"
                  aria-label="AI avatar choices"
                  aria-describedby={avatarError ? 'avatar-error' : undefined}
                  tabIndex={0}
                  onFocus={() => setTouched((t) => ({ ...t, avatar: true }))}
                  className="anime-grid"
                >
                  {avatarOptions.map((opt, index) => {
                    const selected = selectedAvatar?.id === opt.id;
                    return (
                      <div
                        key={opt.id}
                        role="option"
                        aria-selected={selected ? 'true' : 'false'}
                        aria-label={`${opt.name}${selected ? ' (selected)' : ''}`}
                        data-selected={selected ? 'true' : 'false'}
                        tabIndex={index === 0 ? 0 : -1}
                        onKeyDown={(e) => handleCardKeyDown(e, opt)}
                        onClick={() => {
                          setSelectedAvatar(opt);
                          setTouched((t) => ({ ...t, avatar: true }));
                          setAnnounce(`${opt.name} selected`);
                        }}
                        title={opt.name}
                        className="anime-card"
                      >
                        <div className="anime-card__media" aria-hidden="true">
                          <img
                            src={opt.imageUrl || placeholderImg}
                            alt={opt.name}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <div
                          className="anime-card__label"
                          aria-hidden="true"
                          title={opt.name}
                        >
                          {opt.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div
                  id="avatar-error"
                  role="alert"
                  aria-live="polite"
                  style={{
                    marginTop: 6,
                    color: 'var(--color-error)',
                    minHeight: '1em',
                    fontSize: '0.9rem',
                  }}
                >
                  {avatarError}
                </div>
              </fieldset>

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
