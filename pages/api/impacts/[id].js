import { redis, useRedis } from '../../../lib/redis'
import fs from 'fs'
import path from 'path'
import os from 'os'

// Fallback: Use /tmp on Vercel (writable), /data locally
const isVercel = process.env.VERCEL === '1'
const dataDir = isVercel 
  ? path.join(os.tmpdir(), 'math-felt-data')
  : path.join(process.cwd(), 'data')
const impactsFile = path.join(dataDir, 'impacts.json')

// In-memory fallback for Vercel (ephemeral but works)
let memoryStore = []

// Read impacts from Redis, file, or memory
async function readImpacts() {
  if (useRedis && redis) {
    try {
      const impacts = await redis.get('impacts') || []
      return impacts
    } catch (error) {
      console.error('Error reading from Redis:', error)
      return []
    }
  }

  try {
    if (fs.existsSync(impactsFile)) {
      const data = fs.readFileSync(impactsFile, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.warn('Could not read impacts file, using memory store:', error.message)
  }
  return memoryStore
}

// Write impacts to Redis, file, or memory
async function writeImpacts(impacts) {
  if (useRedis && redis) {
    try {
      await redis.set('impacts', impacts)
      return true
    } catch (error) {
      console.error('Error writing to Redis:', error)
      return false
    }
  }

  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    if (!fs.existsSync(impactsFile)) {
      fs.writeFileSync(impactsFile, JSON.stringify([]))
    }
    fs.writeFileSync(impactsFile, JSON.stringify(impacts, null, 2))
    return true
  } catch (error) {
    console.warn('Could not write impacts file, using memory store:', error.message)
  }
  memoryStore = impacts
  return false
}

export default async function handler(req, res) {
  const { id } = req.query
  const method = (req.method || '').toUpperCase()

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }

  if (method === 'GET') {
    try {
      const impacts = await readImpacts()
      const impact = impacts.find(i => i.id === id)
      
      if (!impact) {
        return res.status(404).json({ error: 'Impact not found' })
      }
      
      res.status(200).json(impact)
    } catch (error) {
      console.error('Error reading impact:', error)
      res.status(500).json({ error: 'Failed to load impact', details: error.message })
    }
  } else if (method === 'DELETE') {
    try {
      const impacts = await readImpacts()
      
      const filteredImpacts = impacts.filter(impact => impact.id !== id)
      
      if (filteredImpacts.length === impacts.length) {
        return res.status(404).json({ error: 'Impact not found' })
      }
      
      await writeImpacts(filteredImpacts)
      
      res.status(200).json({ success: true })
    } catch (error) {
      console.error('Error deleting impact:', error)
      res.status(500).json({ error: 'Failed to delete impact', details: error.message })
    }
  } else {
    res.setHeader('Allow', ['GET', 'DELETE', 'OPTIONS'])
    res.status(405).json({ error: `Method ${method} Not Allowed` })
  }
}
