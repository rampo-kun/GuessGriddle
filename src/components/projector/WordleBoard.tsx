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
        correct: 'bg-emerald-600 border-emerald-400 text-white',
        present: 'bg-amber-500 border-amber-300 text-slate-950',
        absent: 'bg-slate-800 border-slate-700 text-slate-300',
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 flex flex-col items-center gap-7">
            <div className="max-w-4xl w-full bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 text-center shadow-xl">
                <div className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">
                    Wordle #{puzzle.number} • Position Challenge
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">“{puzzle.definition}”</h2>
                <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-slate-400">
                    <span>New Yellow: +{config.wordleNewYellowPoints} pts</span>
                    <span>•</span>
                    <span>New Green: +{config.wordleNewGreenPoints} pts</span>
                </div>
                <p className="mt-3 text-sm font-bold text-amber-300">Choose one letter and one position per turn. The answer length is hidden.</p>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-3">
                <span className="text-sm uppercase tracking-wider text-slate-400 font-bold">Turn Order:</span>
                {queueOrder.map((team, i) => (
                    <div key={team.id} className={`px-4 py-1.5 rounded-full text-sm font-bold border ${
                        !puzzle.isCompleted && team.id === activeTeam?.id
                            ? 'bg-amber-500 text-slate-950 border-amber-300 scale-105'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>{i + 1}. {team.name}</div>
                ))}
            </div>

            <div className="w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold uppercase tracking-widest text-slate-400">Attempts</span>
                    <span className="text-sm text-slate-400">{puzzle.guesses.length} / 20</span>
                </div>
                {puzzle.guesses.length === 0 ? (
                    <div className="py-10 text-center text-slate-500">No letters revealed yet. Let the guessing begin.</div>
                ) : (
                    <div className="space-y-3">
                        {puzzle.guesses.map((guess, index) => {
                            const team = teams.find((t) => t.id === guess.teamId);
                            return (
                                <div key={`${guess.teamId}-${index}`} className="flex items-center gap-3 rounded-xl bg-slate-950 p-3">
                                    <span className="w-32 truncate text-sm font-bold text-slate-400">{team?.name ?? 'Team'}</span>
                                    <span className={`h-12 w-12 rounded-lg border-2 flex items-center justify-center text-2xl font-black ${statusStyle[guess.status]}`}>{guess.letter}</span>
                                    <span className="text-sm text-slate-300">Position {guess.position}</span>
                                    <span className="ml-auto text-sm font-bold text-indigo-300">+{guess.pointsEarned} pts</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="flex flex-wrap justify-center gap-5 text-sm font-bold">
                <span className="text-emerald-400">■ Green: correct position</span>
                <span className="text-amber-400">■ Yellow: letter exists elsewhere</span>
                <span className="text-slate-400">■ Grey: letter not in answer</span>
            </div>

            {puzzle.isCompleted && (
                <div className="bg-emerald-950 border-2 border-emerald-500 px-8 py-4 rounded-2xl text-center">
                    <span className="text-slate-300 text-lg mr-3">Target Word:</span>
                    <span className="text-3xl font-black text-emerald-400 tracking-widest">{puzzle.targetWord}</span>
                </div>
            )}
        </div>
    );
}
