export function evaluateWordlePosition(
    letterRaw: string,
    position: number,
    targetRaw: string,
    prevGreenIndices: number[],
    prevDiscoveredLetters: string[],
    config: { wordleNewGreenPoints: number; wordleNewYellowPoints: number }
) {
    const letter = letterRaw.toUpperCase().trim();
    const target = targetRaw.toUpperCase().trim();
    const index = position - 1;
    if (!/^[A-Z]$/.test(letter) || index < 0 || index >= target.length) {
        return { valid: false as const, status: 'absent' as const, pointsEarned: 0,
            updatedGreenIndices: prevGreenIndices, updatedDiscoveredLetters: prevDiscoveredLetters };
    }

    const status = target[index] === letter
        ? 'correct' as const
        : target.includes(letter) ? 'present' as const : 'absent' as const;
    const greens = new Set(prevGreenIndices);
    const discovered = new Set(prevDiscoveredLetters);
    let pointsEarned = 0;

    if (status === 'correct') {
        if (!greens.has(index)) pointsEarned += config.wordleNewGreenPoints;
        greens.add(index);
        discovered.add(letter);
    } else if (status === 'present' && !discovered.has(letter)) {
        pointsEarned += config.wordleNewYellowPoints;
        discovered.add(letter);
    }

    return {
        valid: true as const,
        status,
        pointsEarned,
        updatedGreenIndices: Array.from(greens),
        updatedDiscoveredLetters: Array.from(discovered),
    };
}
