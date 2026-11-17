'use client';

import { useGameStore } from '@/store/useGameStore';

export default function WordleBoard() {
    const { wordles, activeWordleId, teams, config } = useGameStore();
    const puzzle = wordles.find((w) => w.id === activeWordleId);

    if (!puzzle) return null;

    const wordLen = puzzle.targetWord.length;
    const activeTeamIdx =
        (puzzle.startingTeamIndex + puzzle.guesses.length) % Math.max(1, teams.length);
    const activeTeam = teams[activeTeamIdx];

    // Build circular order display
    const queueOrder = teams.map((_, offset) => {
        const idx = (puzzle.startingTeamIndex + offset) % teams.length;
        return teams[idx];
    });

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 flex flex-col items-center justify-between">
            {/* Clue Header */}
            <div className="max-w-4xl w-full bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 text-center shadow-xl">
                <div className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">
                    Wordle #{puzzle.number} • Definition Clue
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                    “{puzzle.definition}”
                </h2>
                <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-slate-400">
                    <span>New Yellow: +{config.wordleNewYellowPoints} pts</span>
                    <span>•</span>
                    <span>New Green: +{config.wordleNewGreenPoints} pts</span>
                    <span>•</span>
                    <span>Full Word Solve: +{config.wordleExactWordBonus} pts</span>
                </div>
            </div>

            {/* Circular Queue Strip */}
            <div className="flex items-center gap-3 my-4">
                <span className="text-sm uppercase tracking-wider text-slate-400 font-bold">
                    Turn Order:
                </span>
                {queueOrder.map((t, i) => {
                    const isCurrent = !puzzle.isCompleted && t.id === activeTeam?.id;
                    return (
                        <div
                            key={t.id}
                            className={`px-4 py-1.5 rounded-full text-sm font-bold border ${isCurrent
                                    ? 'bg-amber-500 text-slate-950 border-amber-300 scale-105'
                                    : 'bg-slate-800 text-slate-300 border-slate-700'
                                }`}
                        >
                            {i + 1}. {t.name}
                        </div>
                    );
                })}
            </div>

            {/* 6-Row Wordle Grid */}
            <div className="flex flex-col gap-3 my-2">
                {Array.from({ length: 6 }).map((_, rowIdx) => {
                    const guessObj = puzzle.guesses[rowIdx];
                    const guessTeam = teams.find((t) => t.id === guessObj?.teamId);

                    return (
                        <div key={rowIdx} className="flex items-center gap-4">
                            <div className="w-36 text-right text-sm font-bold text-slate-400 truncate">
                                {guessTeam ? guessTeam.name : `Row ${rowIdx + 1}`}
                            </div>

                            <div className="flex gap-2.5">
                                {Array.from({ length: wordLen }).map((__, colIdx) => {
                                    const char = guessObj?.word[colIdx] || '';
                                    const status = guessObj?.statuses[colIdx];

                                    let bgClass = 'bg-slate-900 border-slate-700 text-white';
                                    if (status === 'correct')
                                        bgClass = 'bg-emerald-600 border-emerald-400 text-white';
                                    else if (status === 'present')
                                        bgClass = 'bg-amber-500 border-amber-300 text-slate-950';
                                    else if (status === 'absent')
                                        bgClass = 'bg-slate-800 border-slate-700 text-slate-400';

                                    return (
                                        <div
                                            key={colIdx}
                                            className={`w-16 h-16 md:w-20 md:h-20 rounded-xl border-2 flex items-center justify-center text-4xl font-black uppercase transition-all ${bgClass}`}
                                        >
                                            {char}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="w-28 text-left">
                                {guessObj && (
                                    <span className="bg-indigo-600/30 border border-indigo-400/40 text-indigo-300 px-3 py-1 rounded-lg text-sm font-bold">
                                        +{guessObj.pointsEarned} pts
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Reveal Banner when completed */}
            {puzzle.isCompleted && (
                <div className="bg-emerald-950 border-2 border-emerald-500 px-8 py-4 rounded-2xl text-center">
                    <span className="text-slate-300 text-lg mr-3">Target Word:</span>
                    <span className="text-3xl font-black text-emerald-400 tracking-widest">
                        {puzzle.targetWord}
                    </span>
                </div>
            )}
        </div>
    );
}