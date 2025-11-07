import { Redis } from '@upstash/redis'

// Check if Upstash Redis is available
// Upstash Redis uses UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
// Or {PREFIX}_UPSTASH_REDIS_REST_URL if custom prefix is used
const redisUrl = process.env.UPSTASH_REDIS_REST_URL || 
                 process.env.REDIS_UPSTASH_REDIS_REST_URL ||
                 process.env.KV_UPSTASH_REDIS_REST_URL
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || 
                  process.env.REDIS_UPSTASH_REDIS_REST_TOKEN ||
                  process.env.KV_UPSTASH_REDIS_REST_TOKEN

const useRedis = !!(redisUrl && redisToken)

// Initialize Redis client if available
let redis = null
if (useRedis) {
  try {
    redis = new Redis({
      url: redisUrl,
      token: redisToken,
    })
  } catch (error) {
    console.error('Failed to initialize Redis:', error)
  }
}

// Log Redis status (only in development or if Redis URL is set)
if (process.env.NODE_ENV === 'development' || redisUrl) {
  console.log('Redis Status:', {
    hasRedisURL: !!redisUrl,
    hasRedisToken: !!redisToken,
    useRedis: useRedis,
    redisInitialized: !!redis
  })
}

export { redis, useRedis }

