'use client';

import { Trophy, Sparkles } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';

export default function WikiWinnerView() {
    const { teams, winnerTeamId } = useGameStore();
    const winner = teams.find((team) => team.id === winnerTeamId);
    return <main className="flex min-h-screen w-screen flex-col items-center justify-center overflow-hidden bg-[#17130f] px-8 text-center text-white">
        <Sparkles className="mb-5 h-14 w-14 text-[#FFD447]" />
        <p className="text-xl font-black uppercase tracking-[.35em] text-[#FFD447]">X-Insights · GuessGriddle</p>
        <h1 className="mt-5 text-5xl font-black uppercase tracking-tight md:text-7xl">And the winner is...</h1>
        {winner ? <>
            <Trophy className="mt-10 h-28 w-28 text-[#FFD447]" />
            <div className="mt-5 rounded-3xl border-4 border-[#FFD447] bg-[#FFF3D6] px-12 py-8 text-5xl font-black text-[#24211D] shadow-2xl md:text-7xl">{winner.name}</div>
            <p className="mt-6 text-2xl font-bold text-[#FFD447]">{winner.score.toLocaleString()} POINTS</p>
        </> : <p className="mt-8 text-2xl text-amber-200">Winner not selected</p>}
    </main>;
}
