'use client';

import { create } from 'zustand';
import {
    ActiveView,
    GameConfig,
    GameState,
    JeopardyQuestion,
    Team,
    WordlePuzzle,
} from '@/types/game';
import { evaluateWordleGuess } from '@/utils/wordleLogic';

const STORAGE_KEY = 'guessgriddle_xinsights_state_v1';
const CHANNEL_NAME = 'guessgriddle_sync_channel';

const DEFAULT_CONFIG: GameConfig = {
    wordleExactWordBonus: 150,
    wordleNewGreenPoints: 30,
    wordleNewYellowPoints: 15,
    r2BuyCost: 100,
    r2AssignCost: 200,
    r2StealCost: 300,
    r2StealRefundPercent: 50,
    startingWordPool: [
        'QUANTUM',
        'MONSOON',
        'ALGORITHM',
        'ESPRESSO',
        'LABYRINTH',
        'VINTAGE',
    ],
    auctionWordPool: [
        'CHAMELEON',
        'BLOCKCHAIN',
        'CROISSANT',
        'PHOTOSYNTHESIS',
        'KALEIDOSCOPE',
        'INFLATION',
        'SAMURAI',
        'TELESCOPE',
        'ORIGAMI',
        'METEORITE',
        'SYMPHONY',
        'AVALANCHE',
        'CACTUS',
        'NEBULA',
        'PARADOX',
        'FLAMINGO',
        'TURBINE',
        'SILICON',
    ],
};

const SAMPLE_JEOPARDY: JeopardyQuestion[] = [
    {
        id: 'j1',
        category: 'BENGALURU & TECH',
        points: 100,
        question: 'How many cups of filter coffee are consumed daily across Bengaluru offices?',
        actualAnswer: 1800000,
        minLimit: 1200000,
        maxLimit: 2400000,
        unit: 'cups',
        isCompleted: false,
    },
    {
        id: 'j2',
        category: 'BENGALURU & TECH',
        points: 200,
        question: 'Total weight (in kg) of all laptops currently inside Electronic City Phase 1?',
        actualAnswer: 350000,
        minLimit: 250000,
        maxLimit: 450000,
        unit: 'kg',
        isCompleted: false,
    },
    {
        id: 'j3',
        category: 'INDIAN COMMERCE',
        points: 100,
        question: 'How many UPI transactions occur in India in a single hour on average?',
        actualAnswer: 22000000,
        minLimit: 16000000,
        maxLimit: 28000000,
        unit: 'txns',
        isCompleted: false,
    },
    {
        id: 'j4',
        category: 'INDIAN COMMERCE',
        points: 200,
        question: 'How many samosas are sold across Indian railway stations in one day?',
        actualAnswer: 4500000,
        minLimit: 3000000,
        maxLimit: 6000000,
        unit: 'samosas',
        isCompleted: false,
    },
    {
        id: 'j5',
        category: 'CAMPUS LIFE',
        points: 100,
        question: 'Total sheets of A4 paper printed by an MBA batch in one trimester?',
        actualAnswer: 120000,
        minLimit: 80000,
        maxLimit: 160000,
        unit: 'sheets',
        isCompleted: false,
    },
    {
        id: 'j6',
        category: 'CAMPUS LIFE',
        points: 200,
        question: 'How many collective hours of sleep do 120 PGDM students get during exam week (7 days)?',
        actualAnswer: 4200,
        minLimit: 3200,
        maxLimit: 5200,
        unit: 'hours',
        isCompleted: false,
    },
];

const SAMPLE_WORDLES: WordlePuzzle[] = [
    {
        id: 'w1',
        number: 1,
        targetWord: 'PIVOT',
        definition: 'A strategic shift in business direction without changing the core vision.',
        isCompleted: false,
        guesses: [],
        discoveredGreenIndices: [],
        discoveredLetters: [],
        startingTeamIndex: 0,
    },
    {
        id: 'w2',
        number: 2,
        targetWord: 'CHURN',
        definition: 'The percentage of customers who stop using a company’s product over a period.',
        isCompleted: false,
        guesses: [],
        discoveredGreenIndices: [],
        discoveredLetters: [],
        startingTeamIndex: 1,
    },
    {
        id: 'w3',
        number: 3,
        targetWord: 'PROXY',
        definition: 'A variable used to stand in for another difficult-to-measure metric in analytics.',
        isCompleted: false,
        guesses: [],
        discoveredGreenIndices: [],
        discoveredLetters: [],
        startingTeamIndex: 2,
    },
];

interface GameActions {
    setView: (view: ActiveView) => void;
    updateConfig: (partial: Partial<GameConfig>) => void;
    addTeam: (name: string) => void;
    removeTeam: (id: string) => void;
    adjustTeamScore: (id: string, delta: number) => void;
    setJeopardyTurn: (index: number) => void;

    // Jeopardy Actions
    addJeopardyQuestion: (q: Omit<JeopardyQuestion, 'id' | 'isCompleted'>) => void;
    deleteJeopardyQuestion: (id: string) => void;
    selectJeopardyTile: (id: string | null) => void;
    submitGuesstimate: (guess: number) => void;

    // Wordle Actions
    addWordle: (targetWord: string, definition: string) => void;
    deleteWordle: (id: string) => void;
    openWordle: (id: string) => void;
    submitWordleGuess: (guessWord: string) => void;
    closeWordleAsComplete: () => void;

    // Round 2 Actions
    initializeRound2: () => void;
    drawNextMarketWord: () => void;
    r2BuyWord: (buyerTeamId: string) => void;
    r2AssignWord: (actorTeamId: string, targetTeamId: string) => void;
    r2StealWord: (thiefTeamId: string, victimTeamId: string, wordIndex: number) => void;
    r2SkipTurn: () => void;
    r2AutoFillRemaining: () => void;

    resetFullGame: () => void;
    hydrateFromStorage: () => void;
}

const INITIAL_STATE: GameState = {
    activeView: 'LOBBY',
    teams: [
        { id: 't1', name: 'Alpha Quants', score: 0, startingWord: '', words: [] },
        { id: 't2', name: 'Sigma Outliers', score: 0, startingWord: '', words: [] },
        { id: 't3', name: 'Bayesian Beasts', score: 0, startingWord: '', words: [] },
    ],
    jeopardyTurnIndex: 0,
    jeopardyBoard: SAMPLE_JEOPARDY,
    activeJeopardyId: null,
    lastGuesstimateResult: null,
    wordles: SAMPLE_WORDLES,
    activeWordleId: null,
    wordleCountCompleted: 0,
    r2TurnIndex: 0,
    currentMarketWord: null,
    usedPoolWords: [],
    r2LastActionBanner: null,
    config: DEFAULT_CONFIG,
};

function broadcastState(state: GameState) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        const channel = new BroadcastChannel(CHANNEL_NAME);
        channel.postMessage(state);
        channel.close();
    } catch (e) {
        console.error('Sync error:', e);
    }
}

export const useGameStore = create<GameState & GameActions>((set, get) => {
    const commit = (updater: (state: GameState) => Partial<GameState>) => {
        set((prev) => {
            const next = { ...prev, ...updater(prev) };
            // Extract pure state properties to broadcast
            const pureState: GameState = {
                activeView: next.activeView,
                teams: next.teams,
                jeopardyTurnIndex: next.jeopardyTurnIndex,
                jeopardyBoard: next.jeopardyBoard,
                activeJeopardyId: next.activeJeopardyId,
                lastGuesstimateResult: next.lastGuesstimateResult,
                wordles: next.wordles,
                activeWordleId: next.activeWordleId,
                wordleCountCompleted: next.wordleCountCompleted,
                r2TurnIndex: next.r2TurnIndex,
                currentMarketWord: next.currentMarketWord,
                usedPoolWords: next.usedPoolWords,
                r2LastActionBanner: next.r2LastActionBanner,
                config: next.config,
            };
            broadcastState(pureState);
            return next;
        });
    };

    return {
        ...INITIAL_STATE,

        hydrateFromStorage: () => {
            if (typeof window === 'undefined') return;
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    set((prev) => ({ ...prev, ...parsed }));
                } catch { }
            }
            const channel = new BroadcastChannel(CHANNEL_NAME);
            channel.onmessage = (event) => {
                if (event.data) {
                    set((prev) => ({ ...prev, ...event.data }));
                }
            };
        },

        setView: (activeView) => commit(() => ({ activeView, lastGuesstimateResult: null })),

        updateConfig: (partial) =>
            commit((s) => ({ config: { ...s.config, ...partial } })),

        addTeam: (name) =>
            commit((s) => ({
                teams: [
                    ...s.teams,
                    {
                        id: `t_${Date.now()}`,
                        name: name.trim(),
                        score: 0,
                        startingWord: '',
                        words: [],
                    },
                ],
            })),

        removeTeam: (id) =>
            commit((s) => ({
                teams: s.teams.filter((t) => t.id !== id),
                jeopardyTurnIndex: 0,
            })),

        adjustTeamScore: (id, delta) =>
            commit((s) => ({
                teams: s.teams.map((t) => (t.id === id ? { ...t, score: t.score + delta } : t)),
            })),

        setJeopardyTurn: (index) => commit(() => ({ jeopardyTurnIndex: index })),

        addJeopardyQuestion: (q) =>
            commit((s) => ({
                jeopardyBoard: [
                    ...s.jeopardyBoard,
                    { ...q, id: `j_${Date.now()}`, isCompleted: false },
                ],
            })),

        deleteJeopardyQuestion: (id) =>
            commit((s) => ({
                jeopardyBoard: s.jeopardyBoard.filter((q) => q.id !== id),
            })),

        selectJeopardyTile: (id) =>
            commit(() => ({
                activeJeopardyId: id,
                lastGuesstimateResult: null,
            })),

        submitGuesstimate: (guess) =>
            commit((s) => {
                const q = s.jeopardyBoard.find((item) => item.id === s.activeJeopardyId);
                const currentTeam = s.teams[s.jeopardyTurnIndex];
                if (!q || !currentTeam) return {};

                const won = guess >= q.minLimit && guess <= q.maxLimit;
                const awarded = won ? q.points : 0;

                const updatedTeams = s.teams.map((t) =>
                    t.id === currentTeam.id ? { ...t, score: t.score + awarded } : t
                );

                const updatedBoard = s.jeopardyBoard.map((item) =>
                    item.id === q.id
                        ? {
                            ...item,
                            isCompleted: true,
                            answeredByTeamId: won ? currentTeam.id : undefined,
                        }
                        : item
                );

                const nextTurn = (s.jeopardyTurnIndex + 1) % s.teams.length;

                return {
                    teams: updatedTeams,
                    jeopardyBoard: updatedBoard,
                    jeopardyTurnIndex: nextTurn,
                    lastGuesstimateResult: {
                        teamName: currentTeam.name,
                        guess,
                        won,
                        points: awarded,
                        actual: q.actualAnswer,
                    },
                };
            }),

        addWordle: (targetWord, definition) =>
            commit((s) => ({
                wordles: [
                    ...s.wordles,
                    {
                        id: `w_${Date.now()}`,
                        number: s.wordles.length + 1,
                        targetWord: targetWord.toUpperCase().trim(),
                        definition: definition.trim(),
                        isCompleted: false,
                        guesses: [],
                        discoveredGreenIndices: [],
                        discoveredLetters: [],
                        startingTeamIndex: s.wordles.length % Math.max(1, s.teams.length),
                    },
                ],
            })),

        deleteWordle: (id) =>
            commit((s) => ({
                wordles: s.wordles
                    .filter((w) => w.id !== id)
                    .map((w, idx) => ({ ...w, number: idx + 1 })),
            })),

        openWordle: (id) =>
            commit((s) => {
                const startIdx = s.wordleCountCompleted % Math.max(1, s.teams.length);
                return {
                    activeWordleId: id,
                    activeView: 'WORDLE_PLAY',
                    wordles: s.wordles.map((w) =>
                        w.id === id ? { ...w, startingTeamIndex: startIdx } : w
                    ),
                };
            }),

        submitWordleGuess: (guessWord) =>
            commit((s) => {
                const puzzle = s.wordles.find((w) => w.id === s.activeWordleId);
                if (!puzzle || puzzle.guesses.length >= 6 || s.teams.length === 0) return {};

                const activeTeamIdx =
                    (puzzle.startingTeamIndex + puzzle.guesses.length) % s.teams.length;
                const activeTeam = s.teams[activeTeamIdx];

                const evalRes = evaluateWordleGuess(
                    guessWord,
                    puzzle.targetWord,
                    puzzle.discoveredGreenIndices,
                    puzzle.discoveredLetters,
                    s.config
                );

                const newGuess = {
                    teamId: activeTeam.id,
                    word: guessWord.toUpperCase().trim(),
                    statuses: evalRes.statuses,
                    pointsEarned: evalRes.pointsEarned,
                };

                const updatedGuesses = [...puzzle.guesses, newGuess];
                const isDone = evalRes.isSolved || updatedGuesses.length >= 6;

                return {
                    teams: s.teams.map((t) =>
                        t.id === activeTeam.id
                            ? { ...t, score: t.score + evalRes.pointsEarned }
                            : t
                    ),
                    wordles: s.wordles.map((w) =>
                        w.id === puzzle.id
                            ? {
                                ...w,
                                guesses: updatedGuesses,
                                discoveredGreenIndices: evalRes.updatedGreenIndices,
                                discoveredLetters: evalRes.updatedDiscoveredLetters,
                                isCompleted: isDone,
                            }
                            : w
                    ),
                    wordleCountCompleted: isDone
                        ? s.wordleCountCompleted + 1
                        : s.wordleCountCompleted,
                };
            }),

        closeWordleAsComplete: () =>
            commit((s) => ({
                wordles: s.wordles.map((w) =>
                    w.id === s.activeWordleId ? { ...w, isCompleted: true } : w
                ),
                wordleCountCompleted: s.wordleCountCompleted + 1,
                activeWordleId: null,
                activeView: 'WORDLE_SELECT',
            })),

        // ROUND 2: WORD AUCTION & STEAL
        initializeRound2: () =>
            commit((s) => {
                const shuffledStart = [...s.config.startingWordPool].sort(
                    () => Math.random() - 0.5
                );
                const updatedTeams = s.teams.map((t, idx) => ({
                    ...t,
                    startingWord: shuffledStart[idx % shuffledStart.length] || 'NEXUS',
                    words: [],
                }));
                const used = updatedTeams.map((t) => t.startingWord);
                return {
                    teams: updatedTeams,
                    usedPoolWords: used,
                    r2TurnIndex: 0,
                    currentMarketWord: null,
                    r2LastActionBanner: 'Round 2 Initialized! Starting words revealed.',
                    activeView: 'ROUND2_MARKET',
                };
            }),

        drawNextMarketWord: () =>
            commit((s) => {
                const available = s.config.auctionWordPool.filter(
                    (w) => !s.usedPoolWords.includes(w)
                );
                if (available.length === 0) {
                    return {
                        currentMarketWord: null,
                        r2LastActionBanner: 'Pool exhausted! Ready for auto-fill if needed.',
                    };
                }
                const randomWord = available[Math.floor(Math.random() * available.length)];
                return {
                    currentMarketWord: randomWord,
                    usedPoolWords: [...s.usedPoolWords, randomWord],
                    r2LastActionBanner: null,
                };
            }),

        r2BuyWord: (buyerTeamId) =>
            commit((s) => {
                if (!s.currentMarketWord) return {};
                const buyer = s.teams.find((t) => t.id === buyerTeamId);
                if (!buyer || buyer.words.length >= 3 || buyer.score < s.config.r2BuyCost) {
                    return {};
                }
                const word = s.currentMarketWord;
                return {
                    teams: s.teams.map((t) =>
                        t.id === buyerTeamId
                            ? {
                                ...t,
                                score: t.score - s.config.r2BuyCost,
                                words: [...t.words, word],
                            }
                            : t
                    ),
                    currentMarketWord: null,
                    r2TurnIndex: (s.r2TurnIndex + 1) % s.teams.length,
                    r2LastActionBanner: `${buyer.name} BOUGHT "${word}" (-${s.config.r2BuyCost} pts)`,
                };
            }),

        r2AssignWord: (actorTeamId, targetTeamId) =>
            commit((s) => {
                if (!s.currentMarketWord) return {};
                const actor = s.teams.find((t) => t.id === actorTeamId);
                const target = s.teams.find((t) => t.id === targetTeamId);
                if (
                    !actor ||
                    !target ||
                    target.words.length >= 3 ||
                    actor.score < s.config.r2AssignCost
                ) {
                    return {};
                }
                const word = s.currentMarketWord;
                return {
                    teams: s.teams.map((t) => {
                        if (t.id === actorTeamId) {
                            return { ...t, score: t.score - s.config.r2AssignCost };
                        }
                        if (t.id === targetTeamId) {
                            return { ...t, words: [...t.words, word] };
                        }
                        return t;
                    }),
                    currentMarketWord: null,
                    r2TurnIndex: (s.r2TurnIndex + 1) % s.teams.length,
                    r2LastActionBanner: `${actor.name} ASSIGNED "${word}" to ${target.name} (-${s.config.r2AssignCost} pts)`,
                };
            }),

        r2StealWord: (thiefTeamId, victimTeamId, wordIndex) =>
            commit((s) => {
                const thief = s.teams.find((t) => t.id === thiefTeamId);
                const victim = s.teams.find((t) => t.id === victimTeamId);
                if (
                    !thief ||
                    !victim ||
                    thief.words.length >= 3 ||
                    thief.score < s.config.r2StealCost ||
                    !victim.words[wordIndex]
                ) {
                    return {};
                }

                const stolenWord = victim.words[wordIndex];
                const refundAmount = Math.round(
                    (s.config.r2BuyCost * s.config.r2StealRefundPercent) / 100
                );

                return {
                    teams: s.teams.map((t) => {
                        if (t.id === thiefTeamId) {
                            return {
                                ...t,
                                score: t.score - s.config.r2StealCost,
                                words: [...t.words, stolenWord],
                            };
                        }
                        if (t.id === victimTeamId) {
                            const remaining = [...t.words];
                            remaining.splice(wordIndex, 1);
                            return {
                                ...t,
                                score: t.score + refundAmount,
                                words: remaining,
                            };
                        }
                        return t;
                    }),
                    r2TurnIndex: (s.r2TurnIndex + 1) % s.teams.length,
                    r2LastActionBanner: `${thief.name} STOLE "${stolenWord}" from ${victim.name}! (${victim.name} refunded +${refundAmount} pts)`,
                };
            }),

        r2SkipTurn: () =>
            commit((s) => {
                const current = s.teams[s.r2TurnIndex];
                return {
                    currentMarketWord: null,
                    r2TurnIndex: (s.r2TurnIndex + 1) % s.teams.length,
                    r2LastActionBanner: `${current?.name} SKIPPED their turn.`,
                };
            }),

        r2AutoFillRemaining: () =>
            commit((s) => {
                let pool = s.config.auctionWordPool
                    .filter((w) => !s.usedPoolWords.includes(w))
                    .sort(() => Math.random() - 0.5);

                const newlyUsed: string[] = [];
                const updatedTeams = s.teams.map((t) => {
                    const filled = [...t.words];
                    while (filled.length < 3 && pool.length > 0) {
                        const nextW = pool.pop()!;
                        filled.push(nextW);
                        newlyUsed.push(nextW);
                    }
                    return { ...t, words: filled };
                });

                return {
                    teams: updatedTeams,
                    usedPoolWords: [...s.usedPoolWords, ...newlyUsed],
                    currentMarketWord: null,
                    r2LastActionBanner: 'All empty slots randomly filled! Ready for Wiki Race.',
                };
            }),

        resetFullGame: () => {
            if (typeof window !== 'undefined') {
                localStorage.removeItem(STORAGE_KEY);
            }
            commit(() => ({ ...INITIAL_STATE }));
        },
    };
});