'use client';

import {useEffect, useRef} from 'react';

/**
 * Animated infrastructure-grid background.
 *
 * Renders a dense grid of rounded cells whose opacity is driven by three
 * layered sine waves (one radial from the center, two orthogonal along
 * x and y), producing a smooth, propagating "data flow" pattern that
 * evokes a data-center topology or a network heatmap.
 *
 * - Pauses rendering when off-screen (IntersectionObserver)
 * - Honours prefers-reduced-motion (renders a single static frame)
 * - Device-pixel-ratio aware, caps at 2x for perf on retina
 */
export default function GridBackground() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const prefersReduced =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const startTime = performance.now();
        let raf: number | null = null;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;
            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const draw = () => {
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;
            const t = (performance.now() - startTime) / 1000;

            ctx.clearRect(0, 0, w, h);

            // Cell sizing: responsive, clamped
            const cellSize = Math.max(36, Math.min(w, h) / 16);
            const gap = 4;
            const box = cellSize - gap;
            const cols = Math.ceil(w / cellSize) + 1;
            const rows = Math.ceil(h / cellSize) + 1;
            const cx = cols / 2;
            const cy = rows / 2;

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const dx = x - cx;
                    const dy = y - cy;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // Three layered waves: radial ripple + two orthogonal
                    const w1 = Math.sin(t * 1.1 - dist * 0.38);
                    const w2 = Math.sin(t * 0.7 + x * 0.28);
                    const w3 = Math.sin(t * 0.9 + y * 0.22);
                    const wave = (w1 + w2 + w3) / 3; // -1..1
                    const intensity = (wave + 1) / 2; // 0..1

                    // Gamma curve makes peaks pop, valleys sit quietly
                    const alpha = 0.025 + Math.pow(intensity, 2.4) * 0.26;

                    // Indigo accent matches brand (#6366f1 = indigo-500)
                    ctx.fillStyle = `rgba(99, 102, 241, ${alpha.toFixed(3)})`;

                    const px = x * cellSize + gap / 2;
                    const py = y * cellSize + gap / 2;
                    ctx.beginPath();
                    ctx.roundRect(px, py, box, box, 5);
                    ctx.fill();
                }
            }

            if (!prefersReduced) {
                raf = requestAnimationFrame(draw);
            }
        };

        const start = () => {
            if (raf === null) {
                draw();
            }
        };

        const stop = () => {
            if (raf !== null) {
                cancelAnimationFrame(raf);
                raf = null;
            }
        };

        resize();
        start();

        window.addEventListener('resize', resize);

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) start();
                else stop();
            },
            {threshold: 0},
        );
        observer.observe(canvas);

        return () => {
            stop();
            window.removeEventListener('resize', resize);
            observer.disconnect();
        };
    }, []);

    return (
        <canvas
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
            ref={canvasRef}
        />
    );
}
