import React, { useState, useEffect, useMemo } from 'react';
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

/**
 * PUBLIC_INTERFACE
 * App entry: sets up theme and renders the centered layout scaffolding.
 * Wires game components to the useRPSGame hook for gameplay and state.
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

  // Use game hook
  const {
    scores,
    currentRound,
    actions: { selectChoice, playAgain, resetScores },
  } = useRPSGame();

  const canPlayAgain = Boolean(currentRound.playerChoice || currentRound.computerChoice);

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
            <div>
              <h2 className="rps-card__title">Play a Round</h2>
              <p className="rps-card__subtitle">Choose Rock, Paper, or Scissors</p>
            </div>
            <div aria-hidden />
          </div>

          <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
            <ChoiceGrid onSelect={selectChoice} disabled={false} />

            <ResultPanel
              playerChoice={currentRound.playerChoice}
              computerChoice={currentRound.computerChoice}
              outcomeText={currentRound.text}
            />

            <ScoreBoard
              player={scores.player}
              computer={scores.computer}
              draw={scores.draw}
            />

            <ControlsBar
              canPlayAgain={canPlayAgain}
              onPlayAgain={playAgain}
              onReset={resetScores}
            />
          </div>
        </Card>
      </main>
    </div>
  );
}

export default App;
