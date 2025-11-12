import { useCallback, useMemo, useState } from 'react';
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
 *    - resetScores(): resets scores and clears the current round
 *    - togglePersonality(): toggles ai personality mode if available
 */
export default function useRPSGame() {
  const [scores, setScores] = useState({ player: 0, computer: 0, draw: 0 });
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [outcome, setOutcome] = useState(null);
  const [outcomeText, setOutcomeText] = useState('');

  // Personality flag check and toggle state
  const hasAiPersonality = isFeatureEnabled('aiPersonality');
  const [personalityEnabled, setPersonalityEnabled] = useState(hasAiPersonality);

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
