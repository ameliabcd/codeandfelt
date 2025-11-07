import fs from 'fs'
import path from 'path'
import os from 'os'

// Use /tmp on Vercel (writable), /data locally
const isVercel = process.env.VERCEL === '1'
const dataDir = isVercel 
  ? path.join(os.tmpdir(), 'math-felt-data')
  : path.join(process.cwd(), 'data')
const imagesFile = path.join(dataDir, 'images.json')

// In-memory fallback for Vercel (ephemeral but works)
let memoryStore = []

// Ensure data directory exists
function ensureDataDir() {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    if (!fs.existsSync(imagesFile)) {
      fs.writeFileSync(imagesFile, JSON.stringify([]))
    }
  } catch (error) {
    console.warn('Could not create data directory, using memory store:', error.message)
    return false
  }
  return true
}

// Read images from file or memory
function readImages() {
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

// Write images to file or memory
function writeImages(images) {
  try {
    if (ensureDataDir()) {
      fs.writeFileSync(imagesFile, JSON.stringify(images, null, 2))
      return true
    }
  } catch (error) {
    console.warn('Could not write images file, using memory store:', error.message)
  }
  memoryStore = images
  return false
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

  if (method === 'GET') {
    try {
      const images = readImages()
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

      const images = readImages()
      
      const newImage = {
        id: req.body.id || `img-${Date.now()}-${Math.random()}`,
        url: req.body.url,
        name: req.body.name || 'Untitled',
        uploadedAt: req.body.uploadedAt || new Date().toISOString()
      }
      
      images.push(newImage)
      writeImages(images)
      
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

