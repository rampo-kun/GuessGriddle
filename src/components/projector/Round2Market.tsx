'use client';

import { useGameStore } from '@/store/useGameStore';
import { Coins, Lock, Sparkles, Trophy } from 'lucide-react';
import ProjectorStage from './ProjectorStage';

/**
 * Layout density for the team grid. Everything is laid out on a fixed
 * 1920x1080 stage (see ProjectorStage), so these tiers are tuned once and
 * hold on any projector. More teams -> more columns and tighter cards.
 */
function getDensity(teamCount: number) {
    const columns = teamCount <= 5 ? 1 : teamCount <= 12 ? 2 : teamCount <= 18 ? 3 : 4;
    const rows = Math.max(1, Math.ceil(teamCount / columns));
    // Word slots sit in one row when the card is wide, as a 2x2 block when narrow.
    const wideCards = columns <= 2;
    const tier = teamCount <= 8 ? 'roomy' : teamCount <= 10 ? 'normal' : 'compact';
    const t = {
        roomy: { name: 'text-2xl', score: 'text-3xl', rank: 'w-10 h-10 text-lg', word: 'text-lg', slot: 'min-h-[3.25rem]', pad: 'p-3', gap: 'gap-2' },
        normal: { name: 'text-xl', score: 'text-2xl', rank: 'w-9 h-9 text-base', word: 'text-base', slot: 'min-h-[2.75rem]', pad: 'p-2.5', gap: 'gap-1.5' },
        compact: { name: 'text-base', score: 'text-xl', rank: 'w-6 h-6 text-xs', word: 'text-xs', slot: 'min-h-[1.9rem]', pad: 'p-1.5', gap: 'gap-1' },
    }[tier];
    return { columns, rows, wideCards, ...t };
}

export default function Round2Market({ isFinale = false }: { isFinale?: boolean }) {
    const { teams, r2TurnIndex, currentMarketWord, r2LastActionBanner, config } = useGameStore();
    const currentTeam = teams[r2TurnIndex];
    const d = getDensity(teams.length);

    return (
        <ProjectorStage className="bg-[#FFF3D6] text-[#24211D] flex flex-col p-6 gap-3">
            <header className="shrink-0 bg-[#24211D] rounded-2xl px-7 py-3 flex items-center justify-between border-b-[5px] border-[#FFD447]">
                <div className="min-w-0">
                    <div className="text-xs font-black uppercase tracking-[0.2em] text-[#FFD447]">X-Insights Presents</div>
                    <h1 className="text-4xl font-black tracking-tight text-white leading-tight">
                        {isFinale ? 'THE WIKIPEDIA RACE' : 'THE WORD MARKET'}
                    </h1>
                </div>
                <div className="text-right shrink-0 pl-4">
                    <div className="text-xs font-black uppercase tracking-widest text-[#FFD447]">{isFinale ? 'GRAND FINALE' : 'ROUND 2'}</div>
                    <div className="text-xl font-black text-white">{teams.length} TEAMS</div>
                </div>
            </header>

            {!isFinale && (
                <>
                    <section className="shrink-0 h-[116px] flex gap-4">
                        <div className="flex-1 min-w-0 bg-white border-[3px] border-[#24211D] rounded-2xl px-6 py-2 flex items-center justify-between shadow-[0_4px_0_#24211D]">
                            <div className="min-w-0">
                                <div className="text-xs font-black uppercase tracking-[0.2em] text-[#A52B20]">Word on the Block</div>
                                <h2 className="text-5xl font-black leading-[1.05] tracking-wide break-words line-clamp-2">
                                    {currentMarketWord || 'WAITING FOR WORD'}
                                </h2>
                            </div>
                            <div className="flex items-center justify-center bg-[#FFD447] rounded-xl w-16 h-16 shrink-0 ml-4">
                                <Sparkles className="w-9 h-9 text-[#24211D]" />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 w-[480px] shrink-0">
                            <PriceChip label="BUY" cost={config.r2BuyCost} background="bg-[#DCEBDD]" color="text-[#174B2B]" />
                            <PriceChip label="ASSIGN" cost={config.r2AssignCost} background="bg-[#FFE4DE]" color="text-[#8D2419]" />
                            <PriceChip label="STEAL" cost={config.r2StealCost} background="bg-[#DCE5F2]" color="text-[#243B5A]" extra={`${config.r2StealRefundPercent}% refund`} />
                        </div>
                    </section>

                    {/* Reserved slot so the board below never jumps when a banner appears. */}
                    <div className={`shrink-0 h-11 rounded-xl border-2 px-4 flex items-center justify-center text-xl font-black ${r2LastActionBanner ? 'bg-[#D94332] text-white border-[#A52B20]' : 'border-transparent'}`}>
                        {r2LastActionBanner && (
                            <span className="flex items-center gap-2 min-w-0">
                                <Sparkles className="w-5 h-5 shrink-0" />
                                <span className="truncate">{r2LastActionBanner}</span>
                            </span>
                        )}
                    </div>
                </>
            )}

            <section className="flex-1 min-h-0 bg-white border-[3px] border-[#24211D] rounded-2xl p-3 flex flex-col shadow-[0_5px_0_#24211D]">
                <div className="shrink-0 flex justify-between items-center px-2 pb-2 border-b-2 border-[#E6DECF]">
                    <div className="flex items-center gap-2 min-w-0">
                        <Trophy className="w-6 h-6 text-[#B8860B] shrink-0" />
                        <h2 className="text-xl font-black uppercase tracking-wide">
                            {isFinale ? 'Final Word Collection' : 'Team Scoreboard'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-x-5 text-xs font-bold text-[#766E61]">
                        <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-sm bg-[#DCE5F2] border border-[#496B9A]" />Starting Word</span>
                        <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-sm bg-[#DCEBDD] border border-[#35A86B]" />Acquired Word</span>
                        {isFinale && <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-sm bg-emerald-100 border border-emerald-500" />Visited Page</span>}
                        {!isFinale && <span className="font-black uppercase tracking-wider text-[#24211D]">Active Team: {currentTeam?.name || '—'}</span>}
                    </div>
                </div>

                {/* Rows are capped so a handful of teams doesn't stretch into huge cards. */}
                <div
                    className="flex-1 min-h-0 grid gap-2 pt-3 content-center"
                    style={{
                        gridTemplateColumns: `repeat(${d.columns}, minmax(0, 1fr))`,
                        gridTemplateRows: `repeat(${d.rows}, minmax(0, 150px))`,
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
                                className={`min-w-0 min-h-0 overflow-hidden rounded-xl border-2 ${d.pad} flex flex-col justify-center ${d.gap} ${isTurn ? 'bg-[#FFF0B8] border-[#24211D]' : 'bg-[#FFF9EC] border-[#E6DECF]'}`}
                            >
                                <div className="flex items-center justify-between gap-3 min-w-0">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className={`${d.rank} rounded-lg flex items-center justify-center font-black shrink-0 ${isTurn ? 'bg-[#24211D] text-[#FFD447]' : 'bg-[#E9E2D4] text-[#24211D]'}`}>
                                            {idx + 1}
                                        </div>
                                        <div className={`${d.name} font-black leading-tight truncate`} title={team.name}>{team.name}</div>
                                        {isTurn && <span className="shrink-0 rounded-md bg-[#24211D] px-2 py-0.5 text-[11px] font-black uppercase tracking-wider text-[#FFD447]">Playing</span>}
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <Coins className={`w-5 h-5 ${isTurn ? 'text-[#79500A]' : 'text-[#B8860B]'}`} />
                                        <span className={`${d.score} font-black tabular-nums leading-none`}>{team.score}</span>
                                    </div>
                                </div>

                                <div className={`grid ${d.wideCards ? 'grid-cols-4' : 'grid-cols-2'} gap-1.5 min-w-0`}>
                                    {words.map((word, slotIdx) => {
                                        const isVisited = isFinale && !!word && (team.visitedWords ?? []).includes(word);
                                        return (
                                            <div
                                                key={slotIdx}
                                                title={word || 'Empty Slot'}
                                                className={`min-w-0 ${d.slot} px-2 py-1 rounded-md border flex items-center justify-center gap-1 text-center transition-colors ${isVisited
                                                    ? 'bg-emerald-100 border-emerald-500 text-emerald-800'
                                                    : word
                                                        ? slotIdx === 0
                                                            ? 'bg-[#DCE5F2] border-[#496B9A] text-[#243B5A]'
                                                            : 'bg-[#DCEBDD] border-[#35A86B] text-[#174B2B]'
                                                        : 'bg-[#F2EFE8] border-dashed border-[#B6AD9E] text-[#625D55]'
                                                    }`}
                                            >
                                                {slotIdx === 0 && word && <Lock className="w-3.5 h-3.5 shrink-0" />}
                                                <span className={`${d.word} font-black leading-tight line-clamp-2 break-words [overflow-wrap:anywhere]`}>
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
            </section>

            <footer className="shrink-0 flex items-center justify-between px-2 text-[11px] font-black uppercase tracking-[0.15em] text-[#766E61]">
                <span>X-INSIGHTS · GUESSGRIDDLE</span>
                <span>{isFinale ? 'GRAND FINALE' : 'LET THE BIDDING BEGIN'}</span>
            </footer>
        </ProjectorStage>
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
        <div className={`${background} ${color} rounded-xl border-2 border-current/20 px-2 min-w-0 flex flex-col items-center justify-center text-center`}>
            <span className="text-xs font-black uppercase tracking-widest">{label}</span>
            <span className="text-3xl font-black leading-tight">{cost}</span>
            <span className="text-[11px] font-bold uppercase">{extra || 'Points'}</span>
        </div>
    );
}
