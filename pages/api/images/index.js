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

export default async function handler(req, res) {
  // Log the incoming request for debugging
  const method = req.method || 'UNKNOWN'
  console.log('API Request received:', {
    method: method,
    url: req.url,
    bodyType: typeof req.body,
    bodyKeys: req.body ? Object.keys(req.body) : 'no body'
  })
  
  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }

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

  if (method === 'GET') {
    try {
      const data = fs.readFileSync(imagesFile, 'utf8')
      const images = JSON.parse(data)
      res.status(200).json(images)
    } catch (error) {
      console.error('Error reading images:', error)
      res.status(500).json({ error: 'Failed to load images', details: error.message })
    }
  } else if (method === 'POST' || method === 'post') {
    try {
      console.log('POST request body:', JSON.stringify(req.body).substring(0, 200))
      
      // Validate request body
      if (!req.body || !req.body.url) {
        console.error('Missing required fields. Body:', req.body)
        return res.status(400).json({ error: 'Missing required fields: url', received: req.body })
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
    console.error('Unsupported method received:', {
      originalMethod: req.method,
      method: method,
      url: req.url,
      allHeaders: Object.keys(req.headers || {})
    })
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS'])
    res.status(405).json({ 
      error: `Method ${method || req.method || 'UNKNOWN'} Not Allowed`,
      receivedMethod: req.method,
      method: method,
      allowedMethods: ['GET', 'POST', 'OPTIONS'],
      debug: {
        reqMethod: req.method,
        methodVar: method,
        typeOfMethod: typeof method
      }
    })
  }
}

