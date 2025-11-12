import React from 'react';
import PropTypes from 'prop-types';

/**
 * PUBLIC_INTERFACE
 * ControlsBar - Shows Play Again (hidden/disabled until a round is played) and Reset Score.
 * Props:
 * - canPlayAgain: boolean (whether to show/enable Play Again)
 * - onPlayAgain: function
 * - onReset: function
 */
function ControlsBar({ canPlayAgain, onPlayAgain, onReset }) {
  return (
    <div
      role="group"
      aria-label="Game controls"
      style={{
        display: 'flex',
        gap: 'var(--space-3)',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
      }}
    >
      {canPlayAgain && (
        <button
          type="button"
          className="btn"
          onClick={onPlayAgain}
          aria-label="Play again"
          title="Play again"
        >
          Play Again
        </button>
      )}
      {!canPlayAgain && (
        <button
          type="button"
          className="btn"
          aria-label="Play again (disabled until you play)"
          title="Play again (disabled until you play)"
          disabled
          style={{ opacity: 0.6 }}
        >
          Play Again
        </button>
      )}
      <button
        type="button"
        className="btn btn--warning"
        onClick={onReset}
        aria-label="Reset score"
        title="Reset score"
      >
        Reset Score
      </button>
    </div>
  );
}

ControlsBar.propTypes = {
  canPlayAgain: PropTypes.bool,
  onPlayAgain: PropTypes.func,
  onReset: PropTypes.func,
};

ControlsBar.defaultProps = {
  canPlayAgain: false,
  onPlayAgain: undefined,
  onReset: undefined,
};

export default ControlsBar;
