'use client';

import { useGameStore } from '@/store/useGameStore';

export default function WordleBoard() {
    const { wordles, activeWordleId, teams, config } = useGameStore();
    const puzzle = wordles.find((w) => w.id === activeWordleId);
    if (!puzzle) return null;

    const activeTeamIdx = (puzzle.startingTeamIndex + puzzle.guesses.length) % Math.max(1, teams.length);
    const activeTeam = teams[activeTeamIdx];
    const queueOrder = teams.map((_, offset) => teams[(puzzle.startingTeamIndex + offset) % teams.length]);

    const statusStyle = {
        correct: 'bg-emerald-700 border-emerald-600 text-white',
        present: 'bg-amber-400 border-amber-500 text-slate-950',
        absent: 'bg-slate-600 border-slate-500 text-white',
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-900 p-8 flex flex-col items-center gap-7">
            <div className="max-w-4xl w-full bg-slate-900 border border-emerald-700 rounded-3xl p-6 text-center shadow-xl">
                <div className="text-xs font-bold uppercase tracking-widest text-emerald-800 mb-2">
                    Wordle #{puzzle.number} • Full-Word Challenge
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">“{puzzle.definition}”</h2>
                <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-slate-700">
                    <span>New Yellow Letter: +{config.wordleNewYellowPoints} pts</span>
                    <span>•</span>
                    <span>New Green Position: +{config.wordleNewGreenPoints} pts</span>
                    <span>•</span>
                    <span>Full Solve: +{config.wordleExactWordBonus} pts</span>
                </div>
                <p className="mt-3 text-sm font-bold text-amber-800">
                    Submit a complete word. The answer length is hidden.
                </p>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-3">
                <span className="text-sm uppercase tracking-wider text-slate-700 font-bold">Turn Order:</span>
                {queueOrder.map((team, i) => (
                    <div key={team.id} className={`px-4 py-1.5 rounded-full text-sm font-bold border ${
                        !puzzle.isCompleted && team.id === activeTeam?.id
                            ? 'bg-amber-400 text-slate-950 border-amber-600 scale-105'
                            : 'bg-white text-slate-800 border-slate-400'
                    }`}>{i + 1}. {team.name}</div>
                ))}
            </div>

            <div className="w-full max-w-4xl rounded-2xl border border-slate-400 bg-white/90 p-5">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold uppercase tracking-widest text-slate-700">Guesses</span>
                    <span className="text-sm text-slate-700">{puzzle.guesses.length} / 20 attempts</span>
                </div>
                {puzzle.guesses.length === 0 ? (
                    <div className="py-10 text-center text-slate-600">No guesses yet. Let the guessing begin.</div>
                ) : (
                    <div className="space-y-3">
                        {puzzle.guesses.map((guess, index) => {
                            const team = teams.find((t) => t.id === guess.teamId);
                            return (
                                <div key={`${guess.teamId}-${index}`} className="flex flex-wrap items-center gap-3 rounded-xl bg-slate-100 p-3">
                                    <span className="w-36 shrink-0 truncate text-sm font-bold text-slate-800">{team?.name ?? 'Team'}</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {guess.word.split('').map((letter, letterIndex) => (
                                            <span
                                                key={`${letter}-${letterIndex}`}
                                                className={`h-10 min-w-9 px-2 rounded-md border-2 flex items-center justify-center text-lg font-black ${statusStyle[guess.statuses[letterIndex] ?? 'absent']}`}
                                                title={guess.statuses[letterIndex] === 'correct' ? 'Correct position' : guess.statuses[letterIndex] === 'present' ? 'Letter exists elsewhere' : 'Letter not in answer'}
                                            >
                                                {letter}
                                            </span>
                                        ))}
                                    </div>
                                    <span className="ml-auto text-sm font-black text-emerald-800">+{guess.pointsEarned} pts</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="flex flex-wrap justify-center gap-5 text-sm font-bold">
                <span className="text-emerald-800">■ Green: correct position</span>
                <span className="text-amber-800">■ Yellow: letter exists elsewhere</span>
                <span className="text-slate-700">■ Grey: letter not in answer</span>
            </div>

            {puzzle.isCompleted && (
                <div className="bg-emerald-100 border-2 border-emerald-700 px-8 py-4 rounded-2xl text-center">
                    <span className="text-slate-800 text-lg mr-3">Target Word:</span>
                    <span className="text-3xl font-black text-emerald-900 tracking-widest">{puzzle.targetWord}</span>
                </div>
            )}
        </div>
    );
}
