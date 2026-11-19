'use client';

import { useGameStore } from '@/store/useGameStore';
import RoundTimer from '@/components/projector/RoundTimer';
import ProjectorStage from '@/components/projector/ProjectorStage';
import { ArrowLeft } from 'lucide-react';

/**
 * Wordle projector screen, laid out on the fixed 1920x1080 stage (see
 * ProjectorStage). The guess grid is the hero on the left; the timer, clue and
 * team status live in a sidebar so nothing competes with the tiles for height.
 */

// Space available inside the guess card (stage px) used to size the tiles.
const GRID_MAX_WIDTH = 1000;
const GRID_MAX_HEIGHT = 700;
const TILE_GAP = 12;
const ROW_GAP = 12;
const MAX_TILE = 120;

export default function WordleBoard() {
    const { wordles, activeWordleId, teams, config, setView } = useGameStore();
    const puzzle = wordles.find((w) => w.id === activeWordleId);
    if (!puzzle) return null;

    const activeTeam = teams.find((team) => team.id === puzzle.assignedTeamId);
    const maxGuesses = config.wordleMaxGuesses ?? 6;
    const difficulty = puzzle.difficulty ?? 'medium';
    const letterCount = puzzle.targetWord.length;
    // Only a solved guess scores. The available score decreases with each attempt; failed guesses earn zero.
    const pointsCap = letterCount * Math.max(0, config.wordleNewGreenPoints);
    const totalPuzzlePoints = puzzle.guesses.reduce((sum, guess) => sum + guess.pointsEarned, 0);

    // Largest square tile that fits both the width and the height budget.
    const tileByWidth = Math.floor((GRID_MAX_WIDTH - (letterCount - 1) * TILE_GAP) / letterCount);
    const tileByHeight = Math.floor((GRID_MAX_HEIGHT - (maxGuesses - 1) * ROW_GAP) / maxGuesses);
    const tile = Math.max(40, Math.min(MAX_TILE, tileByWidth, tileByHeight));

    const statusStyle = {
        correct: 'bg-[#237747] border-[#155b35] text-white',
        present: 'bg-[#f4c542] border-[#a87500] text-[#241d0d]',
        absent: 'bg-[#525966] border-[#343b47] text-white',
    };

    const legend = [
        { swatch: statusStyle.correct, label: 'Correct letter, correct spot' },
        { swatch: statusStyle.present, label: 'Right letter, wrong spot' },
        { swatch: statusStyle.absent, label: 'Not in the answer' },
    ];

    return (
        <ProjectorStage className="bg-[#f5e8cc] text-[#24211d] flex flex-col gap-4 p-6">
            {/* Header */}
            <header className="shrink-0 flex items-center justify-between gap-6 rounded-2xl bg-[#303b50] px-8 py-4 border-b-4 border-[#e9b949] shadow-lg">
                <div className="min-w-0">
                    <p className="text-sm font-black uppercase tracking-[.22em] text-[#f2c14e]">X-Insights · Jeopardy Bonus Wordle</p>
                    <h1 className="text-5xl font-black tracking-tight text-white">WORDLE <span className="text-[#f2c14e]">#{puzzle.number}</span></h1>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                    <span className="rounded-full border-2 border-[#f2c14e] px-5 py-2 text-lg font-black uppercase tracking-widest text-[#f2c14e]">{difficulty} · max {pointsCap} pts</span>
                </div>
            </header>

            <div className="flex min-h-0 flex-1 gap-5">
                {/* Guess board (hero) */}
                <section className="flex min-w-0 flex-1 flex-col rounded-3xl border-2 border-[#d8c8a8] bg-[#fffaf0] px-8 py-5 shadow-[0_5px_0_rgba(48,59,80,.10)]">
                    <div className="flex items-center justify-between gap-4 border-b-2 border-[#e6dece] pb-3">
                        <h2 className="text-2xl font-black uppercase tracking-widest text-[#303b50]">
                            Guess board <span className="text-[#a82e22]">· {puzzle.guesses.length}/{maxGuesses}</span>
                        </h2>
                        <span className="text-2xl font-black text-[#155b37]">Earned: {totalPuzzlePoints}/{pointsCap} pts</span>
                    </div>

                    <div className="flex min-h-0 flex-1 flex-col items-center justify-center" style={{ gap: ROW_GAP }}>
                        {Array.from({ length: maxGuesses }, (_, rowIndex) => {
                            const guess = puzzle.guesses[rowIndex];
                            const team = guess ? teams.find((t) => t.id === guess.teamId) : undefined;
                            return (
                                <div key={rowIndex} className="flex w-full items-center justify-center gap-6">
                                    <span className="w-10 shrink-0 text-right text-3xl font-black text-[#9a917f]">{rowIndex + 1}</span>
                                    <div className="flex shrink-0" style={{ gap: TILE_GAP }}>
                                        {Array.from({ length: letterCount }, (_, letterIndex) => {
                                            const letter = guess?.word[letterIndex] ?? '';
                                            const status = guess?.statuses[letterIndex];
                                            return (
                                                <div
                                                    key={letterIndex}
                                                    style={{ width: tile, height: tile, fontSize: Math.round(tile * 0.58) }}
                                                    className={`flex items-center justify-center rounded-xl border-[3px] font-black uppercase leading-none ${status ? statusStyle[status] : 'border-[#cfc5b4] bg-[#fffdf8] text-[#24211d]'}`}
                                                    title={status === 'correct' ? 'Correct position' : status === 'present' ? 'Correct letter, wrong position' : status === 'absent' ? 'Not in answer' : 'Empty letter slot'}
                                                >
                                                    {letter}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="w-[230px] shrink-0 min-w-0">
                                        {guess ? (
                                            <>
                                                <p className="truncate text-2xl font-black text-[#303b50]">{team?.name ?? 'Team'}</p>
                                                <p className="text-2xl font-black text-[#155b37]">+{guess.pointsEarned} pts</p>
                                            </>
                                        ) : <span className="text-2xl font-bold text-[#c4b9a4]">—</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {puzzle.isCompleted && (
                        <div className="rounded-2xl border-2 border-[#b7d4bd] bg-[#e1f0e5] px-6 py-3 text-center">
                            <p className="text-2xl font-black uppercase tracking-wider text-[#155b37]">Answer: {puzzle.targetWord} · {totalPuzzlePoints}/{pointsCap} points</p>
                        </div>
                    )}
                </section>

                {/* Sidebar */}
                <aside className="flex w-[540px] shrink-0 flex-col gap-4">
                    <div aria-label="Audience countdown"><RoundTimer compact /></div>

                    <div className={`rounded-2xl border-[3px] px-6 py-4 shadow-[0_4px_0_rgba(48,59,80,.12)] ${puzzle.isCompleted ? 'border-[#237747] bg-[#e1f0e5]' : 'border-[#24211d] bg-[#f2c14e]'}`}>
                        <p className="text-base font-black uppercase tracking-[.18em] text-[#514a40]">{puzzle.isCompleted ? 'Round status' : 'Up now · make your guess'}</p>
                        <p className="mt-1 break-words text-5xl font-black leading-tight text-[#24211d]">{puzzle.isCompleted ? 'Challenge complete' : activeTeam?.name ?? 'Waiting for teams'}</p>
                        <p className="mt-1 text-xl font-bold text-[#514a40]">{puzzle.guesses.length} of {maxGuesses} guesses used</p>
                    </div>

                    <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border-2 border-[#d8c8a8] bg-[#fffaf0] px-6 py-4 shadow-[0_4px_0_rgba(48,59,80,.12)]">
                        <p className="text-base font-black uppercase tracking-[.2em] text-[#a82e22]">Decode the clue</p>
                        <h2 className="mt-2 text-3xl font-extrabold leading-snug text-[#24211d]">“{puzzle.definition}”</h2>
                        <p className="mt-3 text-base font-black uppercase tracking-wider text-[#514a40]">{letterCount} letters · {maxGuesses} attempts</p>
                    </div>

                    <div className="rounded-2xl border border-[#d8c8a8] bg-[#fff7e8] px-6 py-3">
                        <ul className="flex flex-col gap-2">
                            {legend.map((item) => (
                                <li key={item.label} className="flex items-center gap-3 text-lg font-bold text-[#403a32]">
                                    <span className={`h-7 w-7 shrink-0 rounded-md border-2 ${item.swatch}`} />
                                    {item.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div>

            <footer className="shrink-0 flex items-center justify-between gap-3 px-1">
                <button onClick={() => setView('JEOPARDY')} className="inline-flex items-center gap-2 rounded-xl border-2 border-[#303b50] bg-[#fff7e8] px-5 py-2 text-sm font-black uppercase tracking-wider text-[#303b50] shadow-sm hover:bg-[#303b50] hover:text-white">
                    <ArrowLeft size={18} /> Go to Guessing Grid
                </button>
                <div className="text-sm font-black uppercase tracking-wider text-[#514a40]">X-INSIGHTS · WORDLE</div>
            </footer>
        </ProjectorStage>
    );
}
