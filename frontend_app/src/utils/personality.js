//
// AI Personality utilities
//

// PUBLIC_INTERFACE
export function isFeatureEnabled(flagName) {
  /**
   * Checks if a given feature flag is enabled via REACT_APP_FEATURE_FLAGS.
   * Supports JSON array (e.g., '["aiPersonality","exp1"]')
   * or CSV string (e.g., 'aiPersonality,exp1').
   */
  const raw = process.env.REACT_APP_FEATURE_FLAGS;
  if (!raw) return false;

  try {
    // Try JSON parse first if looks like JSON
    const trimmed = String(raw).trim();
    if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map(String).includes(flagName);
      }
      // if object support, consider keys enabled where value truthy
      if (typeof parsed === 'object' && parsed !== null) {
        return Boolean(parsed[flagName]);
      }
    }
  } catch {
    // fall through to CSV parsing
  }

  // Fallback: CSV parse
  const list = String(raw)
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  return list.includes(flagName);
}

// PUBLIC_INTERFACE
export function getPersonalityMessage({ outcome, playerChoice, computerChoice }) {
  /**
   * Returns a playful AI message based on the round outcome and choices.
   * outcome: 'win' | 'lose' | 'draw' | null
   */
  const pretty = (val) => {
    const map = { rock: 'Rock 🪨', paper: 'Paper 📄', scissors: 'Scissors ✂️' };
    return map[val] || val || '—';
  };

  if (!outcome) {
    return "I'm warming up my circuits... make a move when you're ready!";
  }

  if (outcome === 'draw') {
    const quips = [
      "A perfect tie! Great minds think alike.",
      "Draw! I guess we both read the same playbook.",
      "Stalemate. Shall we spice it up?"
    ];
    return quips[Math.floor(Math.random() * quips.length)];
  }

  if (outcome === 'win') {
    const quips = [
      `You got me this time! ${pretty(playerChoice)} outshines ${pretty(computerChoice)}.`,
      "Victory! Your strategy is on point.",
      "Nicely done! I felt that one in my algorithm."
    ];
    return quips[Math.floor(Math.random() * quips.length)];
  }

  // outcome === 'lose'
  const quips = [
    `Ha! ${pretty(computerChoice)} triumphs over ${pretty(playerChoice)}. My training pays off!`,
    "I was built for this. Better luck next round!",
    "My predictive model says... I'm on a roll!"
  ];
  return quips[Math.floor(Math.random() * quips.length)];
}
