'use client';

import { useGameStore } from '@/store/useGameStore';
import { Trophy, Sparkles, CheckCircle2, XCircle } from 'lucide-react';

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
                    <div className="max-w-4xl w-full max-h-full overflow-y-auto bg-[#fff7e8] text-[#24211d] border-4 border-[#e9b949] rounded-3xl p-6 md:p-10 text-center shadow-2xl">
                        <div className="inline-flex items-center gap-2 bg-[#f5e8cc] text-[#a82e22] px-5 py-2 rounded-full text-lg font-bold mb-6">
                            <Sparkles className="w-5 h-5" />
                            {activeQuestion.category} • {activeQuestion.points} PTS
                        </div>

                        {activeQuestion.isImageQuestion && activeQuestion.imageUrl ? (
                            <div className="mb-8">
                                <h1 className="text-2xl md:text-4xl font-extrabold leading-tight text-[#24211d] mb-5">
                                    Estimate the total worth of everything shown in this image.
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

                        <div className="text-lg text-[#62594d] mb-6">
                            Unit: <span className="text-[#a82e22] font-bold">{activeQuestion.unit}</span>
                        </div>

                        {lastGuesstimateResult && (
                            <div
                                className={`mt-8 p-8 rounded-2xl border-2 ${lastGuesstimateResult.won
                                        ? 'bg-[#dcebdd] border-[#28784b] text-[#155b37]'
                                        : 'bg-[#f8dfd9] border-[#c83d2d] text-[#a82e22]'
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-3 text-xl md:text-3xl font-black mb-2">
                                    {lastGuesstimateResult.won ? (
                                        <>
                                            <CheckCircle2 className="w-9 h-9" /> WITHIN RANGE! +
                                            {lastGuesstimateResult.points} PTS
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-9 h-9" /> OUTSIDE RANGE! 0 PTS
                                        </>
                                    )}
                                </div>
                                <p className="text-base md:text-xl text-[#24211d] mt-2">
                                    {lastGuesstimateResult.teamName} guessed:{' '}
                                    <strong>
                                        {lastGuesstimateResult.guess.toLocaleString()} {activeQuestion.unit}
                                    </strong>{' '}
                                    • Actual Answer:{' '}
                                    <strong className="text-amber-400">
                                        {lastGuesstimateResult.actual?.toLocaleString()} {activeQuestion.unit}
                                    </strong>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}