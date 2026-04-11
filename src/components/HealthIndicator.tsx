'use client';

import {useEffect, useState} from 'react';

/**
 * Live health indicator — small colored dot + tooltip, rendered next to
 * the version badge in the Footer. Polls `/api/health` once on mount and
 * renders one of three states:
 *
 *   checking → gray dot, "Checking…"          (initial, before fetch)
 *   ok       → green dot with ping halo       (200 from endpoint)
 *   error    → red dot                         (503 or fetch failure)
 *
 * `cache: 'no-store'` is set on the fetch so the browser doesn't return
 * a stale response from its disk cache. The endpoint itself has its own
 * `Cache-Control: public, max-age=30` header which applies at CDN/edge
 * layers, so this only bypasses the browser's own cache for accuracy.
 *
 * No polling loop — a single fetch on mount is enough. If the visitor
 * loads the page, the site is up. A follow-up state change mainly
 * catches cases where the static HTML was served from the CDN cache
 * while the origin is currently degraded.
 */

type HealthState = 'checking' | 'ok' | 'error';

export default function HealthIndicator() {
    const [state, setState] = useState<HealthState>('checking');

    useEffect(() => {
        const controller = new AbortController();
        fetch('/api/health', {cache: 'no-store', signal: controller.signal})
            .then(async res => {
                if (!res.ok) return setState('error');
                const data = (await res.json()) as {status?: string};
                setState(data.status === 'ok' ? 'ok' : 'error');
            })
            .catch(err => {
                if (err?.name !== 'AbortError') setState('error');
            });
        return () => controller.abort();
    }, []);

    const config = {
        checking: {
            label: 'Checking status…',
            dotClass: 'bg-neutral-500',
            showPing: false,
        },
        ok: {
            label: 'All systems operational',
            dotClass: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]',
            showPing: true,
        },
        error: {
            label: 'Service issue detected',
            dotClass: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]',
            showPing: false,
        },
    }[state];

    return (
        <span
            aria-label={config.label}
            className="inline-flex items-center"
            title={config.label}>
            <span aria-hidden="true" className="relative flex h-2 w-2">
                {config.showPing && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
                )}
                <span className={`relative inline-flex h-2 w-2 rounded-full ${config.dotClass}`} />
            </span>
        </span>
    );
}
