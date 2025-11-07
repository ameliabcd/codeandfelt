import { redis, useRedis } from '../../lib/redis'

export default async function handler(req, res) {
  const testResults = {
    timestamp: new Date().toISOString(),
    redisConfigured: useRedis,
    redisInitialized: !!redis,
    tests: []
  }

  if (!useRedis) {
    testResults.error = 'Redis is not configured. Check environment variables.'
    return res.status(200).json(testResults)
  }

  if (!redis) {
    testResults.error = 'Redis client failed to initialize.'
    return res.status(200).json(testResults)
  }

  // Test 1: Ping
  try {
    const pingResult = await redis.ping()
    testResults.tests.push({
      name: 'Ping',
      success: pingResult === 'PONG',
      result: pingResult
    })
  } catch (error) {
    testResults.tests.push({
      name: 'Ping',
      success: false,
      error: error.message
    })
  }

  // Test 2: Set a test value
  try {
    await redis.set('test:connection', { timestamp: Date.now(), test: true })
    testResults.tests.push({
      name: 'Set',
      success: true
    })
  } catch (error) {
    testResults.tests.push({
      name: 'Set',
      success: false,
      error: error.message
    })
  }

  // Test 3: Get the test value
  try {
    const testValue = await redis.get('test:connection')
    testResults.tests.push({
      name: 'Get',
      success: !!testValue,
      result: testValue
    })
  } catch (error) {
    testResults.tests.push({
      name: 'Get',
      success: false,
      error: error.message
    })
  }

  // Test 4: Check if images key exists
  try {
    const images = await redis.get('images')
    testResults.tests.push({
      name: 'Get Images',
      success: true,
      imageCount: Array.isArray(images) ? images.length : 0
    })
  } catch (error) {
    testResults.tests.push({
      name: 'Get Images',
      success: false,
      error: error.message
    })
  }

  const allTestsPassed = testResults.tests.every(t => t.success)
  res.status(allTestsPassed ? 200 : 500).json(testResults)
}

