'use client';

import { useGameStore } from '@/store/useGameStore';
import { Coins, Sparkles, Compass, Lock } from 'lucide-react';

export default function Round2Market({ isFinale = false }: { isFinale?: boolean }) {
    const {
        teams,
        r2TurnIndex,
        currentMarketWord,
        r2LastActionBanner,
        config,
    } = useGameStore();

    const currentTeam = teams[r2TurnIndex];

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 flex flex-col justify-between">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-purple-500/30 p-6 rounded-3xl">
                <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
                        {isFinale ? 'Grand Finale • Wikipedia Race' : 'Round 2 • Word Marketplace'}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-black mt-1">
                        {isFinale
                            ? 'Connect All 4 Words on Wikipedia!'
                            : `Active Turn: ${currentTeam?.name || ''}`}
                    </h1>
                </div>

                {!isFinale && (
                    <div className="flex gap-4 text-sm font-bold">
                        <div className="bg-emerald-950/80 border border-emerald-500/40 px-4 py-2 rounded-xl text-emerald-300">
                            BUY: {config.r2BuyCost} pts
                        </div>
                        <div className="bg-amber-950/80 border border-amber-500/40 px-4 py-2 rounded-xl text-amber-300">
                            ASSIGN: {config.r2AssignCost} pts
                        </div>
                        <div className="bg-rose-950/80 border border-rose-500/40 px-4 py-2 rounded-xl text-rose-300">
                            STEAL: {config.r2StealCost} pts ({config.r2StealRefundPercent}% refund)
                        </div>
                    </div>
                )}
            </div>

            {/* Live Action Ticker */}
            {r2LastActionBanner && !isFinale && (
                <div className="my-4 bg-indigo-950/90 border border-indigo-400/40 text-indigo-200 px-6 py-3 rounded-2xl text-center text-xl font-bold">
                    {r2LastActionBanner}
                </div>
            )}

            {/* Spotlight Market Word Card (Only during Auction phase) */}
            {!isFinale && (
                <div className="my-4 flex justify-center">
                    <div className="bg-gradient-to-br from-purple-900/60 to-slate-900 border-2 border-purple-400 rounded-3xl px-14 py-8 text-center shadow-2xl min-w-[420px]">
                        <div className="text-xs uppercase tracking-widest text-purple-300 font-bold mb-2">
                            Word on the Block
                        </div>
                        {currentMarketWord ? (
                            <div className="text-5xl md:text-6xl font-black tracking-wider text-white">
                                {currentMarketWord}
                            </div>
                        ) : (
                            <div className="text-2xl font-bold text-slate-500 italic">
                                Waiting for host to draw next word (or steal!)
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Team Word Decks (1 Starting Word + 3 Acquired Slots = 4 Words) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-4 flex-1">
                {teams.map((team, idx) => {
                    const isTurn = !isFinale && idx === r2TurnIndex;
                    return (
                        <div
                            key={team.id}
                            className={`rounded-3xl p-6 border-2 flex flex-col justify-between transition-all ${isTurn
                                    ? 'bg-slate-900 border-amber-400 shadow-xl shadow-amber-950/30'
                                    : 'bg-slate-900/80 border-slate-800'
                                }`}
                        >
                            <div>
                                <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
                                    <h3 className="text-2xl font-black text-white">{team.name}</h3>
                                    <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full font-extrabold text-lg">
                                        <Coins className="w-4 h-4" /> {team.score}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {/* Slot 1: Locked Starting Word */}
                                    <div className="bg-indigo-950/70 border border-indigo-500/40 px-4 py-3 rounded-xl flex items-center justify-between">
                                        <span className="font-black text-xl tracking-wide text-indigo-200">
                                            1. {team.startingWord || '—'}
                                        </span>
                                        <span className="text-xs uppercase font-bold text-indigo-400 flex items-center gap-1">
                                            <Lock className="w-3.5 h-3.5" /> Start
                                        </span>
                                    </div>

                                    {/* Slots 2, 3, 4 */}
                                    {[0, 1, 2].map((slotIdx) => {
                                        const w = team.words[slotIdx];
                                        return (
                                            <div
                                                key={slotIdx}
                                                className={`px-4 py-3 rounded-xl border flex items-center justify-between ${w
                                                        ? 'bg-slate-800 border-slate-600 text-white'
                                                        : 'bg-slate-950/60 border-dashed border-slate-800 text-slate-600'
                                                    }`}
                                            >
                                                <span className="font-bold text-xl">
                                                    {slotIdx + 2}. {w || 'Empty Slot'}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {isFinale && (
                                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-emerald-400 text-sm font-bold">
                                    <span className="flex items-center gap-1.5">
                                        <Compass className="w-4 h-4" /> Wiki Race Deck Ready
                                    </span>
                                    <span>4 / 4 Words</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}