'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'lucide-react'

const HeroSection = () => {
  const [backgroundImages, setBackgroundImages] = useState([])
  const [isCollapsed, setIsCollapsed] = useState(false)
  const sectionRef = useRef(null)
  const [currentPage, setCurrentPage] = useState(0)
  const autoSwitchTimerRef = useRef(null)
  const [imagesLoading, setImagesLoading] = useState(true)

  // Load images directly from API (faster than dynamic import)
  const loadBackgroundImages = async () => {
    try {
      setImagesLoading(true)
      const response = await fetch('/api/images')
      if (!response.ok) {
        throw new Error('Failed to load images')
      }
      const images = await response.json()
      setBackgroundImages(images || [])
      setImagesLoading(false)
      // Reset to first page if current page is out of bounds
      const newTotalPages = Math.ceil((images?.length || 0) / 3)
      if (currentPage >= newTotalPages && newTotalPages > 0) {
        setCurrentPage(0)
      }
    } catch (error) {
      console.error('Error loading background images:', error)
      setBackgroundImages([])
      setImagesLoading(false)
    }
  }

  // Calculate total pages (3 images per page)
  const totalPages = Math.ceil(backgroundImages.length / 3)
  const currentPageImages = backgroundImages.slice(currentPage * 3, (currentPage * 3) + 3)

  // Helper to reset auto-switch timer
  const resetAutoSwitch = () => {
    if (autoSwitchTimerRef.current) {
      clearInterval(autoSwitchTimerRef.current)
    }
    if (totalPages > 1) {
      autoSwitchTimerRef.current = setInterval(() => {
        setCurrentPage((prev) => (prev + 1) % totalPages)
      }, 3000)
    }
  }

  useEffect(() => {
    // Load images immediately
    loadBackgroundImages()
    
    // Listen for custom event from WorkGallery component
    const handleCustomStorage = () => {
      loadBackgroundImages()
    }
    window.addEventListener('workGalleryUpdated', handleCustomStorage)

    return () => {
      window.removeEventListener('workGalleryUpdated', handleCustomStorage)
    }
  }, [])


  // Auto-switch pages every 3 seconds
  useEffect(() => {
    resetAutoSwitch()
    return () => {
      if (autoSwitchTimerRef.current) {
        clearInterval(autoSwitchTimerRef.current)
      }
    }
  }, [totalPages])

  // Handle keyboard and touch navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (totalPages <= 1) return
      
      if (e.key === 'ArrowLeft' && currentPage > 0) {
        setCurrentPage(prev => prev - 1)
        resetAutoSwitch()
      } else if (e.key === 'ArrowRight' && currentPage < totalPages - 1) {
        setCurrentPage(prev => prev + 1)
        resetAutoSwitch()
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
        resetAutoSwitch()
      } else if (swipeDistance < -minSwipeDistance && currentPage > 0) {
        setCurrentPage(prev => prev - 1)
        resetAutoSwitch()
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
      className={`relative overflow-hidden transition-all duration-500 ease-in-out ${
        isCollapsed ? 'min-h-[200px]' : 'min-h-screen'
      }`}
    >
      {/* Background Images - 3 per page with auto-switch */}
      {!imagesLoading && backgroundImages.length > 0 && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="flex items-center justify-center h-full gap-4 px-4">
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
                  onClick={() => {
                    setCurrentPage(index)
                    resetAutoSwitch()
                  }}
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
        <div className={`text-center transition-all duration-500 w-full flex flex-col items-center justify-center ${
          isCollapsed ? 'mb-4' : 'mb-16 mt-32'
        }`}>
          <h1 className={`font-serif font-bold text-gray-800 leading-tight transition-all duration-500 ${
            isCollapsed 
              ? 'text-2xl md:text-3xl mb-2' 
              : 'text-5xl md:text-7xl mb-6'
          }`}>
            Modern Fiber Arts: Needle Felters
          </h1>
          {!isCollapsed && (
            <>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                A student-led community exploring fiber art through creativity, collaboration, and care!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/about" className="btn-secondary">
                  Learn More
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Collapse/Expand Button */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all flex items-center gap-2 text-gray-700 hover:text-pink-500"
          title={isCollapsed ? "Expand to see content" : "Collapse to see more images"}
        >
          {isCollapsed ? (
            <>
              <ChevronDown className="w-5 h-5" />
              <span className="text-sm font-medium">Show Content</span>
            </>
          ) : (
            <>
              <ChevronUp className="w-5 h-5" />
              <span className="text-sm font-medium">See More Images</span>
            </>
          )}
        </button>
      </div>
    </section>
  )
}

export default HeroSection