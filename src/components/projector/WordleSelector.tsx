'use client';

import { useGameStore } from '@/store/useGameStore';
import { Check, Lock } from 'lucide-react';

export default function WordleSelector() {
    const { wordles } = useGameStore();
    const tiers = [
        { key: 'easy', label: 'Easy', points: 'Up to 90 pts', color: 'border-emerald-500 text-emerald-900' },
        { key: 'medium', label: 'Medium', points: 'Up to 130 pts', color: 'border-amber-500 text-amber-900' },
        { key: 'hard', label: 'Hard', points: 'Up to 180 pts', color: 'border-rose-500 text-rose-900' },
    ] as const;

    return (
        <main className="min-h-screen w-screen overflow-y-auto bg-[#f5e8cc] text-[#24211d] px-6 py-8 flex flex-col items-center">
            <div className="text-center mb-8">
                <span className="inline-flex rounded-full border border-[#c83d2d]/30 bg-[#fff7e8] px-4 py-2 text-xs font-black uppercase tracking-[.2em] text-[#a82e22]">Jeopardy Bonus Challenge</span>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight mt-4 text-[#24211d]">Choose Your Wordle</h1>
                <p className="text-base md:text-xl font-bold text-[#514a40] mt-3">Host selects the team · Team chooses a difficulty and puzzle</p>
            </div>
            <div className="w-full max-w-6xl space-y-7">
                {tiers.map((tier) => {
                    const puzzles = wordles.filter((puzzle) => (puzzle.difficulty ?? 'medium') === tier.key);
                    return (
                        <section key={tier.key} className="rounded-2xl border-2 border-[#d8c8a8] bg-[#fffaf0] p-5">
                            <div className="flex items-center justify-between gap-3 mb-4">
                                <h2 className={`text-2xl font-black uppercase ${tier.color.split(' ')[1]}`}>{tier.label}</h2>
                                <span className="text-xs font-black uppercase tracking-widest text-[#766e61]">{tier.points}</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                {puzzles.map((puzzle) => (
                                    <div key={puzzle.id} className={`min-h-28 rounded-xl border-2 flex flex-col items-center justify-center ${puzzle.isCompleted ? 'bg-[#e9dfcc] border-[#cfc2aa] text-[#766e61]' : 'bg-[#303b50] border-[#e9b949] text-[#fff7e8] shadow-[0_4px_0_#24211d]'}`}>
                                        <span className="text-3xl md:text-4xl font-black">{puzzle.number}</span>
                                        <span className="mt-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">{puzzle.isCompleted ? <><Check className="w-3 h-3" /> Completed</> : <><Lock className="w-3 h-3" /> Available</>}</span>
                                    </div>
                                ))}
                                {puzzles.length === 0 && <p className="text-sm text-[#766e61]">No puzzles in this tier yet.</p>}
                            </div>
                        </section>
                    );
                })}
            </div>
            <p className="mt-8 text-xs font-black uppercase tracking-[.2em] text-[#766e61]">X-Insights · GuessGriddle</p>
        </main>
    );
}
