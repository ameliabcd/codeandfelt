import { kv } from '@vercel/kv'
import fs from 'fs'
import path from 'path'
import os from 'os'

// Check if Vercel KV is available
const useKV = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN

// Fallback: Use /tmp on Vercel (writable), /data locally
const isVercel = process.env.VERCEL === '1'
const dataDir = isVercel 
  ? path.join(os.tmpdir(), 'math-felt-data')
  : path.join(process.cwd(), 'data')
const impactsFile = path.join(dataDir, 'impacts.json')

// In-memory fallback for Vercel (ephemeral but works)
let memoryStore = []

// Read impacts from KV, file, or memory
async function readImpacts() {
  if (useKV) {
    try {
      const impacts = await kv.get('impacts') || []
      return impacts
    } catch (error) {
      console.error('Error reading from KV:', error)
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

// Write impacts to KV, file, or memory
async function writeImpacts(impacts) {
  if (useKV) {
    try {
      await kv.set('impacts', impacts)
      return true
    } catch (error) {
      console.error('Error writing to KV:', error)
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
      const impacts = await readImpacts()
      // Sort by date (newest first)
      impacts.sort((a, b) => {
        const dateA = a.date ? new Date(a.date) : new Date(a.createdAt || 0)
        const dateB = b.date ? new Date(b.date) : new Date(b.createdAt || 0)
        return dateB - dateA
      })
      res.status(200).json(impacts)
    } catch (error) {
      console.error('Error reading impacts:', error)
      res.status(500).json({ error: 'Failed to load impacts', details: error.message })
    }
  } else if (method === 'POST' || method === 'post') {
    try {
      // Validate request body
      if (!req.body || !req.body.title || !req.body.description) {
        return res.status(400).json({ error: 'Missing required fields: title, description' })
      }

      const impacts = await readImpacts()
      
      const newImpact = {
        id: req.body.id || `impact-${Date.now()}-${Math.random()}`,
        title: req.body.title,
        description: req.body.description,
        date: req.body.date || null,
        location: req.body.location || '',
        amount: req.body.amount || '',
        category: req.body.category || 'donation',
        images: req.body.images || [],
        createdAt: req.body.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      // Update existing or add new
      const existingIndex = impacts.findIndex(i => i.id === newImpact.id)
      if (existingIndex >= 0) {
        impacts[existingIndex] = { ...impacts[existingIndex], ...newImpact }
      } else {
        impacts.push(newImpact)
      }
      
      await writeImpacts(impacts)
      
      res.status(201).json(newImpact)
    } catch (error) {
      console.error('Error saving impact:', error)
      res.status(500).json({ error: 'Failed to save impact', details: error.message })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS'])
    res.status(405).json({ error: `Method ${method} Not Allowed` })
  }
}
