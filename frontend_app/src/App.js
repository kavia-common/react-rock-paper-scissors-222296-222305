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

/**
 * PUBLIC_INTERFACE
 * App entry: sets up theme and renders the centered layout scaffolding.
 * Currently wires core game components with stub props; game logic arrives in Step 3.
 */
function App() {
  const [theme, setTheme] = useState('light');

  // temporary local stub state for preview; will be replaced in Step 3
  const [stubPlayerChoice, setStubPlayerChoice] = useState(null);
  const [stubComputerChoice, setStubComputerChoice] = useState(null);
  const [stubOutcome, setStubOutcome] = useState('');
  const [stubScores, setStubScores] = useState({ player: 0, computer: 0, draw: 0 });

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

  // placeholder handlers to prove wiring; will be replaced by real logic
  const handleSelect = (choice) => {
    setStubPlayerChoice(choice);
    // simple fake computer choice rotation for preview
    const order = ['rock', 'paper', 'scissors'];
    const idx = order.indexOf(choice);
    const comp = order[(idx + 1) % order.length];
    setStubComputerChoice(comp);
    setStubOutcome(`You picked ${choice}. Computer picked ${comp}. (Outcome TBD)`);
  };

  const handlePlayAgain = () => {
    setStubPlayerChoice(null);
    setStubComputerChoice(null);
    setStubOutcome('');
  };

  const handleReset = () => {
    setStubScores({ player: 0, computer: 0, draw: 0 });
    handlePlayAgain();
  };

  const canPlayAgain = Boolean(stubPlayerChoice || stubComputerChoice);

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
            <ChoiceGrid onSelect={handleSelect} disabled={false} />

            <ResultPanel
              playerChoice={stubPlayerChoice}
              computerChoice={stubComputerChoice}
              outcomeText={stubOutcome}
            />

            <ScoreBoard
              player={stubScores.player}
              computer={stubScores.computer}
              draw={stubScores.draw}
            />

            <ControlsBar
              canPlayAgain={canPlayAgain}
              onPlayAgain={handlePlayAgain}
              onReset={handleReset}
            />
          </div>
        </Card>
      </main>
    </div>
  );
}

export default App;
