import React from 'react';
import PropTypes from 'prop-types';
import ChoiceButton from './ChoiceButton';

/**
 * PUBLIC_INTERFACE
 * ChoiceGrid - Displays the three choices and emits onSelect(choiceValue).
 * Props:
 * - onSelect: function(choice: 'rock'|'paper'|'scissors')
 * - disabled: when true, disables all choice buttons (e.g., during animation)
 */
function ChoiceGrid({ onSelect, disabled }) {
  const choices = [
    { label: 'Rock', value: 'rock', icon: '🪨' },
    { label: 'Paper', value: 'paper', icon: '📄' },
    { label: 'Scissors', value: 'scissors', icon: '✂️' },
  ];

  return (
    <div
      role="group"
      aria-label="Choose Rock, Paper, or Scissors"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: 'var(--space-3)',
      }}
    >
      {choices.map((c) => (
        <ChoiceButton
          key={c.value}
          label={c.label}
          value={c.value}
          icon={c.icon}
          onSelect={onSelect}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

ChoiceGrid.propTypes = {
  onSelect: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

ChoiceGrid.defaultProps = {
  disabled: false,
};

export default ChoiceGrid;
