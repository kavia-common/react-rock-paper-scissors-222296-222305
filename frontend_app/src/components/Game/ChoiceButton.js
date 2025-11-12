import React from 'react';
import PropTypes from 'prop-types';

/**
 * PUBLIC_INTERFACE
 * ChoiceButton - A reusable, accessible button representing a choice (Rock/Paper/Scissors).
 * Props:
 * - label: visual text label for the button
 * - value: machine-readable value (e.g., 'rock', 'paper', 'scissors')
 * - icon: optional icon string or element
 * - onSelect: callback(value) invoked when selected
 * - disabled: disables interaction
 */
function ChoiceButton({ label, value, icon, onSelect, disabled }) {
  const handleClick = () => {
    if (!disabled && onSelect) onSelect(value);
  };

  const handleKeyDown = (e) => {
    // Activate on Enter or Space for accessibility
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect && onSelect(value);
    }
  };

  return (
    <button
      type="button"
      className="btn btn--outline"
      aria-label={`Choose ${label}`}
      title={`Choose ${label}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
    >
      <span aria-hidden="true" style={{ marginRight: icon ? 8 : 0 }}>
        {icon}
      </span>
      {label}
    </button>
  );
}

ChoiceButton.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  icon: PropTypes.node,
  onSelect: PropTypes.func,
  disabled: PropTypes.bool,
};

ChoiceButton.defaultProps = {
  icon: null,
  onSelect: undefined,
  disabled: false,
};

export default ChoiceButton;
