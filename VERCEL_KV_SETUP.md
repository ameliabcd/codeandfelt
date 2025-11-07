# Vercel KV Setup Guide

Your data (images, blogs, impacts) is currently disappearing because Vercel KV (persistent storage) hasn't been set up yet. Without KV, the app uses ephemeral storage that gets wiped.

## Quick Setup Steps:

1. **Go to your Vercel project dashboard**
   - Visit https://vercel.com/dashboard
   - Select your project

2. **Create a KV Database**
   - Click on **Storage** tab
   - Click **Create Database**
   - Select **KV** (Redis)
   - Choose a name (e.g., "math-felt-kv")
   - Select the free tier
   - Click **Create**

3. **Link KV to your project**
   - After creating, click **Connect** or **Link to Project**
   - Select your project
   - Vercel will automatically add environment variables:
     - `KV_REST_API_URL`
     - `KV_REST_API_TOKEN`

4. **Redeploy**
   - Go to **Deployments** tab
   - Click the three dots on the latest deployment
   - Click **Redeploy**
   - Or push a new commit to trigger a deployment

## Verify Setup:

After redeploying, check your Vercel function logs. You should see:
```
KV Status: { hasKVURL: true, hasKVToken: true, useKV: true }
```

If you see `useKV: false`, KV isn't configured yet.

## Alternative: Use Vercel Postgres

If KV isn't available, you can also use Vercel Postgres:
1. Go to Storage → Create Database → Postgres
2. Update the API routes to use Postgres instead of KV

## Current Behavior:

- **Without KV**: Data is stored in memory/tmp (ephemeral, gets wiped)
- **With KV**: Data persists permanently across deployments

