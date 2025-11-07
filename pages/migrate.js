'use client'
import { useState } from 'react'
import Head from 'next/head'

export default function MigratePage() {
  const [status, setStatus] = useState('')
  const [results, setResults] = useState(null)

  const handleMigrate = async () => {
    setStatus('Migrating data...')
    
    try {
      // Import storage functions dynamically
      const { loadImages } = await import('../lib/imageStorage')
      const { loadBlogs } = await import('../lib/blogStorage')
      const { loadImpacts } = await import('../lib/impactStorage')

      const images = await loadImages()
      const blogs = await loadBlogs()
      const impacts = await loadImpacts()

      const data = {
        images: images || [],
        blogs: blogs || [],
        impacts: impacts || [],
        migratedAt: new Date().toISOString()
      }

      // Create downloadable file
      const dataStr = JSON.stringify(data, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `migrated-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setResults({
        images: images.length,
        blogs: blogs.length,
        impacts: impacts.length
      })
      setStatus(`✓ Migration complete! Downloaded file with ${images.length} images, ${blogs.length} blogs, and ${impacts.length} impacts.`)
    } catch (error) {
      console.error('Migration error:', error)
      setStatus(`Error: ${error.message}`)
    }
  }

  return (
    <>
      <Head>
        <title>Data Migration - Math & Felt</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h1 className="font-serif text-4xl font-bold text-gray-800 mb-6">Data Migration Tool</h1>
            <p className="text-gray-600 mb-6">
              This tool will export all your current data (images, blogs, and impacts) from IndexedDB 
              to a JSON file that you can download. After migrating to server-side storage, you can 
              use this file to restore your data.
            </p>
            
            <button
              onClick={handleMigrate}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium hover:from-pink-600 hover:to-purple-600 transition-all mb-4"
            >
              Export My Data
            </button>

            {status && (
              <div className={`p-4 rounded-lg ${status.startsWith('✓') ? 'bg-green-50 text-green-800' : status.startsWith('Error') ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'}`}>
                {status}
              </div>
            )}

            {results && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h2 className="font-bold text-gray-800 mb-2">Migration Summary:</h2>
                <ul className="list-disc list-inside text-gray-600">
                  <li>{results.images} images</li>
                  <li>{results.blogs} blogs</li>
                  <li>{results.impacts} impacts</li>
                </ul>
              </div>
            )}

            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> After migrating to server-side storage, your data will be shared 
                with all visitors. Make sure to download this backup file before the migration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

