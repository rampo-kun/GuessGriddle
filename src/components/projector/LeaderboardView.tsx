'use client';

import { useGameStore } from '@/store/useGameStore';
import { Trophy } from 'lucide-react';

export default function LeaderboardView() {
    const { teams } = useGameStore();
    const sorted = [...teams].sort((a, b) => b.score - a.score);

    return (
        <div className="min-h-screen bg-slate-950 text-white p-10 flex flex-col items-center justify-center">
            <Trophy className="w-20 h-20 text-amber-400 mb-4" />
            <h1 className="text-5xl font-black mb-2">Round 1 Standings</h1>
            <p className="text-xl text-slate-400 mb-10">
                Accumulated Points Heading Into Round 2
            </p>

            <div className="max-w-3xl w-full space-y-4">
                {sorted.map((team, idx) => (
                    <div
                        key={team.id}
                        className={`flex items-center justify-between p-6 rounded-2xl border-2 ${idx === 0
                                ? 'bg-amber-500/20 border-amber-400 scale-105'
                                : 'bg-slate-900 border-slate-800'
                            }`}
                    >
                        <div className="flex items-center gap-5">
                            <span className="text-3xl font-black text-slate-500 w-10">
                                #{idx + 1}
                            </span>
                            <span className="text-3xl font-extrabold">{team.name}</span>
                        </div>
                        <span className="text-4xl font-black text-amber-400">
                            {team.score} pts
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}