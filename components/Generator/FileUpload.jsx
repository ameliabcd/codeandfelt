'use client'
import { useState, useCallback } from 'react'
import { Upload, FileText, X, CheckCircle, Info, ChevronDown, ChevronUp } from 'lucide-react'

export default function FileUpload({ onFileUpload, acceptedTypes = '.csv,.json,.txt,.xlsx' }) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [error, setError] = useState(null)
  const [showDataFlow, setShowDataFlow] = useState(false)

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    setError(null)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleChange = (e) => {
    e.preventDefault()
    setError(null)
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    // Validate file type
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    const allowedTypes = acceptedTypes.split(',')
    
    if (!allowedTypes.includes(fileExtension)) {
      setError(`Invalid file type. Please upload ${acceptedTypes} files.`)
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum size is 10MB.')
      return
    }

    setUploadedFile(file)
    
    // Read the file
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const content = e.target.result
      if (onFileUpload) {
        onFileUpload(file, content)
      }
    }

    // Read as text for CSV, JSON, TXT
    if (fileExtension === '.json' || fileExtension === '.csv' || fileExtension === '.txt') {
      reader.readAsText(file)
    } else {
      // For binary files like Excel
      reader.readAsArrayBuffer(file)
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    setError(null)
    if (onFileUpload) {
      onFileUpload(null, null)
    }
  }

  return (
    <div className="w-full">
      {/* How Data Determines Patterns - At the top */}
      <div className="mb-6 border-2 border-blue-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowDataFlow(!showDataFlow)}
          className="w-full p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-800">
              How Your Data Values Determine the Pattern
            </span>
          </div>
          {showDataFlow ? (
            <ChevronUp className="w-5 h-5 text-blue-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-blue-600" />
          )}
        </button>
        
        {showDataFlow && (
          <div className="p-6 bg-white space-y-6 text-sm">
            {/* Overview */}
            <div>
              <h3 className="font-bold text-gray-800 mb-2">📊 The Data-to-Pattern Pipeline</h3>
              <p className="text-gray-600 mb-3">
                Your file data flows through a transformation pipeline: <strong>File Content → Parsed Data → Normalized (0-1) → Column Averages → Pattern Parameters → Visual Pattern</strong>
              </p>
            </div>

            {/* File Processing */}
            <div className="border-l-4 border-blue-400 pl-4">
              <h4 className="font-semibold text-gray-800 mb-2">Step 1: File Parsing</h4>
              <p className="text-gray-600 mb-2">
                Your uploaded file (CSV, JSON, TXT) is parsed to extract numeric values:
              </p>
              <div className="space-y-2 text-xs">
                <div className="bg-blue-50 p-2 rounded">
                  <strong>CSV Files:</strong> Each row becomes a data row, columns are separated by commas<br/>
                  <code className="text-gray-700">22.5, 75, 1013</code> → <code className="text-gray-700">[22.5, 75, 1013]</code>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <strong>JSON Files:</strong> Arrays or objects are converted to rows and columns<br/>
                  <code className="text-gray-700">{"{"}"temp": 22.5, "humidity": 75{"}"}</code> → <code className="text-gray-700">[22.5, 75]</code>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <strong>TXT Files:</strong> Numbers are extracted line by line or by delimiter
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="border-l-4 border-green-400 pl-4">
              <h4 className="font-semibold text-gray-800 mb-2">Step 2: Data Normalization</h4>
              <p className="text-gray-600 mb-2">
                All numbers are normalized to a 0-1 range. For example:
              </p>
              <code className="block bg-gray-50 p-2 rounded text-xs mb-2">
                [10, 20, 30, 40] → [0.0, 0.33, 0.67, 1.0]
              </code>
              <p className="text-gray-600 text-xs">
                This ensures different scales (like 10°C vs 100°F) work the same way.
              </p>
            </div>

            {/* Step 3 */}
            <div className="border-l-4 border-purple-400 pl-4">
              <h4 className="font-semibold text-gray-800 mb-2">Step 3: Column Averages & Pattern Parameters</h4>
              <p className="text-gray-600 mb-2">
                For each column, we calculate the average of all normalized values:
              </p>
              <code className="block bg-gray-50 p-2 rounded text-xs mb-2">
                Column 1: [0.2, 0.4, 0.6] → Average = 0.4<br/>
                Column 2: [0.1, 0.3, 0.5] → Average = 0.3
              </code>
              <p className="text-gray-600 mb-3 mt-3">
                <strong>For Fractals (Mandelbrot, Julia, etc.):</strong>
              </p>
              <div className="space-y-2 text-xs">
                <div className="bg-purple-50 p-2 rounded">
                  <strong>Column 1 Average</strong> → <code>zoom</code> (0.5x to 3.0x)<br/>
                  <span className="text-gray-600">Higher values = more zoomed in</span>
                </div>
                <div className="bg-purple-50 p-2 rounded">
                  <strong>Column 2 Average</strong> → <code>offsetX</code> (-1.5 to 1.5)<br/>
                  <span className="text-gray-600">Shifts pattern left/right</span>
                </div>
                <div className="bg-purple-50 p-2 rounded">
                  <strong>Column 3 Average</strong> → <code>offsetY</code> (-1.5 to 1.5)<br/>
                  <span className="text-gray-600">Shifts pattern up/down</span>
                </div>
                <div className="bg-purple-50 p-2 rounded">
                  <strong>Column 4 Average</strong> → <code>maxIterations</code> (100 to 200)<br/>
                  <span className="text-gray-600">More iterations = more detail</span>
                </div>
              </div>
            </div>

            {/* Step 4 - Colors */}
            <div className="border-l-4 border-pink-400 pl-4">
              <h4 className="font-semibold text-gray-800 mb-2">Step 4: Color Generation</h4>
              <p className="text-gray-600 mb-2">
                Colors are generated from your data values:
              </p>
              <div className="space-y-2 text-xs">
                <div className="bg-pink-50 p-2 rounded">
                  <strong>Base Hue</strong> = Column 1 Average × 360°<br/>
                  <span className="text-gray-600">Determines the main color (0°=red, 120°=green, 240°=blue)</span>
                </div>
                <div className="bg-pink-50 p-2 rounded">
                  <strong>Color Spread</strong> = Based on data variability<br/>
                  <span className="text-gray-600">More varied data = more diverse colors</span>
                </div>
                <div className="bg-pink-50 p-2 rounded">
                  <strong>Saturation & Lightness</strong> = From column averages<br/>
                  <span className="text-gray-600">Creates vibrant, contrasting colors</span>
                </div>
              </div>
            </div>

            {/* Examples */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">💡 File Examples</h4>
              
              <div className="mb-3">
                <p className="font-medium text-gray-700 mb-1">Example 1: Temperature CSV</p>
                <code className="block bg-white p-2 rounded text-xs mb-2">
                  temp,humidity<br/>
                  22.5,75<br/>
                  24.3,80<br/>
                  26.1,78
                </code>
                <p className="text-xs text-gray-600">
                  → Two columns → Different averages for each<br/>
                  → Column 1 controls zoom, Column 2 controls position<br/>
                  → Result: Unique pattern based on your temperature data
                </p>
              </div>

              <div>
                <p className="font-medium text-gray-700 mb-1">Example 2: Exercise JSON</p>
                <code className="block bg-white p-2 rounded text-xs mb-2">
                  [{"{"}"steps": 8523, "miles": 4.2{"}"},<br/>
                  {"{"}"steps": 9200, "miles": 4.8{"}"}]
                </code>
                <p className="text-xs text-gray-600">
                  → Multiple rows with multiple columns<br/>
                  → Each column's average controls different pattern aspects<br/>
                  → Result: Pattern that reflects your exercise patterns
                </p>
              </div>
            </div>

            {/* Key Insight */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <p className="font-semibold text-gray-800 mb-2">✨ Key Insight</p>
              <p className="text-xs text-gray-700">
                <strong>Different file data = Different column averages = Different pattern parameters = Different visual output</strong>
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Your file's structure (rows, columns, values) directly determines the generated pattern's appearance!
              </p>
            </div>
          </div>
        )}
      </div>

      {!uploadedFile ? (
        <div
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
            dragActive 
              ? 'border-blue-400 bg-blue-50' 
              : error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-gray-400 bg-white'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput').click()}
        >
          <input
            id="fileInput"
            type="file"
            className="hidden"
            accept={acceptedTypes}
            onChange={handleChange}
          />
          
          <Upload className={`w-12 h-12 mx-auto mb-4 ${error ? 'text-red-400' : 'text-blue-400'}`} />
          
          {error ? (
            <>
              <p className="text-lg text-red-600 mb-2 font-medium">{error}</p>
              <p className="text-sm text-red-500">Please try again with a valid file</p>
            </>
          ) : (
            <>
              <p className="text-lg text-gray-700 mb-2 font-medium">
                {dragActive ? 'Drop your file here' : 'Drag & Drop or Click to Upload'}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supports CSV, JSON, TXT, Excel files (max 10MB)
              </p>
              <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Choose File
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="border-2 border-green-300 bg-green-50 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-800 mb-1">File Uploaded Successfully</h3>
              <p className="text-sm text-gray-600 truncate mb-2">{uploadedFile.name}</p>
              <p className="text-xs text-gray-500">
                Size: {(uploadedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                removeFile()
              }}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-100 rounded-lg transition-colors"
              title="Remove file"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

