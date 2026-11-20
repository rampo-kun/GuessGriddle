export type WordleDifficultyLevel = 'easy' | 'medium' | 'hard';

export function getWordleMaxPoints(difficulty: WordleDifficultyLevel): number {
    switch (difficulty) {
        case 'easy': return 150;
        case 'hard': return 300;
        case 'medium':
        default: return 220;
    }
}

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
 * Evaluate one guess independently using standard Wordle duplicate-letter rules.
 * Scoring is applied by the game store only when this guess solves the puzzle.
 */
export function evaluateWordleGuess(
    guessRaw: string,
    targetRaw: string,
    _prevGreenIndices: number[],
    _prevDiscoveredLetters: string[],
    _config: { wordleNewGreenPoints: number; wordleNewYellowPoints: number }
): WordleEvaluation {
    const guess = guessRaw.toUpperCase().trim();
    const target = targetRaw.toUpperCase().trim();
    const invalid: WordleEvaluation = {
        valid: false,
        statuses: [],
        pointsByLetter: [],
        pointsEarned: 0,
        updatedGreenIndices: [],
        updatedDiscoveredLetters: [],
        solved: false,
    };

    if (!/^[A-Z]+$/.test(guess) || !/^[A-Z]+$/.test(target) || guess.length !== target.length) {
        return invalid;
    }

    const statuses: WordleTileStatus[] = Array(guess.length).fill('absent');
    const remaining = new Map<string, number>();

    // Exact matches consume their answer letters before misplaced letters are checked.
    for (let i = 0; i < target.length; i += 1) {
        if (guess[i] === target[i]) {
            statuses[i] = 'correct';
        } else {
            remaining.set(target[i], (remaining.get(target[i]) ?? 0) + 1);
        }
    }

    // A non-green guess is yellow only while an unmatched copy remains in the answer.
    for (let i = 0; i < guess.length; i += 1) {
        if (statuses[i] === 'correct') continue;
        const count = remaining.get(guess[i]) ?? 0;
        if (count > 0) {
            statuses[i] = 'present';
            remaining.set(guess[i], count - 1);
        }
    }

    const updatedGreenIndices = statuses.reduce<number[]>((indices, status, index) => {
        if (status === 'correct') indices.push(index);
        return indices;
    }, []);
    const updatedDiscoveredLetters = Array.from(new Set(
        guess.split('').filter((_, index) => statuses[index] !== 'absent')
    ));

    return {
        valid: true,
        statuses,
        // The store deliberately awards zero for every non-winning attempt.
        pointsByLetter: statuses.map(() => 0),
        pointsEarned: 0,
        updatedGreenIndices,
        updatedDiscoveredLetters,
        solved: guess === target,
    };
}
