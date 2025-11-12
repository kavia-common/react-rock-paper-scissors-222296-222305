import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import './index.css';
import Header from './components/Layout/Header';
import Card from './components/Layout/Card';

/**
 * PUBLIC_INTERFACE
 * App entry: sets up theme and renders the centered layout scaffolding.
 * Currently shows a placeholder in the card; future steps will add game UI.
 */
function App() {
  const [theme, setTheme] = useState('light');

  // Apply theme to the root element for CSS variable switching
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const themeLabel = useMemo(
    () => (theme === 'light' ? 'Dark' : 'Light'),
    [theme]
  );

  return (
    <div className="App">
      <Header
        title="Rock Paper Scissors"
        actions={
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
        }
      />
      <main className="App__main container-center">
        <Card>
          <div className="rps-card__header">
            <h2 className="rps-card__title">Welcome</h2>
            <p className="rps-card__subtitle">Ocean Professional theme scaffold</p>
          </div>
          <div className="placeholder" aria-live="polite">
            <div className="row">
              <span className="chip">Primary</span>
              <span className="chip" style={{ background: 'rgba(245,158,11,0.12)', color: 'var(--color-secondary)', borderColor: 'rgba(245,158,11,0.25)', borderStyle: 'solid', borderWidth: 1 }}>
                Secondary
              </span>
              <span className="chip" style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--color-error)', borderColor: 'rgba(239,68,68,0.25)', borderStyle: 'solid', borderWidth: 1 }}>
                Error
              </span>
            </div>
            <p className="note">
              This is the initial layout. The game UI and logic will be added in the next steps.
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}

export default App;
