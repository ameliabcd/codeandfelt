// Animal Selection Based on Data Characteristics
// Selects different animals based on data patterns and values

/**
 * Select an animal type based on data characteristics
 * @param {Object} data - The data object containing data.data array
 * @param {Object} fractalParams - Fractal parameters from data
 * @returns {string} - Animal ID (bear, cat, dog, etc.)
 */
export function selectAnimalFromData(data, fractalParams) {
  if (!data || !data.data || data.data.length === 0) {
    return 'bear' // Default
  }
  
  const { dataFingerprint, columnAverages, rowCount } = fractalParams || {}
  
  // Extract data characteristics
  const allValues = []
  data.data.forEach(row => {
    row.forEach(val => {
      if (typeof val === 'number') allValues.push(val)
    })
  })
  
  const avgValue = allValues.length > 0 
    ? allValues.reduce((sum, val) => sum + val, 0) / allValues.length 
    : 0.5
  
  const maxValue = allValues.length > 0 ? Math.max(...allValues) : 1
  const minValue = allValues.length > 0 ? Math.min(...allValues) : 0
  const dataRange = maxValue - minValue
  const variance = allValues.length > 0
    ? allValues.reduce((sum, val) => sum + Math.pow(val - avgValue, 2), 0) / allValues.length
    : 0
  
  // Use fingerprint for consistent selection
  const fingerprintFactor = dataFingerprint ? (dataFingerprint % 1000) / 1000 : 0.5
  
  // Combine multiple factors to select animal
  // Use a combination of average value, range, variance, and fingerprint
  const selectionValue = (
    avgValue * 0.3 +
    (dataRange / 1.0) * 0.2 +
    Math.min(variance, 0.5) * 0.2 +
    fingerprintFactor * 0.3
  ) % 1.0
  
  // Map selection value to animal types
  // Each animal gets a range, ensuring variety
  const animals = [
    { id: 'bear', range: [0.0, 0.08] },
    { id: 'cat', range: [0.08, 0.16] },
    { id: 'dog', range: [0.16, 0.24] },
    { id: 'rabbit', range: [0.24, 0.32] },
    { id: 'bird', range: [0.32, 0.40] },
    { id: 'owl', range: [0.40, 0.48] },
    { id: 'penguin', range: [0.48, 0.56] },
    { id: 'elephant', range: [0.56, 0.64] },
    { id: 'whale', range: [0.64, 0.72] },
    { id: 'fox', range: [0.72, 0.80] },
    { id: 'panda', range: [0.80, 0.88] },
    { id: 'fish', range: [0.88, 1.0] }
  ]
  
  // Find matching animal
  for (const animal of animals) {
    if (selectionValue >= animal.range[0] && selectionValue < animal.range[1]) {
      return animal.id
    }
  }
  
  // Fallback to bear
  return 'bear'
}

