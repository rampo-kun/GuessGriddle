'use client';

import { useGameStore } from '@/store/useGameStore';
import { Trophy, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import RoundTimer from '@/components/projector/RoundTimer';

export default function JeopardyView() {
    const {
        teams,
        jeopardyTurnIndex,
        jeopardyBoard,
        activeJeopardyId,
        lastGuesstimateResult,
    } = useGameStore();

    const currentTeam = teams[jeopardyTurnIndex];
    const categories = Array.from(new Set(jeopardyBoard.map((q) => q.category)));
    const activeQuestion = jeopardyBoard.find((q) => q.id === activeJeopardyId);

    return (
        <div className="h-screen w-screen overflow-hidden bg-[#f5e8cc] text-[#24211d] p-4 md:p-5 flex flex-col gap-3">
            {/* Top Bar: Active Turn + Live Scores */}
            <div className="shrink-0 flex flex-wrap items-center justify-between gap-3 bg-[#303b50] text-[#fff7e8] border-b-4 border-[#e9b949] rounded-2xl px-5 py-3 shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="bg-[#e9b949] text-[#24211d] font-black px-4 py-2 rounded-xl text-sm uppercase tracking-wider animate-pulse">
                        Current Turn
                    </div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#f2c14e]">
                        {currentTeam ? currentTeam.name : 'No Teams'}
                    </h2>
                </div>

                <div className="flex flex-wrap gap-3">
                    {teams.map((t, idx) => (
                        <div
                            key={t.id}
                            className={`px-4 py-2 rounded-xl border transition-all ${idx === jeopardyTurnIndex
                                    ? 'bg-[#465875] border-[#f2c14e] scale-105'
                                    : 'bg-[#fff7e8]/10 border-[#fff7e8]/20'
                                }`}
                        >
                            <div className="text-xs text-[#f5e8cc] font-semibold">{t.name}</div>
                            <div className="text-xl font-black text-[#fff7e8]">{t.score} pts</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Jeopardy Grid */}
            <div
                className="grid gap-3 md:gap-4 flex-1 min-h-0"
                style={{
                    gridTemplateColumns: `repeat(${Math.max(1, categories.length)}, minmax(0, 1fr))`,
                }}
            >
                {categories.map((cat) => {
                    const questions = jeopardyBoard
                        .filter((q) => q.category === cat)
                        .sort((a, b) => a.points - b.points);

                    return (
                        <div key={cat} className="flex min-w-0 min-h-0 flex-col gap-2">
                            <div className="h-20 min-h-20 shrink-0 flex items-center justify-center overflow-hidden bg-[#303b50] text-[#fff7e8] px-2 py-2 rounded-xl text-center font-black text-xs md:text-sm leading-tight tracking-wide uppercase shadow border-b-4 border-[#e9b949] break-words [overflow-wrap:anywhere] line-clamp-3">
                                {cat}
                            </div>

                            {questions.map((q) => (
                                <div
                                    key={q.id}
                                    className={`flex-1 min-h-0 rounded-xl flex flex-col items-center justify-center border-2 transition-all ${q.isCompleted
                                            ? 'bg-[#e9dfcc] border-[#cfc2aa] text-[#766e61]'
                                            : 'bg-[#fff7e8] border-[#d8c8a8] text-[#a82e22] shadow-md'
                                        }`}
                                >
                                    {q.isCompleted ? (
                                        <span className="text-lg font-bold uppercase tracking-widest">
                                            Completed
                                        </span>
                                    ) : (
                                        <span className="text-5xl font-black">{q.points}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>

            {/* Active Guesstimate Modal on Smartboard (Hides Secret Bounds!) */}
            {activeQuestion && (
                <div className="fixed inset-0 bg-[#24211d]/95 backdrop-blur-md flex items-center justify-center p-5 md:p-8 z-50">
                    <div className="max-w-4xl w-full max-h-full overflow-y-auto bg-[#fff7e8] text-[#24211d] border-4 border-[#e9b949] rounded-3xl p-5 md:p-8 text-center shadow-2xl">
                        <div className="mb-5">
                            <RoundTimer />
                        </div>
                        <div className="inline-flex items-center gap-2 bg-[#f5e8cc] text-[#a82e22] px-5 py-2 rounded-full text-lg font-bold mb-6">
                            <Sparkles className="w-5 h-5" />
                            {activeQuestion.category} • {activeQuestion.points} PTS
                        </div>

                        {activeQuestion.isImageQuestion && activeQuestion.imageUrl ? (
                            <div className="mb-8">
                                <h1 className="text-2xl md:text-4xl font-extrabold leading-tight text-[#24211d] mb-5">
                                    Estimate the combined market value of all items shown in this image, in Indian rupees.
                                </h1>
                                <img
                                    src={activeQuestion.imageUrl}
                                    alt="Image valuation challenge"
                                    className="mx-auto max-h-[42vh] max-w-full rounded-2xl border border-[#d8c8a8] object-contain"
                                />
                            </div>
                        ) : (
                            <h1 className="text-2xl md:text-4xl font-extrabold leading-tight text-[#24211d] mb-7">
                                {activeQuestion.question}
                            </h1>
                        )}

                        <div className="text-lg text-[#62594d] mb-2">
                            Unit: <span className="text-[#a82e22] font-bold">{activeQuestion.unit}</span>
                        </div>

                        {lastGuesstimateResult && (
                            <div className={`mt-8 overflow-hidden rounded-3xl border-4 text-left shadow-2xl ${lastGuesstimateResult.won ? 'border-emerald-500 bg-emerald-50' : 'border-rose-500 bg-rose-50'}`}>
                                <div className={`flex flex-wrap items-center justify-between gap-3 px-6 py-5 ${lastGuesstimateResult.won ? 'bg-emerald-700 text-white' : 'bg-rose-700 text-white'}`}>
                                    <div className="flex items-center gap-3">
                                        {lastGuesstimateResult.won ? <CheckCircle2 className="h-10 w-10" /> : <XCircle className="h-10 w-10" />}
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-[.22em] opacity-80">Official result · {lastGuesstimateResult.teamName}</p>
                                            <h2 className="text-2xl md:text-4xl font-black">{lastGuesstimateResult.points === activeQuestion.points ? 'Perfect estimate!' : lastGuesstimateResult.points > 0 ? 'Close enough · Half credit!' : 'Not quite!'}</h2>
                                        </div>
                                    </div>
                                    <div className="rounded-xl bg-white/15 px-5 py-3 text-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Points earned</p>
                                        <p className="text-3xl font-black">{lastGuesstimateResult.points > 0 ? '+' : ''}{lastGuesstimateResult.points}</p>
                                    </div>
                                </div>
                                <div className="grid gap-3 p-5 sm:grid-cols-2">
                                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                        <p className="text-[10px] font-black uppercase tracking-[.18em] text-slate-500">Team’s answer</p>
                                        <p className="mt-2 break-words text-2xl md:text-3xl font-black text-slate-900">{lastGuesstimateResult.guess.toLocaleString()} <span className="text-base font-bold text-slate-500">{activeQuestion.unit}</span></p>
                                    </div>
                                    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4">
                                        <p className="text-[10px] font-black uppercase tracking-[.18em] text-amber-800">Actual answer</p>
                                        <p className="mt-2 break-words text-2xl md:text-3xl font-black text-slate-900">{lastGuesstimateResult.actual?.toLocaleString()} <span className="text-base font-bold text-slate-500">{activeQuestion.unit}</span></p>
                                    </div>
                                </div>
                                <p className="px-5 pb-5 text-center text-xs font-bold uppercase tracking-widest text-slate-500">
                                    {lastGuesstimateResult.points === activeQuestion.points ? 'Within full-credit tolerance · Full points awarded' : lastGuesstimateResult.points > 0 ? 'Within half-credit tolerance · Half points awarded' : 'Outside the accepted range · No points awarded'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}