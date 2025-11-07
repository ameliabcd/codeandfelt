import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')
const imagesFile = path.join(dataDir, 'images.json')

export default function handler(req, res) {
  const { id } = req.query

  if (req.method === 'DELETE') {
    try {
      if (!fs.existsSync(imagesFile)) {
        return res.status(404).json({ error: 'Images file not found' })
      }

      const data = fs.readFileSync(imagesFile, 'utf8')
      const images = JSON.parse(data)
      
      const filteredImages = images.filter(img => img.id !== id)
      
      if (filteredImages.length === images.length) {
        return res.status(404).json({ error: 'Image not found' })
      }
      
      fs.writeFileSync(imagesFile, JSON.stringify(filteredImages, null, 2))
      
      res.status(200).json({ success: true })
    } catch (error) {
      console.error('Error deleting image:', error)
      res.status(500).json({ error: 'Failed to delete image' })
    }
  } else {
    res.setHeader('Allow', ['DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

