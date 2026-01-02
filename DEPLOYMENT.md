# Deploying Questfully to Vercel

Questfully (formerly Analog) is built with Next.js and Turborepo, making it fully compatible with Vercel.

## Prerequisites
- A Vercel account.
- A hosted PostgreSQL database (e.g., Vercel Postgres, Neon, or Supabase).
- A generated `BETTER_AUTH_SECRET` (run `openssl rand -hex 32` locally).

## Step-by-Step Guide

### 1. Import Project
- Go to Vercel Dashboard -> **Add New...** -> **Project**.
- Select your GitHub repository.
- **Root Directory**: Vercel should automatically detect this as a Turborepo. If asked, you can leave it as root, or select `apps/web` if you truly only want the web app (but root is recommended for monorepos).

### 2. Configure Build Settings
- **Framework Preset**: Next.js
- **Build Command**: `turbo run build` (or Vercel default).
- **Install Command**: `bun install` (Vercel supports Bun automatically).

### 3. Environment Variables
You must add the following variables in the **Settings > Environment Variables** tab on Vercel.

**Core**
- `DATABASE_URL`: Connection string to your hosted Postgres DB.
- `BETTER_AUTH_SECRET`: Your generated secret.
- `BETTER_AUTH_URL`: Your Vercel deployment URL (e.g., `https://your-project.vercel.app`).
  - *Note:* When setting this initially, you might need to deploy once to get the URL, then update this var and redeploy, OR set a custom domain first.

**Integrations (Optional but Recommended)**
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: For Google Auth.
- `GOOGLE_MAPS_API_KEY`: For location features.
- `COMPOSIO_API_KEY`: For AI integrations (required for full feature set).
- `UPSTASH_REDIS_REST_URL` & `TOKEN`: If using Redis (likely for rate limiting/caching).

### 4. Database Migration
After your database is connected, you need to push the schema. You can run this locally pointing to your production DB, or set up a build command hook.
- **Local Method (Easiest)**:
  1. Update your local `.env` with the *production* `DATABASE_URL`.
  2. Run `bun run db:push`.
  3. Revert your local `.env`.

## Troubleshooting
- **Build Fails on CSS**: If you see "unknown utility class", ensure you are using the latest PostCSS/Tailwind config.
- **Missing Env Vars**: The build utilizes `@repo/env` which validates env vars at build time. If you miss one, the deployment will fail with a clear error message listing the missing variable.
