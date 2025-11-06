'use client'
import { useState, useEffect, useMemo } from 'react'
import { Download, BarChart3, Settings, Grid, Sparkles, Upload, Keyboard } from 'lucide-react'
import FileUpload from './FileUpload'
import ManualDataEntry from './ManualDataEntry'
import { parseCSV, parseJSON, parseText, dataToPattern, generateDataStats, dataToFractalParams, generateDataColors } from '../../lib/dataParser'
import { generateMandelbrot, generateJulia, generateSierpinski, generateKochSnowflake, generateMandelbrotWoolLayers, generatePhiMatrix, fractalToColors } from '../../lib/fractals'
import { 
  generateGradient, 
  generateRandomGrid, 
  generateSpiral, 
  generateStripes, 
  generateCheckerboard, 
  generateNoise, 
  generateCircularGradient, 
  generateZigzag, 
  generateDiamond,
  patternToColors,
  dataToPatternParams
} from '../../lib/geometricPatterns'
import { exportKochSnowflakeSVG, exportMandelbrotWoolSVG, exportPhiMatrixSVG, downloadSVG } from '../../lib/svgExporter'
import { wallpaperGroups, generateWallpaperPattern } from '../../lib/wallpaperGroups'

// Icon mapping for wallpaper groups
function getWallpaperIcon(groupId) {
  const iconMap = {
    'p1': '⬜', 'p2': '🔄', 'pm': '🪞', 'pg': '🌊', 'cm': '🎯',
    'pmm': '🔄🪞', 'pmg': '🪞🌊', 'pgg': '🌊🔄', 'cmm': '🎯🔄',
    'p4': '🔲', 'p4m': '🔲🪞', 'p4g': '🔲🌊', 'p3': '🔺', 
    'p3m1': '🔺🪞', 'p31m': '🔺🎯', 'p6': '⬡', 'p6m': '⬡🪞'
  }
  return iconMap[groupId] || '📐'
}

export default function DataPatternGenerator({ selectedColors, onPatternGenerated }) {
  const [inputMode, setInputMode] = useState('upload') // 'upload' or 'manual'
  const [fileData, setFileData] = useState(null)
  const [parsedData, setParsedData] = useState(null)
  const [pattern, setPattern] = useState(null)
  const [stats, setStats] = useState(null)
  const [patternSize, setPatternSize] = useState(40)
  const [showStats, setShowStats] = useState(false)
  const [fractalType, setFractalType] = useState('mandelbrot')
  const [fractalParams, setFractalParams] = useState(null)
  const [dataColors, setDataColors] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [exportData, setExportData] = useState(null)

  const patternTypes = [
    // Fractals
    { id: 'mandelbrot', name: 'Mandelbrot', icon: '🌀', description: 'Fractal boundaries', category: 'fractal' },
    { id: 'julia', name: 'Julia Set', icon: '✨', description: 'Complex iterations', category: 'fractal' },
    { id: 'sierpinski', name: 'Sierpinski', icon: '🔺', description: 'Geometric recursion', category: 'fractal' },
    { id: 'koch', name: 'Koch Snowflake', icon: '❄️', description: 'Recursive snowflake', category: 'fractal' },
    { id: 'mandelbrot-wool', name: 'Mandelbrot Wool', icon: '🧶', description: 'Wool layering guide', category: 'fractal' },
    { id: 'phi-matrix', name: 'Phi Matrix', icon: '📐', description: 'Golden ratio sculptor', category: 'fractal' },
    // Geometric Patterns
    { id: 'gradient', name: 'Gradient', icon: '🌈', description: 'Linear gradient', category: 'geometric' },
    { id: 'spiral', name: 'Spiral Wave', icon: '🌊', description: 'Radial waves', category: 'geometric' },
    { id: 'stripes', name: 'Stripes', icon: '📏', description: 'Linear stripes', category: 'geometric' },
    { id: 'checkerboard', name: 'Checkerboard', icon: '🔲', description: 'Grid pattern', category: 'geometric' },
    { id: 'noise', name: 'Felt Texture', icon: '🧶', description: 'Random noise', category: 'geometric' },
    { id: 'circular', name: 'Circular', icon: '⭕', description: 'Radial gradient', category: 'geometric' },
    { id: 'zigzag', name: 'Zigzag', icon: '⚡', description: 'Wave pattern', category: 'geometric' },
    { id: 'diamond', name: 'Diamond', icon: '💎', description: 'Diamond grid', category: 'geometric' },
    // Wallpaper Groups (17 types)
    ...wallpaperGroups.map(group => ({
      id: group.id,
      name: group.name,
      icon: getWallpaperIcon(group.id),
      description: group.description,
      category: 'wallpaper'
    }))
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
        
        // Generate colors from data (more colors for better fractal visualization)
        const colors = generateDataColors(parsed, 6)
        setDataColors(colors)
      }
    } catch (error) {
      console.error('Error parsing file:', error)
    }
  }

  // Handle manual data entry
  const handleManualDataSubmit = (data) => {
    if (!data || !data.data || data.data.length === 0) {
      setParsedData(null)
      setStats(null)
      setPattern(null)
      return
    }

    setFileData(null) // Clear file data when using manual entry
    setParsedData(data)
    
    // Generate statistics
    const dataStats = generateDataStats(data)
    setStats(dataStats)
    
    // Extract fractal parameters from data
    const params = dataToFractalParams(data)
    setFractalParams(params)
    
    // Generate colors from data
    const colors = generateDataColors(data, 6)
    setDataColors(colors)
  }

  // Generate pattern from data
  useEffect(() => {
    if (parsedData && fractalParams && dataColors) {
      // Use setTimeout to allow UI to update before heavy computation
      setIsGenerating(true)
      
      setTimeout(() => {
        try {
          let rawPattern
          const patternParams = dataToPatternParams(fractalParams)
        
        // Generate based on pattern type
        switch (fractalType) {
          // Fractals
          case 'mandelbrot':
            rawPattern = generateMandelbrot(
              patternSize, patternSize,
              fractalParams.maxIterations,
              fractalParams.zoom,
              fractalParams.offsetX,
              fractalParams.offsetY
            )
            break
          case 'julia':
            rawPattern = generateJulia(
              patternSize, patternSize,
              fractalParams.maxIterations,
              fractalParams.juliaReal,
              fractalParams.juliaImag,
              fractalParams.zoom,
              fractalParams.offsetX,
              fractalParams.offsetY
            )
            break
          case 'sierpinski':
            rawPattern = generateSierpinski(
              patternSize, patternSize,
              Math.floor(fractalParams.maxIterations / 10)
            )
            break
          case 'koch':
            // Limit to 1 iteration max for fast rendering (3-fold symmetry = 3 * 4^1 = 12 segments)
            const kochIterations = 1
            rawPattern = generateKochSnowflake(
              patternSize, patternSize,
              kochIterations
            )
            break
          case 'mandelbrot-wool':
            const woolResult = generateMandelbrotWoolLayers(
              patternSize, patternSize,
              fractalParams.maxIterations,
              fractalParams.zoom,
              fractalParams.offsetX,
              fractalParams.offsetY
            )
            rawPattern = woolResult.pattern
            break
          case 'phi-matrix':
            const phiResult = generatePhiMatrix(
              patternSize, patternSize,
              20, // grid size
              fractalParams.phiRatio || 1.618
            )
            rawPattern = phiResult.pattern
            break
          
          // Geometric Patterns
          case 'gradient':
            rawPattern = generateGradient(patternSize, {
              angle: patternParams.gradientAngle,
              intensity: patternParams.gradientIntensity,
              offset: patternParams.gradientOffset
            })
            break
          case 'spiral':
            rawPattern = generateSpiral(patternSize, {
              frequency: patternParams.spiralFrequency,
              amplitude: patternParams.spiralAmplitude,
              rotation: patternParams.spiralRotation
            })
            break
          case 'stripes':
            rawPattern = generateStripes(patternSize, {
              stripeWidth: patternParams.stripeWidth,
              angle: patternParams.stripeAngle,
              contrast: patternParams.stripeContrast,
              wave: patternParams.stripeWave
            })
            break
          case 'checkerboard':
            rawPattern = generateCheckerboard(patternSize, {
              blockSize: patternParams.checkBlockSize,
              contrast: patternParams.checkContrast,
              depth: patternParams.checkDepth
            })
            break
          case 'noise':
            rawPattern = generateNoise(patternSize, {
              scale: patternParams.noiseScale,
              octaves: patternParams.noiseOctaves,
              persistence: patternParams.noisePersistence,
              seed: patternParams.noiseSeed
            })
            break
          case 'circular':
            rawPattern = generateCircularGradient(patternSize, {
              frequency: patternParams.circularFrequency,
              centerX: patternParams.circularCenterX,
              centerY: patternParams.circularCenterY
            })
            break
          case 'zigzag':
            rawPattern = generateZigzag(patternSize, {
              xFrequency: patternParams.zigzagXFreq,
              yFrequency: patternParams.zigzagYFreq,
              amplitude: patternParams.zigzagAmplitude
            })
            break
          case 'diamond':
            rawPattern = generateDiamond(patternSize, {
              scale: patternParams.diamondScale,
              centerX: patternParams.diamondCenterX,
              centerY: patternParams.diamondCenterY
            })
            break
          
          // Wallpaper Groups
          default:
            if (wallpaperGroups.find(g => g.id === fractalType)) {
              rawPattern = generateWallpaperPattern(patternSize, patternSize, fractalType, {
                cellSize: patternParams.cellSize || 20,
                offsetX: patternParams.offsetX || 0,
                offsetY: patternParams.offsetY || 0,
                centerX: patternSize / 2,
                centerY: patternSize / 2,
                glideOffset: patternParams.glideOffset || 10
              })
            } else {
              rawPattern = generateMandelbrot(patternSize, patternSize, 100, 1, 0, 0)
            }
        }
        
        // Convert pattern to colors using data-generated colors
        const colorPattern = ['mandelbrot', 'julia', 'sierpinski', 'koch', 'mandelbrot-wool', 'phi-matrix'].includes(fractalType)
          ? fractalToColors(rawPattern, dataColors, false)
          : patternToColors(rawPattern, dataColors)
        
        setPattern(colorPattern)
        
        // Pass pattern to parent
        if (onPatternGenerated) {
          onPatternGenerated(colorPattern)
        }
        
        setIsGenerating(false)
      } catch (error) {
        console.error('Error generating pattern:', error)
        setIsGenerating(false)
      }
      }, 100) // Small delay to let UI update
    }
  }, [parsedData, dataColors, patternSize, fractalType, fractalParams])

  // Export pattern as SVG felting guide
  const exportPattern = () => {
    if (!pattern || !dataColors) return
    
    let svgContent = ''
    const filename = `felted-${fractalType}-${Date.now()}.svg`
    
    switch (fractalType) {
      case 'koch':
        const kochData = generateKochSnowflake(patternSize, patternSize, 3, 3, true)
        svgContent = exportKochSnowflakeSVG(kochData.segments, kochData.centerX, kochData.centerY, kochData.size, kochData.symmetry, dataColors)
        break
      case 'mandelbrot-wool':
        const woolData = generateMandelbrotWoolLayers(patternSize, patternSize, fractalParams.maxIterations, fractalParams.zoom, fractalParams.offsetX, fractalParams.offsetY)
        svgContent = exportMandelbrotWoolSVG(woolData.woolLayers, patternSize, patternSize, dataColors)
        break
      case 'phi-matrix':
        const phiData = generatePhiMatrix(patternSize, patternSize, 20, fractalParams.phiRatio || 1.618)
        svgContent = exportPhiMatrixSVG(phiData.phiGrid, patternSize, patternSize, dataColors)
        break
      default:
        // Generic SVG export for other patterns
        svgContent = exportGenericPatternSVG(pattern, dataColors, fractalType)
    }
    
    downloadSVG(svgContent, filename)
  }

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
    
    // Generate colors from data (more colors for better fractal visualization)
    const colors = generateDataColors(sampleData, 6)
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
      {/* Data Input Section */}
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h2 className="font-serif text-2xl font-bold text-gray-800 mb-6">Add Your Data</h2>
        
        {/* Input Mode Tabs */}
        <div className="flex gap-2 mb-6 bg-gray-100 rounded-2xl p-1">
          <button
            onClick={() => setInputMode('upload')}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              inputMode === 'upload'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Upload className="w-5 h-5" />
            Upload File
          </button>
          <button
            onClick={() => setInputMode('manual')}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              inputMode === 'manual'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Keyboard className="w-5 h-5" />
            Manual Entry
          </button>
        </div>
        
        {/* File Upload or Manual Entry */}
        {inputMode === 'upload' ? (
          <FileUpload 
            onFileUpload={handleFileUpload}
            acceptedTypes=".csv,.json,.txt"
          />
        ) : (
          <ManualDataEntry 
            onDataSubmit={handleManualDataSubmit}
          />
        )}
        
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

      {/* Pattern Preview and Type Selection */}
      {(parsedData || pattern) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Pattern Preview and Settings */}
          <div className="lg:order-1 space-y-6">
            {/* Pattern Preview */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-bold text-gray-800">
                  Generated Pattern
                </h2>
                {pattern && (
                  <button
                    onClick={exportPattern}
                    className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <Download size={16} />
                    Export Felting Guide
                  </button>
                )}
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-blue-50 rounded-2xl p-8 min-h-96 flex items-center justify-center">
                {isGenerating ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Generating {patternTypes.find(t => t.id === fractalType)?.name}...</p>
                    {fractalType === 'koch' && (
                      <p className="text-sm text-gray-500 mt-2">Optimizing rendering for best performance...</p>
                    )}
                  </div>
                ) : pattern ? (
                  <div className="text-center">
                    <div 
                      className="mb-6 inline-block border border-gray-200 overflow-auto max-w-full shadow-lg"
                      style={{ 
                        display: 'grid', 
                        gridTemplateColumns: `repeat(${pattern[0]?.length || 1}, 12px)`,
                        gridTemplateRows: `repeat(${pattern.length}, 12px)`,
                        gap: 0,
                        lineHeight: 0
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
                            padding: 0,
                            display: 'block'
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 font-medium">
                      {patternTypes.find(t => t.id === fractalType)?.name} ({pattern.length}×{pattern[0]?.length || 0})
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

            {/* Pattern Size Settings - Right under pattern */}
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
                  min="30"
                  max="60"
                  value={patternSize}
                  onChange={(e) => setPatternSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Larger sizes show more fractal detail (recommended: 40-50)
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Pattern Type Selection - Scrollable */}
          <div className="bg-white rounded-3xl shadow-lg p-8 lg:order-2 lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
            <h3 className="font-serif text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 sticky top-0 bg-white pb-4 z-10">
              <Sparkles className="w-6 h-6" />
              Pattern Type
            </h3>
            
            {/* Geometric Patterns Section - Moved to top */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">📐 Geometric Patterns (8 types)</h4>
              <div className="grid grid-cols-2 gap-3">
                {patternTypes.filter(t => t.category === 'geometric').map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setFractalType(type.id)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      fractalType === type.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="font-medium text-xs">{type.name}</div>
                    <div className="text-xs opacity-75 mt-0.5">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Fractals Section - Moved below geometric */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">🌀 Fractal Patterns (6 types)</h4>
              <div className="grid grid-cols-2 gap-3">
                {patternTypes.filter(t => t.category === 'fractal').map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setFractalType(type.id)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      fractalType === type.id
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="font-medium text-xs">{type.name}</div>
                    <div className="text-xs opacity-75 mt-0.5">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Wallpaper Groups Section */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">🌐 Wallpaper Groups (17 types)</h4>
              <div className="grid grid-cols-2 gap-2">
                {patternTypes.filter(t => t.category === 'wallpaper').map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setFractalType(type.id)}
                    className={`p-2 rounded-lg border-2 transition-all ${
                      fractalType === type.id
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <div className="text-lg mb-1">{type.icon}</div>
                    <div className="font-medium text-xs">{type.name}</div>
                    <div className="text-xs opacity-75 mt-0.5">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              ✨ All patterns are controlled by your data values. Different data = unique patterns!<br/>
              📊 Total: 8 Geometric + 6 Fractals + 17 Wallpaper Groups = 31 pattern types
            </p>
          </div>
        </div>
      )}

      {/* Fallback Pattern Preview when no data */}
      {!parsedData && !pattern && (
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-bold text-gray-800">
              Data-Driven Fractal Pattern
            </h2>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-blue-50 rounded-2xl p-8 min-h-96 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Upload data or generate sample to see your fractal pattern</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

