export function evaluateWordleGuess(
    guessRaw: string,
    targetRaw: string,
    prevGreenIndices: number[],
    prevDiscoveredLetters: string[],
    config: {
        wordleExactWordBonus: number;
        wordleNewGreenPoints: number;
        wordleNewYellowPoints: number;
    }
) {
    const guess = guessRaw.toUpperCase().trim();
    const target = targetRaw.toUpperCase().trim();
    const len = target.length;

    const statuses: ('correct' | 'present' | 'absent')[] = Array(len).fill('absent');
    const targetCharCounts: Record<string, number> = {};

    for (const ch of target) {
        targetCharCounts[ch] = (targetCharCounts[ch] || 0) + 1;
    }

    // Pass 1: Greens
    for (let i = 0; i < len; i++) {
        if (guess[i] === target[i]) {
            statuses[i] = 'correct';
            targetCharCounts[guess[i]]--;
        }
    }

    // Pass 2: Yellows
    for (let i = 0; i < len; i++) {
        if (statuses[i] !== 'correct' && targetCharCounts[guess[i]] > 0) {
            statuses[i] = 'present';
            targetCharCounts[guess[i]]--;
        }
    }

    // Novel Points Calculation
    let pointsEarned = 0;
    const updatedGreenIndices = new Set(prevGreenIndices);
    const updatedDiscoveredLetters = new Set(prevDiscoveredLetters);

    for (let i = 0; i < len; i++) {
        const letter = guess[i];
        if (statuses[i] === 'correct') {
            // Award green points if this exact position wasn't green before
            if (!updatedGreenIndices.has(i)) {
                pointsEarned += config.wordleNewGreenPoints;
                updatedGreenIndices.add(i);
            }
            updatedDiscoveredLetters.add(letter);
        } else if (statuses[i] === 'present') {
            // Award yellow points ONLY if this alphabet was never discovered before
            if (!updatedDiscoveredLetters.has(letter)) {
                pointsEarned += config.wordleNewYellowPoints;
                updatedDiscoveredLetters.add(letter);
            }
        }
    }

    const isSolved = guess === target;
    if (isSolved) {
        pointsEarned += config.wordleExactWordBonus;
    }

    return {
        statuses,
        pointsEarned,
        isSolved,
        updatedGreenIndices: Array.from(updatedGreenIndices),
        updatedDiscoveredLetters: Array.from(updatedDiscoveredLetters),
    };
}