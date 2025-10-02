'use client'
import { useState, useEffect, useMemo } from 'react'
import { RefreshCw, Settings, Download, RotateCcw } from 'lucide-react'
import { 
  generateMandelbrot, 
  generateJulia, 
  generateSierpinski, 
  generateDragonCurve,
  fractalToColors,
  getRandomJuliaParams 
} from '../../lib/fractals'

export default function FractalPatternGenerator({ selectedColors, onPatternGenerated }) {
  const [fractalType, setFractalType] = useState('mandelbrot')
  const [patternSize, setPatternSize] = useState(20) // Grid size (20x20 for felting)
  const [maxIterations, setMaxIterations] = useState(50)
  const [zoom, setZoom] = useState(1)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [invertColors, setInvertColors] = useState(false)
  const [juliaParams, setJuliaParams] = useState({ real: -0.7, imag: 0.27015 })
  const [isGenerating, setIsGenerating] = useState(false)

  const fractalTypes = [
    { id: 'mandelbrot', name: 'Mandelbrot Set', description: 'The famous fractal boundary' },
    { id: 'julia', name: 'Julia Set', description: 'Complex plane iterations' },
    { id: 'sierpinski', name: 'Sierpinski Triangle', description: 'Geometric recursion' },
    { id: 'dragon', name: 'Dragon Curve', description: 'Space-filling curve' }
  ]

  // Generate fractal pattern
  const fractalPattern = useMemo(() => {
    if (!selectedColors || selectedColors.length === 0) return null
    
    setIsGenerating(true)
    
    let pattern
    switch (fractalType) {
      case 'mandelbrot':
        pattern = generateMandelbrot(patternSize, patternSize, maxIterations, zoom, offsetX, offsetY)
        break
      case 'julia':
        pattern = generateJulia(patternSize, patternSize, maxIterations, juliaParams.real, juliaParams.imag, zoom, offsetX, offsetY)
        break
      case 'sierpinski':
        pattern = generateSierpinski(patternSize, patternSize, Math.floor(maxIterations / 10))
        break
      case 'dragon':
        pattern = generateDragonCurve(patternSize, patternSize, Math.floor(maxIterations / 5))
        break
      default:
        pattern = generateMandelbrot(patternSize, patternSize, maxIterations, zoom, offsetX, offsetY)
    }
    
    const colorPattern = fractalToColors(pattern, selectedColors, invertColors)
    setIsGenerating(false)
    
    return colorPattern
  }, [fractalType, patternSize, maxIterations, zoom, offsetX, offsetY, invertColors, juliaParams, selectedColors])

  // Generate random Julia parameters
  const generateRandomJulia = () => {
    setJuliaParams(getRandomJuliaParams())
  }

  // Reset to default settings
  const resetSettings = () => {
    setZoom(1)
    setOffsetX(0)
    setOffsetY(0)
    setMaxIterations(50)
    setInvertColors(false)
    setJuliaParams({ real: -0.7, imag: 0.27015 })
  }

  // Pass pattern to parent when it changes
  useEffect(() => {
    if (fractalPattern && onPatternGenerated) {
      onPatternGenerated(fractalPattern)
    }
  }, [fractalPattern, onPatternGenerated])

  return (
    <div className="space-y-6">
      {/* Fractal Type Selection */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="font-serif text-xl font-bold text-gray-800 mb-4">Fractal Type</h3>
        <div className="grid grid-cols-2 gap-3">
          {fractalTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setFractalType(type.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                fractalType === type.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <div className="font-medium">{type.name}</div>
              <div className="text-sm opacity-75">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Pattern Controls */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-xl font-bold text-gray-800">Pattern Controls</h3>
          <div className="flex gap-2">
            <button
              onClick={resetSettings}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              title="Reset Settings"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            {fractalType === 'julia' && (
              <button
                onClick={generateRandomJulia}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                title="Random Julia Parameters"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pattern Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pattern Size: {patternSize}×{patternSize}
            </label>
            <input
              type="range"
              min="10"
              max="40"
              value={patternSize}
              onChange={(e) => setPatternSize(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Max Iterations */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detail Level: {maxIterations}
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={maxIterations}
              onChange={(e) => setMaxIterations(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Zoom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zoom: {zoom.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Color Invert */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="invertColors"
              checked={invertColors}
              onChange={(e) => setInvertColors(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="invertColors" className="text-sm font-medium text-gray-700">
              Invert Colors
            </label>
          </div>
        </div>

        {/* Offset Controls */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              X Offset: {offsetX.toFixed(2)}
            </label>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={offsetX}
              onChange={(e) => setOffsetX(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Y Offset: {offsetY.toFixed(2)}
            </label>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={offsetY}
              onChange={(e) => setOffsetY(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Julia Set Specific Controls */}
        {fractalType === 'julia' && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Real Component: {juliaParams.real.toFixed(3)}
              </label>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.001"
                value={juliaParams.real}
                onChange={(e) => setJuliaParams({...juliaParams, real: parseFloat(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imaginary Component: {juliaParams.imag.toFixed(3)}
              </label>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.001"
                value={juliaParams.imag}
                onChange={(e) => setJuliaParams({...juliaParams, imag: parseFloat(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Pattern Preview */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="font-serif text-xl font-bold text-gray-800 mb-4">Fractal Pattern Preview</h3>
        <div className="bg-gradient-to-br from-pink-50 to-blue-50 rounded-xl p-6 min-h-96 flex items-center justify-center">
          {isGenerating ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating fractal pattern...</p>
            </div>
          ) : fractalPattern ? (
            <div className="text-center">
              <div className="grid gap-0 mb-6 inline-block border border-gray-200" style={{ gridTemplateColumns: `repeat(${patternSize}, 1fr)` }}>
                {fractalPattern.flat().map((color, i) => (
                  <div
                    key={i}
                    className="w-3 h-3"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <p className="text-gray-600">
                {fractalType.charAt(0).toUpperCase() + fractalType.slice(1)} Pattern ({patternSize}×{patternSize})
              </p>
            </div>
          ) : (
            <div className="text-center">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Select colors to generate fractal pattern</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
