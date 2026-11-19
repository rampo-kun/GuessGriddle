
'use client';

import { useGameStore } from '@/store/useGameStore';
import {
    Coins,
    Lock,
    Sparkles,
    Compass,
    Trophy,
} from 'lucide-react';

export default function Round2Market({
    isFinale = false,
}: {
    isFinale?: boolean;
}) {
    const {
        teams,
        r2TurnIndex,
        currentMarketWord,
        r2LastActionBanner,
        config,
    } = useGameStore();

    const currentTeam = teams[r2TurnIndex];

    return (
        <main className="h-screen w-screen overflow-hidden bg-[#FFF3D6] text-[#24211D] flex flex-col p-5 gap-3">

            {/* ================= HEADER ================= */}
            <header className="shrink-0 bg-[#24211D] rounded-2xl px-6 py-3 flex items-center justify-between border-b-[5px] border-[#FFD447]">

                <div>
                    <div className="text-xs font-black uppercase tracking-[0.25em] text-[#FFD447]">
                        X-Insights Presents
                    </div>

                    <h1 className="text-3xl font-black tracking-tight text-white">
                        {isFinale
                            ? 'THE WIKIPEDIA RACE'
                            : 'THE WORD MARKET'}
                    </h1>
                </div>

                <div className="text-right">
                    <div className="text-xs font-black uppercase tracking-widest text-[#FFD447]">
                        {isFinale ? 'GRAND FINALE' : 'ROUND 2'}
                    </div>
                    <div className="text-lg font-black text-white">
                        {teams.length} TEAMS
                    </div>
                </div>
            </header>


            {/* ================= AUCTION SPOTLIGHT ================= */}
            {!isFinale && (
                <section className="shrink-0 grid grid-cols-[1fr_auto] gap-4">

                    {/* CURRENT WORD */}
                    <div className="bg-white border-[3px] border-[#24211D] rounded-2xl px-6 py-3 flex items-center justify-between shadow-[0_4px_0_#24211D] min-w-0">

                        <div className="min-w-0">
                            <div className="text-xs font-black uppercase tracking-[0.2em] text-[#A52B20]">
                                Word on the Block
                            </div>

                            <h2 className="text-5xl font-black leading-tight tracking-wide truncate">
                                {currentMarketWord || 'WAITING FOR WORD'}
                            </h2>
                        </div>

                        <div className="hidden lg:flex items-center justify-center bg-[#FFD447] rounded-xl w-20 h-20 shrink-0 ml-4">
                            <Sparkles className="w-10 h-10 text-[#24211D]" />
                        </div>
                    </div>

                    {/* PRICE LEGEND */}
                    <div className="flex gap-2">

                        <PriceChip
                            label="BUY"
                            cost={config.r2BuyCost}
                            background="bg-[#DCEBDD]"
                            color="text-[#174B2B]"
                        />

                        <PriceChip
                            label="ASSIGN"
                            cost={config.r2AssignCost}
                            background="bg-[#FFE4DE]"
                            color="text-[#8D2419]"
                        />

                        <PriceChip
                            label="STEAL"
                            cost={config.r2StealCost}
                            background="bg-[#DCE5F2]"
                            color="text-[#243B5A]"
                            extra={`${config.r2StealRefundPercent}% refund`}
                        />

                    </div>
                </section>
            )}


            {/* ================= LIVE ACTION BANNER ================= */}
            {r2LastActionBanner && !isFinale && (
                <div className="shrink-0 bg-[#D94332] text-white border-2 border-[#A52B20] rounded-xl px-5 py-2 text-center text-lg font-black">
                    <Sparkles className="inline w-5 h-5 mr-2" />
                    {r2LastActionBanner}
                </div>
            )}


            {/* ================= SCOREBOARD ================= */}
            <section className="flex-1 min-h-0 bg-white border-[3px] border-[#24211D] rounded-2xl p-3 flex flex-col shadow-[0_5px_0_#24211D]">

                {/* TABLE TITLE */}
                <div className="shrink-0 flex justify-between items-center px-3 pb-2 border-b-2 border-[#E6DECF]">

                    <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-[#B8860B]" />
                        <h2 className="text-xl font-black uppercase tracking-wide">
                            {isFinale ? 'Final Word Collection' : 'Team Scoreboard'}
                        </h2>
                    </div>

                    <div className="text-xs font-black uppercase tracking-widest text-[#766E61]">
                        {isFinale ? '✓ = Wikipedia page visited by host' : 'Live team standings'}
                    </div>
                </div>


                {/* COLUMN HEADINGS */}
                <div className="shrink-0 grid grid-cols-[34px_minmax(110px,1fr)_minmax(0,3fr)_90px] gap-3 px-4 py-2 text-xs font-black uppercase tracking-widest text-[#766E61]">
                    <span>#</span>
                    <span>Team</span>
                    <span>Word Collection</span>
                    <span className="text-right">Points</span>
                </div>


                {/* TEAM ROWS */}
                <div className="flex-1 min-h-0 grid gap-1.5"
                    style={{
                        gridTemplateRows: `repeat(${Math.max(teams.length, 1)}, minmax(0, 1fr))`,
                    }}
                >

                    {teams.map((team, idx) => {
                        const isTurn = !isFinale && idx === r2TurnIndex;

                        const words = [
                            team.startingWord || '',
                            (team.words ?? [])[0] || '',
                            (team.words ?? [])[1] || '',
                            (team.words ?? [])[2] || '',
                        ];

                        return (
                            <div
                                key={team.id}
                                className={`min-h-0 grid grid-cols-[34px_minmax(110px,1fr)_minmax(0,3fr)_90px] gap-3 items-center px-4 rounded-xl border-2 transition-colors ${isTurn
                                    ? 'bg-[#FFD447] border-[#24211D]'
                                    : 'bg-[#FFF9EC] border-[#E6DECF]'
                                    }`}
                            >

                                {/* TEAM NUMBER */}
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black ${isTurn
                                    ? 'bg-[#24211D] text-[#FFD447]'
                                    : 'bg-[#E9E2D4] text-[#24211D]'
                                    }`}>
                                    {idx + 1}
                                </div>


                                {/* TEAM NAME */}
                                <div className="min-w-0 flex flex-col justify-center">
                                    <div className="text-base md:text-lg font-black truncate leading-tight">
                                        {team.name}
                                    </div>

                                    {isTurn && (
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#79500A]">
                                            Currently Playing
                                        </span>
                                    )}
                                </div>


                                {/* FOUR WORD SLOTS */}
                                <div className="grid grid-cols-4 gap-1.5 min-w-0">


                                    {words.map((word, slotIdx) => {
                                        const isVisited =
                                            isFinale &&
                                            !!word &&
                                            (team.visitedWords ?? []).includes(word);

                                        return (
                                            <div
                                                key={slotIdx}
                                                title={word || 'Empty Slot'}
                                                className={`min-w-0 h-10 px-2 rounded-lg border flex items-center justify-center gap-1 transition-colors ${isVisited
                                                        ? 'bg-emerald-100 border-emerald-500 text-emerald-800'
                                                        : word
                                                            ? slotIdx === 0
                                                                ? 'bg-[#DCE5F2] border-[#496B9A] text-[#243B5A]'
                                                                : 'bg-[#DCEBDD] border-[#35A86B] text-[#174B2B]'
                                                            : 'bg-[#F2EFE8] border-dashed border-[#B6AD9E] text-[#625D55]'
                                                    }`}
                                            >
                                                {slotIdx === 0 && word && (
                                                    <Lock className="w-3 h-3 shrink-0" />
                                                )}

                                                <span className="text-sm font-black truncate">
                                                    {word || '—'}
                                                </span>
                                            </div>
                                        );
                                    })}


                                </div>


                                {/* TEAM SCORE */}
                                <div className="flex justify-end items-center gap-2">
                                    <Coins className={`w-4 h-4 ${isTurn ? 'text-[#79500A]' : 'text-[#B8860B]'
                                        }`} />

                                    <span className="text-xl md:text-2xl font-black tabular-nums">
                                        {team.score}
                                    </span>
                                </div>

                            </div>
                        );
                    })}

                </div>


                {/* TABLE LEGEND */}
                <div className="shrink-0 border-t-2 border-[#E6DECF] mt-2 pt-2 px-3 flex justify-between items-center text-xs font-bold text-[#766E61]">

                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-sm bg-[#DCE5F2] border border-[#496B9A]" />
                            Starting Word
                        </span>

                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-sm bg-[#DCEBDD] border border-[#35A86B]" />
                            Acquired Word
                        </span>

                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-sm bg-[#F2EFE8] border border-[#B6AD9E]" />
                            Empty Slot
                        </span>
                    </div>

                    {!isFinale && (
                        <span className="font-black uppercase tracking-wider">
                            Active Team: {currentTeam?.name || '—'}
                        </span>
                    )}

                </div>
            </section>


            {/* ================= FOOTER ================= */}
            <footer className="shrink-0 flex items-center justify-between px-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#766E61]">
                <span>X-INSIGHTS · GUESSGRIDDLE</span>
                <span>{isFinale ? 'GRAND FINALE' : 'LET THE BIDDING BEGIN'}</span>
            </footer>

        </main>
    );
}


/* ================= PRICE CHIP ================= */

function PriceChip({
    label,
    cost,
    background,
    color,
    extra,
}: {
    label: string;
    cost: number;
    background: string;
    color: string;
    extra?: string;
}) {
    return (
        <div className={`${background} ${color} rounded-xl border-2 border-current/20 px-3 py-2 min-w-[88px] flex flex-col justify-center text-center`}>
            <span className="text-[10px] font-black uppercase tracking-widest">
                {label}
            </span>

            <span className="text-lg font-black leading-tight">
                {cost}
            </span>

            <span className="text-[9px] font-bold uppercase">
                {extra || 'Points'}
            </span>
        </div>
    );
}
