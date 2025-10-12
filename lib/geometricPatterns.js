// Geometric Pattern Generation (inspired by mathematical patterns)

// 1. Gradient / Heatmap Pattern
export function generateGradient(size = 40, params = {}) {
  const { angle = 0, intensity = 1, offset = 0 } = params
  const pattern = []
  
  for (let y = 0; y < size; y++) {
    const row = []
    for (let x = 0; x < size; x++) {
      // Normalize coordinates to -0.5 to 0.5 (centered)
      const nx = (x / size) - 0.5
      const ny = (y / size) - 0.5
      
      // Apply angle rotation
      const rad = (angle * Math.PI) / 180
      const rotX = nx * Math.cos(rad) - ny * Math.sin(rad)
      const rotY = nx * Math.sin(rad) + ny * Math.cos(rad)
      
      // Create gradient with offset to center it
      const value = ((rotX + rotY + 1) / 2) * intensity + offset
      row.push(Math.max(0, Math.min(1, value)))
    }
    pattern.push(row)
  }
  
  return pattern
}

// 2. Random Pastel Grid (Data-influenced randomness)
export function generateRandomGrid(size = 40, params = {}) {
  const { seed = 0, density = 0.5 } = params
  const pattern = []
  
  // Seeded random function
  let rng = seed
  const seededRandom = () => {
    rng = (rng * 9301 + 49297) % 233280
    return rng / 233280
  }
  
  for (let y = 0; y < size; y++) {
    const row = []
    for (let x = 0; x < size; x++) {
      row.push(seededRandom() * density)
    }
    pattern.push(row)
  }
  
  return pattern
}

// 3. Spiral Wave Pattern
export function generateSpiral(size = 40, params = {}) {
  const { frequency = 4, amplitude = 1, rotation = 0 } = params
  const pattern = []
  const center = size / 2
  
  for (let y = 0; y < size; y++) {
    const row = []
    for (let x = 0; x < size; x++) {
      // Calculate distance from center
      const dx = (x - center) / center
      const dy = (y - center) / center
      const r = Math.sqrt(dx * dx + dy * dy)
      const theta = Math.atan2(dy, dx) + rotation
      
      // Create spiral wave
      const value = Math.sin(r * frequency + theta) * amplitude
      row.push((value + 1) / 2) // Normalize to 0-1
    }
    pattern.push(row)
  }
  
  return pattern
}

// 4. Striped Pattern
export function generateStripes(size = 40, params = {}) {
  const { stripeWidth = 5, angle = 0, contrast = 1 } = params
  const pattern = []
  
  for (let y = 0; y < size; y++) {
    const row = []
    for (let x = 0; x < size; x++) {
      // Apply rotation
      const rad = (angle * Math.PI) / 180
      const rotX = x * Math.cos(rad) - y * Math.sin(rad)
      
      // Create stripes
      const stripe = Math.floor(rotX / stripeWidth) % 2
      row.push(stripe * contrast)
    }
    pattern.push(row)
  }
  
  return pattern
}

// 5. Checkerboard Pattern
export function generateCheckerboard(size = 40, params = {}) {
  const { blockSize = 4, contrast = 1 } = params
  const pattern = []
  
  for (let y = 0; y < size; y++) {
    const row = []
    for (let x = 0; x < size; x++) {
      const checkX = Math.floor(x / blockSize) % 2
      const checkY = Math.floor(y / blockSize) % 2
      const value = (checkX + checkY) % 2
      row.push(value * contrast)
    }
    pattern.push(row)
  }
  
  return pattern
}

// 6. Noise (Felt Texture) Pattern
export function generateNoise(size = 40, params = {}) {
  const { scale = 1, octaves = 3, persistence = 0.5, seed = 0 } = params
  const pattern = []
  
  // Simple noise function
  let rng = seed
  const seededRandom = () => {
    rng = (rng * 9301 + 49297) % 233280
    return rng / 233280
  }
  
  for (let y = 0; y < size; y++) {
    const row = []
    for (let x = 0; x < size; x++) {
      let value = 0
      let amplitude = 1
      let frequency = scale
      
      // Multi-octave noise
      for (let i = 0; i < octaves; i++) {
        const sampleX = x * frequency + i * 100
        const sampleY = y * frequency + i * 100
        
        // Simple hash-based noise
        rng = Math.floor(sampleX * 12.9898 + sampleY * 78.233) * 43758.5453
        const noise = Math.abs(Math.sin(rng)) - 0.5
        
        value += noise * amplitude
        amplitude *= persistence
        frequency *= 2
      }
      
      row.push((value + 0.5)) // Normalize
    }
    pattern.push(row)
  }
  
  // Normalize to 0-1 range
  const flat = pattern.flat()
  const min = Math.min(...flat)
  const max = Math.max(...flat)
  const range = max - min || 1
  
  return pattern.map(row => row.map(v => (v - min) / range))
}

// 7. Circular Gradient Pattern
export function generateCircularGradient(size = 40, params = {}) {
  const { frequency = Math.PI, centerX = 0.5, centerY = 0.5 } = params
  const pattern = []
  
  for (let y = 0; y < size; y++) {
    const row = []
    for (let x = 0; x < size; x++) {
      const dx = (x / size) - centerX
      const dy = (y / size) - centerY
      const r = Math.sqrt(dx * dx + dy * dy)
      
      const value = Math.cos(r * frequency)
      row.push((value + 1) / 2) // Normalize to 0-1
    }
    pattern.push(row)
  }
  
  return pattern
}

// 8. Zigzag / Wave Pattern
export function generateZigzag(size = 40, params = {}) {
  const { xFrequency = 0.5, yFrequency = 0.25, amplitude = 1 } = params
  const pattern = []
  
  for (let y = 0; y < size; y++) {
    const row = []
    for (let x = 0; x < size; x++) {
      const xWave = Math.sin(x * xFrequency)
      const yWave = Math.cos(y * yFrequency)
      const value = (xWave + yWave) * amplitude
      row.push((value + 2) / 4) // Normalize to 0-1
    }
    pattern.push(row)
  }
  
  return pattern
}

// 9. Diamond Pattern
export function generateDiamond(size = 40, params = {}) {
  const { scale = 1, centerX = 0.5, centerY = 0.5 } = params
  const pattern = []
  
  for (let y = 0; y < size; y++) {
    const row = []
    for (let x = 0; x < size; x++) {
      const dx = Math.abs((x / size) - centerX)
      const dy = Math.abs((y / size) - centerY)
      const value = (dx + dy) * scale
      row.push(Math.min(1, value))
    }
    pattern.push(row)
  }
  
  return pattern
}

// Convert pattern to color grid
export function patternToColors(pattern, colors) {
  const height = pattern.length
  const width = pattern[0].length
  const colorGrid = []
  
  for (let y = 0; y < height; y++) {
    const row = []
    for (let x = 0; x < width; x++) {
      const value = pattern[y][x]
      
      // Map value to color index
      const colorIndex = Math.floor(value * colors.length)
      const color = colors[Math.min(colorIndex, colors.length - 1)]
      
      row.push(color)
    }
    colorGrid.push(row)
  }
  
  return colorGrid
}

// Map data to pattern parameters
export function dataToPatternParams(fractalParams) {
  if (!fractalParams) return {}
  
  const { columnAverages, variability } = fractalParams
  
  return {
    // Gradient - constrained to 45° increments for better visibility
    gradientAngle: Math.floor((columnAverages[0] || 0.5) * 8) * 45, // 0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°
    gradientIntensity: 0.8 + (columnAverages[1] || 0.5) * 0.4, // 0.8 to 1.2
    gradientOffset: (columnAverages[2] || 0.5) * 0.2 - 0.1, // -0.1 to 0.1
    
    // Random Grid
    randomSeed: Math.floor((columnAverages[0] || 0.5) * 10000),
    randomDensity: 0.3 + (variability || 0.5) * 0.7,
    
    // Spiral
    spiralFrequency: 2 + (columnAverages[0] || 0.5) * 6,
    spiralAmplitude: 0.7 + (columnAverages[1] || 0.5) * 0.6,
    spiralRotation: (columnAverages[2] || 0.5) * Math.PI * 2,
    
    // Stripes
    stripeWidth: Math.floor(3 + (columnAverages[0] || 0.5) * 7),
    stripeAngle: (columnAverages[1] || 0.5) * 180,
    stripeContrast: 0.7 + (columnAverages[2] || 0.5) * 0.3,
    
    // Checkerboard
    checkBlockSize: Math.floor(2 + (columnAverages[0] || 0.5) * 8),
    checkContrast: 0.7 + (columnAverages[1] || 0.5) * 0.3,
    
    // Noise
    noiseScale: 0.05 + (columnAverages[0] || 0.5) * 0.2,
    noiseOctaves: Math.floor(2 + (columnAverages[1] || 0.5) * 4),
    noisePersistence: 0.3 + (columnAverages[2] || 0.5) * 0.5,
    noiseSeed: Math.floor((columnAverages[3] || 0.5) * 10000),
    
    // Circular
    circularFrequency: Math.PI + (columnAverages[0] || 0.5) * Math.PI * 3,
    circularCenterX: 0.3 + (columnAverages[1] || 0.5) * 0.4,
    circularCenterY: 0.3 + (columnAverages[2] || 0.5) * 0.4,
    
    // Zigzag
    zigzagXFreq: 0.2 + (columnAverages[0] || 0.5) * 0.8,
    zigzagYFreq: 0.1 + (columnAverages[1] || 0.5) * 0.4,
    zigzagAmplitude: 0.7 + (columnAverages[2] || 0.5) * 0.6,
    
    // Diamond
    diamondScale: 0.8 + (columnAverages[0] || 0.5) * 1.2,
    diamondCenterX: 0.3 + (columnAverages[1] || 0.5) * 0.4,
    diamondCenterY: 0.3 + (columnAverages[2] || 0.5) * 0.4
  }
}

