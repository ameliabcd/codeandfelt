'use client'
import { useState } from 'react'
import { Keyboard, Plus, Trash2, Download, Shuffle, Info, ChevronDown, ChevronUp } from 'lucide-react'

// Creative prompts for data entry
const dataPrompts = [
  {
    question: "What's your birthday? (month, day, year)",
    example: "3, 15, 2000",
    format: 'single',
    description: "Transform your special date into a unique pattern!"
  },
  {
    question: "What's your exercise data? (steps, miles, calories)",
    example: "8523, 4.2, 312",
    format: 'rows',
    description: "Turn your fitness journey into art!"
  },
  {
    question: "What are your favorite numbers?",
    example: "7\n42\n13\n21\n99",
    format: 'single',
    description: "Your lucky numbers become a pattern!"
  },
  {
    question: "What's your daily routine? (hours of sleep, work, exercise)",
    example: "Sleep, Work, Exercise\n8, 8, 1\n7.5, 9, 0.5\n8, 7, 1.5",
    format: 'table',
    description: "Visualize your daily life patterns!"
  },
  {
    question: "What's your mood this week? (rate 1-10)",
    example: "7\n8\n6\n9\n7\n8\n7",
    format: 'single',
    description: "Capture your emotional journey!"
  },
  {
    question: "What's your spending data? (food, entertainment, savings)",
    example: "Food, Entertainment, Savings\n150, 75, 200\n180, 50, 220\n120, 100, 250",
    format: 'table',
    description: "Turn your budget into beautiful patterns!"
  },
  {
    question: "What's your screen time? (hours per day)",
    example: "6.5\n7.2\n5.8\n8.1\n6.3\n7.5\n6.9",
    format: 'single',
    description: "Your digital life as art!"
  },
  {
    question: "What's your reading data? (pages, minutes, books)",
    example: "25, 30, 0.5\n50, 60, 1\n30, 45, 0.75",
    format: 'rows',
    description: "Pages turn into patterns!"
  },
  {
    question: "What's your coffee consumption? (cups per day)",
    example: "2\n3\n2\n4\n1\n2\n3",
    format: 'single',
    description: "Your caffeine story visualized!"
  },
  {
    question: "What's your travel data? (miles, hours, cost)",
    example: "Miles, Hours, Cost\n250, 4, 45\n180, 3, 35\n320, 5, 60",
    format: 'table',
    description: "Journey distances become designs!"
  },
  {
    question: "What's your study time? (hours per subject)",
    example: "Math, Science, English\n3, 2, 1.5\n2.5, 3, 2\n4, 1, 2.5",
    format: 'table',
    description: "Your learning journey as art!"
  },
  {
    question: "What's your heart rate? (resting, active, peak)",
    example: "65, 120, 165\n68, 125, 170\n66, 118, 160",
    format: 'rows',
    description: "Your heartbeat becomes a pattern!"
  }
]

export default function ManualDataEntry({ onDataSubmit }) {
  const [manualData, setManualData] = useState([{ value: '' }])
  const [format, setFormat] = useState('single') // 'single', 'rows', 'table'
  const [delimiter, setDelimiter] = useState(',')
  const [currentPrompt, setCurrentPrompt] = useState(dataPrompts[0])
  const [showDataFlow, setShowDataFlow] = useState(false)

  const handleAddRow = () => {
    setManualData([...manualData, { value: '' }])
  }

  const handleRemoveRow = (index) => {
    if (manualData.length > 1) {
      const newData = manualData.filter((_, i) => i !== index)
      setManualData(newData)
    }
  }

  const handleValueChange = (index, value) => {
    const newData = [...manualData]
    newData[index].value = value
    setManualData(newData)
  }

  const handleSubmit = () => {
    // Parse manual data based on format
    let parsedData = { data: [], headers: [] }
    
    if (format === 'single') {
      // Single column - each row is a value
      const numericValues = manualData
        .map(item => {
          const val = parseFloat(item.value)
          return isNaN(val) ? null : val
        })
        .filter(val => val !== null)
      
      parsedData.data = numericValues.map(val => [val])
      parsedData.headers = ['value']
    } else if (format === 'rows') {
      // Multiple values per row separated by delimiter
      parsedData.data = manualData
        .map(item => {
          const values = item.value.split(delimiter)
            .map(v => parseFloat(v.trim()))
            .filter(v => !isNaN(v))
          return values.length > 0 ? values : null
        })
        .filter(row => row !== null)
      
      if (parsedData.data.length > 0) {
        const maxCols = Math.max(...parsedData.data.map(row => row.length))
        parsedData.headers = Array.from({ length: maxCols }, (_, i) => `column_${i + 1}`)
      }
    } else if (format === 'table') {
      // First row is headers, rest are data
      if (manualData.length > 1) {
        const headerRow = manualData[0].value.split(delimiter).map(h => h.trim())
        parsedData.headers = headerRow
        
        parsedData.data = manualData.slice(1)
          .map(item => {
            const values = item.value.split(delimiter)
              .map(v => parseFloat(v.trim()))
              .filter(v => !isNaN(v))
            return values.length > 0 ? values : null
          })
          .filter(row => row !== null)
      }
    }
    
    if (parsedData.data.length > 0 && onDataSubmit) {
      onDataSubmit(parsedData)
    }
  }

  const handleClear = () => {
    setManualData([{ value: '' }])
  }

  const handleLoadExample = () => {
    // Load example temperature data
    const exampleData = [
      '22.5', '24.3', '26.1', '25.8', '27.2',
      '28.5', '30.1', '29.8', '27.5', '25.2'
    ]
    setManualData(exampleData.map(val => ({ value: val })))
    setFormat('single')
  }

  const handleShufflePrompt = () => {
    // Get a random prompt different from current
    let newPrompt
    do {
      newPrompt = dataPrompts[Math.floor(Math.random() * dataPrompts.length)]
    } while (newPrompt === currentPrompt && dataPrompts.length > 1)
    
    setCurrentPrompt(newPrompt)
    setFormat(newPrompt.format)
    
    // Parse example data based on format
    const exampleValues = newPrompt.example.split('\n')
    setManualData(exampleValues.map(val => ({ value: val.trim() })))
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Keyboard className="w-6 h-6 text-blue-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Manual Data Entry</h2>
      </div>

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
                Your values flow through a transformation pipeline: <strong>Raw Numbers → Normalized (0-1) → Column Averages → Pattern Parameters → Visual Pattern</strong>
              </p>
            </div>

            {/* Step 1 */}
            <div className="border-l-4 border-blue-400 pl-4">
              <h4 className="font-semibold text-gray-800 mb-2">Step 1: Data Normalization</h4>
              <p className="text-gray-600 mb-2">
                All your numbers are normalized to a 0-1 range. For example:
              </p>
              <code className="block bg-gray-50 p-2 rounded text-xs mb-2">
                [10, 20, 30, 40] → [0.0, 0.33, 0.67, 1.0]
              </code>
              <p className="text-gray-600 text-xs">
                This ensures different scales (like 10°C vs 100°F) work the same way.
              </p>
            </div>

            {/* Step 2 */}
            <div className="border-l-4 border-green-400 pl-4">
              <h4 className="font-semibold text-gray-800 mb-2">Step 2: Column Averages</h4>
              <p className="text-gray-600 mb-2">
                For each column, we calculate the average of all normalized values:
              </p>
              <code className="block bg-gray-50 p-2 rounded text-xs mb-2">
                Column 1: [0.2, 0.4, 0.6] → Average = 0.4<br/>
                Column 2: [0.1, 0.3, 0.5] → Average = 0.3
              </code>
            </div>

            {/* Step 3 - Fractal Parameters */}
            <div className="border-l-4 border-purple-400 pl-4">
              <h4 className="font-semibold text-gray-800 mb-2">Step 3: Mapping to Pattern Parameters</h4>
              <p className="text-gray-600 mb-3">
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

            {/* Step 3 - Geometric */}
            <div className="border-l-4 border-orange-400 pl-4">
              <p className="text-gray-600 mb-3">
                <strong>For Geometric Patterns:</strong>
              </p>
              <div className="space-y-2 text-xs">
                <div className="bg-orange-50 p-2 rounded">
                  <strong>Column 1</strong> → Angle, frequency, or size<br/>
                  <span className="text-gray-600">Controls pattern direction and scale</span>
                </div>
                <div className="bg-orange-50 p-2 rounded">
                  <strong>Column 2</strong> → Intensity, amplitude, or contrast<br/>
                  <span className="text-gray-600">Controls pattern strength</span>
                </div>
                <div className="bg-orange-50 p-2 rounded">
                  <strong>Column 3</strong> → Offset or position<br/>
                  <span className="text-gray-600">Shifts pattern position</span>
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
              <h4 className="font-semibold text-gray-800 mb-3">💡 Examples</h4>
              
              <div className="mb-3">
                <p className="font-medium text-gray-700 mb-1">Example 1: Birthday Data</p>
                <code className="block bg-white p-2 rounded text-xs mb-2">
                  Input: 3, 15, 2000 (month, day, year)
                </code>
                <p className="text-xs text-gray-600">
                  → Normalized → Column Average: 0.335<br/>
                  → Zoom: 1.34x, Colors: Green-tinted<br/>
                  → Result: A specific zoomed view of the Mandelbrot set
                </p>
              </div>

              <div>
                <p className="font-medium text-gray-700 mb-1">Example 2: Exercise Data</p>
                <code className="block bg-white p-2 rounded text-xs mb-2">
                  Input: 8523, 4.2, 312 (steps, miles, calories)
                </code>
                <p className="text-xs text-gray-600">
                  → Three columns → Different averages<br/>
                  → Controls zoom, position, AND colors<br/>
                  → Result: Unique pattern with specific parameters
                </p>
              </div>
            </div>

            {/* Key Insight */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <p className="font-semibold text-gray-800 mb-2">✨ Key Insight</p>
              <p className="text-xs text-gray-700">
                <strong>Different data values = Different column averages = Different pattern parameters = Different visual output</strong>
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Even small changes in your input will change zoom level, position, colors, and complexity!
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Format Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Data Format
        </label>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setFormat('single')}
            className={`p-4 rounded-xl border-2 transition-all ${
              format === 'single'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm font-medium">Single Column</div>
              <div className="text-xs text-gray-500 mt-1">One value per row</div>
            </div>
          </button>
          
          <button
            onClick={() => setFormat('rows')}
            className={`p-4 rounded-xl border-2 transition-all ${
              format === 'rows'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">📋</div>
              <div className="text-sm font-medium">Multiple Values</div>
              <div className="text-xs text-gray-500 mt-1">Separated values</div>
            </div>
          </button>
          
          <button
            onClick={() => setFormat('table')}
            className={`p-4 rounded-xl border-2 transition-all ${
              format === 'table'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">📑</div>
              <div className="text-sm font-medium">Table with Headers</div>
              <div className="text-xs text-gray-500 mt-1">First row headers</div>
            </div>
          </button>
        </div>
      </div>

      {/* Delimiter Selection (for multiple values) */}
      {(format === 'rows' || format === 'table') && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Separator
          </label>
          <div className="flex space-x-2">
            {[',', ';', '|', '\t'].map(sep => (
              <button
                key={sep}
                onClick={() => setDelimiter(sep)}
                className={`px-4 py-2 rounded-lg border-2 font-mono text-lg transition-all ${
                  delimiter === sep
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {sep === '\t' ? 'Tab' : sep}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Prompt Section */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800 mb-1">
              💡 {currentPrompt.question}
            </p>
            <p className="text-xs text-gray-600 italic">
              {currentPrompt.description}
            </p>
          </div>
          <button
            onClick={handleShufflePrompt}
            className="ml-3 p-2 bg-white rounded-lg shadow-sm hover:bg-purple-100 transition-colors"
            title="Get a new prompt"
          >
            <Shuffle className="w-4 h-4 text-purple-600" />
          </button>
        </div>
        <div className="mt-3 p-3 bg-white rounded-lg border border-purple-100">
          <p className="text-xs text-gray-500 mb-1">Example format:</p>
          <code className="text-xs text-gray-700 whitespace-pre-wrap">{currentPrompt.example}</code>
        </div>
      </div>

      {/* Data Entry */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-semibold text-gray-700">
            Enter Your Data
          </label>
          <div className="flex space-x-2">
            <button
              onClick={handleLoadExample}
              className="text-xs px-3 py-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Load Example
            </button>
            <button
              onClick={handleClear}
              className="text-xs px-3 py-1 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {manualData.map((row, index) => (
            <div key={index} className="flex items-center gap-2">
              {format === 'table' && index === 0 && (
                <div className="w-8 text-xs text-gray-500 font-semibold">Header</div>
              )}
              {format !== 'table' && (
                <div className="w-8 text-xs text-gray-500 text-right pr-2">
                  {index + 1}
                </div>
              )}
              <input
                type="text"
                value={row.value}
                onChange={(e) => handleValueChange(index, e.target.value)}
                placeholder={
                  format === 'single'
                    ? 'Enter a number...'
                    : format === 'rows'
                    ? 'Value1, Value2, Value3...'
                    : index === 0
                    ? 'Header1, Header2, Header3...'
                    : 'Value1, Value2, Value3...'
                }
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              />
              <button
                onClick={() => handleRemoveRow(index)}
                className={`p-2 rounded-lg transition-colors ${
                  manualData.length === 1
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-red-500 hover:bg-red-50'
                }`}
                disabled={manualData.length === 1}
                title="Remove row"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        
        <button
          onClick={handleAddRow}
          className="mt-3 flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Another Row
        </button>
      </div>

      {/* Format Help */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl text-sm text-gray-600">
        <strong className="text-gray-800">Format Guide:</strong>
        {format === 'single' && (
          <div className="mt-2">
            Enter one number per row. Example:<br />
            <code className="text-gray-700">22.5</code><br />
            <code className="text-gray-700">24.3</code><br />
            <code className="text-gray-700">26.1</code>
          </div>
        )}
        {format === 'rows' && (
          <div className="mt-2">
            Separate multiple values with commas. Example:<br />
            <code className="text-gray-700">22.5, 75, 1.2</code><br />
            <code className="text-gray-700">24.3, 80, 1.5</code>
          </div>
        )}
        {format === 'table' && (
          <div className="mt-2">
            First row contains headers, rest are data values. Example:<br />
            <code className="text-gray-700">Temp, Humidity, Pressure</code><br />
            <code className="text-gray-700">22.5, 75, 1013</code><br />
            <code className="text-gray-700">24.3, 80, 1015</code>
          </div>
        )}
        <div className="mt-3 pt-3 border-t border-gray-300">
          <p className="text-xs text-gray-600">
            ✨ <strong>Each unique set of data creates a unique pattern!</strong> Your values control:
            fractal zoom, position, colors, and complexity. Try different numbers to see the changes!
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={manualData.every(row => !row.value.trim())}
        className="w-full py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      >
        <Download className="w-5 h-5 mr-2" />
        Generate Pattern from Data
      </button>
    </div>
  )
}

