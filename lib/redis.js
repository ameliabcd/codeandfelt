import { Redis } from '@upstash/redis'

// Helper to strip quotes from env vars
function cleanEnvVar(value) {
  if (!value) return null
  return value.toString().trim().replace(/^["']|["']$/g, '')
}

// Check if Upstash Redis is available
// Upstash Redis uses UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
// Or {PREFIX}_UPSTASH_REDIS_REST_URL if custom prefix is used
const redisUrl = cleanEnvVar(process.env.UPSTASH_REDIS_REST_URL) || 
                 cleanEnvVar(process.env.REDIS_UPSTASH_REDIS_REST_URL) ||
                 cleanEnvVar(process.env.KV_UPSTASH_REDIS_REST_URL)
const redisToken = cleanEnvVar(process.env.UPSTASH_REDIS_REST_TOKEN) || 
                  cleanEnvVar(process.env.REDIS_UPSTASH_REDIS_REST_TOKEN) ||
                  cleanEnvVar(process.env.KV_UPSTASH_REDIS_REST_TOKEN)

const useRedis = !!(redisUrl && redisToken)

// Initialize Redis client if available
let redis = null
let redisError = null
if (useRedis) {
  try {
    redis = new Redis({
      url: redisUrl,
      token: redisToken,
    })
    // Test connection immediately
    redis.ping().catch(err => {
      console.error('Redis ping failed:', err)
      redisError = err
    })
  } catch (error) {
    console.error('Failed to initialize Redis:', error)
    redisError = error
  }
}

// Log Redis status (always log in production to help debug)
console.log('Redis Status:', {
  hasRedisURL: !!redisUrl,
  hasRedisToken: !!redisToken,
  redisURLPreview: redisUrl ? `${redisUrl.substring(0, 30)}...` : 'none',
  useRedis: useRedis,
  redisInitialized: !!redis,
  redisError: redisError ? redisError.message : null,
  environment: process.env.VERCEL ? 'Vercel' : 'Local'
})

export { redis, useRedis }

