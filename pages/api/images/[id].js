import { redis, useRedis } from '../../../lib/redis'
import fs from 'fs'
import path from 'path'
import os from 'os'

// Fallback: Use /tmp on Vercel (writable), /data locally
const isVercel = process.env.VERCEL === '1'
const dataDir = isVercel 
  ? path.join(os.tmpdir(), 'math-felt-data')
  : path.join(process.cwd(), 'data')
const imagesFile = path.join(dataDir, 'images.json')

// In-memory fallback for Vercel (ephemeral but works)
let memoryStore = []

// Read images from Redis, file, or memory
async function readImages() {
  if (useRedis && redis) {
    try {
      const images = await redis.get('images') || []
      return images
    } catch (error) {
      console.error('Error reading from Redis:', error)
      return []
    }
  }

  try {
    if (fs.existsSync(imagesFile)) {
      const data = fs.readFileSync(imagesFile, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.warn('Could not read images file, using memory store:', error.message)
  }
  return memoryStore
}

// Write images to Redis, file, or memory
async function writeImages(images) {
  if (useRedis && redis) {
    try {
      await redis.set('images', images)
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
    if (!fs.existsSync(imagesFile)) {
      fs.writeFileSync(imagesFile, JSON.stringify([]))
    }
    fs.writeFileSync(imagesFile, JSON.stringify(images, null, 2))
    return true
  } catch (error) {
    console.warn('Could not write images file, using memory store:', error.message)
  }
  memoryStore = images
  return false
}

export default async function handler(req, res) {
  const { id } = req.query
  const method = (req.method || '').toUpperCase()

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }

  if (method === 'DELETE') {
    try {
      const images = await readImages()
      
      const filteredImages = images.filter(img => img.id !== id)
      
      if (filteredImages.length === images.length) {
        return res.status(404).json({ error: 'Image not found' })
      }
      
      await writeImages(filteredImages)
      
      res.status(200).json({ success: true })
    } catch (error) {
      console.error('Error deleting image:', error)
      res.status(500).json({ error: 'Failed to delete image', details: error.message })
    }
  } else {
    res.setHeader('Allow', ['DELETE', 'OPTIONS'])
    res.status(405).json({ error: `Method ${method} Not Allowed` })
  }
}
