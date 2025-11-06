import { useRouter } from 'next/router'
import { samplePatterns } from '../../lib/data'
import { Heart } from 'lucide-react'

const PatternGrid = () => {
  const router = useRouter()
  
  const handlePatternClick = (pattern) => {
    router.push(`/gallery?pattern=${pattern.id}`)
  }
  
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl font-bold text-gray-800 mb-4">
            Interesting Patterns
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover interesting patterns generated from different categories of data
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {samplePatterns.slice(0, 6).map((pattern) => (
            <div
              key={pattern.id}
              className="pattern-card cursor-pointer"
              onClick={() => handlePatternClick(pattern)}
            >
              <div className="h-48 bg-gradient-to-br from-pink-100 to-blue-100 flex items-center justify-center text-6xl">
                {pattern.image}
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">{pattern.title}</h3>
                <p className="text-gray-600 mb-4">{pattern.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    {pattern.colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <Heart className="w-5 h-5 text-gray-400 hover:text-pink-400 cursor-pointer transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PatternGrid