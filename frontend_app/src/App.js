import React, { useState, useEffect, useMemo, useState as useReactState } from 'react';
import './App.css';
import './index.css';
import Header from './components/Layout/Header';
import Card from './components/Layout/Card';

// Step 2 components
import ChoiceGrid from './components/Game/ChoiceGrid';
import ResultPanel from './components/Game/ResultPanel';
import ScoreBoard from './components/Game/ScoreBoard';
import ControlsBar from './components/Game/ControlsBar';

// Step 3: game hook
import useRPSGame from './hooks/useRPSGame';
import { isAuthenticated, logout, subscribeAuth, getUserProfile } from './utils/auth';

/**
 * PUBLIC_INTERFACE
 * App entry: sets up theme and renders the centered layout scaffolding.
 * Wires game components to the useRPSGame hook for gameplay and state.
 */
function App() {
  const [theme, setTheme] = useState('light');
  const [authed, setAuthed] = useReactState(isAuthenticated());
  const [authAnnounce, setAuthAnnounce] = useReactState('');
  const [profile, setProfile] = useReactState(getUserProfile());

  // Apply theme to the root element for CSS variable switching
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Keep auth state in sync across tabs
  useEffect(() => {
    const unsubscribe = subscribeAuth((val) => {
      setAuthed(val);
      setAuthAnnounce(val ? 'Logged in' : 'Logged out');
      setProfile(getUserProfile());
    });
    return unsubscribe;
  }, []);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const themeLabel = useMemo(
    () => (theme === 'light' ? 'Dark' : 'Light'),
    [theme]
  );

  // Use game hook
  const {
    scores,
    currentRound,
    featureFlags,
    personalityEnabled,
    actions: { selectChoice, playAgain, resetScores, togglePersonality },
  } = useRPSGame();

  const canPlayAgain = Boolean(currentRound.playerChoice || currentRound.computerChoice);

  const headerActions = (
    <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
      {authed && profile?.name && (
        <span
          aria-label={`Logged in as ${profile.name}`}
          title={`Logged in as ${profile.name}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--color-text-muted)', fontWeight: 600 }}
        >
          {(() => {
            // Prefer new imageUrl; fallback to legacy animeImageUrl for compatibility
            const imgUrl = profile?.imageUrl || profile?.animeImageUrl;
            return imgUrl ? (
              <img
                src={imgUrl}
                alt="Profile avatar"
                width="28"
                height="28"
                style={{ width: 28, height: 28, objectFit: 'cover', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.1)' }}
              />
            ) : null;
          })()}
          <span>{profile.name}</span>
        </span>
      )}
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${themeLabel} mode`}
        title={`Switch to ${themeLabel} mode`}
      >
        <span className="theme-toggle__icon" aria-hidden>
          {theme === 'light' ? '🌙' : '☀️'}
        </span>
        {themeLabel} Mode
      </button>
      {authed ? (
        <a
          href="/login"
          className="btn btn--outline"
          aria-label="Logout"
          title="Logout"
          onClick={(e) => {
            e.preventDefault();
            logout();
            setAuthed(false);
            setAuthAnnounce('Logged out');
            // Navigate by assigning href to avoid requiring hooks in Header
            window.location.assign('/login');
          }}
          style={{ minHeight: 44 }}
        >
          Logout
        </a>
      ) : (
        <a
          href="/login"
          className="btn btn--outline"
          aria-label="Go to Login"
          title="Go to Login"
          style={{ minHeight: 44 }}
        >
          Login
        </a>
      )}
    </div>
  );

  return (
    <div className="App">
      <Header
        title="Rock Paper Scissors"
        actions={headerActions}
      />
      <main className="App__main container-center">
        <Card>
          <div className="rps-card__header">
            <div>
              <h2 className="rps-card__title" id="play-round-title">Play a Round</h2>
              <p className="rps-card__subtitle" id="play-round-desc">Choose Rock, Paper, or Scissors</p>
            </div>
            <div aria-hidden />
          </div>

          <div aria-live="polite" aria-atomic="true" className="visually-hidden">
            {authAnnounce}
          </div>

          <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
            <ChoiceGrid onSelect={selectChoice} disabled={!authed} />

            <ResultPanel
              playerChoice={authed ? currentRound.playerChoice : null}
              computerChoice={authed ? currentRound.computerChoice : null}
              outcomeText={authed ? currentRound.text : 'Please log in to play.'}
              outcome={authed ? currentRound.outcome : null}
              aiPersonalityOn={authed && featureFlags?.hasAiPersonality && personalityEnabled}
            />

            <ScoreBoard
              player={authed ? scores.player : 0}
              computer={authed ? scores.computer : 0}
              draw={authed ? scores.draw : 0}
            />

            <ControlsBar
              canPlayAgain={authed && canPlayAgain}
              onPlayAgain={authed ? playAgain : undefined}
              onReset={authed ? resetScores : undefined}
              hasAiPersonality={authed && featureFlags?.hasAiPersonality}
              personalityEnabled={authed && personalityEnabled}
              onTogglePersonality={authed ? togglePersonality : undefined}
            />
          </div>
        </Card>
      </main>
    </div>
  );
}

export default App;
