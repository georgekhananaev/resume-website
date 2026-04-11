import pkg from '../../package.json';

/**
 * Compile-time version metadata sourced from package.json.
 *
 * This is resolved at build/import time by the TypeScript bundler
 * (`resolveJsonModule: true` in tsconfig.json), so both server code
 * (API routes, server components) and client components can import
 * it without any runtime filesystem access.
 *
 * Surfaced by:
 *   - `/api/health` — JSON health-check endpoint
 *   - The Footer component (small version badge in the bottom bar)
 *
 * Bump only by editing package.json "version" — the /push / /release
 * slash commands handle this automatically.
 */
export const APP_VERSION: string = pkg.version;
export const APP_NAME: string = pkg.name;
