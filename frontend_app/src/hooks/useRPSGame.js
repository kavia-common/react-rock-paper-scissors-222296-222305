import { useCallback, useEffect, useMemo, useState } from 'react';
import { getRandomComputerChoice, determineResult } from '../utils/rps';
import { isFeatureEnabled } from '../utils/personality';
import { createLogger } from '../utils/logger';

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
  const log = createLogger('rps:game');

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
    if (!raw) {
      log.info('No persisted scores found, initializing to zeros');
      return { player: 0, computer: 0, draw: 0 };
    }
    try {
      const parsed = JSON.parse(raw);
      // Backward compatibility: ensure numeric values with defaults
      const p = Number.isFinite(parsed?.player) ? Number(parsed.player) : 0;
      const c = Number.isFinite(parsed?.computer) ? Number(parsed.computer) : 0;
      const d = Number.isFinite(parsed?.draw) ? Number(parsed.draw) : 0;
      const initial = { player: p, computer: c, draw: d };
      log.info('Loaded persisted scores', initial);
      return initial;
    } catch (e) {
      log.error('Failed to parse persisted scores, resetting to zeros', e);
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
  useEffect(() => {
    if (hasAiPersonality) {
      log.info('AI Personality feature enabled via flags');
    } else {
      log.debug('AI Personality feature not enabled');
    }
  }, [hasAiPersonality, log]);

  // Persist scores when they change
  useEffect(() => {
    // Only persist valid numeric scores
    const payload = {
      player: Number.isFinite(scores.player) ? scores.player : 0,
      computer: Number.isFinite(scores.computer) ? scores.computer : 0,
      draw: Number.isFinite(scores.draw) ? scores.draw : 0,
    };
    safeStorage.set(JSON.stringify(payload));
    log.debug('Persisted scores', payload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scores.player, scores.computer, scores.draw]);

  const selectChoice = useCallback((choice) => {
    log.info('Player selected choice', choice);
    const computer = getRandomComputerChoice();
    log.debug('Computer RNG choice', computer);
    const { outcome: result, text } = determineResult(choice, computer);
    log.info('Round decided', { player: choice, computer, outcome: result, text });

    setPlayerChoice(choice);
    setComputerChoice(computer);
    setOutcome(result);
    setOutcomeText(text);

    setScores((prev) => {
      if (result === 'win') {
        const updated = { ...prev, player: prev.player + 1 };
        log.debug('Score update (player win)', updated);
        return updated;
      }
      if (result === 'lose') {
        const updated = { ...prev, computer: prev.computer + 1 };
        log.debug('Score update (computer win)', updated);
        return updated;
      }
      const updated = { ...prev, draw: prev.draw + 1 };
      log.debug('Score update (draw)', updated);
      return updated;
    });
  }, [log]);

  const playAgain = useCallback(() => {
    log.info('Play again clicked - clearing current round');
    setPlayerChoice(null);
    setComputerChoice(null);
    setOutcome(null);
    setOutcomeText('');
  }, [log]);

  const resetScores = useCallback(() => {
    log.error('Reset score requested - clearing scores and current round');
    setScores({ player: 0, computer: 0, draw: 0 });
    setPlayerChoice(null);
    setComputerChoice(null);
    setOutcome(null);
    setOutcomeText('');
    // Clear persisted scores
    safeStorage.remove();
    log.debug('Cleared persisted scores');
  }, [log]);

  const togglePersonality = useCallback(() => {
    if (!hasAiPersonality) {
      log.debug('Attempted to toggle personality while feature disabled - ignored');
      return;
    }
    setPersonalityEnabled((prev) => {
      const next = !prev;
      log.info('AI Personality toggled', { next });
      return next;
    });
  }, [hasAiPersonality, log]);

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
