'use client'
import { useState } from 'react'
import { Keyboard, Plus, Trash2, Download } from 'lucide-react'

export default function ManualDataEntry({ onDataSubmit }) {
  const [manualData, setManualData] = useState([{ value: '' }])
  const [format, setFormat] = useState('single') // 'single', 'rows', 'table'
  const [delimiter, setDelimiter] = useState(',')

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

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Keyboard className="w-6 h-6 text-blue-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Manual Data Entry</h2>
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

