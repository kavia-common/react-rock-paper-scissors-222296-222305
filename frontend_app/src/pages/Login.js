import React, { useState, useMemo } from 'react';
import Card from '../components/Layout/Card';
import Header from '../components/Layout/Header';
import { login as authLogin, saveUserProfile } from '../utils/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import narutoImg from '../assets/anime/naruto.png';
import onePieceImg from '../assets/anime/one-piece.png';
import demonSlayerImg from '../assets/anime/demon-slayer.png';
import aotImg from '../assets/anime/attack-on-titan.png';
import mhaImg from '../assets/anime/my-hero-academia.png';
import placeholderImg from '../assets/anime/placeholder.png';

/**
 * PUBLIC_INTERFACE
 * Login - A centered, themed login page that collects a display name and an anime selection.
 * Now presents anime options as selectable image cards with keyboard accessibility.
 * On submit, persists { isAuthed: true, name, anime, animeImageUrl } to client-side auth storage and routes via existing gating.
 */
function Login() {
  const [theme, setTheme] = useState('light');
  const [name, setName] = useState('');
  const [selectedAnime, setSelectedAnime] = useState(null); // { id, label, img }
  const [touched, setTouched] = useState({ name: false, anime: false });
  const [submitted, setSubmitted] = useState(false);
  const [announce, setAnnounce] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    const next = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
  };

  // Grid options with images
  const animeOptions = useMemo(() => ([
    { id: 'naruto', label: 'Naruto', img: narutoImg || placeholderImg },
    { id: 'one-piece', label: 'One Piece', img: onePieceImg || placeholderImg },
    { id: 'demon-slayer', label: 'Demon Slayer', img: demonSlayerImg || placeholderImg },
    { id: 'attack-on-titan', label: 'Attack on Titan', img: aotImg || placeholderImg },
    { id: 'my-hero-academia', label: 'My Hero Academia', img: mhaImg || placeholderImg },
  ]), []);

  // Validation
  const nameError = (touched.name || submitted) ? (!name.trim() ? 'Please enter your name.' : '') : '';
  const animeError = (touched.anime || submitted) ? (!selectedAnime ? 'Please select your favorite anime.' : '') : '';
  const hasErrors = Boolean(nameError || animeError);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (hasErrors) {
      if (nameError) {
        const el = document.getElementById('name');
        if (el) el.focus();
      } else if (animeError) {
        const el = document.getElementById('anime-grid');
        if (el) el.focus();
      }
      return;
    }
    // Persist profile and set auth flag
    saveUserProfile({
      name: name.trim(),
      anime: selectedAnime?.id || '',
      animeImageUrl: selectedAnime?.img || '',
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
      setSelectedAnime(opt);
      setTouched((t) => ({ ...t, anime: true }));
      setAnnounce(`${opt.label} selected`);
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

              <fieldset
                id="anime-grid"
                aria-label="Favorite Anime"
                style={{ border: 'none', padding: 0, margin: 0 }}
              >
                <legend style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Favorite Anime</legend>
                <div
                  role="listbox"
                  aria-label="Anime choices"
                  aria-describedby={animeError ? 'anime-error' : undefined}
                  tabIndex={0}
                  onFocus={() => setTouched((t) => ({ ...t, anime: true }))}
                  className="anime-grid"
                >
                  {animeOptions.map((opt, index) => {
                    const selected = selectedAnime?.id === opt.id;
                    return (
                      <div
                        key={opt.id}
                        role="option"
                        aria-selected={selected ? 'true' : 'false'}
                        aria-label={`${opt.label}${selected ? ' (selected)' : ''}`}
                        data-selected={selected ? 'true' : 'false'}
                        tabIndex={index === 0 ? 0 : -1}
                        onKeyDown={(e) => handleCardKeyDown(e, opt)}
                        onClick={() => {
                          setSelectedAnime(opt);
                          setTouched((t) => ({ ...t, anime: true }));
                          setAnnounce(`${opt.label} selected`);
                        }}
                        title={opt.label}
                        className="anime-card"
                      >
                        <div className="anime-card__media" aria-hidden="true">
                          <img
                            src={opt.img || placeholderImg}
                            alt={opt.label}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <div
                          className="anime-card__label"
                          aria-hidden="true"
                          title={opt.label}
                        >
                          {opt.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
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
