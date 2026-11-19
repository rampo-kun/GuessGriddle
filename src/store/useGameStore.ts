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
import { SAMPLE_JEOPARDY } from '@/data/jeopardyQuestions';

const STORAGE_KEY = 'guessgriddle_xinsights_state_v4';
const CHANNEL_NAME = 'guessgriddle_sync_channel';

const DEFAULT_CONFIG: GameConfig = {
    wordleMaxGuesses: 6,
    roundTimerSeconds: 45,
    wordleNewGreenPoints: 25,
    wordleNewYellowPoints: 12,
    r2BuyCost: 100,
    r2AssignCost: 200,
    r2StealCost: 300,
    r2StealRefundPercent: 50,
    // Wiki Race words are recognizable Wikipedia pages with multiple possible cross-links.
    startingWordPool: [
        'ALGORITHM', 'STATISTICS', 'DATABASE', 'MACHINE LEARNING', 'DATA VISUALIZATION',
        'REGRESSION', 'PROBABILITY', 'ECONOMICS', 'COMPUTER NETWORK', 'ARTIFICIAL INTELLIGENCE',
        'BUSINESS INTELLIGENCE', 'CYBERSECURITY', 'CLIMATE CHANGE', 'SOLAR SYSTEM',
        'PHOTOGRAPHY', 'DEMOCRACY', 'EVOLUTION', 'CRICKET', 'GLOBALIZATION', 'RENEWABLE ENERGY',
        'NEUROSCIENCE', 'PSYCHOLOGY', 'INTERNET', 'OCEAN', 'SPACE EXPLORATION',
    ],
    auctionWordPool: [
        'GOOGLE', 'AMAZON', 'SMARTPHONE', 'SOCIAL MEDIA', 'VIDEO GAME', 'ROBOT',
        'COMPUTER', 'COFFEE', 'PIZZA', 'SOLAR ENERGY', 'ELECTRIC CAR', 'JAPAN',
        'UNITED STATES', 'MOUNT EVEREST', 'TAJ MAHAL', 'LEONARDO DA VINCI',
        'ALBERT EINSTEIN', 'WILLIAM SHAKESPEARE', 'MARIE CURIE', 'NELSON MANDELA',
        'BARACK OBAMA', 'CRICKET WORLD CUP', 'OLYMPIC GAMES', 'FOOTBALL',
        'TENNIS', 'CHESS', 'FORMULA ONE', 'BOLLYWOOD', 'HOLLYWOOD', 'WALT DISNEY',
        'STAR WARS', 'HARRY POTTER', 'THE BEATLES', 'MICHAEL JACKSON', 'TAYLOR SWIFT',
        'MARIO', 'POKEMON', 'MINECRAFT', 'YOUTUBE', 'NETFLIX', 'INSTAGRAM',
        'WIKIPEDIA', 'ARTIFICIAL INTELLIGENCE', 'BLOCKCHAIN', 'QUANTUM COMPUTING',
        'ELECTRICITY', 'GRAVITY', 'BLACK HOLE', 'DNA', 'VACCINE', 'VOLCANO',
        'EARTHQUAKE', 'AMAZON RAINFOREST', 'GREAT BARRIER REEF', 'SAHARA',
        'NILE', 'GANGES', 'HIMALAYAS', 'PARIS', 'TOKYO', 'NEW YORK CITY',
        'SINGAPORE', 'DUBAI', 'ITALY', 'BRAZIL', 'EGYPT', 'AUSTRALIA',
        'CHOCOLATE', 'SUSHI', 'MASALA DOSA', 'COCA-COLA',
        'TITANIC', 'APOLLO 11', 'INTERNATIONAL SPACE STATION', 'MOBILE PHONE',
        'WORLD WIDE WEB', 'UNITED NATIONS', 'RED CROSS', 'NOBEL PRIZE',
        'FIFA', 'NBA', 'TOYOTA', 'TESLA', 'NIKE', 'ADIDAS',
    ],
};

const PRE_EXPANSION_STARTING_WORD_POOL = [
    'ALGORITHM', 'STATISTICS', 'DATABASE', 'MACHINE LEARNING',
    'DATA VISUALIZATION', 'REGRESSION', 'PROBABILITY', 'ECONOMICS',
    'COMPUTER NETWORK', 'ARTIFICIAL INTELLIGENCE', 'BUSINESS INTELLIGENCE', 'CYBERSECURITY',
];
const PRE_EXPANSION_AUCTION_WORD_POOL = [
    'INTERNET', 'GOOGLE', 'AMAZON', 'SMARTPHONE', 'SOCIAL MEDIA',
    'VIDEO GAME', 'ROBOT', 'COMPUTER', 'COFFEE', 'PIZZA',
    'SOLAR ENERGY', 'ELECTRIC CAR',
];

const LEGACY_STARTING_WORD_POOL = ['KALEIDOSCOPE', 'CHAMELEON', 'ESPRESSO', 'LABYRINTH', 'MONSOON', 'ORIGAMI'];
const LEGACY_AUCTION_WORD_POOL = [
    'BLACK SWAN', 'MEME', 'BLOCKCHAIN', 'ALGORITHM', 'REGRESSION', 'PARETO PRINCIPLE',
    'BAYESIAN INFERENCE', 'DATA VISUALIZATION', 'NEURAL NETWORK', 'CRYPTOGRAPHY', 'DOPAMINE',
    'SCHADENFREUDE', 'PANGOLIN', 'BIOLUMINESCENCE', 'DEJA VU', 'LIMERENCE', 'PETRICHOR', 'TARDIGRADE',
];

// Previous built-in defaults shipped before the updated Wiki Race bank.
const PREVIOUS_DEFAULT_STARTING_WORD_POOL = ['PIZZA', 'BARBIE', 'MONOPOLY', 'CAPTCHA', 'IKEA', 'OCTOPUS'];
const PREVIOUS_DEFAULT_AUCTION_WORD_POOL = [
    'ENRON', 'PONZI SCHEME', 'QR CODE', 'DEEPFAKE', 'DUNNING-KRUGER EFFECT', 'PARETO PRINCIPLE',
    'BITCOIN', 'MEME', 'TAMAGOTCHI', 'RUBE GOLDBERG MACHINE', 'BLACK FRIDAY', 'SPAM',
    'ALGORITHM', 'RECOMMENDER SYSTEM', 'DATA MINING', 'BAYES’ THEOREM', 'TULIP MANIA', 'RUBBER DUCK DEBUGGING',
];

const SHIPPED_DEFAULT_STARTING_WORD_POOL = [
    'PIZZA', 'BARBIE', 'MONOPOLY', 'OCTOPUS', 'IKEA', 'CAPTCHA',
];
const SHIPPED_DEFAULT_AUCTION_WORD_POOL = [
    'CHOCOLATE', 'COFFEE', 'SUSHI', 'ITALY', 'DISNEY', 'HOLLYWOOD',
    'ANIMATION', 'SUPERHERO', 'LEGO', 'NINTENDO', 'AMAZON', 'COCA-COLA',
    'GOOGLE', 'INTERNET', 'ARTIFICIAL INTELLIGENCE', 'SMARTPHONE', 'ROBOT',
    'CINEMA', 'DOLPHIN', 'PENGUIN', 'VOLCANO', 'SOLAR SYSTEM', 'SWEDEN', 'YOUTUBE',
];
const SHIPPED_DEFAULT_WORDLE_WORDS = [
    'TOKEN', 'LOGIC', 'TREND', 'PIVOT', 'BAYES', 'EMBED', 'QUERY', 'CACHE',
    'PIXEL', 'SCHEMA', 'PYTHON', 'REGRESSION', 'ALGORITHM', 'DASHBOARD',
    'BLOCKCHAIN', 'VISUALIZATION', 'OVERFITTING', 'SEGMENTATION', 'LATENCY', 'FORECAST',
];

const SAMPLE_WORDLES: WordlePuzzle[] = [
    { id: 'w1', number: 1, targetWord: 'CHART', definition: 'A visual display of information or data.', difficulty: 'easy', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
    { id: 'w2', number: 2, targetWord: 'CLOUD', definition: 'A network-based place to store and access computing resources.', difficulty: 'easy', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
    { id: 'w3', number: 3, targetWord: 'ROBOT', definition: 'A programmable machine that can carry out tasks.', difficulty: 'easy', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
    { id: 'w4', number: 4, targetWord: 'PIXEL', definition: 'The smallest addressable unit in a digital image.', difficulty: 'easy', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
    { id: 'w5', number: 5, targetWord: 'QUERY', definition: 'A request for information from a database.', difficulty: 'easy', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
    { id: 'w6', number: 6, targetWord: 'GRAPH', definition: 'A visual representation of relationships or values.', difficulty: 'easy', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
    { id: 'w7', number: 7, targetWord: 'MATRIX', definition: 'A rectangular arrangement of numbers in rows and columns.', difficulty: 'medium', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
    { id: 'w8', number: 8, targetWord: 'LINEAR', definition: 'A relationship that can be represented by a straight line.', difficulty: 'medium', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
    { id: 'w9', number: 9, targetWord: 'CLIENT', definition: 'A person or system that requests a service from a server.', difficulty: 'medium', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
    { id: 'w10', number: 10, targetWord: 'CACHE', definition: 'A fast storage layer holding frequently used data.', difficulty: 'medium', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
    { id: 'w11', number: 11, targetWord: 'NEURAL', definition: 'Relating to networks of connected artificial processing units.', difficulty: 'medium', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
    { id: 'w12', number: 12, targetWord: 'VECTOR', definition: 'A quantity or data representation with multiple components.', difficulty: 'medium', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
    { id: 'w13', number: 13, targetWord: 'ENTROPY', definition: 'A measure of uncertainty or disorder in information theory.', difficulty: 'hard', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
    { id: 'w14', number: 14, targetWord: 'OVERFIT', definition: 'To model training data too closely, harming generalisation.', difficulty: 'hard', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
    { id: 'w15', number: 15, targetWord: 'LATENCY', definition: 'The delay between a request and its response.', difficulty: 'hard', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
    { id: 'w16', number: 16, targetWord: 'BAYESIAN', definition: 'Relating to probability updated using prior knowledge and evidence.', difficulty: 'hard', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
    { id: 'w17', number: 17, targetWord: 'KERNEL', definition: 'The central component of an operating system.', difficulty: 'hard', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
    { id: 'w18', number: 18, targetWord: 'HEURISTIC', definition: 'A practical method used to find an approximate solution.', difficulty: 'hard', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
    { id: 'w19', number: 19, targetWord: 'MERGE', definition: 'To combine two datasets, branches, or groups into one.', difficulty: 'easy', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
    { id: 'w20', number: 20, targetWord: 'BRAND', definition: 'A name, symbol, or identity that distinguishes a product or company.', difficulty: 'easy', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
    { id: 'w21', number: 21, targetWord: 'SCALE', definition: 'The ability of a system or business to handle growth.', difficulty: 'easy', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
    { id: 'w22', number: 22, targetWord: 'SALES', definition: 'The exchange of goods or services for money.', difficulty: 'easy', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
    { id: 'w23', number: 23, targetWord: 'RATIO', definition: 'A comparison of two quantities by division.', difficulty: 'easy', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
    { id: 'w24', number: 24, targetWord: 'MARKET', definition: 'A place or system where buyers and sellers exchange goods or services.', difficulty: 'medium', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
    { id: 'w25', number: 25, targetWord: 'PROFIT', definition: 'The amount remaining when costs are subtracted from revenue.', difficulty: 'medium', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
    { id: 'w26', number: 26, targetWord: 'INSIGHT', definition: 'A useful understanding discovered by analysing information.', difficulty: 'hard', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
    { id: 'w27', number: 27, targetWord: 'NETWORK', definition: 'A group of connected computers, people, or organisations.', difficulty: 'hard', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
    { id: 'w28', number: 28, targetWord: 'MARGIN', definition: 'The difference between revenue and a related cost, often expressed as a percentage.', difficulty: 'medium', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
    { id: 'w29', number: 29, targetWord: 'DEMAND', definition: 'The quantity of a product consumers are willing and able to buy.', difficulty: 'medium', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
    { id: 'w30', number: 30, targetWord: 'CAPITAL', definition: 'Wealth or resources used to start or operate a business.', difficulty: 'hard', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
    { id: 'w31', number: 31, targetWord: 'STRATEGY', definition: 'A long-term plan designed to achieve a particular objective.', difficulty: 'hard', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
    { id: 'w32', number: 32, targetWord: 'REVENUE', definition: 'The total income generated from normal business activities.', difficulty: 'hard', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
    { id: 'w33', number: 33, targetWord: 'SUPPLY', definition: 'The amount of a product or service available to the market.', difficulty: 'medium', isCompleted: false, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], startingTeamIndex: 0 },
];

interface GameActions {
    setView: (view: ActiveView) => void;
    updateConfig: (partial: Partial<GameConfig>) => void;
    addTeam: (name: string) => void;
    removeTeam: (id: string) => void;
    adjustTeamScore: (id: string, delta: number) => void;
    setJeopardyTurn: (index: number) => void;
    chooseRound1Mode: (mode: 'JEOPARDY' | 'WORDLE_SELECT') => void;
    startRound1Choice: () => void;
    startRoundTimer: () => void;
    endThinkingTime: () => void;
    resetRoundTimer: () => void;

    // Jeopardy Actions
    addJeopardyQuestion: (q: Omit<JeopardyQuestion, 'id' | 'isCompleted'>) => void;
    deleteJeopardyQuestion: (id: string) => void;
    selectJeopardyTile: (id: string | null) => void;
    submitGuesstimate: (guess: number) => void;
    revealNextRound1Turn: () => void;

    // Wordle Actions
    addWordle: (targetWord: string, definition: string, difficulty?: 'easy' | 'medium' | 'hard') => void;
    deleteWordle: (id: string) => void;
    openWordle: (id: string, teamId: string) => void;
    submitWordleGuess: (word: string) => void;
    closeWordleAsComplete: () => void;

    // Round 2 Actions
    initializeRound2: () => void;
    drawNextMarketWord: () => void;
    r2BuyWord: (buyerTeamId: string) => void;
    r2AssignWord: (actorTeamId: string, targetTeamId: string) => void;
    r2StealWord: (thiefTeamId: string, victimTeamId: string, wordIndex: number) => void;
    r2SkipTurn: () => void;
    r2AutoFillRemaining: () => void;
    toggleWikiWordVisited: (teamId: string, word: string) => void;
    chooseWikiWinner: (teamId: string | null) => void;

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
    lastRound1Mode: null,
    round1ModeStreak: 0,
    jeopardyBoard: [...SAMPLE_JEOPARDY],
    activeJeopardyId: null,
    lastGuesstimateResult: null,
    wordles: SAMPLE_WORDLES,
    activeWordleId: null,
    wordleCountCompleted: 0,
    r2TurnIndex: 0,
    currentMarketWord: null,
    usedPoolWords: [],
    r2LastActionBanner: null,
    winnerTeamId: null,
    config: DEFAULT_CONFIG,
    roundTimerStartedAt: null,
    roundTimerPhase: 'idle',
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
                lastRound1Mode: next.lastRound1Mode,
                round1ModeStreak: next.round1ModeStreak,
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
                winnerTeamId: next.winnerTeamId,
                config: next.config,
                roundTimerStartedAt: next.roundTimerStartedAt,
                roundTimerPhase: next.roundTimerPhase,
            };
            broadcastState(pureState);
            return next;
        });
    };

    return {
        ...INITIAL_STATE,

        hydrateFromStorage: () => {
            if (typeof window === 'undefined') return;
            // Migrate the previous saved game without discarding teams, scores,
            // Jeopardy progress, or Round 2 state. Replace only the old untouched
            // three-word starter bank with the expanded variable-length bank.
            const raw =
                localStorage.getItem(STORAGE_KEY) ??
                localStorage.getItem('guessgriddle_xinsights_state_v3');
            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed.wordles)) {
                        parsed.wordles = parsed.wordles.map((w: WordlePuzzle) => {
                            const legacy = Array.isArray(w.guesses) &&
                                w.guesses.some((g: any) => typeof g.word === 'string' || Array.isArray(g.statuses));
                            return legacy ? { ...w, guesses: [], discoveredGreenIndices: [], discoveredLetters: [], isCompleted: false } : w;
                        });
                    }
                    const hasUntouchedStarterWordleBank =
                        Array.isArray(parsed.wordles) &&
                        parsed.wordles.length === 3 &&
                        parsed.wordles.every((w: WordlePuzzle) => w.guesses?.length === 0) &&
                        parsed.wordles.map((w: WordlePuzzle) => w.targetWord).join(',') === 'PIVOT,CHURN,PROXY';
                    if (hasUntouchedStarterWordleBank) {
                        parsed.wordles = SAMPLE_WORDLES;
                        parsed.activeWordleId = null;
                        parsed.wordleCountCompleted = 0;
                    }
                    // Upgrade only the previous built-in Wiki Race bank; preserve any custom bank.
                    if (parsed.config && Array.isArray(parsed.config.startingWordPool) &&
                        (JSON.stringify(parsed.config.startingWordPool) === JSON.stringify(LEGACY_STARTING_WORD_POOL) ||
                            JSON.stringify(parsed.config.startingWordPool) === JSON.stringify(PREVIOUS_DEFAULT_STARTING_WORD_POOL) ||
                            JSON.stringify(parsed.config.startingWordPool) === JSON.stringify(SHIPPED_DEFAULT_STARTING_WORD_POOL) ||
                            JSON.stringify(parsed.config.startingWordPool) === JSON.stringify(PRE_EXPANSION_STARTING_WORD_POOL))) {
                        parsed.config = { ...parsed.config, startingWordPool: DEFAULT_CONFIG.startingWordPool };
                    }
                    if (parsed.config && Array.isArray(parsed.config.auctionWordPool) &&
                        (JSON.stringify(parsed.config.auctionWordPool) === JSON.stringify(LEGACY_AUCTION_WORD_POOL) ||
                            JSON.stringify(parsed.config.auctionWordPool) === JSON.stringify(PREVIOUS_DEFAULT_AUCTION_WORD_POOL) ||
                            JSON.stringify(parsed.config.auctionWordPool) === JSON.stringify(SHIPPED_DEFAULT_AUCTION_WORD_POOL) ||
                            JSON.stringify(parsed.config.auctionWordPool) === JSON.stringify(PRE_EXPANSION_AUCTION_WORD_POOL))) {
                        parsed.config = { ...parsed.config, auctionWordPool: DEFAULT_CONFIG.auctionWordPool };
                    }
                    if (parsed.config) {
                        if (parsed.config.wordleNewGreenPoints === 15 && parsed.config.wordleNewYellowPoints === 8) {
                            parsed.config.wordleNewGreenPoints = DEFAULT_CONFIG.wordleNewGreenPoints;
                            parsed.config.wordleNewYellowPoints = DEFAULT_CONFIG.wordleNewYellowPoints;
                        }
                        parsed.config = { ...DEFAULT_CONFIG, ...parsed.config };
                    }
                    parsed.lastRound1Mode = parsed.lastRound1Mode ?? null;
                    parsed.round1ModeStreak = parsed.round1ModeStreak ?? 0;
                    parsed.roundTimerStartedAt = parsed.roundTimerStartedAt ?? null;
                    parsed.roundTimerPhase = parsed.roundTimerPhase ?? 'idle';
                    // Extend the built-in 18-puzzle bank with the new 15 puzzles while preserving played progress.
                    if (Array.isArray(parsed.wordles) && parsed.wordles.length === 18 &&
                        parsed.wordles.every((puzzle: WordlePuzzle, index: number) => puzzle.targetWord === SAMPLE_WORDLES[index]?.targetWord)) {
                        const existingIds = new Set(parsed.wordles.map((puzzle: WordlePuzzle) => puzzle.id));
                        parsed.wordles = [...parsed.wordles, ...SAMPLE_WORDLES.filter((puzzle) => !existingIds.has(puzzle.id))];
                    }
                    if (Array.isArray(parsed.wordles) &&
                        parsed.wordles.length === SHIPPED_DEFAULT_WORDLE_WORDS.length &&
                        parsed.wordles.every((puzzle: WordlePuzzle) => (puzzle.guesses ?? []).length === 0) &&
                        parsed.wordles.map((puzzle: WordlePuzzle) => puzzle.targetWord).join(',') === SHIPPED_DEFAULT_WORDLE_WORDS.join(',')) {
                        parsed.wordles = SAMPLE_WORDLES;
                        parsed.activeWordleId = null;
                        parsed.wordleCountCompleted = 0;
                    }
                    if (Array.isArray(parsed.wordles)) {
                        parsed.wordles = parsed.wordles.map((puzzle: WordlePuzzle) => ({
                            ...puzzle,
                            difficulty: puzzle.difficulty ?? 'medium',
                        }));
                    }
                    // Replace the previous shipped Jeopardy questionnaire while preserving custom boards.
                    if (Array.isArray(parsed.jeopardyBoard) &&
                        parsed.jeopardyBoard.some((question: JeopardyQuestion) => question.isImageQuestion || question.id.startsWith('image-') || (question.id === 'j1' && question.category === 'SPORTS'))) {
                        parsed.jeopardyBoard = [...SAMPLE_JEOPARDY];
                        parsed.activeJeopardyId = null;
                        parsed.lastGuesstimateResult = null;
                    }
                    parsed.teams = Array.isArray(parsed.teams) ? parsed.teams.map((team: Team) => ({ ...team, visitedWords: team.visitedWords ?? [] })) : parsed.teams;
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
        startRound1Choice: () => commit(() => ({ activeView: 'R1_CHOICE' })),
        chooseRound1Mode: (mode) => commit((s) => {
            if (s.teams.length === 0) return {};
            const forcedMode = s.round1ModeStreak >= 2 && s.lastRound1Mode === mode;
            if (forcedMode) return {};
            // Switching modes always starts a fresh streak at one. Only consecutive
            // selections of the same mode increase the streak.
            const nextStreak = s.lastRound1Mode === mode
                ? s.round1ModeStreak + 1
                : 1;
            return {
                activeView: mode,
                lastRound1Mode: mode,
                round1ModeStreak: nextStreak,
            };
        }),
        startRoundTimer: () => commit((s) => ({
            roundTimerStartedAt: Date.now(),
            roundTimerPhase: 'thinking',
        })),
        endThinkingTime: () => commit((s) => ({
            roundTimerStartedAt: null,
            roundTimerPhase: 'answer',
        })),
        resetRoundTimer: () => commit(() => ({
            roundTimerStartedAt: null,
            roundTimerPhase: 'idle',
        })),

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
            commit((s) => ({
                activeJeopardyId: id,
                lastGuesstimateResult: null,
                roundTimerStartedAt: id ? Date.now() : null,
                roundTimerPhase: id ? 'thinking' : 'idle',
            })),

        submitGuesstimate: (guess) =>
            commit((s) => {
                const q = s.jeopardyBoard.find((item) => item.id === s.activeJeopardyId);
                const currentTeam = s.teams[s.jeopardyTurnIndex];
                if (!q || !currentTeam) return {};

                // Error tolerance grows with tile difficulty (100 to 500).
                // Full credit: 25%, 30%, 35%, 40%, 45%; half credit: 50%-70%.
                const level = Math.max(1, Math.min(5, Math.round(q.points / 100)));
                const fullTolerance = 0.25 + (level - 1) * 0.05;
                const halfTolerance = 0.50 + (level - 1) * 0.05;
                const errorRate = q.actualAnswer === 0
                    ? (guess === 0 ? 0 : Infinity)
                    : Math.abs(guess - q.actualAnswer) / Math.abs(q.actualAnswer);
                const awarded = errorRate <= fullTolerance
                    ? q.points
                    : errorRate <= halfTolerance
                        ? Math.round(q.points / 2)
                        : 0;
                const won = awarded > 0;

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

                return {
                    teams: updatedTeams,
                    jeopardyBoard: updatedBoard,
                    // Keep the question and result on the projector until the host
                    // explicitly advances to the next team's choice screen.
                    activeView: 'JEOPARDY',
                    lastGuesstimateResult: {
                        teamName: currentTeam.name,
                        guess,
                        won,
                        points: awarded,
                        actual: q.actualAnswer,
                    },
                    roundTimerStartedAt: null,
                    roundTimerPhase: 'idle',
                };
            }),

        revealNextRound1Turn: () =>
            commit((s) => ({
                jeopardyTurnIndex: s.teams.length
                    ? (s.jeopardyTurnIndex + 1) % s.teams.length
                    : 0,
                activeJeopardyId: null,
                lastGuesstimateResult: null,
                activeView: 'R1_CHOICE',
                roundTimerStartedAt: null,
                roundTimerPhase: 'idle',
            })),

        addWordle: (targetWord, definition, difficulty = 'medium') =>
            commit((s) => ({
                wordles: [
                    ...s.wordles,
                    {
                        id: `w_${Date.now()}`,
                        number: s.wordles.length + 1,
                        targetWord: targetWord.toUpperCase().trim(),
                        definition: definition.trim(),
                        difficulty,
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

        openWordle: (id, teamId) =>
            commit((s) => {
                const puzzle = s.wordles.find((w) => w.id === id);
                if (!puzzle || puzzle.isCompleted ||
                    (puzzle.assignedTeamId && puzzle.assignedTeamId !== teamId) ||
                    !s.teams.some((team) => team.id === teamId)) return {};
                return {
                    activeWordleId: id,
                    activeView: 'WORDLE_PLAY',
                    roundTimerStartedAt: Date.now(),
                    roundTimerPhase: 'thinking',
                    wordles: s.wordles.map((w) =>
                        w.id === id ? { ...w, assignedTeamId: teamId } : w
                    ),
                };
            }),

        submitWordleGuess: (word) =>
            commit((s) => {
                const puzzle = s.wordles.find((w) => w.id === s.activeWordleId);
                if (!puzzle || puzzle.isCompleted || puzzle.guesses.length >= s.config.wordleMaxGuesses || !puzzle.assignedTeamId) return {};
                const normalizedWord = word.toUpperCase().trim();
                if (!/^[A-Z]+$/.test(normalizedWord) || puzzle.guesses.some((g) => g.word === normalizedWord)) return {};
                const activeTeam = s.teams.find((team) => team.id === puzzle.assignedTeamId);
                if (!activeTeam) return {};

                const result = evaluateWordleGuess(
                    normalizedWord,
                    puzzle.targetWord,
                    puzzle.discoveredGreenIndices ?? [],
                    puzzle.discoveredLetters ?? [],
                    {
                        wordleNewGreenPoints: Math.max(1, s.config.wordleNewGreenPoints),
                        wordleNewYellowPoints: Math.max(1, s.config.wordleNewYellowPoints),
                    }
                );
                if (!result.valid || normalizedWord.length !== puzzle.targetWord.length) return {};

                // Only the winning attempt scores. Earlier guesses are feedback-only,
                // so discovering letters across multiple attempts never accumulates points.
                const greenPoints = Math.max(0, s.config.wordleNewGreenPoints);
                const yellowPoints = Math.max(0, s.config.wordleNewYellowPoints);
                // The first guess earns the full base value. Each later winning
                // guess earns one fewer fraction of that value (e.g. 6 guesses:
                // 100%, 83%, 67%, 50%, 33%, 17%). Failed guesses always earn 0.
                const attemptNumber = puzzle.guesses.length + 1;
                const maxGuesses = Math.max(1, s.config.wordleMaxGuesses);
                const attemptMultiplier = Math.max(0, (maxGuesses - attemptNumber + 1) / maxGuesses);
                const pointsByLetter = result.statuses.map((status) => {
                    if (!result.solved) return 0;
                    if (status === 'correct') return Math.round(greenPoints * attemptMultiplier);
                    if (status === 'present') return Math.round(yellowPoints * attemptMultiplier);
                    return 0;
                });
                const pointsEarned = pointsByLetter.reduce((sum, points) => sum + points, 0);
                const updatedGuesses = [...puzzle.guesses, {
                    teamId: activeTeam.id,
                    word: normalizedWord,
                    statuses: result.statuses,
                    pointsEarned,
                    pointsByLetter,
                }];
                const isDone = result.solved || updatedGuesses.length >= s.config.wordleMaxGuesses;

                return {
                    teams: pointsEarned > 0
                        ? s.teams.map((team) => team.id === activeTeam.id
                            ? { ...team, score: team.score + pointsEarned }
                            : team)
                        : s.teams,
                    wordles: s.wordles.map((w) => w.id === puzzle.id ? {
                        ...w,
                        guesses: updatedGuesses,
                        discoveredGreenIndices: result.updatedGreenIndices,
                        discoveredLetters: result.updatedDiscoveredLetters,
                        isCompleted: isDone,
                    } : w),
                    wordleCountCompleted: isDone ? s.wordleCountCompleted + 1 : s.wordleCountCompleted,
                    activeView: isDone ? 'R1_CHOICE' : s.activeView,
                    jeopardyTurnIndex: isDone && s.teams.length ? (s.jeopardyTurnIndex + 1) % s.teams.length : s.jeopardyTurnIndex,
                    roundTimerStartedAt: isDone ? null : Date.now(),
                    roundTimerPhase: isDone ? 'idle' : 'thinking',
                };
            }),

        closeWordleAsComplete: () =>
            commit((s) => ({
                wordles: s.wordles.map((w) =>
                    w.id === s.activeWordleId ? { ...w, isCompleted: true } : w
                ),
                wordleCountCompleted: s.wordleCountCompleted + (s.wordles.find((w) => w.id === s.activeWordleId)?.isCompleted ? 0 : 1),
                activeWordleId: null,
                activeView: 'R1_CHOICE',
                jeopardyTurnIndex: s.teams.length ? (s.jeopardyTurnIndex + 1) % s.teams.length : 0,
                roundTimerStartedAt: null,
                roundTimerPhase: 'idle',
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
                // Never replace a live auction lot: skipped teams pass the same word onward.
                if (s.currentMarketWord) return {};
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
    winnerTeamId: null,
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
                    currentMarketWord: s.currentMarketWord,
                    r2TurnIndex: (s.r2TurnIndex + 1) % s.teams.length,
                    r2LastActionBanner: `${current?.name} SKIPPED. "${s.currentMarketWord ?? 'No word'}" stays open for the next team to bid.`,
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

        toggleWikiWordVisited: (teamId, word) =>
            commit((s) => ({
                teams: s.teams.map((team) => {
                    if (team.id !== teamId) return team;
                    const visited = team.visitedWords ?? [];
                    return { ...team, visitedWords: visited.includes(word) ? visited.filter((item) => item !== word) : [...visited, word] };
                }),
            })),

        chooseWikiWinner: (teamId) =>
            commit(() => ({ winnerTeamId: teamId, activeView: teamId ? 'WIKIRACE_WINNER' : 'WIKIRACE_FINALE' })),

        resetFullGame: () => {
            if (typeof window !== 'undefined') {
                localStorage.removeItem(STORAGE_KEY);
            }
            commit(() => ({ ...INITIAL_STATE }));
        },
    };
});