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
  const scrollContainerRef = useRef(null)

  return (
    <section 
      className="relative overflow-hidden transition-all duration-500 ease-in-out min-h-screen"
    >
      {/* Background Images - Horizontal scrollable */}
      {backgroundImages.length > 0 && (
        <div className="absolute inset-0 z-0 overflow-x-auto overflow-y-hidden">
          <div 
            ref={scrollContainerRef}
            className="flex items-start h-full gap-2 px-4 pt-0"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#f9a8d4 transparent',
            }}
          >
            {backgroundImages.map((img, index) => (
              <div
                key={`hero-bg-${img.id}`}
                className="relative flex-shrink-0 w-80 h-full opacity-[0.25] hover:opacity-[0.35] transition-all duration-500 pointer-events-none"
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