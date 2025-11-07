import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')
const blogsFile = path.join(dataDir, 'blogs.json')

export default function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      if (!fs.existsSync(blogsFile)) {
        return res.status(404).json({ error: 'Blog not found' })
      }

      const data = fs.readFileSync(blogsFile, 'utf8')
      const blogs = JSON.parse(data)
      const blog = blogs.find(b => b.id === id)
      
      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' })
      }
      
      res.status(200).json(blog)
    } catch (error) {
      console.error('Error reading blog:', error)
      res.status(500).json({ error: 'Failed to load blog' })
    }
  } else if (req.method === 'DELETE') {
    try {
      if (!fs.existsSync(blogsFile)) {
        return res.status(404).json({ error: 'Blogs file not found' })
      }

      const data = fs.readFileSync(blogsFile, 'utf8')
      const blogs = JSON.parse(data)
      
      const filteredBlogs = blogs.filter(blog => blog.id !== id)
      
      if (filteredBlogs.length === blogs.length) {
        return res.status(404).json({ error: 'Blog not found' })
      }
      
      fs.writeFileSync(blogsFile, JSON.stringify(filteredBlogs, null, 2))
      
      res.status(200).json({ success: true })
    } catch (error) {
      console.error('Error deleting blog:', error)
      res.status(500).json({ error: 'Failed to delete blog' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

