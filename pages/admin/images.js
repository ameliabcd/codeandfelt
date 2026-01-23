'use client'
import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function ImagesAdmin() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/images')
      if (!response.ok) {
        throw new Error('Failed to load images')
      }
      const data = await response.json()
      setImages(data)
      setError(null)
    } catch (err) {
      console.error('Error loading images:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  return (
    <>
      <Head>
        <title>Image URLs - Admin - Modern Fiber Arts</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-bold text-gray-800 mb-2">Image URLs</h1>
            <p className="text-gray-600">Copy image URLs to use in your code</p>
            <button
              onClick={loadImages}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Refresh
            </button>
          </div>

          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading images...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
              Error: {error}
            </div>
          )}

          {!loading && !error && images.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-600">No images uploaded yet.</p>
            </div>
          )}

          {!loading && !error && images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                  <div className="aspect-square bg-gray-100 relative">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 truncate">{image.name}</h3>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Image URL:</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={image.url}
                            readOnly
                            className="flex-1 text-xs p-2 border border-gray-300 rounded bg-gray-50 text-gray-700 truncate"
                          />
                          <button
                            onClick={() => copyToClipboard(image.url, image.id)}
                            className="px-3 py-2 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                          >
                            {copiedId === image.id ? '✓ Copied' : 'Copy'}
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {image.id}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && images.length > 0 && (
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">How to use these URLs:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
                <li>Click "Copy" next to any image URL</li>
                <li>Open <code className="bg-blue-100 px-1 rounded">components/Home/HeroSection.jsx</code></li>
                <li>Find the <code className="bg-blue-100 px-1 rounded">DEMO_IMAGES</code> array</li>
                <li>Replace any <code className="bg-blue-100 px-1 rounded">url</code> value with your copied URL</li>
                <li>Save and the changes will appear on your home page</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

