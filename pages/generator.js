'use client'
import { useState } from 'react'
import Head from 'next/head'
import { Upload, Download, Code, Palette } from 'lucide-react'
import FractalPatternGenerator from '../components/Generator/FractalPatternGenerator'
import DataPatternGenerator from '../components/Generator/DataPatternGenerator'
import { colorPalettes } from '../lib/data'

export default function Generator() {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [selectedColors, setSelectedColors] = useState(['#FCE4EC', '#E3F2FD', '#FFE0B2'])
  const [currentPattern, setCurrentPattern] = useState(null)
  const [patternMode, setPatternMode] = useState('data') // 'data' or 'fractal'

  const colorOptions = [
    // Light pastels (original)
    '#FCE4EC', '#E3F2FD', '#FFE0B2', '#FFF9F5', '#F3E5F5', '#E8F5E8',
    // Deep jewel tones
    '#1A237E', '#4A148C', '#B71C1C', '#1B5E20', '#E65100', '#3E2723',
    // Rich colors
    '#2E7D32', '#C62828', '#6A1B9A', '#F57C00', '#5D4037', '#455A64',
    // Deep ocean & forest
    '#0D47A1', '#004D40', '#1565C0', '#00695C', '#2E7D32', '#558B2F',
    // Warm deep tones
    '#D84315', '#F4511E', '#FF8F00', '#FFA000', '#AFB42B', '#689F38',
    // Cool deep tones
    '#283593', '#303F9F', '#3949AB', '#3F51B5', '#5C6BC0', '#7986CB'
  ]

  const handleColorToggle = (color) => {
    const newColors = [...selectedColors]
    if (newColors.includes(color)) {
      const index = newColors.indexOf(color)
      newColors.splice(index, 1)
    } else if (newColors.length < 4) {
      newColors.push(color)
    }
    setSelectedColors(newColors)
  }

  const applyPalette = (paletteName) => {
    setSelectedColors([...colorPalettes[paletteName]])
  }

  return (
    <>
      <Head>
        <title>Pattern Generator - Math & Felt</title>
        <meta name="description" content="Transform your data into beautiful felting patterns" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-serif text-5xl font-bold text-gray-800 mb-4">Pattern Generator</h1>
            <p className="text-xl text-gray-600 mb-6">Transform your data into beautiful felting patterns</p>
            
            {/* Pattern Mode Toggle */}
            <div className="flex justify-center">
              <div className="bg-white rounded-2xl p-2 shadow-lg">
                <div className="flex">
                  <button
                    onClick={() => setPatternMode('data')}
                    className={`px-4 py-3 rounded-xl font-medium transition-all ${
                      patternMode === 'data'
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Code className="w-4 h-4 inline mr-2" />
                    Data Patterns
                  </button>
                  <button
                    onClick={() => setPatternMode('fractal')}
                    className={`px-4 py-3 rounded-xl font-medium transition-all ${
                      patternMode === 'fractal'
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Palette className="w-4 h-4 inline mr-2" />
                    Fractal Grid
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={`grid grid-cols-1 gap-8 ${patternMode === 'data' ? '' : 'lg:grid-cols-3'}`}>
            {/* Main Content Area */}
            <div className={`space-y-6 ${patternMode === 'data' ? '' : 'lg:col-span-2'}`}>
              {patternMode === 'data' ? (
                <>
                  {/* Data Pattern Generator */}
                  <DataPatternGenerator 
                    selectedColors={selectedColors}
                    onPatternGenerated={setCurrentPattern}
                  />
                </>
              ) : patternMode === 'fractal' ? (
                <>
                  {/* Fractal Pattern Generator */}
                  <FractalPatternGenerator 
                    selectedColors={selectedColors}
                    onPatternGenerated={setCurrentPattern}
                  />
                  
                  {/* Fractal Pattern Download */}
                  {currentPattern && (
                    <div className="bg-white rounded-3xl shadow-lg p-8">
                      <h2 className="font-serif text-2xl font-bold text-gray-800 mb-6">Download Pattern</h2>
                      <div className="space-y-4">
                        <p className="text-gray-600">Your fractal pattern is ready! Download it as a PDF or image file.</p>
                        <div className="flex gap-4">
                          <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-2xl font-medium hover:from-blue-500 hover:to-blue-600 transition-all duration-200 flex items-center justify-center gap-2">
                            <Download className="w-5 h-5" />
                            Download PDF
                          </button>
                          <button className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-2xl font-medium hover:from-pink-500 hover:to-pink-600 transition-all duration-200 flex items-center justify-center gap-2">
                            <Download className="w-5 h-5" />
                            Download PNG
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>

            {/* Color Palette - Hidden for Data Pattern mode */}
            {patternMode !== 'data' && (
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h2 className="font-serif text-2xl font-bold text-gray-800 mb-6">Color Palette</h2>
              
              {/* Preset Palettes */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Preset Palettes:</h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {Object.entries(colorPalettes).slice(0, 8).map(([name, colors]) => (
                    <button
                      key={name}
                      onClick={() => applyPalette(name)}
                      className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-all text-sm"
                    >
                      <div className="flex gap-1">
                        {colors.map((color, idx) => (
                          <div
                            key={idx}
                            className="w-3 h-3 rounded-full border border-white"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="capitalize text-gray-600">{name.replace('_', ' ')}</span>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(colorPalettes).slice(8).map(([name, colors]) => (
                    <button
                      key={name}
                      onClick={() => applyPalette(name)}
                      className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-all text-sm"
                    >
                      <div className="flex gap-1">
                        {colors.map((color, idx) => (
                          <div
                            key={idx}
                            className="w-3 h-3 rounded-full border border-white"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="capitalize text-gray-600">{name.replace('_', ' ')}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Individual Colors */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Individual Colors:</h3>
                <div className="grid grid-cols-6 gap-2">
                  {colorOptions.map((color, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleColorToggle(color)}
                      className={`aspect-square rounded-lg cursor-pointer border-2 transition-all ${
                        selectedColors.includes(color) ? 'border-gray-800 scale-110' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              
              {/* Selected Colors */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Selected Colors ({selectedColors.length}/4):</h3>
                <div className="flex gap-2 flex-wrap">
                  {selectedColors.map((color, idx) => (
                    <div
                      key={idx}
                      className="relative group"
                    >
                      <div
                        className="w-10 h-10 rounded-lg border-2 border-white shadow-md cursor-pointer"
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorToggle(color)}
                        title={`Remove ${color}`}
                      />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        ×
                      </div>
                    </div>
                  ))}
                  {selectedColors.length === 0 && (
                    <p className="text-gray-500 text-sm italic">Click colors above to select up to 4 colors</p>
                  )}
                </div>
              </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}