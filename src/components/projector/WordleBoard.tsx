'use client';

import { useGameStore } from '@/store/useGameStore';

export default function WordleBoard() {
    const { wordles, activeWordleId, teams, config } = useGameStore();
    const puzzle = wordles.find((w) => w.id === activeWordleId);
    if (!puzzle) return null;

    const activeTeam = teams.find((team) => team.id === puzzle.assignedTeamId);
    const maxGuesses = config.wordleMaxGuesses ?? 6;
    const rewardByDifficulty = {
        easy: [90, 68, 50, 32, 18, 9],
        medium: [130, 98, 72, 46, 26, 13],
        hard: [180, 135, 99, 63, 36, 18],
    } as const;
    const nextGuessReward = rewardByDifficulty[puzzle.difficulty ?? 'medium'][puzzle.guesses.length] ?? 0;

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
                    <h1 className="text-xl md:text-3xl font-black tracking-tight text-white">FULL-WORD CHALLENGE <span className="text-[#f2c14e]">#{puzzle.number}</span></h1>
                </div>
                <div className="shrink-0 text-right">
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[#f2c14e]">{puzzle.isCompleted ? 'Challenge complete' : 'SELECTED TEAM'}</p>
                    <p className="max-w-[34vw] truncate text-lg md:text-2xl font-black text-white">{puzzle.isCompleted ? 'ANSWER REVEALED' : activeTeam?.name ?? 'Teams ready?'}</p>
                </div>
            </header>

            <section className="shrink-0 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(230px,320px)] gap-3">
                <div className="rounded-2xl border-2 border-[#d8c8a8] bg-[#fffaf0] px-5 py-3 md:px-6 md:py-4 shadow-[0_4px_0_rgba(48,59,80,.12)] min-w-0">
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[.2em] text-[#a82e22]">Decode the clue</p>
                    <h2 className="mt-1 text-base md:text-2xl font-extrabold leading-snug text-[#24211d]">“{puzzle.definition}”</h2>
                    <p className="mt-2 text-[10px] md:text-xs font-black uppercase tracking-wider text-[#514a40]">Guess a complete word · Answer length stays hidden</p>
                </div>
                <div className={`rounded-2xl border-[3px] px-5 py-3 flex flex-col justify-center shadow-[0_4px_0_rgba(48,59,80,.12)] ${puzzle.isCompleted ? 'border-[#237747] bg-[#e1f0e5]' : 'border-[#24211d] bg-[#f2c14e]'}`}>
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[.18em] text-[#514a40]">{puzzle.isCompleted ? 'Round status' : 'UP NOW · MAKE YOUR GUESS'}</p>
                    <p className="mt-1 text-xl md:text-3xl font-black leading-tight text-[#24211d] break-words">{puzzle.isCompleted ? 'Challenge complete' : activeTeam?.name ?? 'Waiting for teams'}</p>
                    {!puzzle.isCompleted && <p className="mt-1 text-xs md:text-sm font-bold text-[#514a40]">{puzzle.guesses.length} of {maxGuesses} guesses used · {puzzle.difficulty ?? 'medium'} difficulty</p>}
                </div>
            </section>

            <section className="shrink-0 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#d8c8a8] bg-[#fff7e8] px-3 py-2 text-xs font-bold text-[#514a40]">
                <span>ONE TEAM CHALLENGE · {puzzle.difficulty ?? 'medium'} WORDLE</span>
                <span>Potential solve reward this guess: {puzzle.isCompleted ? 0 : nextGuessReward} points</span>
            </section>

            <section className="wordle-history flex-1 min-h-0 rounded-2xl border-2 border-[#d8c8a8] bg-[#fffaf0] p-3 md:p-4 flex flex-col shadow-[0_5px_0_rgba(48,59,80,.10)]">
                <div className="shrink-0 flex items-center justify-between gap-3 border-b border-[#e6dece] pb-2">
                    <h3 className="text-xs md:text-sm font-black uppercase tracking-widest text-[#303b50]">Guess history <span className="text-[#a82e22]">· {puzzle.guesses.length}</span></h3>
                    <div className="flex items-center gap-3 text-[10px] md:text-xs font-bold text-[#514a40]">
                        <span>🟩 Exact</span><span>🟨 Elsewhere</span><span>⬛ Not in word</span>
                    </div>
                </div>
                {puzzle.guesses.length === 0 ? (
                    <div className="flex-1 min-h-0 flex flex-col items-center justify-center text-center">
                        <p className="text-lg md:text-2xl font-black text-[#303b50]">No guesses yet</p>
                        <p className="mt-1 text-sm md:text-base font-semibold text-[#766e61]">{activeTeam?.name ?? 'The first team'} is up. Let the guessing begin.</p>
                    </div>
                ) : (
                    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-2 grid content-start gap-2 pr-1">
                        {puzzle.guesses.map((guess, index) => {
                            const team = teams.find((t) => t.id === guess.teamId);
                            return (
                                <article key={`${guess.teamId}-${index}`} className="rounded-xl border border-[#e0d5c2] bg-white px-3 py-2 md:px-4 md:py-2.5">
                                    <div className="mb-1.5 flex items-center justify-between gap-3">
                                        <span className="min-w-0 truncate text-xs md:text-sm font-black text-[#303b50]">{index + 1}. {team?.name ?? 'Team'}</span>
                                        <span className="shrink-0 whitespace-nowrap text-xs md:text-sm font-black text-[#155b37]">+{guess.pointsEarned} pts</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 md:gap-1.5">
                                        {guess.word.split('').map((letter, letterIndex) => (
                                            <span key={`${letter}-${letterIndex}`} className={`wordle-tile flex h-[clamp(29px,3.4vh,42px)] min-w-[clamp(29px,2.35vw,42px)] items-center justify-center rounded-md border-2 px-1 text-sm md:text-lg font-black ${statusStyle[guess.statuses[letterIndex] ?? 'absent']}`} title={guess.statuses[letterIndex] === 'correct' ? 'Correct position' : guess.statuses[letterIndex] === 'present' ? 'Letter exists elsewhere' : 'Letter not in answer'}>
                                                {letter}
                                            </span>
                                        ))}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>

            <footer className="shrink-0 flex items-center justify-between gap-3 px-1 text-[9px] md:text-[11px] font-black uppercase tracking-wider text-[#514a40]">
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <span><b className="text-[#155b37]">GREEN</b> Correct position</span>
                    <span><b className="text-[#805600]">YELLOW</b> Correct letter, wrong position</span>
                    <span><b className="text-[#454b55]">GREY</b> Not in answer</span>
                </div>
                <div className="shrink-0 text-right">{puzzle.isCompleted && <span className="mr-3 rounded-lg bg-[#dcebdd] px-2 py-1 text-[#155b37]">Answer: {puzzle.targetWord}</span>}X-INSIGHTS</div>
            </footer>
        </main>
    );
}
