'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const HeroSection = () => {
  const [backgroundImages, setBackgroundImages] = useState([])

  // Load images from localStorage for background
  const loadBackgroundImages = () => {
    const savedImages = localStorage.getItem('workGalleryImages')
    if (savedImages) {
      try {
        const images = JSON.parse(savedImages)
        setBackgroundImages(images.slice(0, 8)) // Show up to 8 images
      } catch (error) {
        console.error('Error loading background images:', error)
      }
    } else {
      setBackgroundImages([])
    }
  }

  useEffect(() => {
    loadBackgroundImages()

    // Listen for storage changes (when images are uploaded)
    const handleStorageChange = (e) => {
      if (e.key === 'workGalleryImages') {
        loadBackgroundImages()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Also listen for custom event from WorkGallery component
    const handleCustomStorage = () => {
      loadBackgroundImages()
    }
    window.addEventListener('workGalleryUpdated', handleCustomStorage)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('workGalleryUpdated', handleCustomStorage)
    }
  }, [])

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Grid - Fixed grid layout in top section */}
      {backgroundImages.length > 0 && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-8">
            {backgroundImages.slice(0, 8).map((img, index) => (
              <div
                key={`hero-bg-${img.id}`}
                className="relative aspect-square opacity-[0.30] hover:opacity-[0.40] transition-all duration-300 transform hover:scale-110"
              >
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight">
            Turn Data Into
            <span className="text-gradient">
              {" "}Felting Patterns
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Transform your spreadsheets, APIs, and data files into beautiful, feltable patterns. 
            Where math meets craft, and data becomes art.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/generator" className="btn-primary">
              Try the Generator
            </Link>
            <Link href="/about" className="btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection