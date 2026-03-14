'use client';

import {useEffect, useRef} from 'react';

export default function MatrixBackground({timeout}: {timeout: number}) {
    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvasEl = canvas.current;
        if (!canvasEl) return;

        const context = canvasEl.getContext('2d');
        if (!context) return;

        const width = document.body.offsetWidth;
        const height = document.body.offsetHeight;
        canvasEl.width = width;
        canvasEl.height = height;

        context.fillStyle = '#000';
        context.fillRect(0, 0, width, height);

        const columns = Math.floor(width / 20) + 1;
        const yPositions = Array.from({length: columns}).fill(0) as number[];

        let animId: number;
        let lastTime = 0;
        let visible = true;

        const matrixEffect = () => {
            context.fillStyle = '#0001';
            context.fillRect(0, 0, width, height);

            context.fillStyle = '#9a9';
            context.font = '12pt monospace';

            yPositions.forEach((y, index) => {
                const text = String.fromCharCode(Math.random() * 128);
                const x = index * 20;
                context.fillText(text, x, y);

                if (y > 100 + Math.random() * 10000) {
                    yPositions[index] = 0;
                } else {
                    yPositions[index] = y + 20;
                }
            });
        };

        const loop = (time: number) => {
            if (!visible) {
                animId = requestAnimationFrame(loop);
                return;
            }
            if (time - lastTime >= timeout) {
                lastTime = time;
                matrixEffect();
            }
            animId = requestAnimationFrame(loop);
        };

        animId = requestAnimationFrame(loop);

        const observer = new IntersectionObserver(
            ([entry]) => { visible = entry.isIntersecting; },
            {threshold: 0},
        );
        observer.observe(canvasEl);

        return () => {
            cancelAnimationFrame(animId);
            observer.disconnect();
        };
    }, [timeout]);

    return (
        <div className="fixed left-0 top-0 -z-10 h-full w-full overflow-hidden bg-black">
            <canvas ref={canvas} />
        </div>
    );
}
