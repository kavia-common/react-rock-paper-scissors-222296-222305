import { useCallback, useEffect, useMemo, useState } from 'react';
import { getRandomComputerChoice, determineResult } from '../utils/rps';
import { isFeatureEnabled } from '../utils/personality';

/**
 * PUBLIC_INTERFACE
 * useRPSGame - Manages Rock-Paper-Scissors game state.
 * Exposes:
 * - scores: { player: number, computer: number, draw: number }
 * - currentRound: { playerChoice: string|null, computerChoice: string|null, outcome: 'win'|'lose'|'draw'|null, text: string }
 * - featureFlags: { hasAiPersonality: boolean }
 * - personalityEnabled: boolean (current toggle state, when feature present)
 * - actions:
 *    - selectChoice(choice): plays a round with the given player choice
 *    - playAgain(): clears the current round (keeps scores)
 *    - resetScores(): resets scores and clears the current round (and clears persisted scores)
 *    - togglePersonality(): toggles ai personality mode if available
 *
 * Persistence:
 * - Loads saved scores from localStorage on initialization (if available and valid).
 * - Saves scores to localStorage whenever they change.
 * - Clears persisted scores on reset.
 * - All storage operations are guarded to avoid crashes in environments without localStorage (SSR/tests).
 */
export default function useRPSGame() {
  const STORAGE_KEY = 'rps:scores:v1';

  // Safe storage helpers
  const safeStorage = {
    get() {
      try {
        if (typeof window === 'undefined' || !window.localStorage) return null;
        return window.localStorage.getItem(STORAGE_KEY);
      } catch {
        return null;
      }
    },
    set(value) {
      try {
        if (typeof window === 'undefined' || !window.localStorage) return;
        window.localStorage.setItem(STORAGE_KEY, value);
      } catch {
        // ignore write failures
      }
    },
    remove() {
      try {
        if (typeof window === 'undefined' || !window.localStorage) return;
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore remove failures
      }
    },
  };

  // Initialize scores with persisted value if present and valid
  const [scores, setScores] = useState(() => {
    const raw = safeStorage.get();
    if (!raw) return { player: 0, computer: 0, draw: 0 };
    try {
      const parsed = JSON.parse(raw);
      // Backward compatibility: ensure numeric values with defaults
      const p = Number.isFinite(parsed?.player) ? Number(parsed.player) : 0;
      const c = Number.isFinite(parsed?.computer) ? Number(parsed.computer) : 0;
      const d = Number.isFinite(parsed?.draw) ? Number(parsed.draw) : 0;
      return { player: p, computer: c, draw: d };
    } catch {
      return { player: 0, computer: 0, draw: 0 };
    }
  });

  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [outcome, setOutcome] = useState(null);
  const [outcomeText, setOutcomeText] = useState('');

  // Personality flag check and toggle state
  const hasAiPersonality = isFeatureEnabled('aiPersonality');
  const [personalityEnabled, setPersonalityEnabled] = useState(hasAiPersonality);

  // Persist scores when they change
  useEffect(() => {
    // Only persist valid numeric scores
    const payload = {
      player: Number.isFinite(scores.player) ? scores.player : 0,
      computer: Number.isFinite(scores.computer) ? scores.computer : 0,
      draw: Number.isFinite(scores.draw) ? scores.draw : 0,
    };
    safeStorage.set(JSON.stringify(payload));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scores.player, scores.computer, scores.draw]);

  const selectChoice = useCallback((choice) => {
    const computer = getRandomComputerChoice();
    const { outcome: result, text } = determineResult(choice, computer);

    setPlayerChoice(choice);
    setComputerChoice(computer);
    setOutcome(result);
    setOutcomeText(text);

    setScores((prev) => {
      if (result === 'win') return { ...prev, player: prev.player + 1 };
      if (result === 'lose') return { ...prev, computer: prev.computer + 1 };
      return { ...prev, draw: prev.draw + 1 };
    });
  }, []);

  const playAgain = useCallback(() => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setOutcome(null);
    setOutcomeText('');
  }, []);

  const resetScores = useCallback(() => {
    setScores({ player: 0, computer: 0, draw: 0 });
    setPlayerChoice(null);
    setComputerChoice(null);
    setOutcome(null);
    setOutcomeText('');
    // Clear persisted scores
    safeStorage.remove();
  }, []);

  const togglePersonality = useCallback(() => {
    if (!hasAiPersonality) return;
    setPersonalityEnabled((prev) => !prev);
  }, [hasAiPersonality]);

  const currentRound = useMemo(
    () => ({
      playerChoice,
      computerChoice,
      outcome,
      text: outcomeText,
    }),
    [playerChoice, computerChoice, outcome, outcomeText]
  );

  return {
    scores,
    currentRound,
    featureFlags: { hasAiPersonality },
    personalityEnabled,
    actions: {
      selectChoice,
      playAgain,
      resetScores,
      togglePersonality,
    },
  };
}
