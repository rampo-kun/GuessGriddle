'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import JeopardyView from '@/components/projector/JeopardyView';
import WordleSelector from '@/components/projector/WordleSelector';
import WordleBoard from '@/components/projector/WordleBoard';
import LeaderboardView from '@/components/projector/LeaderboardView';
import Round2Market from '@/components/projector/Round2Market';

export default function ProjectorPage() {
    const { activeView, teams, hydrateFromStorage } = useGameStore();
    useEffect(() => { hydrateFromStorage(); }, [hydrateFromStorage]);

    if (activeView === 'JEOPARDY') return <JeopardyView />;
    if (activeView === 'WORDLE_SELECT') return <WordleSelector />;
    if (activeView === 'WORDLE_PLAY') return <WordleBoard />;
    if (activeView === 'R1_LEADERBOARD') return <LeaderboardView />;
    if (activeView === 'ROUND2_MARKET') return <Round2Market isFinale={false} />;
    if (activeView === 'WIKIRACE_FINALE') return <Round2Market isFinale={true} />;

    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#f5e8cc] px-8 py-12 text-center text-[#24211d]">
            <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full border-[40px] border-[#e9b949]/25" />
            <div aria-hidden="true" className="pointer-events-none absolute -right-28 bottom-0 h-96 w-96 rounded-full border-[48px] border-[#c83d2d]/10" />
            <div className="relative mb-8 inline-flex items-center gap-3 rounded-full border border-[#c83d2d]/30 bg-[#fff7e8] px-5 py-2 text-sm font-black uppercase tracking-[.25em] text-[#c83d2d] shadow-sm"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#c83d2d]"/>X-Insights Presents</div>
            <h1 className="relative text-7xl font-black leading-[.88] tracking-[-.07em] text-[#24211d] md:text-9xl">GUESS<span className="text-[#c83d2d]">GRIDDLE</span></h1>
            <p className="relative mt-7 text-xl font-bold text-[#766e61] md:text-3xl">Guesstimates <span className="text-[#c83d2d]">·</span> Wordle <span className="text-[#c83d2d]">·</span> Word Market <span className="text-[#c83d2d]">·</span> Wild Pitches</p>
            <div className="relative mt-14 flex max-w-5xl flex-wrap justify-center gap-4">{teams.map((t)=><div key={t.id} className="rounded-2xl border-2 border-[#303b50]/15 bg-[#fff7e8] px-7 py-4 text-xl font-black text-[#303b50] shadow-[0_8px_18px_rgba(58,43,23,.08)]">{t.name}</div>)}</div>
            <div className="relative mt-16 flex items-center gap-3 text-xs font-black uppercase tracking-[.28em] text-[#9b6a08]"><span className="h-px w-12 bg-[#e9b949]"/>Get ready to play<span className="h-px w-12 bg-[#e9b949]"/></div>
        </main>
    );
}
