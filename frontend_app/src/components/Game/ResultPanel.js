import React from 'react';
import PropTypes from 'prop-types';

/**
 * PUBLIC_INTERFACE
 * ResultPanel - Displays player and computer choices and a placeholder outcome line.
 * Props:
 * - playerChoice: string|null
 * - computerChoice: string|null
 * - outcomeText: string (placeholder for win/lose/draw text)
 */
function ResultPanel({ playerChoice, computerChoice, outcomeText }) {
  const pretty = (val) => {
    if (!val) return '—';
    const map = { rock: 'Rock 🪨', paper: 'Paper 📄', scissors: 'Scissors ✂️' };
    return map[val] || val;
  };

  return (
    <section
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="result-panel animate-fade-in-up"
      style={{
        display: 'grid',
        gap: 'var(--space-3)',
      }}
    >
      <h2 className="visually-hidden">Round Results</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <div aria-label={`Player choice ${pretty(playerChoice)}`}>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Player chose</div>
          <div style={{ fontWeight: 700 }}>{pretty(playerChoice)}</div>
        </div>
        <div aria-label={`Computer choice ${pretty(computerChoice)}`}>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Computer chose</div>
          <div style={{ fontWeight: 700 }}>{pretty(computerChoice)}</div>
        </div>
      </div>
      <p style={{ fontWeight: 700, margin: 0 }}>
        {outcomeText || 'Make a selection to play a round.'}
      </p>
    </section>
  );
}

ResultPanel.propTypes = {
  playerChoice: PropTypes.string,
  computerChoice: PropTypes.string,
  outcomeText: PropTypes.string,
};

ResultPanel.defaultProps = {
  playerChoice: null,
  computerChoice: null,
  outcomeText: '',
};

export default ResultPanel;
