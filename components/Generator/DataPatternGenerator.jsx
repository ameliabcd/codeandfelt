'use client'
import { useState, useEffect, useMemo } from 'react'
import { Download, BarChart3, Settings, Grid, Sparkles } from 'lucide-react'
import FileUpload from './FileUpload'
import { parseCSV, parseJSON, parseText, dataToPattern, generateDataStats, dataToFractalParams, generateDataColors } from '../../lib/dataParser'
import { generateMandelbrot, generateJulia, generateSierpinski, fractalToColors } from '../../lib/fractals'

export default function DataPatternGenerator({ selectedColors, onPatternGenerated }) {
  const [fileData, setFileData] = useState(null)
  const [parsedData, setParsedData] = useState(null)
  const [pattern, setPattern] = useState(null)
  const [stats, setStats] = useState(null)
  const [patternSize, setPatternSize] = useState(30)
  const [showStats, setShowStats] = useState(false)
  const [fractalType, setFractalType] = useState('mandelbrot')
  const [fractalParams, setFractalParams] = useState(null)
  const [dataColors, setDataColors] = useState(null)

  const fractalTypes = [
    { id: 'mandelbrot', name: 'Mandelbrot Set', icon: '🌀', description: 'Classic fractal boundaries' },
    { id: 'julia', name: 'Julia Set', icon: '✨', description: 'Complex iterations' },
    { id: 'sierpinski', name: 'Sierpinski Triangle', icon: '🔺', description: 'Geometric recursion' }
  ]

  // Handle file upload
  const handleFileUpload = (file, content) => {
    if (!file || !content) {
      setFileData(null)
      setParsedData(null)
      setPattern(null)
      setStats(null)
      return
    }

    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    let parsed = null

    try {
      switch (fileExtension) {
        case '.csv':
          parsed = parseCSV(content)
          break
        case '.json':
          parsed = parseJSON(content)
          break
        case '.txt':
          parsed = parseText(content)
          break
        default:
          console.error('Unsupported file type')
          return
      }

      setFileData(file)
      setParsedData(parsed)
      
      // Generate statistics
      if (parsed) {
        const dataStats = generateDataStats(parsed)
        setStats(dataStats)
        
        // Extract fractal parameters from data
        const params = dataToFractalParams(parsed)
        setFractalParams(params)
        
        // Generate colors from data
        const colors = generateDataColors(parsed, 4)
        setDataColors(colors)
      }
    } catch (error) {
      console.error('Error parsing file:', error)
    }
  }

  // Generate fractal pattern from data
  useEffect(() => {
    if (parsedData && fractalParams && dataColors) {
      try {
        let fractalPattern
        
        switch (fractalType) {
          case 'mandelbrot':
            fractalPattern = generateMandelbrot(
              patternSize,
              patternSize,
              fractalParams.maxIterations,
              fractalParams.zoom,
              fractalParams.offsetX,
              fractalParams.offsetY
            )
            break
          case 'julia':
            fractalPattern = generateJulia(
              patternSize,
              patternSize,
              fractalParams.maxIterations,
              fractalParams.juliaReal,
              fractalParams.juliaImag,
              fractalParams.zoom,
              fractalParams.offsetX,
              fractalParams.offsetY
            )
            break
          case 'sierpinski':
            fractalPattern = generateSierpinski(
              patternSize,
              patternSize,
              Math.floor(fractalParams.maxIterations / 10)
            )
            break
          default:
            fractalPattern = generateMandelbrot(patternSize, patternSize, 100, 1, 0, 0)
        }
        
        // Convert fractal to colors using data-generated colors
        const colorPattern = fractalToColors(fractalPattern, dataColors, false)
        setPattern(colorPattern)
        
        // Pass pattern to parent
        if (onPatternGenerated) {
          onPatternGenerated(colorPattern)
        }
      } catch (error) {
        console.error('Error generating fractal pattern:', error)
      }
    }
  }, [parsedData, dataColors, patternSize, fractalType, fractalParams])

  // Generate random sample data
  const generateSampleData = () => {
    const sampleData = {
      headers: ['Temperature', 'Humidity', 'Pressure', 'WindSpeed'],
      data: Array.from({ length: 30 }, () => ({
        Temperature: Math.floor(Math.random() * 40 + 10),
        Humidity: Math.floor(Math.random() * 60 + 30),
        Pressure: Math.floor(Math.random() * 30 + 990),
        WindSpeed: Math.floor(Math.random() * 50 + 5)
      }))
    }
    setParsedData(sampleData)
    setStats(generateDataStats(sampleData))
    
    // Extract fractal parameters
    const params = dataToFractalParams(sampleData)
    setFractalParams(params)
    
    // Generate colors from data
    const colors = generateDataColors(sampleData, 4)
    setDataColors(colors)
  }

  // Download pattern as PNG
  const downloadPattern = () => {
    if (!pattern) return

    const canvas = document.createElement('canvas')
    const cellSize = 20
    canvas.width = pattern[0].length * cellSize
    canvas.height = pattern.length * cellSize
    const ctx = canvas.getContext('2d')

    // Draw pattern
    pattern.forEach((row, y) => {
      row.forEach((color, x) => {
        ctx.fillStyle = color
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
      })
    })

    // Download
    const link = document.createElement('a')
    link.download = `data-pattern-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  // Download pattern as PDF
  const downloadPatternPDF = () => {
    if (!pattern) return
    
    // For now, just download as PNG
    // In production, you'd use a library like jsPDF
    downloadPattern()
  }

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h2 className="font-serif text-2xl font-bold text-gray-800 mb-6">Upload Your Data</h2>
        
        <FileUpload 
          onFileUpload={handleFileUpload}
          acceptedTypes=".csv,.json,.txt"
        />
        
        <div className="flex gap-4 mt-6">
          <button 
            onClick={generateSampleData}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-2xl font-medium hover:from-purple-500 hover:to-purple-600 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Grid className="w-5 h-5" />
            Generate Sample Pattern
          </button>
          {stats && (
            <button 
              onClick={() => setShowStats(!showStats)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-all duration-200 flex items-center gap-2"
            >
              <BarChart3 className="w-5 h-5" />
              {showStats ? 'Hide' : 'Show'} Stats
            </button>
          )}
        </div>

        {/* Data Statistics */}
        {showStats && stats && fractalParams && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl">
              <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                Data Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Rows:</span>
                  <span className="ml-2 font-medium text-gray-800">{stats.rows}</span>
                </div>
                <div>
                  <span className="text-gray-600">Columns:</span>
                  <span className="ml-2 font-medium text-gray-800">{stats.columns}</span>
                </div>
                <div>
                  <span className="text-gray-600">Total Values:</span>
                  <span className="ml-2 font-medium text-gray-800">{stats.totalValues}</span>
                </div>
                <div>
                  <span className="text-gray-600">Min Value:</span>
                  <span className="ml-2 font-medium text-gray-800">{stats.min.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Max Value:</span>
                  <span className="ml-2 font-medium text-gray-800">{stats.max.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Average:</span>
                  <span className="ml-2 font-medium text-gray-800">{stats.average.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-xl">
              <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Data-Driven Fractal Parameters
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Zoom:</span>
                  <span className="ml-2 font-medium text-gray-800">{fractalParams.zoom.toFixed(2)}x</span>
                </div>
                <div>
                  <span className="text-gray-600">X Offset:</span>
                  <span className="ml-2 font-medium text-gray-800">{fractalParams.offsetX.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Y Offset:</span>
                  <span className="ml-2 font-medium text-gray-800">{fractalParams.offsetY.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Iterations:</span>
                  <span className="ml-2 font-medium text-gray-800">{fractalParams.maxIterations}</span>
                </div>
                <div>
                  <span className="text-gray-600">Variability:</span>
                  <span className="ml-2 font-medium text-gray-800">{(fractalParams.variability * 100).toFixed(1)}%</span>
                </div>
                {fractalType === 'julia' && (
                  <div className="col-span-2 md:col-span-1">
                    <span className="text-gray-600">Julia C:</span>
                    <span className="ml-2 font-medium text-gray-800">
                      {fractalParams.juliaReal.toFixed(3)} + {fractalParams.juliaImag.toFixed(3)}i
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                These fractal parameters are automatically calculated from your data columns
              </p>
            </div>
            
            {dataColors && (
              <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl">
                <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-pink-500" />
                  Data-Generated Color Palette
                </h3>
                <div className="flex gap-3 items-center">
                  {dataColors.map((color, idx) => (
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
                  🎨 Colors automatically generated from your data values (hue, saturation, lightness)
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fractal Type Selection */}
      {(parsedData || pattern) && (
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h3 className="font-serif text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            Fractal Type
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {fractalTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setFractalType(type.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  fractalType === type.id
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <div className="text-2xl mb-2">{type.icon}</div>
                <div className="font-medium text-sm">{type.name}</div>
                <div className="text-xs opacity-75 mt-1">{type.description}</div>
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Your data controls the fractal parameters (zoom, position, iterations). Different data = different patterns!
          </p>
        </div>
      )}

      {/* Pattern Controls */}
      {(parsedData || pattern) && (
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h3 className="font-serif text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Pattern Settings
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pattern Size: {patternSize}×{patternSize}
            </label>
            <input
              type="range"
              min="20"
              max="50"
              value={patternSize}
              onChange={(e) => setPatternSize(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-2">
              Larger sizes show more fractal detail but take longer to generate
            </p>
          </div>
        </div>
      )}

      {/* Pattern Preview */}
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h2 className="font-serif text-2xl font-bold text-gray-800 mb-6">
          Data-Driven Fractal Pattern
        </h2>
        <div className="bg-gradient-to-br from-pink-50 to-blue-50 rounded-2xl p-8 min-h-96 flex items-center justify-center">
          {pattern ? (
            <div className="text-center">
              <div 
                className="mb-6 inline-block border border-gray-200 overflow-auto max-w-full shadow-lg"
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: `repeat(${pattern[0]?.length || 1}, 1fr)`,
                  gap: 0
                }}
              >
                {pattern.flat().map((color, i) => (
                  <div
                    key={i}
                    style={{ 
                      backgroundColor: color, 
                      width: '12px', 
                      height: '12px',
                      margin: 0,
                      padding: 0
                    }}
                  />
                ))}
              </div>
              <p className="text-gray-700 font-medium">
                {fractalTypes.find(t => t.id === fractalType)?.name} ({pattern.length}×{pattern[0]?.length || 0})
              </p>
              {fileData && (
                <p className="text-sm text-gray-500 mt-2">
                  Generated from: {fileData.name}
                </p>
              )}
              <p className="text-xs text-purple-600 mt-2 font-medium">
                ✨ Pattern parameters derived from your data
              </p>
            </div>
          ) : (
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Upload data or generate sample to see your fractal pattern</p>
            </div>
          )}
        </div>
        
        {/* Download Buttons */}
        {pattern && (
          <div className="mt-6 space-y-4">
            <div className="flex gap-4">
              <button 
                onClick={downloadPattern}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-2xl font-medium hover:from-blue-500 hover:to-blue-600 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download PNG
              </button>
              <button 
                onClick={downloadPatternPDF}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-2xl font-medium hover:from-pink-500 hover:to-pink-600 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </button>
            </div>
            <p className="text-sm text-gray-500 text-center">
              Download your pattern to print and use for felting projects
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

