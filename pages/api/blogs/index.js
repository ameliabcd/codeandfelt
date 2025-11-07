import { redis, useRedis } from '../../../lib/redis'
import fs from 'fs'
import path from 'path'
import os from 'os'

// Fallback: Use /tmp on Vercel (writable), /data locally
const isVercel = process.env.VERCEL === '1'
const dataDir = isVercel 
  ? path.join(os.tmpdir(), 'math-felt-data')
  : path.join(process.cwd(), 'data')
const blogsFile = path.join(dataDir, 'blogs.json')

// In-memory fallback for Vercel (ephemeral but works)
let memoryStore = []

// Read blogs from Redis, file, or memory
async function readBlogs() {
  if (useRedis && redis) {
    try {
      const blogs = await redis.get('blogs') || []
      return blogs
    } catch (error) {
      console.error('Error reading from Redis:', error)
      return []
    }
  }

  try {
    if (fs.existsSync(blogsFile)) {
      const data = fs.readFileSync(blogsFile, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.warn('Could not read blogs file, using memory store:', error.message)
  }
  return memoryStore
}

// Write blogs to Redis, file, or memory
async function writeBlogs(blogs) {
  if (useRedis && redis) {
    try {
      await redis.set('blogs', blogs)
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
    if (!fs.existsSync(blogsFile)) {
      fs.writeFileSync(blogsFile, JSON.stringify([]))
    }
    fs.writeFileSync(blogsFile, JSON.stringify(blogs, null, 2))
    return true
  } catch (error) {
    console.warn('Could not write blogs file, using memory store:', error.message)
  }
  memoryStore = blogs
  return false
}

export default async function handler(req, res) {
  const method = (req.method || '').toUpperCase()
  
  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }

  if (method === 'GET') {
    try {
      const blogs = await readBlogs()
      // Sort by published date (newest first)
      blogs.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      res.status(200).json(blogs)
    } catch (error) {
      console.error('Error reading blogs:', error)
      res.status(500).json({ error: 'Failed to load blogs', details: error.message })
    }
  } else if (method === 'POST' || method === 'post') {
    try {
      // Validate request body
      if (!req.body || !req.body.title || !req.body.content) {
        return res.status(400).json({ error: 'Missing required fields: title, content' })
      }

      const blogs = await readBlogs()
      
      const newBlog = {
        id: req.body.id || `blog-${Date.now()}-${Math.random()}`,
        title: req.body.title,
        content: req.body.content,
        images: req.body.images || [],
        publishedAt: req.body.publishedAt || new Date().toISOString(),
        author: req.body.author || 'Anonymous'
      }
      
      blogs.push(newBlog)
      await writeBlogs(blogs)
      
      res.status(201).json(newBlog)
    } catch (error) {
      console.error('Error saving blog:', error)
      res.status(500).json({ error: 'Failed to save blog', details: error.message })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS'])
    res.status(405).json({ error: `Method ${method} Not Allowed` })
  }
}
