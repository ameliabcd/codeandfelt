'use client'
import { useState } from 'react'
import Head from 'next/head'
import { Upload, Download, Code } from 'lucide-react'

export default function Generator() {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [selectedColors, setSelectedColors] = useState(['#FCE4EC', '#E3F2FD', '#FFE0B2'])

  const colorOptions = ['#FCE4EC', '#E3F2FD', '#FFE0B2', '#FFF9F5', '#F3E5F5', '#E8F5E8']

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

  return (
    <>
      <Head>
        <title>Pattern Generator - Code & Felt</title>
        <meta name="description" content="Transform your data into beautiful felting patterns" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-serif text-5xl font-bold text-gray-800 mb-4">Pattern Generator</h1>
            <p className="text-xl text-gray-600">Transform your data into beautiful felting patterns</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* File Upload */}
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h2 className="font-serif text-2xl font-bold text-gray-800 mb-6">Upload Your Data</h2>
                <div 
                  className="border-2 border-dashed border-pink-200 rounded-2xl p-12 text-center hover:border-pink-300 transition-colors cursor-pointer"
                  onClick={() => setUploadedFile('sample-data.csv')}
                >
                  <Upload className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-600 mb-2">Drag & Drop or Upload Your Data File</p>
                  <p className="text-sm text-gray-500">Supports CSV, JSON, Excel files</p>
                  {uploadedFile && (
                    <div className="mt-4 text-sm text-pink-600">
                      ✓ {uploadedFile} uploaded successfully
                    </div>
                  )}
                </div>
                
                <div className="flex gap-4 mt-6">
                  <button 
                    onClick={() => setUploadedFile('sample-data.csv')}
                    className="btn-primary flex-1"
                  >
                    Generate Random Pattern
                  </button>
                  <button 
                    onClick={() => setUploadedFile(null)}
                    className="px-6 py-3 bg-gray-100 text-gray-600 rounded-2xl font-medium hover:bg-gray-200 transition-all duration-200"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Pattern Preview */}
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h2 className="font-serif text-2xl font-bold text-gray-800 mb-6">Pattern Preview</h2>
                <div className="bg-gradient-to-br from-pink-50 to-blue-50 rounded-2xl p-8 min-h-96 flex items-center justify-center">
                  {uploadedFile ? (
                    <div className="text-center">
                      <div className="grid grid-cols-10 gap-1 mb-6">
                        {Array.from({ length: 100 }, (_, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-sm"
                            style={{
                              backgroundColor: selectedColors[i % selectedColors.length],
                              opacity: 0.8 + (Math.random() * 0.2)
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600">Dynamic pattern based on your data</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Upload data to see your pattern</p>
                    </div>
                  )}
                </div>
                
                {uploadedFile && (
                  <div className="mt-6">
                    <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-2xl font-medium hover:from-blue-500 hover:to-blue-600 transition-all duration-200 flex items-center justify-center gap-2">
                      <Download className="w-5 h-5" />
                      Download Pattern
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Color Palette */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h2 className="font-serif text-2xl font-bold text-gray-800 mb-6">Color Palette</h2>
              <div className="space-y-4">
                {colorOptions.map((color, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleColorToggle(color)}
                    className={`w-full h-12 rounded-xl cursor-pointer border-4 transition-all ${
                      selectedColors.includes(color) ? 'border-gray-800 scale-105' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium text-gray-700 mb-3">Selected Colors:</h3>
                <div className="flex gap-2">
                  {selectedColors.map((color, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}