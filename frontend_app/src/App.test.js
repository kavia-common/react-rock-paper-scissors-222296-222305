import { render, screen, within, fireEvent } from '@testing-library/react';
import App from './App';

/**
 * Smoke tests:
 * 1) App title renders.
 * 2) Three choice buttons exist (Rock, Paper, Scissors).
 * 3) Clicking a choice produces a result area update.
 * 
 * Notes:
 * - Keep assertions resilient to randomness by checking for
 *   stable UI labels/roles rather than specific randomized text.
 */

test('renders app title', () => {
  render(<App />);
  const title = screen.getByText(/Rock Paper Scissors/i);
  expect(title).toBeInTheDocument();
});

test('renders three choice buttons', () => {
  render(<App />);
  // The ChoiceGrid is a role="group" with an accessible label
  const group = screen.getByRole('group', { name: /Choose Rock, Paper, or Scissors/i });
  expect(group).toBeInTheDocument();

  // Find the three buttons by their accessible names
  const rockBtn = within(group).getByRole('button', { name: /Choose Rock/i });
  const paperBtn = within(group).getByRole('button', { name: /Choose Paper/i });
  const scissorsBtn = within(group).getByRole('button', { name: /Choose Scissors/i });

  expect(rockBtn).toBeInTheDocument();
  expect(paperBtn).toBeInTheDocument();
  expect(scissorsBtn).toBeInTheDocument();
});

test('clicking a choice shows a result message and choices are reflected', () => {
  render(<App />);

  // ResultPanel has role="status" and includes the outcome text area.
  const status = screen.getByRole('status');
  expect(status).toBeInTheDocument();

  // Initially, the default prompt should be visible
  expect(status).toHaveTextContent(/Make a selection to play a round\./i);

  // Click a specific choice to avoid relying on randomness of user selection
  const group = screen.getByRole('group', { name: /Choose Rock, Paper, or Scissors/i });
  const rockBtn = within(group).getByRole('button', { name: /Choose Rock/i });
  fireEvent.click(rockBtn);

  // After a click, the status should update to some result string
  // We don't assert exact text due to randomness, just that the default prompt changes.
  expect(status).not.toHaveTextContent(/Make a selection to play a round\./i);

  // Also verify that the player's choice label is reflected somewhere in the status region.
  // The component shows "Player chose" and "Computer chose" panels.
  expect(status).toHaveTextContent(/Player chose/i);
  expect(status).toHaveTextContent(/Computer chose/i);
});
