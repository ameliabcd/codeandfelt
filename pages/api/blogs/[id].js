import fs from 'fs'
import path from 'path'
import os from 'os'

// Use /tmp on Vercel (writable), /data locally
const isVercel = process.env.VERCEL === '1'
const dataDir = isVercel 
  ? path.join(os.tmpdir(), 'math-felt-data')
  : path.join(process.cwd(), 'data')
const blogsFile = path.join(dataDir, 'blogs.json')

// In-memory fallback for Vercel (ephemeral but works)
let memoryStore = []

// Read blogs from file or memory
function readBlogs() {
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

// Write blogs to file or memory
function writeBlogs(blogs) {
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
      const blogs = readBlogs()
      const blog = blogs.find(b => b.id === id)
      
      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' })
      }
      
      res.status(200).json(blog)
    } catch (error) {
      console.error('Error reading blog:', error)
      res.status(500).json({ error: 'Failed to load blog', details: error.message })
    }
  } else if (method === 'DELETE') {
    try {
      const blogs = readBlogs()
      
      const filteredBlogs = blogs.filter(blog => blog.id !== id)
      
      if (filteredBlogs.length === blogs.length) {
        return res.status(404).json({ error: 'Blog not found' })
      }
      
      writeBlogs(filteredBlogs)
      
      res.status(200).json({ success: true })
    } catch (error) {
      console.error('Error deleting blog:', error)
      res.status(500).json({ error: 'Failed to delete blog', details: error.message })
    }
  } else {
    res.setHeader('Allow', ['GET', 'DELETE', 'OPTIONS'])
    res.status(405).json({ error: `Method ${method} Not Allowed` })
  }
}

