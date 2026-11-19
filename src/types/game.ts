export type ActiveView =
    | 'LOBBY'
    | 'JEOPARDY'
    | 'WORDLE_SELECT'
    | 'WORDLE_PLAY'
    | 'R1_LEADERBOARD'
    | 'ROUND2_MARKET'
    | 'WIKIRACE_FINALE'
    | 'WIKIRACE_WINNER';

export interface Team {
    id: string;
    name: string;
    score: number;
    startingWord: string;
    words: string[]; // Max 3 acquired words (Total 4 with startingWord)
    visitedWords?: string[]; // Wiki pages successfully visited, in any order
}

export interface JeopardyQuestion {
    id: string;
    category: string;
    points: number;
    question: string;
    actualAnswer: number;
    minLimit: number;
    maxLimit: number;
    unit: string;
    isImageQuestion?: boolean;
    imageUrl?: string;
    isCompleted: boolean;
    answeredByTeamId?: string;
}

export interface WordleGuess {
    teamId: string;
    word: string;
    statuses: ('correct' | 'present' | 'absent')[];
    pointsEarned: number;
    pointsByLetter: number[];
}

export type WordleDifficulty = 'easy' | 'medium' | 'hard';

export interface WordlePuzzle {
    id: string;
    number: number;
    targetWord: string; // Secret answer; never render its length on the projector
    definition: string;
    difficulty: WordleDifficulty;
    assignedTeamId?: string;
    isCompleted: boolean;
    guesses: WordleGuess[];
    discoveredGreenIndices: number[]; // Correct answer positions already rewarded
    discoveredLetters: string[];      // Letters already rewarded as yellow or green
    startingTeamIndex: number;
}

export interface GameConfig {
    // Wordle scoring
    wordleMaxGuesses: number;
    roundTimerSeconds: number;
    wordleNewGreenPoints: number;
    wordleNewYellowPoints: number;
    // Round 2 economics
    r2BuyCost: number;
    r2AssignCost: number;
    r2StealCost: number;
    r2StealRefundPercent: number; // e.g., 50 means victim gets 50% of r2BuyCost back
    startingWordPool: string[];
    auctionWordPool: string[];
}

export interface GameState {
    activeView: ActiveView;
    teams: Team[];
    jeopardyTurnIndex: number;
    jeopardyBoard: JeopardyQuestion[];
    activeJeopardyId: string | null;
    lastGuesstimateResult: {
        teamName: string;
        guess: number;
        won: boolean;
        points: number;
        actual?: number;
    } | null;

    wordles: WordlePuzzle[];
    activeWordleId: string | null;
    wordleCountCompleted: number; // Number of Wordle challenges completed

    // Round 2 state
    r2TurnIndex: number;
    currentMarketWord: string | null;
    usedPoolWords: string[];
    r2LastActionBanner: string | null;
    winnerTeamId: string | null;

    config: GameConfig;
    roundTimerStartedAt: number | null;
    roundTimerPhase: 'idle' | 'thinking' | 'answer';
}