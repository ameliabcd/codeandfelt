// Data parsing utilities for different file formats

// Parse CSV data
export function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n')
  if (lines.length === 0) return { headers: [], data: [] }

  const headers = lines[0].split(',').map(h => h.trim())
  const data = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    const row = {}
    headers.forEach((header, index) => {
      row[header] = values[index]
    })
    data.push(row)
  }

  return { headers, data }
}

// Parse JSON data
export function parseJSON(jsonContent) {
  try {
    const parsed = JSON.parse(jsonContent)
    
    // Handle array of objects
    if (Array.isArray(parsed) && parsed.length > 0) {
      const headers = Object.keys(parsed[0])
      return { headers, data: parsed }
    }
    
    // Handle single object
    if (typeof parsed === 'object' && !Array.isArray(parsed)) {
      const headers = Object.keys(parsed)
      return { headers, data: [parsed] }
    }
    
    return { headers: [], data: [] }
  } catch (error) {
    console.error('JSON parsing error:', error)
    return { headers: [], data: [] }
  }
}

// Parse plain text (line by line)
export function parseText(textContent) {
  const lines = textContent.trim().split('\n').filter(line => line.trim())
  return {
    headers: ['Value'],
    data: lines.map(line => ({ Value: line.trim() }))
  }
}

// Convert data to numeric values for pattern generation
export function extractNumericData(data, headers) {
  const numericData = []
  
  data.forEach(row => {
    const rowValues = []
    headers.forEach(header => {
      const value = row[header]
      
      // Try to convert to number
      const num = parseFloat(value)
      if (!isNaN(num)) {
        rowValues.push(num)
      } else if (typeof value === 'string') {
        // Convert string to numeric hash
        rowValues.push(stringToNumber(value))
      } else {
        rowValues.push(0)
      }
    })
    numericData.push(rowValues)
  })
  
  return numericData
}

// Convert string to a numeric value (0-1)
function stringToNumber(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash % 100) / 100
}

// Normalize data to 0-1 range
export function normalizeData(numericData) {
  if (numericData.length === 0) return []
  
  const flat = numericData.flat()
  const min = Math.min(...flat)
  const max = Math.max(...flat)
  const range = max - min || 1
  
  return numericData.map(row => 
    row.map(value => (value - min) / range)
  )
}

// Generate pattern from data
export function dataToPattern(parsedData, selectedColors, options = {}) {
  const { headers, data } = parsedData
  const { maxRows = 30, maxCols = 30 } = options
  
  // Extract and normalize numeric data
  let numericData = extractNumericData(data, headers)
  numericData = normalizeData(numericData)
  
  // Limit size
  numericData = numericData.slice(0, maxRows)
  numericData = numericData.map(row => row.slice(0, maxCols))
  
  // Convert to color pattern
  const pattern = numericData.map(row =>
    row.map(value => {
      const colorIndex = Math.floor(value * selectedColors.length)
      return selectedColors[Math.min(colorIndex, selectedColors.length - 1)]
    })
  )
  
  return pattern
}

// Generate statistics from data
export function generateDataStats(parsedData) {
  const { headers, data } = parsedData
  const numericData = extractNumericData(data, headers)
  const flat = numericData.flat()
  
  return {
    rows: data.length,
    columns: headers.length,
    totalValues: flat.length,
    min: Math.min(...flat),
    max: Math.max(...flat),
    average: flat.reduce((a, b) => a + b, 0) / flat.length,
    hasHeaders: headers.length > 0
  }
}

