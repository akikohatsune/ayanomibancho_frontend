# ayanomi_frontend (AyanomiBancho Frontend)

The dedicated Web Dashboard, API, and Frontend service for [AyanomiBancho](https://gitlab.com/luminehq/ayanomibancho).

## Features
- **Modern Web Dashboard**: Responsive UI with dark theme, customizable profiles, badges, leaderboards, and staff directory.
- **Markdown & Bio Engine**: GitHub-Flavored Markdown (GFM) renderer with safe HTML sanitization via ammonia.
- **Cloudflare Turnstile**: Bot and brute-force protection for registration and login.
- **Multiplayer Match History**: Real-time inspection of online match results.
- **Telemetry & Health Monitoring**: Live memory, mirror latencies, and uptime telemetry.

## Running Locally

`ash
cargo run --release
`

The frontend listens on port 5002 (configurable via config.toml -> web_port).
