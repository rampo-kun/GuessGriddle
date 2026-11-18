'use client';

import { useGameStore } from '@/store/useGameStore';
import { Check } from 'lucide-react';

export default function WordleSelector() {
    const { wordles, teams, wordleCountCompleted } = useGameStore();
    const nextStarter = teams[wordleCountCompleted % Math.max(1, teams.length)];

    return (
        <main className="h-screen w-screen overflow-hidden bg-[#f5e8cc] text-[#24211d] px-8 py-7 flex flex-col items-center justify-center">
            <div className="text-center mb-8">
                <span className="inline-flex rounded-full border border-[#c83d2d]/30 bg-[#fff7e8] px-4 py-2 text-xs font-black uppercase tracking-[.2em] text-[#a82e22]">Wordle Intermission Round</span>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight mt-4 text-[#24211d]">Select a Wordle Challenge</h1>
                {nextStarter && <p className="text-lg md:text-2xl font-bold text-[#514a40] mt-3">Next starting team: <span className="text-[#a82e22]">{nextStarter.name}</span></p>}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl w-full">
                {wordles.map((w) => (
                    <div key={w.id} className={`aspect-[1.35] rounded-2xl flex flex-col items-center justify-center border-2 transition-all ${w.isCompleted ? 'bg-[#e9dfcc] border-[#cfc2aa] text-[#766e61]' : 'bg-[#303b50] border-[#e9b949] text-[#fff7e8] shadow-[0_5px_0_#24211d]'}`}>
                        <span className="text-4xl md:text-6xl font-black">{w.number}</span>
                        <span className="mt-2 text-xs font-black uppercase tracking-widest flex items-center gap-1">{w.isCompleted ? <><Check className="w-4 h-4" /> Done</> : 'Available'}</span>
                    </div>
                ))}
            </div>
            <p className="mt-8 text-xs font-black uppercase tracking-[.2em] text-[#766e61]">X-Insights · GuessGriddle</p>
        </main>
    );
}
