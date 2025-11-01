// Gallery Pattern Generators
// Specialized generators for each pattern type in the gallery

/**
 * Generate Temperature Scarf pattern
 * Creates a gradient pattern based on temperature data
 */
export function generateTemperatureScarf(data, width = 60) {
  const pattern = []
  
  if (!data || data.length === 0) {
    // Generate sample data if none provided
    for (let y = 0; y < 20; y++) {
      const row = []
      for (let x = 0; x < width; x++) {
        // Simulate daily temperature variation
        const day = x
        const temperature = 20 + 15 * Math.sin(day * 0.1) + Math.random() * 5
        // Map temperature to color (0-35°C range)
        const normalized = Math.max(0, Math.min(1, temperature / 35))
        row.push(normalized)
      }
      pattern.push(row)
    }
    return pattern
  }
  
  // Extract numeric temperature values
  const temperatures = data.map(row => {
    // Try to find temperature column
    const temp = row.find(val => typeof val === 'number' && val > -50 && val < 50)
    return temp || 20
  })
  
  // Normalize to 0-1 range
  const minTemp = Math.min(...temperatures)
  const maxTemp = Math.max(...temperatures)
  const range = maxTemp - minTemp || 1
  
  const normalized = temperatures.map(t => (t - minTemp) / range)
  
  // Create pattern with gradient bars
  for (let y = 0; y < 20; y++) {
    const row = []
    for (let x = 0; x < width; x++) {
      const dataIdx = Math.floor(x / (width / normalized.length))
      row.push(normalized[dataIdx] || 0.5)
    }
    pattern.push(row)
  }
  
  return pattern
}

/**
 * Generate Stock Market Blanket pattern
 * Creates a candle-stick style pattern from financial data
 */
export function generateStockMarketBlanket(data, width = 60) {
  const pattern = []
  
  if (!data || data.length === 0) {
    // Generate sample data
    let price = 100
    for (let y = 0; y < 30; y++) {
      const row = []
      for (let x = 0; x < width; x++) {
        // Random walk price simulation
        price += (Math.random() - 0.5) * 5
        price = Math.max(50, Math.min(150, price))
        
        // Calculate relative position in range
        const normalized = (price - 50) / 100
        row.push(normalized)
      }
      pattern.push(row)
    }
    return pattern
  }
  
  // Extract high, low, open, close values
  const prices = data.map(row => {
    const numeric = row.filter(val => typeof val === 'number' && val > 0)
    return numeric.length > 0 ? numeric[0] : 100
  })
  
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const range = maxPrice - minPrice || 1
  
  const normalized = prices.map(p => (p - minPrice) / range)
  
  // Create candle-stick style pattern
  for (let y = 0; y < 30; y++) {
    const row = []
    for (let x = 0; x < width; x++) {
      const dataIdx = Math.floor(x / (width / normalized.length))
      const base = normalized[dataIdx] || 0.5
      
      // Add some variation for candle wicks
      const variation = Math.random() * 0.3 - 0.15
      row.push(Math.max(0, Math.min(1, base + variation)))
    }
    pattern.push(row)
  }
  
  return pattern
}

/**
 * Generate Heart Rate Hat pattern
 * Creates an EKG-style waveform pattern
 */
export function generateHeartRateHat(data, width = 60) {
  const pattern = []
  
  if (!data || data.length === 0) {
    // Generate sample EKG pattern
    const heartRatePattern = []
    for (let i = 0; i < 20; i++) {
      heartRatePattern.push(0.3) // baseline
      heartRatePattern.push(0.8) // spike
      heartRatePattern.push(0.2) // dip
      heartRatePattern.push(0.6) // second spike
      heartRatePattern.push(0.3) // return to baseline
      heartRatePattern.push(0.3) // rest
    }
    
    for (let y = 0; y < 20; y++) {
      const row = []
      for (let x = 0; x < width; x++) {
        const idx = x % heartRatePattern.length
        row.push(heartRatePattern[idx])
      }
      pattern.push(row)
    }
    return pattern
  }
  
  // Extract heart rate values
  const heartRates = data.map(row => {
    const numeric = row.filter(val => typeof val === 'number' && val > 30 && val < 200)
    return numeric.length > 0 ? numeric[0] : 70
  })
  
  const minRate = Math.min(...heartRates)
  const maxRate = Math.max(...heartRates)
  const range = maxRate - minRate || 1
  
  const normalized = heartRates.map(r => (r - minRate) / range)
  
  // Create EKG-style waveform
  for (let y = 0; y < 20; y++) {
    const row = []
    for (let x = 0; x < width; x++) {
      const dataIdx = Math.floor(x / (width / normalized.length))
      const baseRate = normalized[dataIdx] || 0.5
      
      // Create EKG spike pattern
      const position = (x % 6)
      let value = baseRate * 0.4 // baseline
      
      if (position === 1 || position === 3) {
        value = baseRate * 1.5 // spike
      } else if (position === 2) {
        value = baseRate * 0.3 // dip
      }
      
      row.push(Math.max(0, Math.min(1, value)))
    }
    pattern.push(row)
  }
  
  return pattern
}

/**
 * Generate Rainfall Wrap pattern
 * Creates a rainfall-style visualization
 */
export function generateRainfallWrap(data, width = 60) {
  const pattern = []
  
  if (!data || data.length === 0) {
    // Generate sample rainfall data
    for (let y = 0; y < 40; y++) {
      const row = []
      for (let x = 0; x < width; x++) {
        // Random rainfall drops
        const rain = Math.random() < 0.3 ? Math.random() * 0.8 + 0.2 : 0
        row.push(rain)
      }
      pattern.push(row)
    }
    return pattern
  }
  
  // Extract rainfall values
  const rainfall = data.map(row => {
    const numeric = row.filter(val => typeof val === 'number' && val >= 0)
    return numeric.length > 0 ? numeric[0] : 0
  })
  
  const maxRain = Math.max(...rainfall, 1)
  const normalized = rainfall.map(r => r / maxRain)
  
  // Create rainfall pattern
  for (let y = 0; y < 40; y++) {
    const row = []
    for (let x = 0; x < width; x++) {
      const dataIdx = Math.floor(x / (width / normalized.length))
      const base = normalized[dataIdx] || 0
      
      // Add random drops
      const drop = Math.random() < base ? base * Math.random() : 0
      row.push(drop)
    }
    pattern.push(row)
  }
  
  return pattern
}

/**
 * Generate Math Complexity Cowl pattern
 * Creates a complexity visualization for code metrics
 */
export function generateMathComplexityCowl(data, width = 60) {
  const pattern = []
  
  if (!data || data.length === 0) {
    // Generate sample complexity pattern
    for (let y = 0; y < 25; y++) {
      const row = []
      for (let x = 0; x < width; x++) {
        // Create blocky pattern
        const blockSize = 5
        const blockX = Math.floor(x / blockSize)
        const blockY = Math.floor(y / blockSize)
        const complexity = ((blockX + blockY) % 3) / 2
        row.push(complexity)
      }
      pattern.push(row)
    }
    return pattern
  }
  
  // Extract complexity values
  const complexity = data.map(row => {
    const numeric = row.filter(val => typeof val === 'number' && val >= 0)
    return numeric.length > 0 ? numeric[0] : 1
  })
  
  const maxComplexity = Math.max(...complexity, 1)
  const normalized = complexity.map(c => c / maxComplexity)
  
  // Create blocky complexity pattern
  for (let y = 0; y < 25; y++) {
    const row = []
    for (let x = 0; x < width; x++) {
      const dataIdx = Math.floor(x / 5)
      const base = normalized[dataIdx] || 0.5
      
      // Create block chunks
      const blockX = Math.floor(x / 5)
      const blockY = Math.floor(y / 5)
      const blockValue = ((blockX + blockY) % 2 === 0) ? base : base * 0.7
      
      row.push(Math.max(0, Math.min(1, blockValue)))
    }
    pattern.push(row)
  }
  
  return pattern
}

/**
 * Generate Sleep Pattern Pillow pattern
 * Creates a sleep cycle visualization
 */
export function generateSleepPatternPillow(data, width = 60) {
  const pattern = []
  
  if (!data || data.length === 0) {
    // Generate sample sleep pattern (circadian rhythm)
    for (let y = 0; y < 25; y++) {
      const row = []
      for (let x = 0; x < width; x++) {
        // Simulate 24-hour cycle
        const hour = (x / width) * 24
        const sleepDepth = Math.sin((hour - 6) * Math.PI / 12)
        const depth = (sleepDepth + 1) / 2 // 0-1 range
        row.push(Math.max(0, Math.min(1, depth)))
      }
      pattern.push(row)
    }
    return pattern
  }
  
  // Extract sleep depth/quality values
  const sleepData = data.map(row => {
    const numeric = row.filter(val => typeof val === 'number' && val >= 0 && val <= 1)
    return numeric.length > 0 ? numeric[0] : 0.5
  })
  
  // Create wave pattern
  for (let y = 0; y < 25; y++) {
    const row = []
    for (let x = 0; x < width; x++) {
      const dataIdx = Math.floor(x / (width / sleepData.length))
      const base = sleepData[dataIdx] || 0.5
      
      // Add wave oscillation
      const wave = Math.sin(x * 0.3) * 0.2
      row.push(Math.max(0, Math.min(1, base + wave)))
    }
    pattern.push(row)
  }
  
  return pattern
}

/**
 * Generate Social Media Mittens pattern
 * Creates engagement metric visualization
 */
export function generateSocialMediaMittens(data, width = 60) {
  const pattern = []
  
  if (!data || data.length === 0) {
    // Generate sample engagement pattern
    for (let y = 0; y < 20; y++) {
      const row = []
      for (let x = 0; x < width; x++) {
        // Bursty engagement pattern
        const burst = Math.sin(x * 0.5) > 0.7 ? Math.random() * 0.5 + 0.5 : Math.random() * 0.3
        row.push(burst)
      }
      pattern.push(row)
    }
    return pattern
  }
  
  // Extract engagement values
  const engagement = data.map(row => {
    const numeric = row.filter(val => typeof val === 'number' && val >= 0)
    return numeric.length > 0 ? numeric[0] : 0
  })
  
  const maxEngagement = Math.max(...engagement, 1)
  const normalized = engagement.map(e => e / maxEngagement)
  
  // Create bursty pattern
  for (let y = 0; y < 20; y++) {
    const row = []
    for (let x = 0; x < width; x++) {
      const dataIdx = Math.floor(x / (width / normalized.length))
      const base = normalized[dataIdx] || 0
      
      // Add random bursts
      const burst = Math.random() < base ? base : base * 0.3
      row.push(burst)
    }
    pattern.push(row)
  }
  
  return pattern
}

/**
 * Generate Cryptocurrency Cowl pattern
 * Creates crypto price volatility visualization
 */
export function generateCryptocurrencyCowl(data, width = 60) {
  const pattern = []
  
  if (!data || data.length === 0) {
    // Generate sample crypto volatility pattern
    let price = 100
    for (let y = 0; y < 30; y++) {
      const row = []
      for (let x = 0; x < width; x++) {
        // High volatility random walk
        price += (Math.random() - 0.5) * 10
        price = Math.max(20, Math.min(200, price))
        
        const normalized = (price - 20) / 180
        row.push(normalized)
      }
      pattern.push(row)
    }
    return pattern
  }
  
  // Extract price values
  const prices = data.map(row => {
    const numeric = row.filter(val => typeof val === 'number' && val > 0)
    return numeric.length > 0 ? numeric[0] : 100
  })
  
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const range = maxPrice - minPrice || 1
  
  const normalized = prices.map(p => (p - minPrice) / range)
  
  // Create volatile zigzag pattern
  for (let y = 0; y < 30; y++) {
    const row = []
    for (let x = 0; x < width; x++) {
      const dataIdx = Math.floor(x / (width / normalized.length))
      const base = normalized[dataIdx] || 0.5
      
      // Add zigzag volatility
      const zigzag = Math.sin(x * 0.5) * 0.2
      row.push(Math.max(0, Math.min(1, base + zigzag)))
    }
    pattern.push(row)
  }
  
  return pattern
}

/**
 * Get the appropriate color palette for a pattern type
 */
export function getPatternColors(patternId) {
  const colorMap = {
    1: ['#FFC0CB', '#FFB6C1', '#FF69B4', '#FF1493'], // Temperature - pink gradient
    2: ['#FFD700', '#FFA500', '#FF6347', '#DC143C'], // Stock - gold to red
    3: ['#FF0000', '#DC143C', '#B22222', '#8B0000'], // Heart Rate - red gradient
    4: ['#4169E1', '#1E90FF', '#00BFFF', '#87CEEB'], // Rainfall - blue gradient
    5: ['#9370DB', '#BA55D3', '#DDA0DD', '#EE82EE'], // Math Complexity - purple
    6: ['#191970', '#000080', '#483D8B', '#6A5ACD'], // Sleep - dark blue
    7: ['#FF1493', '#FF69B4', '#FFB6C1', '#FFC0CB'], // Social Media - hot pink
    8: ['#FFD700', '#FFA500', '#FF4500', '#FF0000'], // Crypto - yellow to red
  }
  
  return colorMap[patternId] || ['#FCE4EC', '#E3F2FD', '#FFE0B2', '#FFF9F5']
}

/**
 * Pattern generator mapping
 */
export const patternGenerators = {
  1: generateTemperatureScarf,
  2: generateStockMarketBlanket,
  3: generateHeartRateHat,
  4: generateRainfallWrap,
  5: generateMathComplexityCowl,
  6: generateSleepPatternPillow,
  7: generateSocialMediaMittens,
  8: generateCryptocurrencyCowl,
}
