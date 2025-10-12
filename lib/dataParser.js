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

// Extract fractal parameters from data
export function dataToFractalParams(parsedData) {
  const { headers, data } = parsedData
  if (!data || data.length === 0) return null
  
  // Extract and normalize numeric data
  let numericData = extractNumericData(data, headers)
  const normalized = normalizeData(numericData)
  
  // Calculate average values for each column
  const columnAverages = []
  const numCols = normalized[0]?.length || 0
  
  for (let col = 0; col < numCols; col++) {
    let sum = 0
    let count = 0
    normalized.forEach(row => {
      if (row[col] !== undefined) {
        sum += row[col]
        count++
      }
    })
    columnAverages.push(count > 0 ? sum / count : 0.5)
  }
  
  // Map averages to fractal parameters
  const params = {
    // Use first column for zoom (0.5 to 3.0)
    zoom: columnAverages[0] ? 0.5 + columnAverages[0] * 2.5 : 1,
    
    // Use second column for X offset (-1.5 to 1.5)
    offsetX: columnAverages[1] ? (columnAverages[1] - 0.5) * 3 : 0,
    
    // Use third column for Y offset (-1.5 to 1.5)
    offsetY: columnAverages[2] ? (columnAverages[2] - 0.5) * 3 : 0,
    
    // Use fourth column for iterations (50 to 150)
    maxIterations: columnAverages[3] ? Math.floor(50 + columnAverages[3] * 100) : 100,
    
    // Julia set parameters from data (constrained to produce visible patterns)
    juliaReal: columnAverages[0] ? -0.8 + columnAverages[0] * 1.6 : -0.7,
    juliaImag: columnAverages[1] ? -0.5 + columnAverages[1] * 1.0 : 0.27015,
    
    // Store all column averages for custom uses
    columnAverages,
    
    // Data variability (standard deviation)
    variability: calculateVariability(normalized)
  }
  
  return params
}

// Calculate data variability
function calculateVariability(normalizedData) {
  const flat = normalizedData.flat()
  const mean = flat.reduce((a, b) => a + b, 0) / flat.length
  const variance = flat.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / flat.length
  return Math.sqrt(variance)
}

// Generate color palette from data
export function generateDataColors(parsedData, numColors = 4) {
  const { headers, data } = parsedData
  if (!data || data.length === 0) return ['#FCE4EC', '#E3F2FD', '#FFE0B2', '#FFF9F5']
  
  // Extract and normalize numeric data
  let numericData = extractNumericData(data, headers)
  const normalized = normalizeData(numericData)
  
  // Calculate column averages
  const columnAverages = []
  const numCols = normalized[0]?.length || 0
  
  for (let col = 0; col < numCols; col++) {
    let sum = 0
    let count = 0
    normalized.forEach(row => {
      if (row[col] !== undefined) {
        sum += row[col]
        count++
      }
    })
    columnAverages.push(count > 0 ? sum / count : 0.5)
  }
  
  // Calculate data variability for color strategy
  const flat = normalized.flat()
  const mean = flat.reduce((a, b) => a + b, 0) / flat.length
  const variance = flat.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / flat.length
  const variability = Math.sqrt(variance)
  
  // Generate colors with guaranteed contrast
  const colors = []
  
  // Use data to seed color generation, but ensure distinct colors
  const baseHue = (columnAverages[0] || 0.5) * 360
  const hueSpread = 60 + variability * 100 // More spread for varied data
  
  for (let i = 0; i < numColors; i++) {
    // Ensure colors are spread across the color wheel
    const hueOffset = (i * 360 / numColors) + (columnAverages[i % columnAverages.length] || 0.5) * hueSpread
    const hue = (baseHue + hueOffset) % 360
    
    // Alternate between lighter and darker, saturated and desaturated
    const saturationBase = i % 2 === 0 ? 70 : 85
    const saturation = saturationBase + (columnAverages[(i + 1) % columnAverages.length] || 0.5) * 15
    
    const lightnessBase = i % 2 === 0 ? 45 : 65
    const lightness = lightnessBase + (columnAverages[(i + 2) % columnAverages.length] || 0.5) * 15
    
    colors.push(hslToHex(Math.floor(hue), saturation, lightness))
  }
  
  // Ensure colors are distinct - check contrast
  const distinctColors = ensureDistinctColors(colors, columnAverages)
  
  return distinctColors
}

// Ensure colors have enough contrast between them
function ensureDistinctColors(colors, columnAverages) {
  // If colors are too similar, use predefined palettes based on data
  const colorSimilarity = checkColorSimilarity(colors)
  
  if (colorSimilarity > 0.7) {
    // Colors are too similar, use predefined high-contrast palettes
    const paletteIndex = Math.floor((columnAverages[0] || 0.5) * predefinedPalettes.length)
    return predefinedPalettes[paletteIndex % predefinedPalettes.length]
  }
  
  return colors
}

// Check if colors are too similar
function checkColorSimilarity(colors) {
  if (colors.length < 2) return 0
  
  let totalDiff = 0
  let comparisons = 0
  
  for (let i = 0; i < colors.length - 1; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const rgb1 = hexToRgb(colors[i])
      const rgb2 = hexToRgb(colors[j])
      
      if (rgb1 && rgb2) {
        const diff = Math.abs(rgb1.r - rgb2.r) + Math.abs(rgb1.g - rgb2.g) + Math.abs(rgb1.b - rgb2.b)
        totalDiff += diff
        comparisons++
      }
    }
  }
  
  const avgDiff = comparisons > 0 ? totalDiff / comparisons : 0
  const maxDiff = 255 * 3 // Maximum possible difference
  
  return 1 - (avgDiff / maxDiff) // Return similarity (0 = very different, 1 = identical)
}

// Predefined high-contrast palettes for fallback
const predefinedPalettes = [
  // Vibrant contrast
  ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3'],
  ['#F38181', '#AA96DA', '#FCBAD3', '#FFFFD2'],
  ['#A8E6CF', '#FFD3B6', '#FFAAA5', '#FF8B94'],
  ['#5C80BC', '#F4A259', '#BC4B51', '#8E7DBE'],
  // Deep jewel tones
  ['#1A237E', '#C62828', '#2E7D32', '#F57C00'],
  ['#4A148C', '#B71C1C', '#1B5E20', '#E65100'],
  ['#311B92', '#C62828', '#00695C', '#F57F17'],
  // Pastel contrast
  ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA'],
  ['#FF9CEE', '#B4F8C8', '#FBE7C6', '#A0E7E5'],
  ['#FFC8DD', '#CAFFBF', '#9BF6FF', '#FFD6A5']
]

// Helper to convert hex to RGB for similarity check
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

// Convert HSL to HEX
function hslToHex(h, s, l) {
  s /= 100
  l /= 100
  
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = l - c / 2
  
  let r = 0, g = 0, b = 0
  
  if (0 <= h && h < 60) {
    r = c; g = x; b = 0
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x
  }
  
  r = Math.round((r + m) * 255)
  g = Math.round((g + m) * 255)
  b = Math.round((b + m) * 255)
  
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
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

