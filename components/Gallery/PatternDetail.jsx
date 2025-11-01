import { useState, useEffect } from 'react'
import { ChevronLeft, Download, Upload, Heart, Share2 } from 'lucide-react'
import FileUpload from '../Generator/FileUpload'
import { patternGenerators, getPatternColors } from '../../lib/galleryPatterns'
import { parseCSV, parseJSON, parseText } from '../../lib/dataParser'

const PatternDetail = ({ pattern, onBack }) => {
  const [uploadedData, setUploadedData] = useState(null)
  const [parsedData, setParsedData] = useState(null)
  const [generatedPattern, setGeneratedPattern] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [width, setWidth] = useState(60)
  
  const colors = getPatternColors(pattern.id)
  
  useEffect(() => {
    if (uploadedData) {
      setIsGenerating(true)
      setTimeout(() => {
        const file = uploadedData.file
        const content = uploadedData.content
        const ext = file.name.split('.').pop().toLowerCase()
        
        let parsed = null
        if (ext === 'csv') {
          parsed = parseCSV(content)
        } else if (ext === 'json') {
          parsed = parseJSON(content)
        } else if (ext === 'txt') {
          parsed = parseText(content)
        }
        
        setParsedData(parsed)
        setIsGenerating(false)
      }, 300)
    }
  }, [uploadedData])
  
  useEffect(() => {
    if (parsedData && pattern.id) {
      setIsGenerating(true)
      setTimeout(() => {
        const generator = patternGenerators[pattern.id]
        if (generator) {
          const pattern = generator(parsedData.data, width)
          setGeneratedPattern(pattern)
        } else {
          setGeneratedPattern(null)
        }
        setIsGenerating(false)
      }, 500)
    } else if (!uploadedData && pattern.id) {
      // Show sample pattern
      const generator = patternGenerators[pattern.id]
      if (generator) {
        const samplePattern = generator([], width)
        setGeneratedPattern(samplePattern)
      }
    }
  }, [parsedData, pattern.id, width, uploadedData])
  
  const handleFileUpload = (file, content) => {
    if (file && content) {
      setUploadedData({ file, content })
    } else {
      setUploadedData(null)
      setParsedData(null)
    }
  }
  
  const renderSpecialVisualization = () => {
    if (pattern.id === 3) {
      // Heart Rate - EKG visualization
      return (
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="text-4xl mr-4">{pattern.image}</span>
            Live EKG Waveform
          </h3>
          <div className="bg-black rounded-xl p-6">
            <svg width="100%" height="150" viewBox="0 0 600 150" className="overflow-visible">
              <defs>
                <linearGradient id="ekgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF6B6B" />
                  <stop offset="100%" stopColor="#FF8E8E" />
                </linearGradient>
              </defs>
              <path
                d="M0,75 L50,75 L55,30 L75,120 L80,75 L130,75 L135,60 L155,90 L160,75 L210,75 L215,30 L235,120 L240,75 L290,75 L295,60 L315,90 L320,75 L370,75 L375,30 L395,120 L400,75 L450,75 L455,60 L475,90 L480,75 L530,75 L535,30 L555,120 L560,75 L600,75"
                stroke="url(#ekgGradient)"
                strokeWidth="3"
                fill="none"
              />
            </svg>
            <div className="flex items-center justify-between mt-4 text-green-400">
              <span className="text-sm">Heart Rate: 72 BPM</span>
              <span className="text-xs">●</span>
            </div>
          </div>
        </div>
      )
    }
    
    if (pattern.id === 2) {
      // Stock Market - Candle chart visualization
      return (
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="text-4xl mr-4">{pattern.image}</span>
            Live Price Chart
          </h3>
          <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl p-6 border-2 border-gray-200">
            <svg width="100%" height="200" viewBox="0 0 600 200" className="overflow-visible">
              {/* Grid lines */}
              {[0, 50, 100, 150].map(y => (
                <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#E5E7EB" strokeWidth="1" />
              ))}
              
              {/* Candlesticks */}
              {[50, 100, 150, 200, 250, 300, 350, 400, 450, 500].map((x, i) => {
                const open = 80 + Math.random() * 40
                const close = 80 + Math.random() * 40
                const high = Math.max(open, close) + Math.random() * 20
                const low = Math.min(open, close) - Math.random() * 20
                const isGreen = close > open
                
                return (
                  <g key={i}>
                    <line x1={x} y1={low} x2={x} y2={high} stroke={isGreen ? '#10B981' : '#EF4444'} strokeWidth="2" />
                    <rect x={x-10} y={Math.min(open, close)} width="20" height={Math.abs(close-open) || 4} fill={isGreen ? '#10B981' : '#EF4444'} />
                  </g>
                )
              })}
            </svg>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm font-semibold text-gray-700">Latest: $142.50</span>
              <span className="text-sm font-semibold text-green-600">+2.4%</span>
            </div>
          </div>
        </div>
      )
    }
    
    if (pattern.id === 1) {
      // Temperature - Weather forecast visualization
      return (
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="text-4xl mr-4">{pattern.image}</span>
            Temperature Forecast
          </h3>
          <div className="grid grid-cols-7 gap-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
              const temp = 20 + 10 * Math.sin(i * 0.8)
              return (
                <div key={day} className="text-center">
                  <div className="text-sm text-gray-600 mb-2">{day}</div>
                  <div className="text-3xl mb-2">🌤️</div>
                  <div className="text-lg font-bold text-gray-800">{Math.round(temp)}°</div>
                  <div className="text-xs text-gray-500">{Math.round(temp-5)}°</div>
                </div>
              )
            })}
          </div>
        </div>
      )
    }
    
    return null
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-pink-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Back to Gallery
        </button>
        
        {/* Pattern Title */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <span className="text-6xl mr-6">{pattern.image}</span>
              <div>
                <h1 className="font-serif text-4xl font-bold text-gray-800 mb-2">{pattern.title}</h1>
                <p className="text-xl text-gray-600">{pattern.description}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="p-3 rounded-xl bg-pink-100 hover:bg-pink-200 transition-colors">
                <Heart className="w-5 h-5 text-pink-600" />
              </button>
              <button className="p-3 rounded-xl bg-blue-100 hover:bg-blue-200 transition-colors">
                <Share2 className="w-5 h-5 text-blue-600" />
              </button>
            </div>
          </div>
          
          {/* Color Palette */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-gray-700 mr-2">Colors:</span>
            {colors.map((color, idx) => (
              <div
                key={idx}
                className="w-8 h-8 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
        
        {/* Special Visualization */}
        {renderSpecialVisualization()}
        
        {/* File Upload Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Your Data</h2>
          <p className="text-gray-600 mb-6">
            Upload a CSV, JSON, or TXT file to generate a personalized {pattern.title.toLowerCase()} pattern
          </p>
          <FileUpload onFileUpload={handleFileUpload} />
        </div>
        
        {/* Pattern Size Control */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Pattern Width</h2>
            <span className="text-xl font-semibold text-gray-700">{width}</span>
          </div>
          <input
            type="range"
            min="30"
            max="100"
            value={width}
            onChange={(e) => setWidth(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
        
        {/* Generated Pattern */}
        {generatedPattern && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Your Pattern Preview</h2>
              <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
            </div>
            
            {isGenerating ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="overflow-auto max-w-full">
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${generatedPattern[0]?.length || 1}, 12px)`,
                      gridTemplateRows: `repeat(${generatedPattern.length}, 12px)`,
                      gap: 0,
                      lineHeight: 0
                    }}
                  >
                    {generatedPattern.map((row, y) =>
                      row.map((value, x) => {
                        const colorIdx = Math.floor(value * (colors.length - 1))
                        const color = colors[colorIdx] || colors[0]
                        return (
                          <div
                            key={`${x}-${y}`}
                            style={{
                              backgroundColor: color,
                              width: '12px',
                              height: '12px',
                              margin: 0,
                              padding: 0,
                              display: 'block'
                            }}
                          />
                        )
                      })
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PatternDetail
