import React from 'react';
import PropTypes from 'prop-types';

/**
 * PUBLIC_INTERFACE
 * ControlsBar - Shows Play Again (hidden/disabled until a round is played) and Reset Score.
 * Optionally renders an AI Personality toggle when available.
 * Props:
 * - canPlayAgain: boolean (whether to show/enable Play Again)
 * - onPlayAgain: function
 * - onReset: function
 * - hasAiPersonality: boolean (shows toggle when true)
 * - personalityEnabled: boolean (current toggle state)
 * - onTogglePersonality: function (toggle handler)
 */
function ControlsBar({
  canPlayAgain,
  onPlayAgain,
  onReset,
  hasAiPersonality,
  personalityEnabled,
  onTogglePersonality,
}) {
  return (
    <div
      role="group"
      aria-label="Game controls"
      style={{
        display: 'flex',
        gap: 'var(--space-3)',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
        {hasAiPersonality && (
          <button
            type="button"
            className="btn btn--outline"
            aria-pressed={!!personalityEnabled}
            onClick={onTogglePersonality}
            title="Toggle AI Personality"
            style={{ minHeight: 44 }}
          >
            {personalityEnabled ? 'AI Personality: On 🤖' : 'AI Personality: Off'}
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        {canPlayAgain ? (
          <button
            type="button"
            className="btn"
            onClick={onPlayAgain}
            aria-label="Play again"
            title="Play again"
            style={{ minHeight: 44 }}
          >
            Play Again
          </button>
        ) : (
          <button
            type="button"
            className="btn"
            aria-label="Play again (disabled until you play)"
            title="Play again (disabled until you play)"
            disabled
            style={{ opacity: 0.6, minHeight: 44 }}
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
          style={{ minHeight: 44 }}
        >
          Reset Score
        </button>
      </div>
    </div>
  );
}

ControlsBar.propTypes = {
  canPlayAgain: PropTypes.bool,
  onPlayAgain: PropTypes.func,
  onReset: PropTypes.func,
  hasAiPersonality: PropTypes.bool,
  personalityEnabled: PropTypes.bool,
  onTogglePersonality: PropTypes.func,
};

ControlsBar.defaultProps = {
  canPlayAgain: false,
  onPlayAgain: undefined,
  onReset: undefined,
  hasAiPersonality: false,
  personalityEnabled: false,
  onTogglePersonality: undefined,
};

export default ControlsBar;
