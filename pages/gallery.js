import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import FilterBar from '../components/Gallery/FilterBar'
import PatternGrid from '../components/Gallery/PatternGrid'
import PatternDetail from '../components/Gallery/PatternDetail'
import { samplePatterns } from '../lib/data'

export default function Gallery() {
  const router = useRouter()
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedPattern, setSelectedPattern] = useState(null)

  // Handle URL parameter for direct pattern navigation
  useEffect(() => {
    if (router.query.pattern) {
      const patternId = parseInt(router.query.pattern)
      const pattern = samplePatterns.find(p => p.id === patternId)
      if (pattern) {
        setSelectedPattern(pattern)
      }
    }
  }, [router.query.pattern])

  const filteredPatterns = selectedFilter === 'all' 
    ? samplePatterns 
    : samplePatterns.filter(pattern => pattern.category === selectedFilter)

  if (selectedPattern) {
    return (
      <>
        <Head>
          <title>{selectedPattern.title} - Modern Fiber Arts</title>
          <meta name="description" content={selectedPattern.description} />
        </Head>
        <PatternDetail pattern={selectedPattern} onBack={() => setSelectedPattern(null)} />
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Pattern Gallery - Modern Fiber Arts</title>
        <meta name="description" content="Discover patterns created by our community" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-serif text-5xl font-bold text-gray-800 mb-4">Pattern Gallery</h1>
            <p className="text-xl text-gray-600">Discover patterns created by our community</p>
          </div>

          <FilterBar 
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
          
          <PatternGrid patterns={filteredPatterns} onPatternClick={setSelectedPattern} />
          
          <div className="text-center mt-12">
            <button className="btn-secondary">
              Load More Patterns
            </button>
          </div>
        </div>
      </div>
    </>
  )
}