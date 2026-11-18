export type WordleTileStatus = 'correct' | 'present' | 'absent';

export interface WordleEvaluation {
    valid: boolean;
    statuses: WordleTileStatus[];
    pointsByLetter: number[];
    pointsEarned: number;
    updatedGreenIndices: number[];
    updatedDiscoveredLetters: string[];
    solved: boolean;
}

/**
 * Evaluates a complete-word guess using Wordle-style duplicate-letter handling.
 * Yellow points are awarded once per distinct letter for the whole puzzle.
 * Green points are awarded once per exact answer position for the whole puzzle.
 */
export function evaluateWordleGuess(
    guessRaw: string,
    targetRaw: string,
    prevGreenIndices: number[],
    prevDiscoveredLetters: string[],
    config: { wordleNewGreenPoints: number; wordleNewYellowPoints: number }
): WordleEvaluation {
    const guess = guessRaw.toUpperCase().trim();
    const target = targetRaw.toUpperCase().trim();
    const invalid: WordleEvaluation = {
        valid: false,
        statuses: [],
        pointsByLetter: [],
        pointsEarned: 0,
        updatedGreenIndices: prevGreenIndices,
        updatedDiscoveredLetters: prevDiscoveredLetters,
        solved: false,
    };

    if (!/^[A-Z]+$/.test(guess) || !/^[A-Z]+$/.test(target)) return invalid;

    const statuses: WordleTileStatus[] = Array(guess.length).fill('absent');
    const remaining = new Map<string, number>();
    const greenIndices = new Set(prevGreenIndices);
    const discoveredLetters = new Set(prevDiscoveredLetters);

    // Mark greens first, then count only unmatched answer letters for yellows.
    for (let i = 0; i < target.length; i += 1) {
        if (guess[i] === target[i]) {
            statuses[i] = 'correct';
        } else {
            remaining.set(target[i], (remaining.get(target[i]) ?? 0) + 1);
        }
    }

    for (let i = 0; i < guess.length; i += 1) {
        if (statuses[i] === 'correct') continue;
        const count = remaining.get(guess[i]) ?? 0;
        if (count > 0) {
            statuses[i] = 'present';
            remaining.set(guess[i], count - 1);
        }
    }

    const pointsByLetter = statuses.map(() => 0);
    let pointsEarned = 0;
    for (let i = 0; i < statuses.length; i += 1) {
        const letter = guess[i];
        if (statuses[i] === 'correct') {
            if (!greenIndices.has(i)) {
                pointsByLetter[i] = config.wordleNewGreenPoints;
                pointsEarned += config.wordleNewGreenPoints;
                greenIndices.add(i);
            }
            discoveredLetters.add(letter);
        } else if (statuses[i] === 'present' && !discoveredLetters.has(letter)) {
            pointsByLetter[i] = config.wordleNewYellowPoints;
            pointsEarned += config.wordleNewYellowPoints;
            discoveredLetters.add(letter);
        }
    }

    return {
        valid: true,
        statuses,
        pointsByLetter,
        pointsEarned,
        updatedGreenIndices: Array.from(greenIndices),
        updatedDiscoveredLetters: Array.from(discoveredLetters),
        solved: guess === target,
    };
}
