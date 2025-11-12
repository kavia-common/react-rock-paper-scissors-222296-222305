import React from 'react';
import PropTypes from 'prop-types';
import { getPersonalityMessage } from '../../utils/personality';

/**
 * PUBLIC_INTERFACE
 * ResultPanel - Displays player and computer choices and a placeholder outcome line.
 * Props:
 * - playerChoice: string|null
 * - computerChoice: string|null
 * - outcomeText: string (placeholder for win/lose/draw text)
 * - outcome: 'win'|'lose'|'draw'|null (for personality messaging)
 * - aiPersonalityOn: boolean (show personality line when true)
 */
function ResultPanel({ playerChoice, computerChoice, outcomeText, outcome, aiPersonalityOn }) {
  const pretty = (val) => {
    if (!val) return '—';
    const map = { rock: 'Rock 🪨', paper: 'Paper 📄', scissors: 'Scissors ✂️' };
    return map[val] || val;
  };

  const personalityLine =
    aiPersonalityOn
      ? getPersonalityMessage({ outcome, playerChoice, computerChoice })
      : '';

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
      {aiPersonalityOn && (
        <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
          {personalityLine}
        </p>
      )}
    </section>
  );
}

ResultPanel.propTypes = {
  playerChoice: PropTypes.string,
  computerChoice: PropTypes.string,
  outcomeText: PropTypes.string,
  outcome: PropTypes.oneOf(['win', 'lose', 'draw', null]),
  aiPersonalityOn: PropTypes.bool,
};

ResultPanel.defaultProps = {
  playerChoice: null,
  computerChoice: null,
  outcomeText: '',
  outcome: null,
  aiPersonalityOn: false,
};

export default ResultPanel;
