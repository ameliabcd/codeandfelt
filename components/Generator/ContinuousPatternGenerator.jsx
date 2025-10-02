'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import { RefreshCw, Download, RotateCcw, Palette, Waves, Mountain } from 'lucide-react'
import { 
  generateContinuousFractal,
  generateMarblePattern,
  generateWoodPattern,
  interpolateColors
} from '../../lib/continuousPatterns'

export default function ContinuousPatternGenerator({ selectedColors, onPatternGenerated }) {
  const canvasRef = useRef(null)
  const [patternType, setPatternType] = useState('mandelbrot')
  const [patternSize, setPatternSize] = useState(400) // Canvas size for high quality
  const [maxIterations, setMaxIterations] = useState(100)
  const [zoom, setZoom] = useState(1)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [juliaParams, setJuliaParams] = useState({ real: -0.7, imag: 0.27015 })
  const [noiseParams, setNoiseParams] = useState({ scale: 0.01 })
  const [waveParams, setWaveParams] = useState({ frequency: 0.02, amplitude: 1, phase: 0 })
  const [marbleParams, setMarbleParams] = useState({ scale: 0.01, turbulence: 0.5, veining: 2 })
  const [woodParams, setWoodParams] = useState({ ringSpacing: 0.02, irregularity: 0.3 })
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentCanvas, setCurrentCanvas] = useState(null)

  const patternTypes = [
    { id: 'mandelbrot', name: 'Mandelbrot', description: 'Smooth fractal boundaries', icon: '🌀' },
    { id: 'julia', name: 'Julia Set', description: 'Complex iterations', icon: '✨' },
    { id: 'noise', name: 'Organic Noise', description: 'Natural textures', icon: '🌿' },
    { id: 'waves', name: 'Wave Patterns', description: 'Flowing waves', icon: '🌊' },
    { id: 'marble', name: 'Marble', description: 'Stone-like veining', icon: '🏛️' },
    { id: 'wood', name: 'Wood Grain', description: 'Natural wood rings', icon: '🌳' }
  ]

  // Generate continuous pattern
  const generatePattern = useMemo(() => {
    if (!selectedColors || selectedColors.length === 0) return null
    
    setIsGenerating(true)
    
    const params = {
      zoom,
      offsetX,
      offsetY,
      maxIterations,
      ...juliaParams,
      ...noiseParams,
      ...waveParams,
      ...marbleParams,
      ...woodParams
    }
    
    let canvas
    try {
      switch (patternType) {
        case 'mandelbrot':
        case 'julia':
        case 'noise':
        case 'waves':
          canvas = generateContinuousFractal(patternSize, patternSize, patternType, params, selectedColors)
          break
        case 'marble':
          canvas = generateMarblePattern(patternSize, patternSize, selectedColors, marbleParams)
          break
        case 'wood':
          canvas = generateWoodPattern(patternSize, patternSize, selectedColors, woodParams)
          break
        default:
          canvas = generateContinuousFractal(patternSize, patternSize, 'mandelbrot', params, selectedColors)
      }
      
      setCurrentCanvas(canvas)
      setIsGenerating(false)
      return canvas
    } catch (error) {
      console.error('Pattern generation error:', error)
      setIsGenerating(false)
      return null
    }
  }, [patternType, patternSize, maxIterations, zoom, offsetX, offsetY, juliaParams, noiseParams, waveParams, marbleParams, woodParams, selectedColors])

  // Update canvas display
  useEffect(() => {
    if (generatePattern && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      ctx.drawImage(generatePattern, 0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }, [generatePattern])

  // Pass pattern to parent
  useEffect(() => {
    if (currentCanvas && onPatternGenerated) {
      onPatternGenerated(currentCanvas)
    }
  }, [currentCanvas, onPatternGenerated])

  const resetSettings = () => {
    setZoom(1)
    setOffsetX(0)
    setOffsetY(0)
    setMaxIterations(100)
    setJuliaParams({ real: -0.7, imag: 0.27015 })
    setNoiseParams({ scale: 0.01 })
    setWaveParams({ frequency: 0.02, amplitude: 1, phase: 0 })
    setMarbleParams({ scale: 0.01, turbulence: 0.5, veining: 2 })
    setWoodParams({ ringSpacing: 0.02, irregularity: 0.3 })
  }

  const randomizePattern = () => {
    switch (patternType) {
      case 'julia':
        setJuliaParams({
          real: (Math.random() - 0.5) * 2,
          imag: (Math.random() - 0.5) * 2
        })
        break
      case 'waves':
        setWaveParams({
          frequency: Math.random() * 0.05 + 0.01,
          amplitude: Math.random() * 2 + 0.5,
          phase: Math.random() * Math.PI * 2
        })
        break
      case 'marble':
        setMarbleParams({
          scale: Math.random() * 0.02 + 0.005,
          turbulence: Math.random() * 0.8 + 0.2,
          veining: Math.random() * 4 + 1
        })
        break
      case 'wood':
        setWoodParams({
          ringSpacing: Math.random() * 0.03 + 0.01,
          irregularity: Math.random() * 0.5 + 0.1
        })
        break
      default:
        setOffsetX((Math.random() - 0.5) * 2)
        setOffsetY((Math.random() - 0.5) * 2)
        setZoom(Math.random() * 3 + 0.5)
    }
  }

  const downloadPattern = (format = 'png') => {
    if (!currentCanvas) return
    
    const link = document.createElement('a')
    link.download = `pattern-${patternType}-${Date.now()}.${format}`
    link.href = currentCanvas.toDataURL(`image/${format}`)
    link.click()
  }

  return (
    <div className="space-y-6">
      {/* Pattern Type Selection */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="font-serif text-xl font-bold text-gray-800 mb-4">Continuous Pattern Type</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {patternTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setPatternType(type.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                patternType === type.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <div className="text-2xl mb-2">{type.icon}</div>
              <div className="font-medium text-sm">{type.name}</div>
              <div className="text-xs opacity-75">{type.description}</div>
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
            <button
              onClick={randomizePattern}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              title="Randomize Pattern"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Resolution */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resolution: {patternSize}×{patternSize}
            </label>
            <input
              type="range"
              min="200"
              max="800"
              step="50"
              value={patternSize}
              onChange={(e) => setPatternSize(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Detail Level */}
          {['mandelbrot', 'julia'].includes(patternType) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detail Level: {maxIterations}
              </label>
              <input
                type="range"
                min="50"
                max="200"
                value={maxIterations}
                onChange={(e) => setMaxIterations(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}

          {/* Zoom */}
          {['mandelbrot', 'julia', 'noise'].includes(patternType) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zoom: {zoom.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Pattern-specific controls */}
        {patternType === 'julia' && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Real: {juliaParams.real.toFixed(3)}
              </label>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.001"
                value={juliaParams.real}
                onChange={(e) => setJuliaParams({...juliaParams, real: parseFloat(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imaginary: {juliaParams.imag.toFixed(3)}
              </label>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.001"
                value={juliaParams.imag}
                onChange={(e) => setJuliaParams({...juliaParams, imag: parseFloat(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}

        {patternType === 'waves' && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency: {waveParams.frequency.toFixed(3)}
              </label>
              <input
                type="range"
                min="0.005"
                max="0.1"
                step="0.001"
                value={waveParams.frequency}
                onChange={(e) => setWaveParams({...waveParams, frequency: parseFloat(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amplitude: {waveParams.amplitude.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={waveParams.amplitude}
                onChange={(e) => setWaveParams({...waveParams, amplitude: parseFloat(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phase: {waveParams.phase.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max={Math.PI * 2}
                step="0.1"
                value={waveParams.phase}
                onChange={(e) => setWaveParams({...waveParams, phase: parseFloat(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}

        {patternType === 'marble' && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scale: {marbleParams.scale.toFixed(3)}
              </label>
              <input
                type="range"
                min="0.005"
                max="0.05"
                step="0.001"
                value={marbleParams.scale}
                onChange={(e) => setMarbleParams({...marbleParams, scale: parseFloat(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Turbulence: {marbleParams.turbulence.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={marbleParams.turbulence}
                onChange={(e) => setMarbleParams({...marbleParams, turbulence: parseFloat(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Veining: {marbleParams.veining.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                value={marbleParams.veining}
                onChange={(e) => setMarbleParams({...marbleParams, veining: parseFloat(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}

        {patternType === 'wood' && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ring Spacing: {woodParams.ringSpacing.toFixed(3)}
              </label>
              <input
                type="range"
                min="0.01"
                max="0.05"
                step="0.001"
                value={woodParams.ringSpacing}
                onChange={(e) => setWoodParams({...woodParams, ringSpacing: parseFloat(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Irregularity: {woodParams.irregularity.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.1"
                value={woodParams.irregularity}
                onChange={(e) => setWoodParams({...woodParams, irregularity: parseFloat(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Pattern Preview */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="font-serif text-xl font-bold text-gray-800 mb-4">Continuous Pattern Preview</h3>
        <div className="bg-gradient-to-br from-pink-50 to-blue-50 rounded-xl p-6 flex items-center justify-center">
          {isGenerating ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating smooth pattern...</p>
            </div>
          ) : (
            <div className="text-center">
              <canvas
                ref={canvasRef}
                width={300}
                height={300}
                className="border border-gray-200 rounded-lg shadow-sm mb-4"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
              <p className="text-gray-600">
                {patternTypes.find(p => p.id === patternType)?.name} Pattern ({patternSize}×{patternSize})
              </p>
            </div>
          )}
        </div>
        
        {currentCanvas && (
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => downloadPattern('png')}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-2xl font-medium hover:from-blue-500 hover:to-blue-600 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download PNG
            </button>
            <button
              onClick={() => downloadPattern('jpeg')}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-2xl font-medium hover:from-pink-500 hover:to-pink-600 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download JPEG
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
