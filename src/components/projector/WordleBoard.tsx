'use client';

import { useGameStore } from '@/store/useGameStore';

export default function WordleBoard() {
    const { wordles, activeWordleId, teams, config } = useGameStore();
    const puzzle = wordles.find((w) => w.id === activeWordleId);
    if (!puzzle) return null;

    const activeTeamIdx = (puzzle.startingTeamIndex + puzzle.guesses.length) % Math.max(1, teams.length);
    const activeTeam = teams[activeTeamIdx];
    const queueOrder = teams.map((_, offset) => teams[(puzzle.startingTeamIndex + offset) % teams.length]);

    const statusStyle = {
        correct: 'bg-[#28784b] border-[#1d633c] text-white',
        present: 'bg-[#f2c14e] border-[#bd8b16] text-[#24211d]',
        absent: 'bg-[#555b66] border-[#454b55] text-white',
    };

    return (
        <main className="h-screen w-screen overflow-hidden bg-[#f5e8cc] text-[#24211d] px-5 py-4 flex flex-col gap-3">
            <header className="shrink-0 flex items-center justify-between rounded-2xl bg-[#303b50] px-6 py-3 text-[#fff7e8] border-b-4 border-[#e9b949]">
                <div>
                    <p className="text-[11px] font-black uppercase tracking-[.24em] text-[#f2c14e]">X-Insights · Wordle Intermission</p>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight">FULL-WORD CHALLENGE <span className="text-[#f2c14e]">#{puzzle.number}</span></h1>
                </div>
                <div className="text-right">
                    <p className="text-[11px] font-black uppercase tracking-widest text-[#f2c14e]">{puzzle.isCompleted ? 'Challenge complete' : 'Now playing'}</p>
                    <p className="text-lg md:text-xl font-black">{puzzle.isCompleted ? 'ANSWER REVEALED' : activeTeam?.name ?? 'Teams ready?'}</p>
                </div>
            </header>

            <section className="shrink-0 rounded-2xl border-2 border-[#d8c8a8] bg-[#fff7e8] px-6 py-4 text-center shadow-[0_5px_0_rgba(48,59,80,.10)]">
                <p className="text-[11px] font-black uppercase tracking-[.2em] text-[#a82e22]">Decode the clue</p>
                <h2 className="mt-1 text-xl md:text-3xl font-extrabold leading-snug text-[#24211d]">“{puzzle.definition}”</h2>
                <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-1 text-xs md:text-sm font-bold text-[#514a40]">
                    <span>New yellow letter: <b className="text-[#805600]">+{config.wordleNewYellowPoints}</b></span>
                    <span>New green position: <b className="text-[#155b37]">+{config.wordleNewGreenPoints}</b></span>
                    <span>Full solve: <b className="text-[#a82e22]">+{config.wordleExactWordBonus}</b></span>
                </div>
                <p className="mt-2 text-xs font-black uppercase tracking-wider text-[#a82e22]">Guess a complete word · Answer length stays hidden</p>
            </section>

            <section className="shrink-0 flex flex-wrap items-center justify-center gap-2">
                <span className="mr-1 text-[11px] font-black uppercase tracking-widest text-[#514a40]">Turn order</span>
                {queueOrder.map((team, i) => (
                    <div key={team.id} className={`rounded-full border px-3 py-1.5 text-xs md:text-sm font-extrabold ${!puzzle.isCompleted && team.id === activeTeam?.id ? 'bg-[#f2c14e] border-[#24211d] text-[#24211d] shadow-sm' : 'bg-[#fff7e8] border-[#d8c8a8] text-[#303b50]'}`}>
                        {i + 1}. {team.name}
                    </div>
                ))}
            </section>

            <section className="flex-1 min-h-0 rounded-2xl border-2 border-[#d8c8a8] bg-[#fffaf0] p-4 flex flex-col shadow-[0_5px_0_rgba(48,59,80,.10)]">
                <div className="shrink-0 flex items-center justify-between border-b border-[#e6dece] pb-2">
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#303b50]">Guess history</h3>
                    <span className="text-xs font-bold text-[#62594d]">{puzzle.guesses.length} / 20 attempts</span>
                </div>
                {puzzle.guesses.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-base font-semibold text-[#766e61]">No guesses yet. Let the guessing begin.</div>
                ) : (
                    <div className="min-h-0 flex-1 overflow-y-auto py-3 grid content-start gap-2">
                        {puzzle.guesses.map((guess, index) => {
                            const team = teams.find((t) => t.id === guess.teamId);
                            return (
                                <div key={`${guess.teamId}-${index}`} className="grid grid-cols-[minmax(100px,180px)_1fr_auto] items-center gap-3 rounded-xl border border-[#e6dece] bg-white px-3 py-2">
                                    <span className="truncate text-xs md:text-sm font-black text-[#303b50]">{team?.name ?? 'Team'}</span>
                                    <div className="flex flex-wrap gap-1">
                                        {guess.word.split('').map((letter, letterIndex) => (
                                            <span key={`${letter}-${letterIndex}`} className={`h-8 min-w-8 px-1.5 rounded-md border-2 flex items-center justify-center text-sm md:text-base font-black ${statusStyle[guess.statuses[letterIndex] ?? 'absent']}`} title={guess.statuses[letterIndex] === 'correct' ? 'Correct position' : guess.statuses[letterIndex] === 'present' ? 'Letter exists elsewhere' : 'Letter not in answer'}>
                                                {letter}
                                            </span>
                                        ))}
                                    </div>
                                    <span className="whitespace-nowrap text-xs md:text-sm font-black text-[#155b37]">+{guess.pointsEarned} pts</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            <footer className="shrink-0 flex flex-wrap items-center justify-between gap-2 px-2 text-[10px] md:text-xs font-black uppercase tracking-wider text-[#514a40]">
                <div className="flex flex-wrap gap-4">
                    <span><b className="text-[#155b37]">■ Green</b> Exact position</span>
                    <span><b className="text-[#805600]">■ Yellow</b> Letter elsewhere</span>
                    <span><b className="text-[#454b55]">■ Grey</b> Not in answer</span>
                </div>
                {puzzle.isCompleted && <span className="rounded-lg bg-[#dcebdd] px-3 py-1 text-[#155b37]">Answer: {puzzle.targetWord}</span>}
                <span>X-INSIGHTS · GUESSGRIDDLE</span>
            </footer>
        </main>
    );
}
