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

// Normalize data to 0-1 range, but preserve more information about value differences
export function normalizeData(numericData) {
  if (numericData.length === 0) return []
  
  const flat = numericData.flat()
  const min = Math.min(...flat)
  const max = Math.max(...flat)
  const range = max - min || 1
  
  // Use a more sensitive normalization that preserves relative differences better
  // Apply a slight exponential curve to make differences more pronounced
  return numericData.map(row => 
    row.map(value => {
      const normalized = (value - min) / range
      // Apply slight curve to enhance differences (square root for more sensitivity)
      return Math.pow(normalized, 0.8) // Makes values more distinct
    })
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
  
  // Convert to color pattern with enhanced sensitivity to value differences
  const pattern = numericData.map(row =>
    row.map(value => {
      // Use more sensitive color mapping that better preserves value differences
      // Clamp to avoid edge cases
      const clampedValue = Math.max(0, Math.min(1, value))
      // Use a more precise mapping that preserves distinctions better
      const colorIndex = Math.floor(clampedValue * (selectedColors.length - 0.001))
      return selectedColors[Math.min(colorIndex, selectedColors.length - 1)]
    })
  )
  
  return pattern
}

// Extract fractal parameters from data
export function dataToFractalParams(parsedData) {
  const { headers, data } = parsedData
  if (!data || data.length === 0) return null
  
  // Extract BOTH raw and normalized numeric data
  let numericData = extractNumericData(data, headers)
  const normalized = normalizeData(numericData)
  
  // Calculate average values for each column (from normalized)
  const columnAverages = []
  // Also calculate from raw values for more sensitivity
  const rawColumnAverages = []
  const numCols = normalized[0]?.length || 0
  
  // Get raw value ranges for better differentiation
  const maxRawValue = Math.max(...numericData.flat().filter(v => !isNaN(v))) || 100
  const minRawValue = Math.min(...numericData.flat().filter(v => !isNaN(v))) || 0
  const rawRange = maxRawValue - minRawValue || 100
  
  for (let col = 0; col < numCols; col++) {
    let sum = 0
    let count = 0
    let rawSum = 0
    let rawCount = 0
    
    normalized.forEach((row, idx) => {
      if (row[col] !== undefined) {
        sum += row[col]
        count++
      }
    })
    
    numericData.forEach((row) => {
      if (row[col] !== undefined && !isNaN(row[col])) {
        rawSum += row[col]
        rawCount++
      }
    })
    
    columnAverages.push(count > 0 ? sum / count : 0.5)
    
    // Normalize raw average to 0-1 for consistency
    const rawAvg = rawCount > 0 ? rawSum / rawCount : 0
    const normalizedRawAvg = rawRange > 0 ? (rawAvg - minRawValue) / rawRange : 0.5
    rawColumnAverages.push(normalizedRawAvg)
  }
  
  // Use raw column averages for more dramatic differences
  // Map averages to fractal parameters with EXPANDED ranges for more obvious changes
  const params = {
    // Use first column for zoom - EXPANDED range (0.3 to 5.0) for more dramatic changes
    zoom: rawColumnAverages[0] ? 0.3 + rawColumnAverages[0] * 4.7 : 1,
    
    // Use second column for X offset - EXPANDED range (-2.5 to 2.5) for more movement
    offsetX: rawColumnAverages[1] ? (rawColumnAverages[1] - 0.5) * 5 : 0,
    
    // Use third column for Y offset - EXPANDED range (-2.5 to 2.5) for more movement
    offsetY: rawColumnAverages[2] ? (rawColumnAverages[2] - 0.5) * 5 : 0,
    
    // Use fourth column for iterations - EXPANDED range (50 to 250) for more detail variation
    maxIterations: rawColumnAverages[3] ? Math.floor(50 + rawColumnAverages[3] * 200) : 150,
    
    // Julia set parameters from data - EXPANDED ranges for more variety
    juliaReal: rawColumnAverages[0] ? -1.2 + rawColumnAverages[0] * 2.4 : -0.7,
    juliaImag: rawColumnAverages[1] ? -1.0 + rawColumnAverages[1] * 2.0 : 0.27015,
    
    // Store all column averages for custom uses
    columnAverages: rawColumnAverages, // Use raw averages for better differentiation
    
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
export function generateDataColors(parsedData, numColors = 6) {
  const { headers, data } = parsedData
  if (!data || data.length === 0) return ['#FCE4EC', '#E3F2FD', '#FFE0B2', '#FFF9F5']
  
  // Extract BOTH raw and normalized numeric data
  let numericData = extractNumericData(data, headers)
  const normalized = normalizeData(numericData)
  
  // Calculate column averages from RAW values (for better differentiation)
  const rawColumnAverages = []
  const normalizedColumnAverages = []
  const numCols = numericData[0]?.length || 0
  
  // Also get raw value ranges for better color differentiation
  const rawValueRanges = []
  
  for (let col = 0; col < numCols; col++) {
    const rawValues = numericData.map(row => row[col]).filter(v => v !== undefined)
    const normValues = normalized.map(row => row[col]).filter(v => v !== undefined)
    
    if (rawValues.length > 0) {
      const rawMin = Math.min(...rawValues)
      const rawMax = Math.max(...rawValues)
      const rawAvg = rawValues.reduce((a, b) => a + b, 0) / rawValues.length
      const rawRange = rawMax - rawMin || 1
      
      rawColumnAverages.push(rawAvg)
      rawValueRanges.push({ min: rawMin, max: rawMax, range: rawRange, avg: rawAvg })
    } else {
      rawColumnAverages.push(0)
      rawValueRanges.push({ min: 0, max: 0, range: 1, avg: 0 })
    }
    
    if (normValues.length > 0) {
      normalizedColumnAverages.push(normValues.reduce((a, b) => a + b, 0) / normValues.length)
    } else {
      normalizedColumnAverages.push(0.5)
    }
  }
  
  // Calculate data variability for color strategy
  const flat = normalized.flat()
  const mean = flat.reduce((a, b) => a + b, 0) / flat.length
  const variance = flat.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / flat.length
  const variability = Math.sqrt(variance)
  
  // Generate colors with MORE DRAMATIC differences based on raw values
  const colors = []
  
  // Use raw values to create more distinct hues - scale raw values to 0-1 using a fixed scale
  // This preserves differences between different value sets
  const maxRawValue = Math.max(...numericData.flat().filter(v => !isNaN(v))) || 100
  const minRawValue = Math.min(...numericData.flat().filter(v => !isNaN(v))) || 0
  const rawRange = maxRawValue - minRawValue || 100
  
  // Base hue from first column's raw average (scaled)
  const normalizedRawAvg = rawValueRanges[0] ? (rawValueRanges[0].avg - minRawValue) / rawRange : 0.5
  const baseHue = normalizedRawAvg * 360
  
  // MUCH larger hue spread for more dramatic differences
  const hueSpread = 120 + variability * 180 // 120-300 degree spread
  
  for (let i = 0; i < numColors; i++) {
    // Use raw column averages for each color to create more variation
    const colIndex = i % rawValueRanges.length
    const rawAvg = rawValueRanges[colIndex]?.avg || 0
    const normalizedRawVal = (rawAvg - minRawValue) / rawRange
    
    // Create much more dramatic hue differences
    const hueOffset = (i * 360 / numColors) + normalizedRawVal * hueSpread
    const hue = (baseHue + hueOffset) % 360
    
    // MUCH higher saturation for vibrant, distinct colors
    const saturationBase = 85
    const saturation = Math.min(100, saturationBase + (normalizedColumnAverages[colIndex] || 0.5) * 15)
    
    // More dramatic lightness variation
    const lightnessBase = 45
    const lightness = Math.min(75, Math.max(25, lightnessBase + (normalizedColumnAverages[(i + 1) % normalizedColumnAverages.length] || 0.5) * 30))
    
    colors.push(hslToHex(Math.floor(hue), Math.floor(saturation), Math.floor(lightness)))
  }
  
  // Ensure colors are distinct - check contrast
  const distinctColors = ensureDistinctColors(colors, rawColumnAverages)
  
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

// Predefined high-contrast vibrant palettes for fallback
const predefinedPalettes = [
  // Vibrant contrast
  ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3'],
  ['#F38181', '#AA96DA', '#FCBAD3', '#FFFFD2'],
  ['#FF1744', '#00E5FF', '#FFEA00', '#76FF03'],
  ['#E040FB', '#18FFFF', '#FFFF00', '#FF4081'],
  // Deep jewel tones - more saturated
  ['#304FFE', '#FF1744', '#00E676', '#FFC400'],
  ['#6200EA', '#D50000', '#00C853', '#FF6D00'],
  ['#311B92', '#C62828', '#00BFA5', '#FFD600'],
  // Bright neon-like
  ['#FF3D00', '#00E5FF', '#AEEA00', '#FF6E40'],
  ['#FF6090', '#50FA7B', '#FFD93D', '#6BC5F8'],
  ['#FF5252', '#69F0AE', '#FFD740', '#448AFF']
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

