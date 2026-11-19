'use client';

import { useGameStore } from '@/store/useGameStore';
import { Trophy, ArrowLeft, ArrowRight } from 'lucide-react';

export default function LeaderboardView() {
    const { teams, setView } = useGameStore();
    const sorted = [...teams].sort((a, b) => b.score - a.score);

    return (
        <main className="h-screen w-screen overflow-hidden bg-[#f5e8cc] text-[#24211d] px-8 py-7 flex flex-col items-center justify-center">
            <Trophy className="w-14 h-14 md:w-20 md:h-20 text-[#b8860b] mb-3" />
            <p className="text-xs font-black uppercase tracking-[.24em] text-[#a82e22]">X-Insights · Live standings</p>
            <h1 className="text-4xl md:text-6xl font-black mb-2 text-center">Round 1 Standings</h1>
            <p className="text-base md:text-xl font-semibold text-[#62594d] mb-7 text-center">Accumulated points heading into Round 2</p>
            <div className="max-w-4xl w-full grid gap-3">
                {sorted.map((team, idx) => (
                    <div key={team.id} className={`flex items-center justify-between gap-4 px-5 py-4 rounded-2xl border-2 ${idx === 0 ? 'bg-[#f9e6a9] border-[#b8860b]' : 'bg-[#fff7e8] border-[#d8c8a8]'}`}>
                        <div className="flex min-w-0 items-center gap-4">
                            <span className="text-xl md:text-3xl font-black text-[#766e61] w-10">#{idx + 1}</span>
                            <span className="truncate text-xl md:text-3xl font-extrabold text-[#303b50]">{team.name}</span>
                        </div>
                        <span className="shrink-0 text-2xl md:text-4xl font-black text-[#a82e22]">{team.score} pts</span>
                    </div>
                ))}
            </div>
            <div className="mt-8 flex w-full max-w-4xl items-center justify-between gap-3">
                <button onClick={() => setView('JEOPARDY')} className="inline-flex items-center gap-2 rounded-xl border-2 border-[#303b50] bg-[#fff7e8] px-4 py-3 text-xs font-black uppercase tracking-wider text-[#303b50] hover:bg-[#303b50] hover:text-white">
                    <ArrowLeft size={16} /> Guessing Grid
                </button>
                <button onClick={() => setView('WORDLE_SELECT')} className="inline-flex items-center gap-2 rounded-xl bg-[#c83d2d] px-4 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-[#a82e22]">
                    Wordle <ArrowRight size={16} />
                </button>
            </div>
        </main>
    );
}
