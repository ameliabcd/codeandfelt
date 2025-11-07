export default function handler(req, res) {
  console.log('Test API called:', req.method, req.url)
  res.status(200).json({ 
    method: req.method,
    message: 'API route is working',
    timestamp: new Date().toISOString()
  })
}

