'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/useGameStore';

export default function RoundTimer() {
    const { roundTimerStartedAt, roundTimerPhase, config, endThinkingTime } = useGameStore();
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        if (roundTimerPhase !== 'thinking' || !roundTimerStartedAt) return;
        const interval = window.setInterval(() => setNow(Date.now()), 100);
        return () => window.clearInterval(interval);
    }, [roundTimerPhase, roundTimerStartedAt]);

    const remaining = roundTimerPhase === 'thinking' && roundTimerStartedAt
        ? Math.max(0, Math.ceil((config.roundTimerSeconds * 1000 - (now - roundTimerStartedAt)) / 1000))
        : 0;

    useEffect(() => {
        if (roundTimerPhase === 'thinking' && roundTimerStartedAt &&
            Date.now() - roundTimerStartedAt >= config.roundTimerSeconds * 1000) {
            endThinkingTime();
        }
    }, [now, roundTimerPhase, roundTimerStartedAt, config.roundTimerSeconds, endThinkingTime]);

    if (roundTimerPhase === 'idle') return null;
    const isAnswer = roundTimerPhase === 'answer';
    const urgent = remaining <= 10 && !isAnswer;

    return (
        <div className={`flex items-center justify-center gap-3 rounded-2xl border-2 px-5 py-3 shadow-lg ${isAnswer ? 'border-rose-500 bg-rose-950 text-white' : urgent ? 'border-rose-500 bg-rose-600 text-white' : 'border-[#e9b949] bg-[#303b50] text-white'}`}>
            <div className="text-[10px] font-black uppercase tracking-[.2em] opacity-80">
                {isAnswer ? 'Thinking time over · answer now' : 'Time to think'}
            </div>
            {!isAnswer && <div className="text-3xl md:text-4xl font-black tabular-nums">{String(Math.floor(remaining / 60)).padStart(2, '0')}:{String(remaining % 60).padStart(2, '0')}</div>}
            {isAnswer && <div className="text-xl md:text-2xl font-black uppercase tracking-wider">Say your answer!</div>}
        </div>
    );
}
