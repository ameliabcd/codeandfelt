# Upstash Redis Setup Guide

Your data (images, blogs, impacts) is currently disappearing because Upstash Redis (persistent storage) hasn't been set up yet. Without Redis, the app uses ephemeral storage that gets wiped.

## Quick Setup Steps:

1. **Go to your Vercel project dashboard**
   - Visit https://vercel.com/dashboard
   - Select your project

2. **Create an Upstash Redis Database**
   - Click on **Storage** tab
   - Click **Create Database**
   - Select **Upstash** (or **Redis**)
   - Choose a name (e.g., "math-felt-redis")
   - **Custom Prefix**: Leave empty or use "REDIS" (optional)
   - Select the free tier
   - Click **Create**

3. **Link Redis to your project**
   - After creating, click **Connect** or **Link to Project**
   - Select your project
   - Vercel will automatically add environment variables:
     - `UPSTASH_REDIS_REST_URL` (or `{PREFIX}_UPSTASH_REDIS_REST_URL` if you used a prefix)
     - `UPSTASH_REDIS_REST_TOKEN` (or `{PREFIX}_UPSTASH_REDIS_REST_TOKEN` if you used a prefix)

4. **Redeploy**
   - Go to **Deployments** tab
   - Click the three dots on the latest deployment
   - Click **Redeploy**
   - Or push a new commit to trigger a deployment

## Verify Setup:

After redeploying, check your Vercel function logs. You should see:
```
Redis Status: { hasRedisURL: true, hasRedisToken: true, useRedis: true, redisInitialized: true }
```

If you see `useRedis: false`, Redis isn't configured yet.

## Custom Prefix:

If you set a custom prefix (e.g., "REDIS"), the environment variables will be:
- `REDIS_UPSTASH_REDIS_REST_URL`
- `REDIS_UPSTASH_REDIS_REST_TOKEN`

The code automatically checks for these variations.

## Current Behavior:

- **Without Redis**: Data is stored in memory/tmp (ephemeral, gets wiped)
- **With Redis**: Data persists permanently across deployments

