import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')
const blogsFile = path.join(dataDir, 'blogs.json')

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Initialize blogs.json if it doesn't exist
if (!fs.existsSync(blogsFile)) {
  fs.writeFileSync(blogsFile, JSON.stringify([]))
}

export default function handler(req, res) {
  // Ensure data directory and file exist
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    if (!fs.existsSync(blogsFile)) {
      fs.writeFileSync(blogsFile, JSON.stringify([]))
    }
  } catch (error) {
    console.error('Error initializing data directory:', error)
    return res.status(500).json({ error: 'Failed to initialize storage' })
  }

  if (req.method === 'GET') {
    try {
      const data = fs.readFileSync(blogsFile, 'utf8')
      const blogs = JSON.parse(data)
      // Sort by published date (newest first)
      blogs.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      res.status(200).json(blogs)
    } catch (error) {
      console.error('Error reading blogs:', error)
      res.status(500).json({ error: 'Failed to load blogs', details: error.message })
    }
  } else if (req.method === 'POST') {
    try {
      // Validate request body
      if (!req.body || !req.body.title || !req.body.content) {
        return res.status(400).json({ error: 'Missing required fields: title, content' })
      }

      const data = fs.readFileSync(blogsFile, 'utf8')
      const blogs = JSON.parse(data)
      
      const newBlog = {
        id: req.body.id || `blog-${Date.now()}-${Math.random()}`,
        title: req.body.title,
        content: req.body.content,
        images: req.body.images || [],
        publishedAt: req.body.publishedAt || new Date().toISOString(),
        author: req.body.author || 'Anonymous'
      }
      
      blogs.push(newBlog)
      fs.writeFileSync(blogsFile, JSON.stringify(blogs, null, 2))
      
      res.status(201).json(newBlog)
    } catch (error) {
      console.error('Error saving blog:', error)
      res.status(500).json({ error: 'Failed to save blog', details: error.message })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

