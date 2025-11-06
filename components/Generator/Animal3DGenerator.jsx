'use client'
import { useState, useEffect } from 'react'
import { Download, Sparkles, Heart, Info } from 'lucide-react'
import { animalTemplates, generateAnimal3DPattern } from '../../lib/animal3DPatterns'
import { generateDataColors, dataToFractalParams } from '../../lib/dataParser'
import { exportAnimal3DPatternSVG, downloadSVG } from '../../lib/svgExporter'

export default function Animal3DGenerator({ parsedData }) {
  const [selectedAnimal, setSelectedAnimal] = useState('bear')
  const [animalPattern, setAnimalPattern] = useState(null)
  const [colors, setColors] = useState(null)
  const [fractalParams, setFractalParams] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Generate colors and fractal params from data
  useEffect(() => {
    if (parsedData && parsedData.data && parsedData.data.length > 0) {
      try {
        const dataColors = generateDataColors(parsedData, 6)
        setColors(dataColors)
        
        const params = dataToFractalParams(parsedData)
        setFractalParams(params)
      } catch (error) {
        console.error('Error generating colors/params:', error)
      }
    } else {
      // Reset if no data
      setColors(null)
      setFractalParams(null)
      setAnimalPattern(null)
    }
  }, [parsedData])

  // Generate animal pattern when data or animal selection changes
  useEffect(() => {
    if (parsedData && colors && fractalParams) {
      setIsGenerating(true)
      
      setTimeout(() => {
        try {
          console.log('Generating animal pattern:', { selectedAnimal, parsedData, colors, fractalParams })
          const pattern = generateAnimal3DPattern(selectedAnimal, parsedData, colors, fractalParams)
          console.log('Generated pattern:', pattern)
          
          if (pattern && pattern.patternPieces && Object.keys(pattern.patternPieces).length > 0) {
            setAnimalPattern(pattern)
            console.log('Pattern set successfully')
          } else {
            console.error('Pattern generation returned null or invalid pattern:', pattern)
            setAnimalPattern(null)
          }
          setIsGenerating(false)
        } catch (error) {
          console.error('Error generating animal pattern:', error)
          console.error('Error stack:', error.stack)
          setAnimalPattern(null)
          setIsGenerating(false)
        }
      }, 100)
    } else {
      // Reset pattern if dependencies aren't ready
      setAnimalPattern(null)
      setIsGenerating(false)
    }
  }, [parsedData, colors, fractalParams, selectedAnimal])

  // Export animal pattern as SVG
  const exportAnimalPattern = () => {
    if (!animalPattern) return
    
    const svgContent = exportAnimal3DPatternSVG(animalPattern)
    const filename = `felted-${selectedAnimal}-${Date.now()}.svg`
    downloadSVG(svgContent, filename)
  }

  return (
    <div className="space-y-6">
      {/* Animal Selection */}
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h2 className="font-serif text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Heart className="w-6 h-6 text-pink-500" />
          3D Felted Animals
        </h2>
        
        <p className="text-gray-600 mb-6">
          Generate 3D felting patterns for animals from your data! Each animal has multiple pattern pieces with assembly instructions.
        </p>

        {/* Animal Selection Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {animalTemplates.map((animal) => (
            <button
              key={animal.id}
              onClick={() => setSelectedAnimal(animal.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedAnimal === animal.id
                  ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{animal.icon}</div>
                <div className="font-medium text-sm">{animal.name}</div>
                <div className="text-xs text-gray-500 mt-1">{animal.description}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 border-2 border-pink-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-pink-600 mt-0.5" />
            <div className="text-sm text-gray-700">
              <p className="font-semibold mb-2">How It Works:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Your data values control the animal's size, proportions, and features</li>
                <li>Each animal has multiple pattern pieces (body, head, limbs, etc.)</li>
                <li>Pattern pieces include seam allowances and color zones</li>
                <li>Assembly instructions are included with each pattern</li>
                <li>Different data = Different sized and proportioned animals!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Info (for troubleshooting) */}
      {parsedData && !animalPattern && !isGenerating && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-4">
          <p className="text-sm text-gray-700">
            <strong>Debug:</strong> Waiting for pattern generation. 
            {!colors && ' (Colors not ready) '}
            {!fractalParams && ' (Fractal params not ready) '}
            {colors && fractalParams && ' (All ready, generating pattern...) '}
          </p>
        </div>
      )}

      {/* Pattern Preview */}
      {animalPattern && (
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-2xl font-bold text-gray-800 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-purple-500" />
              {animalPattern.animalName} Pattern
            </h3>
            <button
              onClick={exportAnimalPattern}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              <Download size={16} />
              Export Pattern
            </button>
          </div>

          {isGenerating ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating {animalPattern.animalName} pattern...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Measurements */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Measurements</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  {Object.entries(animalPattern.measurements).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                      <span className="ml-2 font-medium text-gray-800">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pattern Pieces Summary */}
              <div className="bg-purple-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Pattern Pieces</h4>
                <div className="text-sm text-gray-700">
                  <p className="mb-2">
                    This {animalPattern.animalName} pattern includes multiple pieces that need to be felted together:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs mb-4">
                    {Object.keys(animalPattern.patternPieces).map((part) => (
                      <li key={part} className="capitalize">{part.replace(/_/g, ' ')}</li>
                    ))}
                  </ul>
                  
                  {/* Visual Preview of Pattern Pieces */}
                  <div className="mt-4 p-4 bg-white rounded-lg border-2 border-purple-200">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Pattern Pieces Preview:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(animalPattern.patternPieces).map(([partName, partData]) => {
                        if (typeof partData === 'object' && partData !== null) {
                          // Handle nested objects (e.g., body.front, body.back)
                          return Object.entries(partData).map(([subPart, piece]) => {
                            if (piece && piece.points && piece.points.length > 0) {
                              return (
                                <div key={`${partName}-${subPart}`} className="border-2 border-gray-300 rounded p-2 bg-white">
                                  <p className="text-xs font-medium text-gray-700 mb-1 capitalize">
                                    {partName} {subPart}
                                  </p>
                                  <svg 
                                    width="100" 
                                    height="100" 
                                    viewBox={`0 0 ${piece.width || 100} ${piece.height || 100}`}
                                    className="border border-gray-200 rounded"
                                  >
                                    <path
                                      d={`M ${piece.points[0]?.x || 0} ${piece.points[0]?.y || 0} ${piece.points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')} Z`}
                                      fill={piece.color || '#ccc'}
                                      stroke="#333"
                                      strokeWidth="1"
                                    />
                                  </svg>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {piece.width?.toFixed(1)} × {piece.height?.toFixed(1)} cm
                                  </p>
                                </div>
                              )
                            }
                            return null
                          })
                        }
                        return null
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Assembly Instructions */}
              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Assembly Instructions</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  {animalPattern.assemblyInstructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>

              {/* Color Palette */}
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Color Palette</h4>
                <div className="flex gap-3 items-center">
                  {animalPattern.colors.map((color, idx) => (
                    <div key={idx} className="flex-1">
                      <div
                        className="w-full h-12 rounded-lg shadow-md border-2 border-white"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                      <p className="text-xs text-gray-600 mt-1 text-center font-mono">{color}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  🎨 Colors automatically generated from your data values
                </p>
              </div>

              {/* Export Note */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <p className="text-sm text-gray-700">
                  <strong>💡 Tip:</strong> Click "Export Pattern" to download a printable SVG with all pattern pieces and assembly instructions. 
                  Each piece includes seam allowances and color zones to guide your felting project!
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {parsedData && isGenerating && !animalPattern && (
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating animal pattern...</p>
        </div>
      )}

      {/* Error State */}
      {parsedData && !isGenerating && !animalPattern && colors && fractalParams && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <p className="text-sm text-red-700">
            <strong>Error:</strong> Failed to generate animal pattern. Check console for details.
          </p>
        </div>
      )}

      {/* No Data Message */}
      {!parsedData && (
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Enter data in Manual Entry or upload a file to generate 3D animal patterns</p>
        </div>
      )}
    </div>
  )
}

