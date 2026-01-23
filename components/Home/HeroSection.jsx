'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// Your local images - Add your images to public/images/hero/ folder
// Then update the paths below to match your image filenames
// Example: If you add "my-artwork.jpg", use: '/images/hero/my-artwork.jpg'
const DEMO_IMAGES = [
  {
    id: 'image-1',
    url: '/images/hero/image4.JPG',
    name: 'Fiber Art 1'
  },
  {
    id: 'image-2',
    url: '/images/hero/image5.JPG',
    name: 'Fiber Art 2'
  },
  {
    id: 'image-3',
    url: '/images/hero/image6.JPG',
    name: 'Fiber Art 3'
  },
  {
    id: 'image-4',
    url: '/images/hero/image1.png',
    name: 'Fiber Art 4'
  },
  {
    id: 'image-5',
    url: '/images/hero/image2.JPG',
    name: 'Fiber Art 5'
  },
  {
    id: 'image-6',
    url: '/images/hero/image3.jpg',
    name: 'Fiber Art 6'
  },
  {
    id: 'image-7',
    url: '/images/hero/image7.JPG',
    name: 'Fiber Art 7'
  },
  {
    id: 'image-8',
    url: '/images/hero/image8.jpg',
    name: 'Fiber Art 8'
  },
  {
    id: 'image-9',
    url: '/images/hero/image9.jpg',
    name: 'Fiber Art 9'
  },
  {
    id: 'image-10',
    url: '/images/hero/image10.jpg',
    name: 'Fiber Art 10'
  },
  {
    id: 'image-11',
    url: '/images/hero/image11.jpg',
    name: 'Fiber Art 11'
  },
  {
    id: 'image-12',
    url: '/images/hero/image12.jpg',
    name: 'Fiber Art 12'
  }
]

const HeroSection = () => {
  const [backgroundImages, setBackgroundImages] = useState(DEMO_IMAGES) // Start with demo images
  const sectionRef = useRef(null)
  const [currentPage, setCurrentPage] = useState(0)

  // No longer loading from API - using demo images only

  // Calculate total pages (3 images per page)
  const totalPages = Math.ceil(backgroundImages.length / 3)
  const currentPageImages = backgroundImages.slice(currentPage * 3, (currentPage * 3) + 3)

  // No useEffect needed - using static demo images

  // Handle keyboard and touch navigation (no auto-switch)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (totalPages <= 1) return
      
      if (e.key === 'ArrowLeft' && currentPage > 0) {
        setCurrentPage(prev => prev - 1)
      } else if (e.key === 'ArrowRight' && currentPage < totalPages - 1) {
        setCurrentPage(prev => prev + 1)
      }
    }

    let touchStartX = 0
    let touchEndX = 0

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX
    }

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX
      handleSwipe()
    }

    const handleSwipe = () => {
      if (totalPages <= 1) return
      const swipeDistance = touchStartX - touchEndX
      const minSwipeDistance = 50

      if (swipeDistance > minSwipeDistance && currentPage < totalPages - 1) {
        setCurrentPage(prev => prev + 1)
      } else if (swipeDistance < -minSwipeDistance && currentPage > 0) {
        setCurrentPage(prev => prev - 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    const section = sectionRef.current
    if (section) {
      section.addEventListener('touchstart', handleTouchStart, { passive: true })
      section.addEventListener('touchend', handleTouchEnd, { passive: true })
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (section) {
        section.removeEventListener('touchstart', handleTouchStart)
        section.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [currentPage, totalPages])

  return (
    <section 
      ref={sectionRef}
      className="relative overflow-hidden transition-all duration-500 ease-in-out min-h-screen"
    >
      {/* Background Images - 3 per page, manual navigation only */}
      {backgroundImages.length > 0 && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="flex items-start justify-center h-full gap-2 px-4 pt-0">
            {currentPageImages.map((img, index) => (
              <div
                key={`hero-bg-${img.id}-${currentPage}`}
                className="relative w-full max-w-md h-3/4 opacity-[0.25] hover:opacity-[0.35] transition-all duration-500"
                style={{
                  animation: 'fadeIn 0.5s ease-in',
                }}
              >
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-full object-cover shadow-lg rounded-lg"
                  loading="eager"
                  style={{
                    filter: 'blur(0.5px)',
                  }}
                />
              </div>
            ))}
          </div>
          
          {/* Page indicators */}
          {totalPages > 1 && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentPage 
                      ? 'bg-pink-500 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="max-w-7xl mx-auto relative z-10 py-20 px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
        <div className="text-center transition-all duration-500 w-full flex flex-col items-center justify-center mb-16 mt-32">
          <h1 className="font-serif font-bold text-gray-800 leading-tight transition-all duration-500 text-5xl md:text-7xl mb-6">
            Modern Fiber Arts: Needle Felters
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            A student-led community exploring fiber art through creativity, collaboration, and care!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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