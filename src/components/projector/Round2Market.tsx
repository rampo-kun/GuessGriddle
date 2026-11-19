'use client';

import { useGameStore } from '@/store/useGameStore';
import { Coins, Lock, Sparkles, Trophy } from 'lucide-react';

export default function Round2Market({ isFinale = false }: { isFinale?: boolean }) {
    const { teams, r2TurnIndex, currentMarketWord, r2LastActionBanner, config } = useGameStore();
    const currentTeam = teams[r2TurnIndex];
    const columns = teams.length > 12 ? 3 : teams.length > 6 ? 2 : 1;

    return (
        <main className="h-screen w-screen overflow-hidden bg-[#FFF3D6] text-[#24211D] flex flex-col p-3 md:p-5 gap-2 md:gap-3">
            <header className="shrink-0 bg-[#24211D] rounded-2xl px-5 py-3 flex items-center justify-between border-b-[5px] border-[#FFD447]">
                <div className="min-w-0">
                    <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-[#FFD447]">X-Insights Presents</div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                        {isFinale ? 'THE WIKIPEDIA RACE' : 'THE WORD MARKET'}
                    </h1>
                </div>
                <div className="text-right shrink-0 pl-3">
                    <div className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[#FFD447]">{isFinale ? 'GRAND FINALE' : 'ROUND 2'}</div>
                    <div className="text-base md:text-lg font-black text-white">{teams.length} TEAMS</div>
                </div>
            </header>

            {!isFinale && (
                <section className="shrink-0 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-2 md:gap-4">
                    <div className="bg-white border-[3px] border-[#24211D] rounded-2xl px-4 md:px-6 py-2 md:py-3 flex items-center justify-between shadow-[0_4px_0_#24211D] min-w-0">
                        <div className="min-w-0">
                            <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-[#A52B20]">Word on the Block</div>
                            <h2 className="text-2xl md:text-4xl xl:text-5xl font-black leading-tight tracking-wide whitespace-normal break-words">
                                {currentMarketWord || 'WAITING FOR WORD'}
                            </h2>
                        </div>
                        <div className="hidden md:flex items-center justify-center bg-[#FFD447] rounded-xl w-14 h-14 lg:w-16 lg:h-16 shrink-0 ml-3">
                            <Sparkles className="w-8 h-8 text-[#24211D]" />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <PriceChip label="BUY" cost={config.r2BuyCost} background="bg-[#DCEBDD]" color="text-[#174B2B]" />
                        <PriceChip label="ASSIGN" cost={config.r2AssignCost} background="bg-[#FFE4DE]" color="text-[#8D2419]" />
                        <PriceChip label="STEAL" cost={config.r2StealCost} background="bg-[#DCE5F2]" color="text-[#243B5A]" extra={`${config.r2StealRefundPercent}% refund`} />
                    </div>
                </section>
            )}

            {r2LastActionBanner && !isFinale && (
                <div className="shrink-0 bg-[#D94332] text-white border-2 border-[#A52B20] rounded-xl px-4 py-2 text-center text-sm md:text-lg font-black">
                    <Sparkles className="inline w-5 h-5 mr-2" />{r2LastActionBanner}
                </div>
            )}

            <section className="flex-1 min-h-0 bg-white border-[3px] border-[#24211D] rounded-2xl p-2 md:p-3 flex flex-col shadow-[0_5px_0_#24211D]">
                <div className="shrink-0 flex justify-between items-center px-2 pb-2 border-b-2 border-[#E6DECF]">
                    <div className="flex items-center gap-2 min-w-0">
                        <Trophy className="w-5 h-5 text-[#B8860B] shrink-0" />
                        <h2 className="text-base md:text-xl font-black uppercase tracking-wide">
                            {isFinale ? 'Final Word Collection' : 'Team Scoreboard'}
                        </h2>
                    </div>
                    <div className="text-[9px] md:text-xs font-black uppercase tracking-wide text-[#766E61] text-right">
                        {isFinale ? 'Green = Wikipedia page visited' : 'Live team standings'}
                    </div>
                </div>

                <div
                    className="flex-1 min-h-0 grid gap-2 pt-2"
                    style={{
                        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                        gridTemplateRows: `repeat(${Math.ceil(Math.max(teams.length, 1) / columns)}, minmax(0, 1fr))`,
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
                            <article
                                key={team.id}
                                className={`min-w-0 min-h-0 rounded-xl border-2 p-2 md:p-3 flex flex-col justify-center gap-1.5 ${isTurn ? 'bg-[#FFF0B8] border-[#24211D]' : 'bg-[#FFF9EC] border-[#E6DECF]'}`}
                            >
                                <div className="flex items-center justify-between gap-2 min-w-0">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-xs md:text-sm font-black shrink-0 ${isTurn ? 'bg-[#24211D] text-[#FFD447]' : 'bg-[#E9E2D4] text-[#24211D]'}`}>
                                            {idx + 1}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-sm md:text-base font-black leading-tight whitespace-normal break-words">{team.name}</div>
                                            {isTurn && <span className="text-[9px] font-black uppercase tracking-wider text-[#79500A]">Currently Playing</span>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <Coins className={`w-3.5 h-3.5 ${isTurn ? 'text-[#79500A]' : 'text-[#B8860B]'}`} />
                                        <span className="text-base md:text-xl font-black tabular-nums">{team.score}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-1 min-w-0">
                                    {words.map((word, slotIdx) => {
                                        const isVisited = isFinale && !!word && (team.visitedWords ?? []).includes(word);
                                        return (
                                            <div
                                                key={slotIdx}
                                                title={word || 'Empty Slot'}
                                                className={`min-w-0 min-h-8 md:min-h-9 px-1.5 py-1 rounded-md border flex items-center justify-center gap-1 text-center transition-colors ${isVisited
                                                    ? 'bg-emerald-100 border-emerald-500 text-emerald-800'
                                                    : word
                                                        ? slotIdx === 0
                                                            ? 'bg-[#DCE5F2] border-[#496B9A] text-[#243B5A]'
                                                            : 'bg-[#DCEBDD] border-[#35A86B] text-[#174B2B]'
                                                        : 'bg-[#F2EFE8] border-dashed border-[#B6AD9E] text-[#625D55]'
                                                }`}
                                            >
                                                {slotIdx === 0 && word && <Lock className="w-3 h-3 shrink-0" />}
                                                <span className="text-[10px] md:text-xs font-black leading-tight whitespace-normal break-words [overflow-wrap:anywhere]">
                                                    {word || '—'}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </article>
                        );
                    })}
                </div>

                <div className="shrink-0 border-t-2 border-[#E6DECF] mt-2 pt-2 px-2 flex flex-wrap justify-between items-center gap-2 text-[9px] md:text-xs font-bold text-[#766E61]">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#DCE5F2] border border-[#496B9A]" />Starting Word</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#DCEBDD] border border-[#35A86B]" />Acquired Word</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-emerald-100 border border-emerald-500" />Visited Page</span>
                    </div>
                    {!isFinale && <span className="font-black uppercase tracking-wider">Active Team: {currentTeam?.name || '—'}</span>}
                </div>
            </section>

            <footer className="shrink-0 flex items-center justify-between px-2 text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] text-[#766E61]">
                <span>X-INSIGHTS · GUESSGRIDDLE</span>
                <span>{isFinale ? 'GRAND FINALE' : 'LET THE BIDDING BEGIN'}</span>
            </footer>
        </main>
    );
}

function PriceChip({ label, cost, background, color, extra }: {
    label: string;
    cost: number;
    background: string;
    color: string;
    extra?: string;
}) {
    return (
        <div className={`${background} ${color} rounded-xl border-2 border-current/20 px-2 py-1.5 md:px-3 md:py-2 min-w-0 flex flex-col justify-center text-center`}>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{label}</span>
            <span className="text-base md:text-lg font-black leading-tight">{cost}</span>
            <span className="text-[8px] md:text-[9px] font-bold uppercase">{extra || 'Points'}</span>
        </div>
    );
}
