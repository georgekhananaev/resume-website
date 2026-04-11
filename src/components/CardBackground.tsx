'use client';

import {useEffect, useRef} from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    alpha: number;
}

export default function CardBackground({seed = 0}: {seed?: number}) {
    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const el = canvas.current;
        if (!el) return;
        const ctx = el.getContext('2d');
        if (!ctx) return;

        let animId: number;
        let visible = false;
        const dpr = window.devicePixelRatio || 1;

        const resize = () => {
            const rect = el.getBoundingClientRect();
            el.width = rect.width * dpr;
            el.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
        };
        resize();

        const w = () => el.width / dpr;
        const h = () => el.height / dpr;

        // Create particles
        const count = 25;
        const particles: Particle[] = [];
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * 400,
                y: Math.random() * 400,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                r: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.4 + 0.1,
            });
        }

        // Color based on seed
        const colors = [
            [99, 102, 241],  // indigo
            [59, 130, 246],  // blue
            [167, 139, 250], // purple
            [34, 197, 94],   // green
        ];
        const color = colors[seed % colors.length];

        const draw = () => {
            if (!visible) {
                animId = requestAnimationFrame(draw);
                return;
            }
            const cw = w();
            const ch = h();
            ctx.clearRect(0, 0, cw, ch);

            // Draw subtle grid
            ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.04)`;
            ctx.lineWidth = 0.5;
            const gridSize = 30;
            for (let x = 0; x < cw; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, ch);
                ctx.stroke();
            }
            for (let y = 0; y < ch; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(cw, y);
                ctx.stroke();
            }

            // Update and draw particles
            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = cw;
                if (p.x > cw) p.x = 0;
                if (p.y < 0) p.y = ch;
                if (p.y > ch) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${p.alpha})`;
                ctx.fill();
            }

            // Draw connections between nearby particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 80) {
                        const alpha = (1 - dist / 80) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            animId = requestAnimationFrame(draw);
        };

        draw();

        const ro = new ResizeObserver(resize);
        ro.observe(el);

        const io = new IntersectionObserver(
            ([entry]) => { visible = entry.isIntersecting; },
            {threshold: 0},
        );
        io.observe(el);

        return () => {
            cancelAnimationFrame(animId);
            ro.disconnect();
            io.disconnect();
        };
    }, [seed]);

    return (
        <canvas
            className="absolute inset-0 h-full w-full rounded-xl"
            ref={canvas}
            style={{background: '#050510'}}
        />
    );
}
