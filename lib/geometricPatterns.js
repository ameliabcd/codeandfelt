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

// 4. Striped Pattern (Enhanced with waves and gradients)
export function generateStripes(size = 40, params = {}) {
  const { stripeWidth = 5, angle = 0, contrast = 1, wave = 0.3 } = params
  const pattern = []
  
  for (let y = 0; y < size; y++) {
    const row = []
    for (let x = 0; x < size; x++) {
      // Apply rotation
      const rad = (angle * Math.PI) / 180
      const rotX = x * Math.cos(rad) - y * Math.sin(rad)
      const rotY = x * Math.sin(rad) + y * Math.cos(rad)
      
      // Add wave effect to stripes
      const waveOffset = Math.sin(rotY * 0.2) * stripeWidth * wave
      const adjustedX = rotX + waveOffset
      
      // Create stripes with gradient within each stripe
      const stripePosition = (adjustedX / stripeWidth) % 2
      const stripeIndex = Math.floor(adjustedX / stripeWidth) % 2
      const gradientWithinStripe = Math.abs(stripePosition % 1)
      
      // Alternate between solid and gradient stripes
      let value
      if (stripeIndex === 0) {
        value = contrast
      } else {
        // Add gradient within stripe for variation
        value = gradientWithinStripe * contrast * 0.7
      }
      
      row.push(value)
    }
    pattern.push(row)
  }
  
  return pattern
}

// 5. Checkerboard Pattern (Enhanced with gradients and depth)
export function generateCheckerboard(size = 40, params = {}) {
  const { blockSize = 4, contrast = 1, depth = 0.3 } = params
  const pattern = []
  
  for (let y = 0; y < size; y++) {
    const row = []
    for (let x = 0; x < size; x++) {
      const checkX = Math.floor(x / blockSize) % 2
      const checkY = Math.floor(y / blockSize) % 2
      const isLight = (checkX + checkY) % 2
      
      // Position within the block (0 to 1)
      const localX = (x % blockSize) / blockSize
      const localY = (y % blockSize) / blockSize
      
      // Create radial gradient from center of each block for depth
      const centerDist = Math.sqrt(
        Math.pow(localX - 0.5, 2) + Math.pow(localY - 0.5, 2)
      ) * 2
      
      // Add subtle gradient for 3D effect
      const gradient = 1 - (centerDist * depth)
      
      let value
      if (isLight === 0) {
        // Dark squares with subtle highlight in center
        value = 0.2 + (gradient * 0.3)
      } else {
        // Light squares with subtle shadow at edges
        value = 0.7 + (gradient * 0.3)
      }
      
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

// Convert pattern to color grid with enhanced sensitivity to value differences
export function patternToColors(pattern, colors) {
  const height = pattern.length
  const width = pattern[0].length
  const colorGrid = []
  
  for (let y = 0; y < height; y++) {
    const row = []
    for (let x = 0; x < width; x++) {
      const value = pattern[y][x]
      
      // Enhanced color mapping that better preserves value distinctions
      // Clamp value and use more precise mapping
      const clampedValue = Math.max(0, Math.min(1, value))
      // Use more sensitive color index calculation
      const colorIndex = Math.floor(clampedValue * (colors.length - 0.001))
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
  
  // EXPANDED ranges for more dramatic visual differences
  return {
    // Gradient - MORE angle variations (15° increments instead of 45°)
    gradientAngle: Math.floor((columnAverages[0] || 0.5) * 24) * 15, // 0° to 345° in 15° steps
    gradientIntensity: 0.5 + (columnAverages[1] || 0.5) * 1.0, // EXPANDED: 0.5 to 1.5 (was 0.8-1.2)
    gradientOffset: (columnAverages[2] || 0.5) * 0.4 - 0.2, // EXPANDED: -0.2 to 0.2 (was -0.1 to 0.1)
    
    // Random Grid - MORE variation
    randomSeed: Math.floor((columnAverages[0] || 0.5) * 50000), // Larger seed range
    randomDensity: 0.1 + (variability || 0.5) * 0.9, // EXPANDED: 0.1 to 1.0 (was 0.3-1.0)
    
    // Spiral - MORE dramatic changes
    spiralFrequency: 1 + (columnAverages[0] || 0.5) * 10, // EXPANDED: 1 to 11 (was 2-8)
    spiralAmplitude: 0.3 + (columnAverages[1] || 0.5) * 1.2, // EXPANDED: 0.3 to 1.5 (was 0.7-1.3)
    spiralRotation: (columnAverages[2] || 0.5) * Math.PI * 4, // EXPANDED: 0 to 4π (was 0 to 2π)
    
    // Stripes - MORE obvious differences
    stripeWidth: Math.floor(2 + (columnAverages[0] || 0.5) * 12), // EXPANDED: 2 to 14 (was 3-10)
    stripeAngle: (columnAverages[1] || 0.5) * 360, // EXPANDED: 0 to 360° (was 0-180°)
    stripeContrast: 0.5 + (columnAverages[2] || 0.5) * 0.5, // EXPANDED: 0.5 to 1.0 (was 0.7-1.0)
    stripeWave: (columnAverages[3] || 0.5) * 1.2, // EXPANDED: 0 to 1.2 (was 0-0.6)
    
    // Checkerboard - MORE variation
    checkBlockSize: Math.floor(2 + (columnAverages[0] || 0.5) * 12), // EXPANDED: 2 to 14 (was 3-10)
    checkContrast: 0.6 + (columnAverages[1] || 0.5) * 0.6, // EXPANDED: 0.6 to 1.2 (was 0.8-1.2)
    checkDepth: 0.1 + (columnAverages[2] || 0.5) * 0.7, // EXPANDED: 0.1 to 0.8 (was 0.2-0.6)
    
    // Noise - MORE dramatic changes
    noiseScale: 0.02 + (columnAverages[0] || 0.5) * 0.3, // EXPANDED: 0.02 to 0.32 (was 0.05-0.25)
    noiseOctaves: Math.floor(1 + (columnAverages[1] || 0.5) * 6), // EXPANDED: 1 to 7 (was 2-6)
    noisePersistence: 0.2 + (columnAverages[2] || 0.5) * 0.6, // EXPANDED: 0.2 to 0.8 (was 0.3-0.8)
    noiseSeed: Math.floor((columnAverages[3] || 0.5) * 50000), // Larger seed range
    
    // Circular - MORE variation
    circularFrequency: Math.PI * 0.5 + (columnAverages[0] || 0.5) * Math.PI * 5, // EXPANDED: π/2 to 5.5π (was π to 4π)
    circularCenterX: 0.2 + (columnAverages[1] || 0.5) * 0.6, // EXPANDED: 0.2 to 0.8 (was 0.3-0.7)
    circularCenterY: 0.2 + (columnAverages[2] || 0.5) * 0.6, // EXPANDED: 0.2 to 0.8 (was 0.3-0.7)
    
    // Zigzag - MORE dramatic waves
    zigzagXFreq: 0.1 + (columnAverages[0] || 0.5) * 1.2, // EXPANDED: 0.1 to 1.3 (was 0.2-1.0)
    zigzagYFreq: 0.05 + (columnAverages[1] || 0.5) * 0.6, // EXPANDED: 0.05 to 0.65 (was 0.1-0.5)
    zigzagAmplitude: 0.4 + (columnAverages[2] || 0.5) * 1.0, // EXPANDED: 0.4 to 1.4 (was 0.7-1.3)
    
    // Diamond - MORE variation
    diamondScale: 0.5 + (columnAverages[0] || 0.5) * 2.0, // EXPANDED: 0.5 to 2.5 (was 0.8-2.0)
    diamondCenterX: 0.2 + (columnAverages[1] || 0.5) * 0.6, // EXPANDED: 0.2 to 0.8 (was 0.3-0.7)
    diamondCenterY: 0.2 + (columnAverages[2] || 0.5) * 0.6 // EXPANDED: 0.2 to 0.8 (was 0.3-0.7)
  }
}

