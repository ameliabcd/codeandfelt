'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'lucide-react'

const HeroSection = () => {
  const [backgroundImages, setBackgroundImages] = useState([])
  const [isCollapsed, setIsCollapsed] = useState(false)
  const sectionRef = useRef(null)
  const [scrollY, setScrollY] = useState(0)

  // Load images from server for background
  const loadBackgroundImages = async () => {
    try {
      const { loadImages } = await import('../../lib/imageStorage')
      const images = await loadImages()
      setBackgroundImages(images.slice(0, 8)) // Show up to 8 images
    } catch (error) {
      console.error('Error loading background images:', error)
        setBackgroundImages([])
    }
  }

  useEffect(() => {
    loadBackgroundImages()
    
    // Listen for custom event from WorkGallery component
    const handleCustomStorage = () => {
      loadBackgroundImages()
    }
    window.addEventListener('workGalleryUpdated', handleCustomStorage)

    // Parallax scroll effect
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('workGalleryUpdated', handleCustomStorage)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <section 
      ref={sectionRef}
      className={`relative overflow-hidden transition-all duration-500 ease-in-out ${
        isCollapsed ? 'min-h-[200px]' : 'min-h-screen'
      }`}
    >
      {/* Animated Background Images */}
      {backgroundImages.length > 0 && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 p-0 h-full">
            {backgroundImages.slice(0, 8).map((img, index) => {
              // Different animation speeds and delays for variety
              const animationDuration = 15 + (index % 3) * 5 // 15s, 20s, or 25s
              const animationDelay = index * 0.5 // Stagger the animations
              const parallaxSpeed = 0.1 + (index % 3) * 0.05 // Different parallax speeds
              const translateY = scrollY * parallaxSpeed
              
              return (
                <div
                  key={`hero-bg-${img.id}`}
                  className="relative aspect-square w-full h-full"
                  style={{
                    transform: `translateY(${translateY}px)`,
                  }}
                >
                  <div
                    className="relative w-full h-full opacity-[0.25] hover:opacity-[0.35] transition-opacity duration-300 animated-bg-image"
                    style={{
                      animationDuration: `${animationDuration}s`,
                      animationDelay: `${animationDelay}s`,
                    }}
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-cover shadow-lg rounded-lg"
                      style={{
                        filter: 'blur(0.5px)',
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
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