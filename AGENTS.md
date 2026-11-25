# Project conventions

This is an independent public Simplifyd Cloud sample. Use Node 22.12 or newer. Install with `npm ci`, build with `npm run build`, and run browser tests with `npm test` after installing Chromium through `npx playwright install chromium`. Production output is `dist/`.

Keep the demo self-contained, accessible, responsive, and free of external API keys. Browser state is intentionally local; handle unavailable storage gracefully. Do not commit dependencies, output, or environment secrets. The Dockerfile serves the static build on port 8080.
