'use client';

import { useGameStore } from '@/store/useGameStore';
import RoundTimer from '@/components/projector/RoundTimer';
import { ArrowLeft } from 'lucide-react';

export default function WordleBoard() {
    const { wordles, activeWordleId, teams, config, setView } = useGameStore();
    const puzzle = wordles.find((w) => w.id === activeWordleId);
    if (!puzzle) return null;

    const activeTeam = teams.find((team) => team.id === puzzle.assignedTeamId);
    const maxGuesses = config.wordleMaxGuesses ?? 6;
    const difficulty = puzzle.difficulty ?? 'medium';
    const pointsCap = difficulty === 'hard' ? 300 : difficulty === 'easy' ? 150 : 220;
    const totalPuzzlePoints = puzzle.guesses.reduce((sum, guess) => sum + guess.pointsEarned, 0);
    const letterCount = puzzle.targetWord.length;

    const statusStyle = {
        correct: 'bg-[#237747] border-[#155b35] text-white',
        present: 'bg-[#f4c542] border-[#a87500] text-[#241d0d]',
        absent: 'bg-[#525966] border-[#343b47] text-white',
    };

    return (
        <main className="wordle-screen h-[100dvh] w-screen overflow-hidden bg-[#f5e8cc] text-[#24211d] px-4 py-3 md:px-6 md:py-4 flex flex-col gap-3">
            <header className="shrink-0 flex items-center justify-between gap-4 rounded-2xl bg-[#303b50] px-5 py-3 md:px-7 border-b-4 border-[#e9b949] shadow-lg">
                <div className="min-w-0">
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[.22em] text-[#f2c14e]">X-Insights · Jeopardy Bonus Wordle</p>
                    <h1 className="text-xl md:text-3xl font-black tracking-tight text-white">WORDLE <span className="text-[#f2c14e]">#{puzzle.number}</span></h1>
                </div>
                <div className="shrink-0 text-right">
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[#f2c14e]">{puzzle.isCompleted ? 'Challenge complete' : 'SELECTED TEAM'}</p>
                    <p className="max-w-[34vw] truncate text-lg md:text-2xl font-black text-white">{puzzle.isCompleted ? 'ANSWER REVEALED' : activeTeam?.name ?? 'Teams ready?'}</p>
                </div>
            </header>

            <section className="shrink-0 flex justify-center px-2" aria-label="Audience countdown"><RoundTimer /></section>

            <section className="shrink-0 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(230px,320px)] gap-3">
                <div className="rounded-2xl border-2 border-[#d8c8a8] bg-[#fffaf0] px-5 py-3 md:px-6 md:py-4 shadow-[0_4px_0_rgba(48,59,80,.12)] min-w-0">
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[.2em] text-[#a82e22]">Decode the clue</p>
                    <h2 className="mt-1 text-base md:text-2xl font-extrabold leading-snug text-[#24211d]">“{puzzle.definition}”</h2>
                    <p className="mt-2 text-[10px] md:text-xs font-black uppercase tracking-wider text-[#514a40]">{letterCount} letters · {maxGuesses} attempts · Guess the complete word</p>
                </div>
                <div className={`rounded-2xl border-[3px] px-5 py-3 flex flex-col justify-center shadow-[0_4px_0_rgba(48,59,80,.12)] ${puzzle.isCompleted ? 'border-[#237747] bg-[#e1f0e5]' : 'border-[#24211d] bg-[#f2c14e]'}`}>
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[.18em] text-[#514a40]">{puzzle.isCompleted ? 'Round status' : 'UP NOW · MAKE YOUR GUESS'}</p>
                    <p className="mt-1 text-xl md:text-3xl font-black leading-tight text-[#24211d] break-words">{puzzle.isCompleted ? 'Challenge complete' : activeTeam?.name ?? 'Waiting for teams'}</p>
                    <p className="mt-1 text-xs md:text-sm font-bold text-[#514a40]">{puzzle.guesses.length} of {maxGuesses} guesses used · {totalPuzzlePoints}/{pointsCap} points earned</p>
                </div>
            </section>

            <section className="shrink-0 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#d8c8a8] bg-[#fff7e8] px-3 py-2 text-xs font-bold text-[#514a40]">
                <span>WORDLE GRID · {difficulty.toUpperCase()} · MAX {pointsCap} PTS</span>
                <span>🟩 Correct position　 🟨 Correct letter　 ⬛ Not in answer</span>
            </section>

            <section className="wordle-history flex-1 min-h-0 rounded-2xl border-2 border-[#d8c8a8] bg-[#fffaf0] p-3 md:p-4 flex flex-col items-center justify-center shadow-[0_5px_0_rgba(48,59,80,.10)]">
                <div className="w-full flex items-center justify-between gap-3 border-b border-[#e6dece] pb-2 mb-3">
                    <h3 className="text-xs md:text-sm font-black uppercase tracking-widest text-[#303b50]">Guess board <span className="text-[#a82e22]">· {puzzle.guesses.length}/{maxGuesses}</span></h3>
                    <span className="text-xs md:text-sm font-black text-[#155b37]">Earned: {totalPuzzlePoints}/{pointsCap} pts</span>
                </div>
                <div
                    className="w-full max-w-[900px] min-h-0 flex-1 grid gap-1"
                    style={{ gridTemplateRows: `repeat(${maxGuesses}, minmax(0, 1fr))` }}
                >
                    {Array.from({ length: maxGuesses }, (_, rowIndex) => {
                        const guess = puzzle.guesses[rowIndex];
                        const team = guess ? teams.find((t) => t.id === guess.teamId) : undefined;
                        return (
                            <div key={rowIndex} className="grid min-h-0 grid-cols-[2rem_minmax(0,1fr)_4.5rem] md:grid-cols-[3.5rem_minmax(0,1fr)_9.5rem] items-center gap-2 md:gap-4">
                                <div className="min-w-0 text-right">
                                    <span className="text-[10px] md:text-xs font-black text-[#766e61]">{rowIndex + 1}</span>
                                </div>
                                <div
                                    className="grid h-full min-h-0 max-w-full justify-self-center items-center gap-1 md:gap-1.5"
                                    style={{
                                        gridTemplateColumns: `repeat(${letterCount}, minmax(0, 1fr))`,
                                        aspectRatio: `${letterCount} / 1`,
                                        width: 'auto',
                                    }}
                                >
                                    {Array.from({ length: letterCount }, (_, letterIndex) => {
                                        const letter = guess?.word[letterIndex] ?? '';
                                        const status = guess?.statuses[letterIndex];
                                        return (
                                            <div
                                                key={letterIndex}
                                                className={`flex aspect-square h-full min-h-0 min-w-0 items-center justify-center rounded-md md:rounded-lg border-2 text-[clamp(11px,2.1vh,22px)] font-black ${status ? statusStyle[status] : 'border-[#cfc5b4] bg-[#fffdf8] text-[#24211d]'}`}
                                                title={status === 'correct' ? 'Correct position' : status === 'present' ? 'Correct letter, wrong position' : status === 'absent' ? 'Not in answer' : 'Empty letter slot'}
                                            >
                                                {letter}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="w-full min-w-0">
                                    {guess ? (
                                        <>
                                            <p className="truncate text-[9px] md:text-xs font-black text-[#303b50]">{team?.name ?? 'Team'}</p>
                                            <p className="text-[10px] md:text-xs font-black text-[#155b37]">+{guess.pointsEarned} pts</p>
                                        </>
                                    ) : <span className="text-[9px] md:text-xs font-bold text-[#b6aa96]">—</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>
                {puzzle.isCompleted && (
                    <div className="mt-3 rounded-xl border border-[#b7d4bd] bg-[#e1f0e5] px-5 py-2 text-center">
                        <p className="text-xs md:text-sm font-black uppercase tracking-wider text-[#155b37]">Answer: {puzzle.targetWord} · {totalPuzzlePoints}/{pointsCap} points</p>
                    </div>
                )}
            </section>

            <footer className="shrink-0 flex items-center justify-between gap-3 px-1">
                <button onClick={() => setView('JEOPARDY')} className="inline-flex items-center gap-2 rounded-xl border-2 border-[#303b50] bg-[#fff7e8] px-4 py-2 text-[10px] md:text-xs font-black uppercase tracking-wider text-[#303b50] shadow-sm hover:bg-[#303b50] hover:text-white">
                    <ArrowLeft size={15} /> Go to Guessing Grid
                </button>
                <div className="text-[9px] md:text-[11px] font-black uppercase tracking-wider text-[#514a40]">X-INSIGHTS · WORDLE</div>
            </footer>
        </main>
    );
}
