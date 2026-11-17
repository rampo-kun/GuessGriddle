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

    useEffect(() => {
        hydrateFromStorage();
    }, [hydrateFromStorage]);

    if (activeView === 'JEOPARDY') return <JeopardyView />;
    if (activeView === 'WORDLE_SELECT') return <WordleSelector />;
    if (activeView === 'WORDLE_PLAY') return <WordleBoard />;
    if (activeView === 'R1_LEADERBOARD') return <LeaderboardView />;
    if (activeView === 'ROUND2_MARKET') return <Round2Market isFinale={false} />;
    if (activeView === 'WIKIRACE_FINALE') return <Round2Market isFinale={true} />;

    // Default Lobby Screen
    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-10 text-center">
            <div className="text-sm font-extrabold uppercase tracking-[0.3em] text-indigo-400 mb-4">
                X-Insights Presents
            </div>
            <h1 className="text-7xl md:text-8xl font-black tracking-tight bg-gradient-to-r from-amber-300 via-indigo-400 to-emerald-400 bg-clip-text text-transparent mb-8">
                GUESSGRIDDLE
            </h1>
            <p className="text-2xl text-slate-400 max-w-2xl mb-12">
                Guesstimates • Wordle • Word Marketplace • Wikipedia Race
            </p>

            <div className="flex flex-wrap justify-center gap-4">
                {teams.map((t) => (
                    <div
                        key={t.id}
                        className="bg-slate-900 border border-slate-700 px-6 py-3 rounded-2xl text-xl font-bold"
                    >
                        {t.name}
                    </div>
                ))}
            </div>
        </div>
    );
}