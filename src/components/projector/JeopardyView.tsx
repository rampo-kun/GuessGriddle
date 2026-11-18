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
        <div className="min-h-screen bg-slate-950 text-white p-8 flex flex-col justify-between">
            {/* Top Bar: Active Turn + Live Scores */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-5 shadow-2xl">
                <div className="flex items-center gap-4">
                    <div className="bg-amber-500 text-slate-950 font-black px-4 py-2 rounded-xl text-sm uppercase tracking-wider animate-pulse">
                        Current Turn
                    </div>
                    <h2 className="text-3xl font-extrabold text-amber-400">
                        {currentTeam ? currentTeam.name : 'No Teams'}
                    </h2>
                </div>

                <div className="flex flex-wrap gap-3">
                    {teams.map((t, idx) => (
                        <div
                            key={t.id}
                            className={`px-4 py-2 rounded-xl border transition-all ${idx === jeopardyTurnIndex
                                    ? 'bg-indigo-600/30 border-amber-400 scale-105'
                                    : 'bg-slate-800/80 border-slate-700'
                                }`}
                        >
                            <div className="text-xs text-slate-400 font-semibold">{t.name}</div>
                            <div className="text-xl font-black text-white">{t.score} pts</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Jeopardy Grid */}
            <div
                className="grid gap-6 my-8 flex-1"
                style={{
                    gridTemplateColumns: `repeat(${Math.max(1, categories.length)}, minmax(0, 1fr))`,
                }}
            >
                {categories.map((cat) => {
                    const questions = jeopardyBoard
                        .filter((q) => q.category === cat)
                        .sort((a, b) => a.points - b.points);

                    return (
                        <div key={cat} className="flex min-w-0 flex-col gap-4">
                            <div className="h-24 min-h-24 flex items-center justify-center overflow-hidden bg-gradient-to-r from-indigo-700 to-purple-700 px-3 py-2 rounded-2xl text-center font-black text-base md:text-lg leading-tight tracking-wide uppercase shadow-lg border border-indigo-400/30 break-words [overflow-wrap:anywhere]">
                                {cat}
                            </div>

                            {questions.map((q) => (
                                <div
                                    key={q.id}
                                    className={`flex-1 min-h-[120px] rounded-2xl flex flex-col items-center justify-center border-2 transition-all ${q.isCompleted
                                            ? 'bg-slate-900/40 border-slate-800 text-slate-600'
                                            : 'bg-slate-900 border-indigo-500/40 text-amber-400 shadow-xl'
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
                <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-10 z-50">
                    <div className="max-w-4xl w-full bg-slate-900 border-2 border-indigo-500 rounded-3xl p-12 text-center shadow-2xl">
                        <div className="inline-flex items-center gap-2 bg-indigo-600/30 text-indigo-300 px-5 py-2 rounded-full text-lg font-bold mb-6">
                            <Sparkles className="w-5 h-5" />
                            {activeQuestion.category} • {activeQuestion.points} PTS
                        </div>

                        {activeQuestion.isImageQuestion && activeQuestion.imageUrl ? (
                            <div className="mb-8">
                                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-white mb-6">
                                    Estimate the total worth of everything shown in this image.
                                </h1>
                                <img
                                    src={activeQuestion.imageUrl}
                                    alt="Image valuation challenge"
                                    className="mx-auto max-h-[48vh] max-w-full rounded-2xl border border-indigo-400/40 object-contain"
                                />
                            </div>
                        ) : (
                            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-white mb-10">
                                {activeQuestion.question}
                            </h1>
                        )}

                        <div className="text-xl text-slate-400 mb-8">
                            Unit: <span className="text-amber-400 font-bold">{activeQuestion.unit}</span>
                        </div>

                        {lastGuesstimateResult && (
                            <div
                                className={`mt-8 p-8 rounded-2xl border-2 ${lastGuesstimateResult.won
                                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                                        : 'bg-rose-950/80 border-rose-500 text-rose-300'
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-3 text-3xl font-black mb-2">
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
                                <p className="text-xl text-white mt-2">
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