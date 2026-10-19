# Dhabbit — Habit Tracker

A polished, responsive React + Vite habit tracker built around small routines, reliable local persistence, streaks, calendar history, analytics, achievements, account isolation, and an installable PWA shell.

## Features

- 12 user-facing experiences: animated splash/initialization, welcome, registration, login, dashboard, habits, add/edit habit dialog, calendar/history, analytics, achievements, settings/profile, and account management.
- Local account registration and login with PBKDF2 password hashing (Web Crypto, unique salt per account); duplicate email prevention and per-account data isolation.
- Habit CRUD, search, category/status filters, sorting, archive/restore, daily completion and undo, selected-weekday scheduling, and completion history.
- Daily/weekly/monthly metrics, streaks, calendar, achievement milestones, and responsive charts calculated from stored records.
- Dark/light themes, reduced-motion preference, responsive navigation, data export/import, account deletion, and friendly status messages.
- Installable PWA manifest, local SVG app icon, service worker shell caching, and offline fallback after the first successful online load.
- Reusable UI, layout, habit, auth, and service modules; critical streak/date utilities are kept as pure functions.

## Technology

React, JSX, Vite, React Router, Context API, Framer Motion, Lucide React, CSS custom properties, LocalStorage, Web Crypto, and a hand-written service worker. No backend or third-party auth provider is required for the local demo.

## Requirements and setup

- Node.js 20.19+ or 22.12+ recommended (current Vite releases require a modern Node runtime).
- npm.

```bash
npm install
npm run dev
```

Vite prints the local development URL. Open it in your browser, create an account, then start adding habits. Localhost is considered a secure context by modern browsers and supports Web Crypto for local password hashing.

## Commands

```bash
npm run dev      # development server
npm run build    # production build
npm run preview  # serve production build locally
npm test         # Node test runner (utility tests)
```

## Production and deployment

```bash
npm run build
npm run preview
```

Deploy the generated `dist/` directory to a static host. Configure SPA fallback so application routes serve `index.html`. HTTPS is required for service workers and full PWA/browser API support outside localhost. A minimal `vercel.json` and `netlify.toml` are included for common static hosting defaults.

## Install as a PWA / offline use

1. Build and deploy over HTTPS (or use localhost for local testing).
2. Visit the app online once so the service worker can cache the shell and assets.
3. Use the browser's Install app action when available. Dhabbit also responds to the native install prompt on supported browsers.
4. After the first successful online load and cache population, the app shell can load offline and LocalStorage habit operations continue working.

Offline availability is not guaranteed before the first successful online visit. Browsers may evict caches, and updates are picked up through the service worker's cache-version change. The service worker does not cache authentication API secrets or private user data.

## Local storage schema

- `dhabbit_users_v1`: account profile and salted PBKDF2 password hashes.
- `dhabbit_session_v1`: current local session ID.
- `dhabbit_data_v1`: per-user habit records, including schedule, metadata and completion date keys (`YYYY-MM-DD`).
- `dhabbit_preferences_v1`: per-user theme and preference settings.

All completion dates use local calendar dates to avoid accidental UTC date shifts. Habit data is keyed by account ID and the UI state is replaced when the active account changes.

## Security and authentication limitations

This is a local demonstration, not production identity infrastructure. Passwords are never stored as plaintext; PBKDF2 hashing runs in the browser. However, a person with access to the browser profile/devtools can inspect or alter LocalStorage, and local authentication does not provide server-side authorization. Accounts and habits do not sync across browsers or devices. Clearing site data can remove accounts. Do not use this local implementation to protect sensitive information.

Apple, Google, and Microsoft sign-in buttons are intentionally not wired to pretend authentication succeeded. Real provider sign-in requires a properly configured OAuth client and authentication backend/service. No email verification is claimed.

## Import/export and notifications

Export creates a versioned JSON backup. Import validates the schema and merges habits into the signed-in account rather than switching account identity. Browser notifications are opt-in and depend on platform permissions; no delivery is promised while the app is closed.

## Troubleshooting

- **Password hashing unavailable:** use a current browser on `localhost` or HTTPS.
- **PWA install unavailable:** use HTTPS or localhost, visit online first, and check browser install support.
- **Offline shell missing:** open the app online once and wait for the service worker to install.
- **Account or habit missing:** accounts are isolated per browser profile and browser origin; check you are signed into the correct local account.
- **Import rejected:** use a JSON file exported by Dhabbit with `schemaVersion: 1` and a `habits` array.

## Project structure

```text
src/
  app/App.jsx
  components/{UI,Layout,Habit}.jsx
  context/AppContext.jsx
  pages/{AuthPages,AppPages}.jsx
  services/{storageService,authService,analyticsService,achievementService}.js
  utils/{dates,streaks}.js
  styles/{tokens,global}.css
  main.jsx
public/{manifest.webmanifest,sw.js,icon.svg,favicon.svg}
```
