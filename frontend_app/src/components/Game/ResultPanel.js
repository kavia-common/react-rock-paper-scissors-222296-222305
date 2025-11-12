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
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'grid',
        gap: 'var(--space-3)',
        border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4)',
        background: 'rgba(0,0,0,0.02)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Player chose</div>
          <div style={{ fontWeight: 700 }}>{pretty(playerChoice)}</div>
        </div>
        <div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Computer chose</div>
          <div style={{ fontWeight: 700 }}>{pretty(computerChoice)}</div>
        </div>
      </div>
      <div style={{ fontWeight: 700 }}>
        {outcomeText || 'Make a selection to play a round.'}
      </div>
    </div>
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
