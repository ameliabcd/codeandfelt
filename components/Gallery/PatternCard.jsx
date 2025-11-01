import { Heart } from 'lucide-react'

const PatternCard = ({ pattern, onClick }) => {
  return (
    <div className="pattern-card cursor-pointer" onClick={onClick}>
      <div className="h-48 bg-gradient-to-br from-pink-100 to-blue-100 flex items-center justify-center text-6xl">
        {pattern.image}
      </div>
      <div className="p-6">
        <h3 className="font-serif text-lg font-bold text-gray-800 mb-2">{pattern.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{pattern.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {pattern.colors.map((color, idx) => (
              <div
                key={idx}
                className="w-3 h-3 rounded-full border border-gray-300"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <Heart className="w-4 h-4 text-gray-400 hover:text-pink-400 cursor-pointer transition-colors" />
        </div>
      </div>
    </div>
  )
}

export default PatternCard