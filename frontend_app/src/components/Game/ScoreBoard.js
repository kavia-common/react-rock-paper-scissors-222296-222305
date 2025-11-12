import React from 'react';
import PropTypes from 'prop-types';

/**
 * PUBLIC_INTERFACE
 * ScoreBoard - Displays Player, Computer, and Draw scores.
 * Props:
 * - player: number
 * - computer: number
 * - draw: number
 */
function ScoreBoard({ player, computer, draw }) {
  const item = (label, value) => (
    <div
      style={{
        flex: 1,
        minWidth: 120,
        border: '1px solid rgba(0,0,0,0.06)',
        borderRadius: '10px',
        padding: '0.75rem 1rem',
        background: 'var(--color-surface)',
        textAlign: 'center',
        boxShadow: 'var(--shadow-sm)',
      }}
      aria-label={`${label} score ${value}`}
    >
      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{label}</div>
      <div
        className="score-flash animate-pulse-once"
        style={{ fontWeight: 800, fontSize: '1.25rem' }}
      >
        {value}
      </div>
    </div>
  );

  return (
    <div
      role="group"
      aria-label="Score board"
      style={{
        display: 'flex',
        gap: 'var(--space-3)',
        flexWrap: 'wrap',
      }}
    >
      {item('Player', player)}
      {item('Computer', computer)}
      {item('Draw', draw)}
    </div>
  );
}

ScoreBoard.propTypes = {
  player: PropTypes.number.isRequired,
  computer: PropTypes.number.isRequired,
  draw: PropTypes.number.isRequired,
};

export default ScoreBoard;
