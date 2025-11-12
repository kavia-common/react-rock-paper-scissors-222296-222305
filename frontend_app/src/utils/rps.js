//
// Rock-Paper-Scissors core utilities
//

// PUBLIC_INTERFACE
export const CHOICES = ['rock', 'paper', 'scissors'];

/**
 * Rule matrix expressing which choice defeats which.
 * rock beats scissors, paper beats rock, scissors beats paper.
 */
const RULES = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper',
};

// PUBLIC_INTERFACE
export function getRandomComputerChoice() {
  /** Returns a random choice for the computer from CHOICES. */
  const idx = Math.floor(Math.random() * CHOICES.length);
  return CHOICES[idx];
}

// PUBLIC_INTERFACE
export function determineResult(player, computer) {
  /**
   * Determine outcome given player and computer choices.
   * Returns an object with:
   * - outcome: 'win' | 'lose' | 'draw'
   * - text: human-readable result sentence
   */
  if (!player || !computer) {
    return { outcome: 'draw', text: 'Make a selection to play a round.' };
  }
  if (player === computer) {
    return { outcome: 'draw', text: `It's a draw! You both chose ${pretty(player)}.` };
  }
  const playerBeats = RULES[player];
  if (playerBeats === computer) {
    return {
      outcome: 'win',
      text: `You win! ${capitalize(player)} beats ${pretty(computer)}.`,
    };
  }
  return {
    outcome: 'lose',
    text: `You lose! ${capitalize(computer)} beats ${pretty(player)}.`,
  };
}

// Helpers
function capitalize(s) {
  return String(s).charAt(0).toUpperCase() + String(s).slice(1);
}

function pretty(val) {
  const map = { rock: 'Rock 🪨', paper: 'Paper 📄', scissors: 'Scissors ✂️' };
  return map[val] || val;
}
