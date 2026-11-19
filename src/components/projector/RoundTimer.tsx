'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/useGameStore';

export default function RoundTimer({ compact = false }: { compact?: boolean }) {
    const { roundTimerStartedAt, roundTimerPhase, config, endThinkingTime } = useGameStore();
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        if (roundTimerPhase !== 'thinking' || !roundTimerStartedAt) return;
        const interval = window.setInterval(() => setNow(Date.now()), 100);
        return () => window.clearInterval(interval);
    }, [roundTimerPhase, roundTimerStartedAt]);

    const durationMs = Math.max(1, (config.roundTimerSeconds || 45) * 1000);
    const elapsedMs = roundTimerStartedAt ? Math.max(0, now - roundTimerStartedAt) : 0;
    const remaining = roundTimerPhase === 'thinking' && roundTimerStartedAt
        ? Math.max(0, Math.ceil((durationMs - elapsedMs) / 1000))
        : 0;
    const progress = roundTimerPhase === 'thinking'
        ? Math.max(0, Math.min(100, ((durationMs - elapsedMs) / durationMs) * 100))
        : 0;

    useEffect(() => {
        if (
            roundTimerPhase === 'thinking' &&
            roundTimerStartedAt &&
            Date.now() - roundTimerStartedAt >= durationMs
        ) {
            endThinkingTime();
        }
    }, [now, roundTimerPhase, roundTimerStartedAt, durationMs, endThinkingTime]);

    useEffect(() => {
        // Keep the displayed value accurate immediately after a timer restart.
        setNow(Date.now());
    }, [roundTimerStartedAt, roundTimerPhase]);

    if (roundTimerPhase === 'idle') return null;

    const isAnswer = roundTimerPhase === 'answer';
    const urgent = remaining <= 10 && !isAnswer;
    const formatted = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`;

    return (
        <section
            role="timer"
            aria-live="off"
            aria-label={isAnswer ? 'Thinking time is over. Give your answer now.' : `${remaining} seconds remaining`}
            className={`mx-auto w-full ${compact ? '' : 'max-w-2xl'} overflow-hidden rounded-2xl border-[3px] shadow-[0_12px_32px_rgba(0,0,0,.3)] ${
                isAnswer
                    ? 'border-rose-300 bg-rose-950 text-white'
                    : urgent
                        ? 'border-rose-300 bg-rose-700 text-white'
                        : 'border-[#f2c14e] bg-[#182337] text-white'
            }`}
        >
            <div className={`flex flex-col items-center justify-center gap-1 ${compact ? 'px-4 py-3' : 'px-5 py-3 md:px-8 md:py-4'}`}>
                <p className={`${compact ? 'text-base tracking-[.22em]' : 'text-[11px] md:text-sm tracking-[.28em]'} font-black uppercase text-[#f2c14e]`}>
                    {isAnswer ? 'Thinking time is over' : urgent ? 'Time is running out' : 'Time remaining'}
                </p>
                {isAnswer ? (
                    <div className={`py-1 font-black uppercase tracking-[.08em] ${compact ? 'text-5xl' : 'text-3xl md:text-5xl'}`}>
                        ANSWER NOW
                    </div>
                ) : (
                    <div className={`font-black tabular-nums leading-none tracking-tight ${compact ? 'text-[110px]' : 'text-[clamp(3.5rem,9vw,6.5rem)]'} ${urgent ? 'animate-pulse' : ''}`}>
                        {formatted}
                    </div>
                )}
                <p className={`${compact ? 'text-sm' : 'text-[10px] md:text-xs'} font-bold uppercase tracking-[.18em] text-white/75`}>
                    {isAnswer ? 'Host: enter the team’s final answer' : 'The team must answer before time runs out'}
                </p>
            </div>
            <div className="h-2 w-full bg-black/35">
                <div
                    className={`h-full transition-[width] duration-100 ${isAnswer ? 'w-0 bg-rose-300' : urgent ? 'bg-rose-200' : 'bg-[#f2c14e]'}`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </section>
    );
}
