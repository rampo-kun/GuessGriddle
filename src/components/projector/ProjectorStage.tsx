'use client';

import { ReactNode, useEffect, useState } from 'react';

export const STAGE_WIDTH = 1920;
export const STAGE_HEIGHT = 1080;

/**
 * Lays its children out on a fixed 1920x1080 stage and scales the whole stage
 * to fit the real viewport (letterboxed on non-16:9 screens). Because the
 * layout is always computed at one known size, a board that fits here fits on
 * every projector, instead of overflowing on smaller or shorter screens.
 */
export default function ProjectorStage({ children, className = '' }: { children: ReactNode; className?: string }) {
    const [scale, setScale] = useState<number | null>(null);

    useEffect(() => {
        const update = () => setScale(Math.min(window.innerWidth / STAGE_WIDTH, window.innerHeight / STAGE_HEIGHT));
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden bg-[#FFF3D6]">
            <div
                className={className}
                style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: STAGE_WIDTH,
                    height: STAGE_HEIGHT,
                    transform: `translate(-50%, -50%) scale(${scale ?? 1})`,
                    transformOrigin: 'center center',
                    visibility: scale === null ? 'hidden' : 'visible',
                }}
            >
                {children}
            </div>
        </div>
    );
}
