# Skillshare

Minimal Vite + React starter with Supabase client configured.

## Setup

1. Copy `.env.example` to `.env` and fill values:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

2. Install deps and run locally:

```bash
npm install
npm run dev
```

3. Build:

```bash
npm run build
```

## Vercel

- In the Vercel project settings, add the environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with your Supabase values.
- Redeploy (choose "Redeploy with cache cleared"). The repo contains `vercel.json` configured to run `node build.js`.

## Notes

This app attempts to fetch rows from a `projects` table on mount. Create that table in Supabase or change the query in `src/App.jsx` as needed.
