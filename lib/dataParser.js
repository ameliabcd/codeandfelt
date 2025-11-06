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

// Create a hash/fingerprint from all data values to ensure different inputs = different patterns
function createDataFingerprint(numericData) {
  // Create a hash from all values, their positions, and row count
  let hash = 0
  numericData.forEach((row, rowIdx) => {
    row.forEach((val, colIdx) => {
      // Include value, row index, and column index in hash
      hash = ((hash << 5) - hash) + (val * 1000) + (rowIdx * 100) + colIdx
      hash = hash & hash // Convert to 32-bit integer
    })
  })
  // Include row count in hash
  hash = ((hash << 5) - hash) + numericData.length
  return Math.abs(hash)
}

// Extract fractal parameters from data using DIRECT VALUE INFLUENCE (not just averages)
export function dataToFractalParams(parsedData) {
  const { headers, data } = parsedData
  if (!data || data.length === 0) return null
  
  // Extract BOTH raw and normalized numeric data
  let numericData = extractNumericData(data, headers)
  const normalized = normalizeData(numericData)
  
  // Create fingerprint from ALL values - this ensures different data = different patterns
  const dataFingerprint = createDataFingerprint(numericData)
  
  // Get raw value ranges for better differentiation
  const maxRawValue = Math.max(...numericData.flat().filter(v => !isNaN(v))) || 100
  const minRawValue = Math.min(...numericData.flat().filter(v => !isNaN(v))) || 0
  const rawRange = maxRawValue - minRawValue || 100
  
  // Use INDIVIDUAL ROW VALUES directly, not just averages
  const numCols = normalized[0]?.length || 0
  const numRows = numericData.length
  
  // Calculate parameters from individual values, not just averages
  // Use first row's first value, second row's first value, etc. for zoom
  const zoomValues = []
  const offsetXValues = []
  const offsetYValues = []
  const iterationValues = []
  
  numericData.forEach((row, idx) => {
    if (row[0] !== undefined && !isNaN(row[0])) {
      const normalizedVal = rawRange > 0 ? (row[0] - minRawValue) / rawRange : 0.5
      zoomValues.push(normalizedVal)
    }
    if (row[1] !== undefined && !isNaN(row[1])) {
      const normalizedVal = rawRange > 0 ? (row[1] - minRawValue) / rawRange : 0.5
      offsetXValues.push(normalizedVal)
    }
    if (row[2] !== undefined && !isNaN(row[2])) {
      const normalizedVal = rawRange > 0 ? (row[2] - minRawValue) / rawRange : 0.5
      offsetYValues.push(normalizedVal)
    }
    if (row[3] !== undefined && !isNaN(row[3])) {
      const normalizedVal = rawRange > 0 ? (row[3] - minRawValue) / rawRange : 0.5
      iterationValues.push(normalizedVal)
    }
  })
  
  // Use weighted average of individual values (weighted by row position)
  // This makes deleting rows change the result dramatically
  function weightedAverage(values) {
    if (values.length === 0) return 0.5
    let sum = 0
    let weightSum = 0
    values.forEach((val, idx) => {
      // Weight by position (later rows have more weight) + fingerprint influence
      const fingerprintWeight = (dataFingerprint % 100) / 1000
      const weight = (idx + 1) * (1 + fingerprintWeight)
      sum += val * weight
      weightSum += weight
    })
    return sum / weightSum
  }
  
  // Calculate column averages for backward compatibility
  const rawColumnAverages = []
  for (let col = 0; col < numCols; col++) {
    const colValues = numericData.map(row => row[col]).filter(v => !isNaN(v))
    if (colValues.length > 0) {
      const avg = colValues.reduce((a, b) => a + b, 0) / colValues.length
      const normalizedAvg = rawRange > 0 ? (avg - minRawValue) / rawRange : 0.5
      rawColumnAverages.push(normalizedAvg)
    } else {
      rawColumnAverages.push(0.5)
    }
  }
  
  // Use fingerprint to create variation even with similar averages
  const fingerprintFactor = (dataFingerprint % 1000) / 1000 // 0 to 0.999
  const rowCountFactor = Math.min(numRows / 20, 1) // Factor based on row count
  
  // Calculate parameters using INDIVIDUAL VALUES with fingerprint influence
  const zoomBase = weightedAverage(zoomValues.length > 0 ? zoomValues : [rawColumnAverages[0] || 0.5])
  const offsetXBase = weightedAverage(offsetXValues.length > 0 ? offsetXValues : [rawColumnAverages[1] || 0.5])
  const offsetYBase = weightedAverage(offsetYValues.length > 0 ? offsetYValues : [rawColumnAverages[2] || 0.5])
  const iterationBase = weightedAverage(iterationValues.length > 0 ? iterationValues : [rawColumnAverages[3] || 0.5])
  
  // Add fingerprint variation to make patterns unique
  const params = {
    // Use individual values + fingerprint for zoom - DRAMATIC range (0.2 to 8.0)
    zoom: 0.2 + (zoomBase * 0.7 + fingerprintFactor * 0.3) * 7.8,
    
    // Use individual values + fingerprint for offsets - DRAMATIC range (-3.5 to 3.5)
    offsetX: (offsetXBase * 0.7 + fingerprintFactor * 0.3 - 0.5) * 7,
    offsetY: (offsetYBase * 0.7 + fingerprintFactor * 0.3 - 0.5) * 7,
    
    // Use individual values + fingerprint for iterations - DRAMATIC range (30 to 300)
    maxIterations: Math.floor(30 + (iterationBase * 0.7 + fingerprintFactor * 0.3) * 270),
    
    // Julia set parameters - DRAMATIC ranges with fingerprint influence
    juliaReal: -1.5 + (zoomBase * 0.6 + fingerprintFactor * 0.4) * 3.0,
    juliaImag: -1.2 + (offsetXBase * 0.6 + fingerprintFactor * 0.4) * 2.4,
    
    // Store all column averages for custom uses (backward compatibility)
    columnAverages: rawColumnAverages,
    
    // Data variability (standard deviation)
    variability: calculateVariability(normalized),
    
    // Store fingerprint for pattern uniqueness
    dataFingerprint: dataFingerprint,
    rowCount: numRows
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

// Generate color palette from data using FINGERPRINT for uniqueness
export function generateDataColors(parsedData, numColors = 6) {
  const { headers, data } = parsedData
  if (!data || data.length === 0) return ['#FCE4EC', '#E3F2FD', '#FFE0B2', '#FFF9F5']
  
  // Extract BOTH raw and normalized numeric data
  let numericData = extractNumericData(data, headers)
  const normalized = normalizeData(numericData)
  
  // Create fingerprint from ALL values - ensures different data = different colors
  const dataFingerprint = createDataFingerprint(numericData)
  const fingerprintFactor = (dataFingerprint % 1000) / 1000 // 0 to 0.999
  
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
  
  // Generate colors with DRAMATIC differences using fingerprint + raw values
  const colors = []
  
  // Use raw values to create more distinct hues - scale raw values to 0-1 using a fixed scale
  // This preserves differences between different value sets
  const maxRawValue = Math.max(...numericData.flat().filter(v => !isNaN(v))) || 100
  const minRawValue = Math.min(...numericData.flat().filter(v => !isNaN(v))) || 0
  const rawRange = maxRawValue - minRawValue || 100
  
  // Base hue from first column's raw average (scaled) + fingerprint influence
  const normalizedRawAvg = rawValueRanges[0] ? (rawValueRanges[0].avg - minRawValue) / rawRange : 0.5
  const baseHue = (normalizedRawAvg * 0.7 + fingerprintFactor * 0.3) * 360
  
  // MUCH larger hue spread for more dramatic differences + fingerprint variation
  const hueSpread = 150 + variability * 200 + fingerprintFactor * 50 // 150-400 degree spread
  
  for (let i = 0; i < numColors; i++) {
    // Use raw column averages for each color + fingerprint to create unique variation
    const colIndex = i % rawValueRanges.length
    const rawAvg = rawValueRanges[colIndex]?.avg || 0
    const normalizedRawVal = (rawAvg - minRawValue) / rawRange
    
    // Create DRAMATIC hue differences with fingerprint influence
    const hueOffset = (i * 360 / numColors) + (normalizedRawVal * 0.7 + fingerprintFactor * 0.3) * hueSpread
    const hue = (baseHue + hueOffset) % 360
    
    // MUCH higher saturation for vibrant, distinct colors + fingerprint
    const saturationBase = 88
    const saturation = Math.min(100, saturationBase + 
      ((normalizedColumnAverages[colIndex] || 0.5) * 0.7 + fingerprintFactor * 0.3) * 12)
    
    // More dramatic lightness variation + fingerprint
    const lightnessBase = 40
    const lightness = Math.min(75, Math.max(25, lightnessBase + 
      ((normalizedColumnAverages[(i + 1) % normalizedColumnAverages.length] || 0.5) * 0.7 + fingerprintFactor * 0.3) * 35))
    
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

