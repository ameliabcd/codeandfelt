import { redis, useRedis } from '../../../lib/redis'
import fs from 'fs'
import path from 'path'
import os from 'os'

// Fallback: Use /tmp on Vercel (writable), /data locally
const isVercel = process.env.VERCEL === '1'
const dataDir = isVercel 
  ? path.join(os.tmpdir(), 'math-felt-data')
  : path.join(process.cwd(), 'data')
const contactsFile = path.join(dataDir, 'contacts.json')

// In-memory fallback for Vercel (ephemeral but works)
let memoryStore = []

// Read contacts from Redis, file, or memory
async function readContacts() {
  if (useRedis && redis) {
    try {
      const contacts = await redis.get('contacts')
      console.log('Read contacts from Redis:', contacts ? `${contacts.length} contacts` : 'null')
      return Array.isArray(contacts) ? contacts : []
    } catch (error) {
      console.error('Error reading from Redis:', error)
      return []
    }
  }

  try {
    if (fs.existsSync(contactsFile)) {
      const data = fs.readFileSync(contactsFile, 'utf8')
      const parsed = JSON.parse(data)
      return Array.isArray(parsed) ? parsed : []
    }
  } catch (error) {
    console.warn('Could not read contacts file, using memory store:', error.message)
  }
  return Array.isArray(memoryStore) ? memoryStore : []
}

// Write contacts to Redis, file, or memory
async function writeContacts(contacts) {
  if (useRedis && redis) {
    try {
      await redis.set('contacts', contacts)
      console.log('Saved contacts to Redis:', contacts.length)
      return true
    } catch (error) {
      console.error('Error writing to Redis:', error)
      // Fall through to file system fallback
    }
  }

  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    fs.writeFileSync(contactsFile, JSON.stringify(contacts, null, 2))
    console.log('Saved contacts to file:', contacts.length)
    return true
  } catch (error) {
    console.warn('Could not write contacts file, using memory store:', error.message)
    memoryStore = contacts
    return true
  }
}

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }

  const method = req.method || 'UNKNOWN'

  if (method === 'GET') {
    try {
      const contacts = await readContacts()
      console.log(`GET /api/contact: Returning ${contacts.length} contacts (using ${useRedis ? 'Redis' : 'fallback'})`)
      res.status(200).json(contacts)
    } catch (error) {
      console.error('Error reading contacts:', error)
      res.status(500).json({ error: 'Failed to load contacts', details: error.message })
    }
  } else if (method === 'POST') {
    try {
      const { firstName, lastName, email, subject, message } = req.body

      // Validate required fields
      if (!firstName || !lastName || !email || !subject || !message) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const contacts = await readContacts()
      
      const newContact = {
        id: `contact-${Date.now()}-${Math.random()}`,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        submittedAt: new Date().toISOString()
      }

      contacts.push(newContact)
      await writeContacts(contacts)
      
      console.log(`POST /api/contact: New contact submission from ${email}`)
      res.status(201).json({ success: true, message: 'Contact form submitted successfully' })
    } catch (error) {
      console.error('Error saving contact:', error)
      res.status(500).json({ error: 'Failed to save contact', details: error.message })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

