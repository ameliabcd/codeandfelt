import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')
const imagesFile = path.join(dataDir, 'images.json')

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Initialize images.json if it doesn't exist
if (!fs.existsSync(imagesFile)) {
  fs.writeFileSync(imagesFile, JSON.stringify([]))
}

export default function handler(req, res) {
  // Ensure data directory and file exist
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    if (!fs.existsSync(imagesFile)) {
      fs.writeFileSync(imagesFile, JSON.stringify([]))
    }
  } catch (error) {
    console.error('Error initializing data directory:', error)
    return res.status(500).json({ error: 'Failed to initialize storage' })
  }

  if (req.method === 'GET') {
    try {
      const data = fs.readFileSync(imagesFile, 'utf8')
      const images = JSON.parse(data)
      res.status(200).json(images)
    } catch (error) {
      console.error('Error reading images:', error)
      res.status(500).json({ error: 'Failed to load images', details: error.message })
    }
  } else if (req.method === 'POST') {
    try {
      // Validate request body
      if (!req.body || !req.body.url) {
        return res.status(400).json({ error: 'Missing required fields: url' })
      }

      const data = fs.readFileSync(imagesFile, 'utf8')
      const images = JSON.parse(data)
      
      const newImage = {
        id: req.body.id || `img-${Date.now()}-${Math.random()}`,
        url: req.body.url,
        name: req.body.name || 'Untitled',
        uploadedAt: req.body.uploadedAt || new Date().toISOString()
      }
      
      images.push(newImage)
      fs.writeFileSync(imagesFile, JSON.stringify(images, null, 2))
      
      res.status(201).json(newImage)
    } catch (error) {
      console.error('Error saving image:', error)
      res.status(500).json({ error: 'Failed to save image', details: error.message })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

