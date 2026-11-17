'use client';

import { useGameStore } from '@/store/useGameStore';
import { Lock, Check } from 'lucide-react';

export default function WordleSelector() {
    const { wordles, teams, wordleCountCompleted } = useGameStore();
    const nextStarter = teams[wordleCountCompleted % Math.max(1, teams.length)];

    return (
        <div className="min-h-screen bg-slate-950 text-white p-10 flex flex-col items-center justify-center">
            <div className="text-center mb-12">
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest">
                    Wordle Intermission Round
                </span>
                <h1 className="text-5xl font-black mt-4">Select a Wordle Challenge</h1>
                {nextStarter && (
                    <p className="text-2xl text-slate-300 mt-3">
                        Next Starting Team:{' '}
                        <span className="text-amber-400 font-extrabold">{nextStarter.name}</span>
                    </p>
                )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 max-w-4xl w-full">
                {wordles.map((w) => (
                    <div
                        key={w.id}
                        className={`aspect-square rounded-3xl flex flex-col items-center justify-center border-4 transition-all ${w.isCompleted
                                ? 'bg-slate-900/50 border-slate-800 text-slate-600 grayscale opacity-60'
                                : 'bg-gradient-to-br from-emerald-600 to-teal-800 border-emerald-400 text-white shadow-2xl shadow-emerald-950'
                            }`}
                    >
                        <span className="text-7xl font-black">{w.number}</span>
                        <span className="mt-3 text-sm font-bold uppercase tracking-widest flex items-center gap-1">
                            {w.isCompleted ? (
                                <>
                                    <Check className="w-4 h-4" /> Done
                                </>
                            ) : (
                                'Available'
                            )}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}