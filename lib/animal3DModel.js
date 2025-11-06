// 3D Animal Model Generator
// Generates realistic front-view visualization of felted animals
// Supports multiple animal types with distinctive features

/**
 * Generate front-view model visualization of animal
 * @param {Object} data - The data object
 * @param {string} animalId - Animal type (bear, cat, dog, etc.)
 * @param {Object} animalParams - Animal parameters (size, proportions, etc.)
 * @returns {Object|null} - Model object with parts, width, height, viewBox
 */
export function generateAnimal3DModel(data, animalId = 'bear', animalParams = null) {
  if (!data || !data.data || data.data.length === 0) {
    console.error('No data provided to generateAnimal3DModel')
    return null
  }
  
  // Calculate parameters from data if not provided
  if (!animalParams) {
    animalParams = calculateAnimalParamsFromData(data)
  }
  
  const { baseSize, headRatio, limbLength, bodyRatio, earSize } = animalParams
  
  // Use fixed colors (don't change based on data)
  const mainColor = '#FF6B6B' // Fixed pink
  const accentColor = '#4ECDC4' // Fixed teal
  
  // SVG dimensions - LARGER to accommodate bigger animals
  const svgWidth = 500
  const svgHeight = 600
  const centerX = svgWidth / 2
  const centerY = svgHeight / 2
  
  // Generate model based on animal type
  switch (animalId) {
    case 'bear':
      return generateBearModel(centerX, centerY, baseSize, headRatio, limbLength, bodyRatio, earSize, mainColor, accentColor, svgWidth, svgHeight)
    case 'cat':
      return generateCatModel(centerX, centerY, baseSize, headRatio, limbLength, bodyRatio, earSize, mainColor, accentColor, svgWidth, svgHeight)
    case 'dog':
      return generateDogModel(centerX, centerY, baseSize, headRatio, limbLength, bodyRatio, earSize, mainColor, accentColor, svgWidth, svgHeight)
    case 'rabbit':
      return generateRabbitModel(centerX, centerY, baseSize, headRatio, limbLength, bodyRatio, earSize, mainColor, accentColor, svgWidth, svgHeight)
    case 'bird':
      return generateBirdModel(centerX, centerY, baseSize, headRatio, limbLength, bodyRatio, earSize, mainColor, accentColor, svgWidth, svgHeight)
    case 'owl':
      return generateOwlModel(centerX, centerY, baseSize, headRatio, limbLength, bodyRatio, earSize, mainColor, accentColor, svgWidth, svgHeight)
    case 'penguin':
      return generatePenguinModel(centerX, centerY, baseSize, headRatio, limbLength, bodyRatio, earSize, mainColor, accentColor, svgWidth, svgHeight)
    case 'elephant':
      return generateElephantModel(centerX, centerY, baseSize, headRatio, limbLength, bodyRatio, earSize, mainColor, accentColor, svgWidth, svgHeight)
    case 'whale':
      return generateWhaleModel(centerX, centerY, baseSize, headRatio, limbLength, bodyRatio, earSize, mainColor, accentColor, svgWidth, svgHeight)
    case 'fox':
      return generateFoxModel(centerX, centerY, baseSize, headRatio, limbLength, bodyRatio, earSize, mainColor, accentColor, svgWidth, svgHeight)
    case 'panda':
      return generatePandaModel(centerX, centerY, baseSize, headRatio, limbLength, bodyRatio, earSize, mainColor, accentColor, svgWidth, svgHeight)
    case 'fish':
      return generateFishModel(centerX, centerY, baseSize, headRatio, limbLength, bodyRatio, earSize, mainColor, accentColor, svgWidth, svgHeight)
    default:
      return generateBearModel(centerX, centerY, baseSize, headRatio, limbLength, bodyRatio, earSize, mainColor, accentColor, svgWidth, svgHeight)
  }
}

// Calculate animal parameters from data
function calculateAnimalParamsFromData(data) {
  const allValues = []
  // Handle both array of arrays and array of objects
  data.data.forEach(row => {
    if (Array.isArray(row)) {
      // Array of arrays (numeric data)
      row.forEach(val => {
        if (typeof val === 'number') allValues.push(val)
      })
    } else if (typeof row === 'object') {
      // Array of objects (parsed CSV/JSON)
      Object.values(row).forEach(val => {
        const num = parseFloat(val)
        if (!isNaN(num)) allValues.push(num)
      })
    }
  })
  
  const avgValue = allValues.length > 0 
    ? allValues.reduce((sum, val) => sum + val, 0) / allValues.length 
    : 0.5
  
  const maxValue = allValues.length > 0 ? Math.max(...allValues) : 1
  const minValue = allValues.length > 0 ? Math.min(...allValues) : 0
  const dataRange = maxValue - minValue
  
  // Map to parameters with constraints to keep animals recognizable
  // LARGER base size, SMALLER variations to keep proportions
  const baseSize = 10 + (avgValue * 20) // 10-30cm (larger)
  const headRatio = 0.45 + (avgValue * 0.1) // 0.45-0.55 (smaller variation)
  const limbLength = Math.max(0.7, Math.min(1.3, 0.7 + (dataRange * 0.6))) // 0.7-1.3x (smaller variation)
  const bodyRatio = 0.8 + (avgValue * 0.2) // 0.8-1.0 (smaller variation)
  const earSize = 0.7 + (dataRange * 0.4) // 0.7-1.1x (smaller variation)
  
  return { baseSize, headRatio, limbLength, bodyRatio, earSize }
}

// Common helper function to create model object
function createModel(parts, svgWidth, svgHeight) {
  return {
    parts: parts,
    width: svgWidth,
    height: svgHeight,
    viewBox: `0 0 ${svgWidth} ${svgHeight}`
  }
}

// Generate Bear Model (default)
function generateBearModel(cx, cy, baseSize, headRatio, limbLength, bodyRatio, earSize, mainColor, accentColor, svgWidth, svgHeight) {
  const parts = []
  const bodySize = baseSize
  const headSize = bodySize * headRatio
  const armLength = bodySize * 0.4 * Math.max(0.5, Math.min(1.5, limbLength))
  const armWidth = bodySize * 0.25
  const legLength = bodySize * 0.5 * Math.max(0.5, Math.min(1.5, limbLength))
  const legWidth = bodySize * 0.3
  const earSizeScaled = headSize * 0.35 * Math.max(0.6, Math.min(1.2, earSize))
  
  const bodyY = cy + bodySize * 2
  const headY = bodyY - bodySize * 3.5
  
  // Body
  parts.push({
    type: 'ellipse',
    cx: cx,
    cy: bodyY,
    rx: bodySize * 4 * bodyRatio,
    ry: bodySize * 3,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 3,
    opacity: 1
  })
  
  // Body shading
  parts.push({
    type: 'ellipse',
    cx: cx - bodySize * 1.5,
    cy: bodyY - bodySize * 0.5,
    rx: bodySize * 2.5,
    ry: bodySize * 2,
    fill: 'rgba(255, 255, 255, 0.2)',
    stroke: 'none',
    opacity: 0.8
  })
  
  // Head
  parts.push({
    type: 'ellipse',
    cx: cx,
    cy: headY,
    rx: headSize * 3.5,
    ry: headSize * 3,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 3,
    opacity: 1
  })
  
  // Head shading
  parts.push({
    type: 'ellipse',
    cx: cx - headSize * 1.5,
    cy: headY - headSize * 0.5,
    rx: headSize * 2,
    ry: headSize * 1.5,
    fill: 'rgba(255, 255, 255, 0.2)',
    stroke: 'none',
    opacity: 0.8
  })
  
  // Ears (round)
  const earLeftX = cx - headSize * 2.5
  const earLeftY = headY - headSize * 2
  parts.push({
    type: 'ellipse',
    cx: earLeftX,
    cy: earLeftY,
    rx: earSizeScaled * 2.5,
    ry: earSizeScaled * 2,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 1
  })
  
  parts.push({
    type: 'ellipse',
    cx: cx + headSize * 2.5,
    cy: earLeftY,
    rx: earSizeScaled * 2.5,
    ry: earSizeScaled * 2,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 1
  })
  
  // Arms
  const armLeftX = cx - bodySize * 3.5
  const armLeftY = bodyY - bodySize * 0.5
  parts.push({
    type: 'ellipse',
    cx: armLeftX,
    cy: armLeftY,
    rx: armWidth * 3,
    ry: armLength * 3.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  parts.push({
    type: 'ellipse',
    cx: cx + bodySize * 3.5,
    cy: armLeftY,
    rx: armWidth * 3,
    ry: armLength * 3.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  // Legs
  const legLeftX = cx - bodySize * 1.8
  const legLeftY = bodyY + bodySize * 2.5
  parts.push({
    type: 'ellipse',
    cx: legLeftX,
    cy: legLeftY,
    rx: legWidth * 2.8,
    ry: legLength * 3.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  parts.push({
    type: 'ellipse',
    cx: cx + bodySize * 1.8,
    cy: legLeftY,
    rx: legWidth * 2.8,
    ry: legLength * 3.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  // Eyes
  const eyeY = headY + headSize * 0.5
  parts.push({
    type: 'circle',
    cx: cx - headSize * 1.2,
    cy: eyeY,
    r: headSize * 0.8,
    fill: '#333',
    stroke: 'none',
    opacity: 1
  })
  
  parts.push({
    type: 'circle',
    cx: cx + headSize * 1.2,
    cy: eyeY,
    r: headSize * 0.8,
    fill: '#333',
    stroke: 'none',
    opacity: 1
  })
  
  // Nose
  const noseY = headY + headSize * 1.8
  parts.push({
    type: 'path',
    d: `M ${cx} ${noseY} L ${cx - headSize * 0.8} ${noseY + headSize * 1.2} L ${cx + headSize * 0.8} ${noseY + headSize * 1.2} Z`,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 1
  })
  
  return createModel(parts, svgWidth, svgHeight)
}

// Generate Cat Model (pointed ears, tail visible)
function generateCatModel(cx, cy, baseSize, headRatio, limbLength, bodyRatio, earSize, mainColor, accentColor, svgWidth, svgHeight) {
  const parts = []
  const bodySize = baseSize
  const headSize = bodySize * headRatio
  const armLength = bodySize * 0.35 * Math.max(0.5, Math.min(1.5, limbLength))
  const armWidth = bodySize * 0.22
  const legLength = bodySize * 0.45 * Math.max(0.5, Math.min(1.5, limbLength))
  const legWidth = bodySize * 0.25
  const earSizeScaled = headSize * 0.4 * Math.max(0.6, Math.min(1.2, earSize))
  
  const bodyY = cy + bodySize * 2
  const headY = bodyY - bodySize * 3.5
  
  // Body (slightly more elongated)
  parts.push({
    type: 'ellipse',
    cx: cx,
    cy: bodyY,
    rx: bodySize * 3.5 * bodyRatio,
    ry: bodySize * 2.8,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 3,
    opacity: 1
  })
  
  // Head
  parts.push({
    type: 'ellipse',
    cx: cx,
    cy: headY,
    rx: headSize * 3.2,
    ry: headSize * 2.8,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 3,
    opacity: 1
  })
  
  // Pointed ears (triangular)
  const earLeftX = cx - headSize * 2.2
  const earLeftY = headY - headSize * 2.2
  parts.push({
    type: 'path',
    d: `M ${earLeftX} ${earLeftY + earSizeScaled * 2} L ${earLeftX - earSizeScaled * 1.5} ${earLeftY} L ${earLeftX + earSizeScaled * 1.5} ${earLeftY} Z`,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 1
  })
  
  parts.push({
    type: 'path',
    d: `M ${cx + headSize * 2.2} ${earLeftY + earSizeScaled * 2} L ${cx + headSize * 2.2 - earSizeScaled * 1.5} ${earLeftY} L ${cx + headSize * 2.2 + earSizeScaled * 1.5} ${earLeftY} Z`,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 1
  })
  
  // Arms
  const armLeftX = cx - bodySize * 3.2
  const armLeftY = bodyY - bodySize * 0.5
  parts.push({
    type: 'ellipse',
    cx: armLeftX,
    cy: armLeftY,
    rx: armWidth * 3,
    ry: armLength * 3.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  parts.push({
    type: 'ellipse',
    cx: cx + bodySize * 3.2,
    cy: armLeftY,
    rx: armWidth * 3,
    ry: armLength * 3.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  // Legs
  const legLeftX = cx - bodySize * 1.5
  const legLeftY = bodyY + bodySize * 2.5
  parts.push({
    type: 'ellipse',
    cx: legLeftX,
    cy: legLeftY,
    rx: legWidth * 2.5,
    ry: legLength * 3.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  parts.push({
    type: 'ellipse',
    cx: cx + bodySize * 1.5,
    cy: legLeftY,
    rx: legWidth * 2.5,
    ry: legLength * 3.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  // Tail (curved, visible from front)
  const tailX = cx + bodySize * 3
  const tailY = bodyY - bodySize * 1
  parts.push({
    type: 'path',
    d: `M ${tailX} ${tailY} Q ${tailX + bodySize * 1.5} ${tailY - bodySize * 2} ${tailX} ${tailY - bodySize * 3}`,
    fill: 'none',
    stroke: mainColor,
    strokeWidth: bodySize * 0.8,
    strokeLinecap: 'round',
    opacity: 0.8
  })
  
  // Eyes (almond-shaped)
  const eyeY = headY + headSize * 0.5
  parts.push({
    type: 'ellipse',
    cx: cx - headSize * 1.1,
    cy: eyeY,
    rx: headSize * 0.9,
    ry: headSize * 0.5,
    fill: '#333',
    stroke: 'none',
    opacity: 1
  })
  
  parts.push({
    type: 'ellipse',
    cx: cx + headSize * 1.1,
    cy: eyeY,
    rx: headSize * 0.9,
    ry: headSize * 0.5,
    fill: '#333',
    stroke: 'none',
    opacity: 1
  })
  
  // Nose (small triangle)
  const noseY = headY + headSize * 1.6
  parts.push({
    type: 'path',
    d: `M ${cx} ${noseY} L ${cx - headSize * 0.6} ${noseY + headSize * 1} L ${cx + headSize * 0.6} ${noseY + headSize * 1} Z`,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 1
  })
  
  return createModel(parts, svgWidth, svgHeight)
}

// Generate Dog Model (floppy ears, snout)
function generateDogModel(cx, cy, baseSize, headRatio, limbLength, bodyRatio, earSize, mainColor, accentColor, svgWidth, svgHeight) {
  const parts = []
  const bodySize = baseSize
  const headSize = bodySize * headRatio
  const armLength = bodySize * 0.4 * Math.max(0.5, Math.min(1.5, limbLength))
  const armWidth = bodySize * 0.25
  const legLength = bodySize * 0.5 * Math.max(0.5, Math.min(1.5, limbLength))
  const legWidth = bodySize * 0.3
  const earSizeScaled = headSize * 0.5 * Math.max(0.6, Math.min(1.2, earSize))
  
  const bodyY = cy + bodySize * 2
  const headY = bodyY - bodySize * 3.5
  
  // Body
  parts.push({
    type: 'ellipse',
    cx: cx,
    cy: bodyY,
    rx: bodySize * 4 * bodyRatio,
    ry: bodySize * 3,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 3,
    opacity: 1
  })
  
  // Head
  parts.push({
    type: 'ellipse',
    cx: cx,
    cy: headY,
    rx: headSize * 3.8,
    ry: headSize * 3.2,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 3,
    opacity: 1
  })
  
  // Snout (protruding)
  const snoutY = headY + headSize * 2
  parts.push({
    type: 'ellipse',
    cx: cx,
    cy: snoutY,
    rx: headSize * 1.5,
    ry: headSize * 1.2,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  // Floppy ears (hanging down)
  const earLeftX = cx - headSize * 2.5
  const earLeftY = headY + headSize * 0.5
  parts.push({
    type: 'ellipse',
    cx: earLeftX,
    cy: earLeftY,
    rx: earSizeScaled * 2,
    ry: earSizeScaled * 3,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 1,
    transform: `rotate(-20 ${earLeftX} ${earLeftY})`
  })
  
  parts.push({
    type: 'ellipse',
    cx: cx + headSize * 2.5,
    cy: earLeftY,
    rx: earSizeScaled * 2,
    ry: earSizeScaled * 3,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 1,
    transform: `rotate(20 ${cx + headSize * 2.5} ${earLeftY})`
  })
  
  // Arms
  const armLeftX = cx - bodySize * 3.5
  const armLeftY = bodyY - bodySize * 0.5
  parts.push({
    type: 'ellipse',
    cx: armLeftX,
    cy: armLeftY,
    rx: armWidth * 3,
    ry: armLength * 3.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  parts.push({
    type: 'ellipse',
    cx: cx + bodySize * 3.5,
    cy: armLeftY,
    rx: armWidth * 3,
    ry: armLength * 3.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  // Legs
  const legLeftX = cx - bodySize * 1.8
  const legLeftY = bodyY + bodySize * 2.5
  parts.push({
    type: 'ellipse',
    cx: legLeftX,
    cy: legLeftY,
    rx: legWidth * 2.8,
    ry: legLength * 3.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  parts.push({
    type: 'ellipse',
    cx: cx + bodySize * 1.8,
    cy: legLeftY,
    rx: legWidth * 2.8,
    ry: legLength * 3.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  // Eyes
  const eyeY = headY + headSize * 0.3
  parts.push({
    type: 'circle',
    cx: cx - headSize * 1.3,
    cy: eyeY,
    r: headSize * 0.7,
    fill: '#333',
    stroke: 'none',
    opacity: 1
  })
  
  parts.push({
    type: 'circle',
    cx: cx + headSize * 1.3,
    cy: eyeY,
    r: headSize * 0.7,
    fill: '#333',
    stroke: 'none',
    opacity: 1
  })
  
  // Nose (on snout)
  parts.push({
    type: 'ellipse',
    cx: cx,
    cy: snoutY,
    rx: headSize * 0.6,
    ry: headSize * 0.5,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 1
  })
  
  return createModel(parts, svgWidth, svgHeight)
}

// Generate Rabbit Model (long ears, puff tail)
function generateRabbitModel(cx, cy, baseSize, headRatio, limbLength, bodyRatio, earSize, mainColor, accentColor, svgWidth, svgHeight) {
  const parts = []
  const bodySize = baseSize
  const headSize = bodySize * headRatio
  const armLength = bodySize * 0.35 * Math.max(0.5, Math.min(1.5, limbLength))
  const armWidth = bodySize * 0.22
  const legLength = bodySize * 0.45 * Math.max(0.5, Math.min(1.5, limbLength))
  const legWidth = bodySize * 0.25
  const earSizeScaled = headSize * 0.8 * Math.max(0.7, Math.min(1.3, earSize)) // Long ears
  
  const bodyY = cy + bodySize * 2
  const headY = bodyY - bodySize * 3.5
  
  // Body
  parts.push({
    type: 'ellipse',
    cx: cx,
    cy: bodyY,
    rx: bodySize * 3.5 * bodyRatio,
    ry: bodySize * 2.8,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 3,
    opacity: 1
  })
  
  // Head
  parts.push({
    type: 'ellipse',
    cx: cx,
    cy: headY,
    rx: headSize * 3,
    ry: headSize * 2.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 3,
    opacity: 1
  })
  
  // Long ears (vertical)
  const earLeftX = cx - headSize * 1.8
  const earTopY = headY - headSize * 2.5
  parts.push({
    type: 'ellipse',
    cx: earLeftX,
    cy: earTopY - earSizeScaled * 2,
    rx: earSizeScaled * 1.2,
    ry: earSizeScaled * 3,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 1
  })
  
  parts.push({
    type: 'ellipse',
    cx: cx + headSize * 1.8,
    cy: earTopY - earSizeScaled * 2,
    rx: earSizeScaled * 1.2,
    ry: earSizeScaled * 3,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 1
  })
  
  // Arms
  const armLeftX = cx - bodySize * 3.2
  const armLeftY = bodyY - bodySize * 0.5
  parts.push({
    type: 'ellipse',
    cx: armLeftX,
    cy: armLeftY,
    rx: armWidth * 3,
    ry: armLength * 3.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  parts.push({
    type: 'ellipse',
    cx: cx + bodySize * 3.2,
    cy: armLeftY,
    rx: armWidth * 3,
    ry: armLength * 3.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  // Legs
  const legLeftX = cx - bodySize * 1.5
  const legLeftY = bodyY + bodySize * 2.5
  parts.push({
    type: 'ellipse',
    cx: legLeftX,
    cy: legLeftY,
    rx: legWidth * 2.5,
    ry: legLength * 3.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  parts.push({
    type: 'ellipse',
    cx: cx + bodySize * 1.5,
    cy: legLeftY,
    rx: legWidth * 2.5,
    ry: legLength * 3.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  // Puff tail
  const tailX = cx + bodySize * 2.5
  const tailY = bodyY - bodySize * 0.5
  parts.push({
    type: 'circle',
    cx: tailX,
    cy: tailY,
    r: bodySize * 1.2,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 1
  })
  
  // Eyes
  const eyeY = headY + headSize * 0.4
  parts.push({
    type: 'circle',
    cx: cx - headSize * 1,
    cy: eyeY,
    r: headSize * 0.6,
    fill: '#333',
    stroke: 'none',
    opacity: 1
  })
  
  parts.push({
    type: 'circle',
    cx: cx + headSize * 1,
    cy: eyeY,
    r: headSize * 0.6,
    fill: '#333',
    stroke: 'none',
    opacity: 1
  })
  
  // Nose
  const noseY = headY + headSize * 1.4
  parts.push({
    type: 'ellipse',
    cx: cx,
    cy: noseY,
    rx: headSize * 0.5,
    ry: headSize * 0.4,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 1
  })
  
  return createModel(parts, svgWidth, svgHeight)
}

// Generate Bird Model (beak, wings)
function generateBirdModel(cx, cy, baseSize, headRatio, limbLength, bodyRatio, earSize, mainColor, accentColor, svgWidth, svgHeight) {
  const parts = []
  const bodySize = baseSize
  const headSize = bodySize * headRatio
  const wingSize = bodySize * 0.6 * Math.max(0.5, Math.min(1.5, limbLength))
  const legLength = bodySize * 0.3 * Math.max(0.5, Math.min(1.5, limbLength))
  const legWidth = bodySize * 0.15
  
  const bodyY = cy + bodySize * 2
  const headY = bodyY - bodySize * 3
  
  // Body (oval)
  parts.push({
    type: 'ellipse',
    cx: cx,
    cy: bodyY,
    rx: bodySize * 3 * bodyRatio,
    ry: bodySize * 2.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 3,
    opacity: 1
  })
  
  // Head (smaller)
  parts.push({
    type: 'ellipse',
    cx: cx,
    cy: headY,
    rx: headSize * 2.5,
    ry: headSize * 2.2,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 3,
    opacity: 1
  })
  
  // Beak (triangular)
  const beakY = headY + headSize * 1.5
  parts.push({
    type: 'path',
    d: `M ${cx} ${beakY} L ${cx - headSize * 0.8} ${beakY + headSize * 1.2} L ${cx + headSize * 0.8} ${beakY + headSize * 1.2} Z`,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 1
  })
  
  // Wings
  const wingLeftX = cx - bodySize * 2.5
  const wingY = bodyY - bodySize * 0.5
  parts.push({
    type: 'ellipse',
    cx: wingLeftX,
    cy: wingY,
    rx: wingSize * 2.5,
    ry: wingSize * 1.5,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1,
    transform: `rotate(-15 ${wingLeftX} ${wingY})`
  })
  
  parts.push({
    type: 'ellipse',
    cx: cx + bodySize * 2.5,
    cy: wingY,
    rx: wingSize * 2.5,
    ry: wingSize * 1.5,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1,
    transform: `rotate(15 ${cx + bodySize * 2.5} ${wingY})`
  })
  
  // Legs (thin)
  const legLeftX = cx - bodySize * 1
  const legLeftY = bodyY + bodySize * 2
  parts.push({
    type: 'ellipse',
    cx: legLeftX,
    cy: legLeftY,
    rx: legWidth * 2,
    ry: legLength * 3,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 1
  })
  
  parts.push({
    type: 'ellipse',
    cx: cx + bodySize * 1,
    cy: legLeftY,
    rx: legWidth * 2,
    ry: legLength * 3,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 1
  })
  
  // Eyes
  const eyeY = headY + headSize * 0.5
  parts.push({
    type: 'circle',
    cx: cx - headSize * 0.8,
    cy: eyeY,
    r: headSize * 0.5,
    fill: '#333',
    stroke: 'none',
    opacity: 1
  })
  
  parts.push({
    type: 'circle',
    cx: cx + headSize * 0.8,
    cy: eyeY,
    r: headSize * 0.5,
    fill: '#333',
    stroke: 'none',
    opacity: 1
  })
  
  return createModel(parts, svgWidth, svgHeight)
}

// Generate Owl Model (large head, big eyes, wings)
function generateOwlModel(cx, cy, baseSize, headRatio, limbLength, bodyRatio, earSize, mainColor, accentColor, svgWidth, svgHeight) {
  const parts = []
  const bodySize = baseSize
  const headSize = bodySize * (headRatio + 0.2) // Larger head
  const wingSize = bodySize * 0.5 * Math.max(0.5, Math.min(1.5, limbLength))
  const legLength = bodySize * 0.25 * Math.max(0.5, Math.min(1.5, limbLength))
  const legWidth = bodySize * 0.15
  
  const bodyY = cy + bodySize * 2
  const headY = bodyY - bodySize * 3.5
  
  // Body
  parts.push({
    type: 'ellipse',
    cx: cx,
    cy: bodyY,
    rx: bodySize * 3.5 * bodyRatio,
    ry: bodySize * 2.8,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 3,
    opacity: 1
  })
  
  // Large head
  parts.push({
    type: 'ellipse',
    cx: cx,
    cy: headY,
    rx: headSize * 4,
    ry: headSize * 3.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 3,
    opacity: 1
  })
  
  // Large eyes
  const eyeY = headY + headSize * 0.5
  parts.push({
    type: 'circle',
    cx: cx - headSize * 1.2,
    cy: eyeY,
    r: headSize * 1.2,
    fill: '#333',
    stroke: 'none',
    opacity: 1
  })
  
  parts.push({
    type: 'circle',
    cx: cx + headSize * 1.2,
    cy: eyeY,
    r: headSize * 1.2,
    fill: '#333',
    stroke: 'none',
    opacity: 1
  })
  
  // Eye highlights
  parts.push({
    type: 'circle',
    cx: cx - headSize * 0.8,
    cy: eyeY - headSize * 0.3,
    r: headSize * 0.4,
    fill: '#fff',
    stroke: 'none',
    opacity: 0.9
  })
  
  parts.push({
    type: 'circle',
    cx: cx + headSize * 0.8,
    cy: eyeY - headSize * 0.3,
    r: headSize * 0.4,
    fill: '#fff',
    stroke: 'none',
    opacity: 0.9
  })
  
  // Beak
  const beakY = headY + headSize * 2
  parts.push({
    type: 'path',
    d: `M ${cx} ${beakY} L ${cx - headSize * 0.6} ${beakY + headSize * 0.8} L ${cx + headSize * 0.6} ${beakY + headSize * 0.8} Z`,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 1
  })
  
  // Wings
  const wingLeftX = cx - bodySize * 2.5
  const wingY = bodyY - bodySize * 0.5
  parts.push({
    type: 'ellipse',
    cx: wingLeftX,
    cy: wingY,
    rx: wingSize * 2.5,
    ry: wingSize * 1.8,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1,
    transform: `rotate(-10 ${wingLeftX} ${wingY})`
  })
  
  parts.push({
    type: 'ellipse',
    cx: cx + bodySize * 2.5,
    cy: wingY,
    rx: wingSize * 2.5,
    ry: wingSize * 1.8,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1,
    transform: `rotate(10 ${cx + bodySize * 2.5} ${wingY})`
  })
  
  // Legs
  const legLeftX = cx - bodySize * 1
  const legLeftY = bodyY + bodySize * 2
  parts.push({
    type: 'ellipse',
    cx: legLeftX,
    cy: legLeftY,
    rx: legWidth * 2,
    ry: legLength * 3,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 1
  })
  
  parts.push({
    type: 'ellipse',
    cx: cx + bodySize * 1,
    cy: legLeftY,
    rx: legWidth * 2,
    ry: legLength * 3,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 1
  })
  
  return createModel(parts, svgWidth, svgHeight)
}

// Generate Penguin Model (distinctive black and white, flippers)
function generatePenguinModel(cx, cy, baseSize, headRatio, limbLength, bodyRatio, earSize, mainColor, accentColor, svgWidth, svgHeight) {
  const parts = []
  const bodySize = baseSize
  const headSize = bodySize * headRatio
  const flipperSize = bodySize * 0.5 * Math.max(0.5, Math.min(1.5, limbLength))
  const legLength = bodySize * 0.3 * Math.max(0.5, Math.min(1.5, limbLength))
  const legWidth = bodySize * 0.2
  
  const bodyY = cy + bodySize * 2
  const headY = bodyY - bodySize * 3
  
  // Body (oval, white belly)
  parts.push({
    type: 'ellipse',
    cx: cx,
    cy: bodyY,
    rx: bodySize * 3.5 * bodyRatio,
    ry: bodySize * 3,
    fill: '#333',
    stroke: '#333',
    strokeWidth: 3,
    opacity: 1
  })
  
  // White belly
  parts.push({
    type: 'ellipse',
    cx: cx,
    cy: bodyY + bodySize * 0.5,
    rx: bodySize * 2.5 * bodyRatio,
    ry: bodySize * 2,
    fill: '#fff',
    stroke: 'none',
    opacity: 1
  })
  
  // Head (black)
  parts.push({
    type: 'ellipse',
    cx: cx,
    cy: headY,
    rx: headSize * 3.2,
    ry: headSize * 2.8,
    fill: '#333',
    stroke: '#333',
    strokeWidth: 3,
    opacity: 1
  })
  
  // White face patch
  parts.push({
    type: 'ellipse',
    cx: cx,
    cy: headY + headSize * 0.5,
    rx: headSize * 2,
    ry: headSize * 1.5,
    fill: '#fff',
    stroke: 'none',
    opacity: 1
  })
  
  // Beak
  const beakY = headY + headSize * 1.8
  parts.push({
    type: 'path',
    d: `M ${cx} ${beakY} L ${cx - headSize * 0.6} ${beakY + headSize * 0.8} L ${cx + headSize * 0.6} ${beakY + headSize * 0.8} Z`,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 1
  })
  
  // Flippers (wings)
  const flipperLeftX = cx - bodySize * 2.8
  const flipperY = bodyY - bodySize * 0.5
  parts.push({
    type: 'ellipse',
    cx: flipperLeftX,
    cy: flipperY,
    rx: flipperSize * 2,
    ry: flipperSize * 1.2,
    fill: '#333',
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1,
    transform: `rotate(-20 ${flipperLeftX} ${flipperY})`
  })
  
  parts.push({
    type: 'ellipse',
    cx: cx + bodySize * 2.8,
    cy: flipperY,
    rx: flipperSize * 2,
    ry: flipperSize * 1.2,
    fill: '#333',
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1,
    transform: `rotate(20 ${cx + bodySize * 2.8} ${flipperY})`
  })
  
  // Feet (webbed)
  const footLeftX = cx - bodySize * 1.2
  const footY = bodyY + bodySize * 2.5
  parts.push({
    type: 'ellipse',
    cx: footLeftX,
    cy: footY,
    rx: legWidth * 3,
    ry: legLength * 2,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 1
  })
  
  parts.push({
    type: 'ellipse',
    cx: cx + bodySize * 1.2,
    cy: footY,
    rx: legWidth * 3,
    ry: legLength * 2,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 1
  })
  
  // Eyes
  const eyeY = headY + headSize * 0.8
  parts.push({
    type: 'circle',
    cx: cx - headSize * 1,
    cy: eyeY,
    r: headSize * 0.6,
    fill: '#333',
    stroke: 'none',
    opacity: 1
  })
  
  parts.push({
    type: 'circle',
    cx: cx + headSize * 1,
    cy: eyeY,
    r: headSize * 0.6,
    fill: '#333',
    stroke: 'none',
    opacity: 1
  })
  
  return createModel(parts, svgWidth, svgHeight)
}

// Generate Elephant Model (trunk, large ears)
function generateElephantModel(cx, cy, baseSize, headRatio, limbLength, bodyRatio, earSize, mainColor, accentColor, svgWidth, svgHeight) {
  const parts = []
  const bodySize = baseSize
  const headSize = bodySize * headRatio
  const armLength = bodySize * 0.4 * Math.max(0.5, Math.min(1.5, limbLength))
  const armWidth = bodySize * 0.25
  const legLength = bodySize * 0.5 * Math.max(0.5, Math.min(1.5, limbLength))
  const legWidth = bodySize * 0.35
  const earSizeScaled = headSize * 1.2 * Math.max(0.8, Math.min(1.5, earSize)) // Large ears
  
  const bodyY = cy + bodySize * 2
  const headY = bodyY - bodySize * 3.5
  
  // Body
  parts.push({
    type: 'ellipse',
    cx: cx,
    cy: bodyY,
    rx: bodySize * 4.5 * bodyRatio,
    ry: bodySize * 3.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 3,
    opacity: 1
  })
  
  // Head
  parts.push({
    type: 'ellipse',
    cx: cx,
    cy: headY,
    rx: headSize * 3.5,
    ry: headSize * 3,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 3,
    opacity: 1
  })
  
  // Trunk (long, curved)
  const trunkY = headY + headSize * 2.5
  parts.push({
    type: 'path',
    d: `M ${cx} ${trunkY} Q ${cx - headSize * 0.5} ${trunkY + headSize * 2} ${cx} ${trunkY + headSize * 3.5}`,
    fill: 'none',
    stroke: mainColor,
    strokeWidth: headSize * 1.2,
    strokeLinecap: 'round',
    opacity: 1
  })
  
  // Large ears
  const earLeftX = cx - headSize * 2.5
  const earLeftY = headY - headSize * 0.5
  parts.push({
    type: 'ellipse',
    cx: earLeftX,
    cy: earLeftY,
    rx: earSizeScaled * 2.5,
    ry: earSizeScaled * 3.5,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  parts.push({
    type: 'ellipse',
    cx: cx + headSize * 2.5,
    cy: earLeftY,
    rx: earSizeScaled * 2.5,
    ry: earSizeScaled * 3.5,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  // Arms
  const armLeftX = cx - bodySize * 4
  const armLeftY = bodyY - bodySize * 0.5
  parts.push({
    type: 'ellipse',
    cx: armLeftX,
    cy: armLeftY,
    rx: armWidth * 3.5,
    ry: armLength * 3.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  parts.push({
    type: 'ellipse',
    cx: cx + bodySize * 4,
    cy: armLeftY,
    rx: armWidth * 3.5,
    ry: armLength * 3.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  // Legs (thick)
  const legLeftX = cx - bodySize * 2
  const legLeftY = bodyY + bodySize * 2.5
  parts.push({
    type: 'ellipse',
    cx: legLeftX,
    cy: legLeftY,
    rx: legWidth * 3,
    ry: legLength * 3.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  parts.push({
    type: 'ellipse',
    cx: cx + bodySize * 2,
    cy: legLeftY,
    rx: legWidth * 3,
    ry: legLength * 3.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  // Eyes
  const eyeY = headY + headSize * 0.5
  parts.push({
    type: 'circle',
    cx: cx - headSize * 1.2,
    cy: eyeY,
    r: headSize * 0.7,
    fill: '#333',
    stroke: 'none',
    opacity: 1
  })
  
  parts.push({
    type: 'circle',
    cx: cx + headSize * 1.2,
    cy: eyeY,
    r: headSize * 0.7,
    fill: '#333',
    stroke: 'none',
    opacity: 1
  })
  
  return createModel(parts, svgWidth, svgHeight)
}

// Generate Whale Model (streamlined, tail fin)
function generateWhaleModel(cx, cy, baseSize, headRatio, limbLength, bodyRatio, earSize, mainColor, accentColor, svgWidth, svgHeight) {
  const parts = []
  const bodySize = baseSize
  const finSize = bodySize * 0.4 * Math.max(0.5, Math.min(1.5, limbLength))
  
  const bodyY = cy + bodySize * 2
  
  // Large streamlined body
  parts.push({
    type: 'ellipse',
    cx: cx,
    cy: bodyY,
    rx: bodySize * 6 * bodyRatio,
    ry: bodySize * 3.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 3,
    opacity: 1
  })
  
  // Top fin
  const finTopY = bodyY - bodySize * 2
  parts.push({
    type: 'path',
    d: `M ${cx} ${finTopY} L ${cx - finSize * 1.5} ${finTopY - finSize * 2} L ${cx + finSize * 1.5} ${finTopY - finSize * 2} Z`,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  // Side fins
  const finLeftX = cx - bodySize * 4
  const finY = bodyY - bodySize * 0.5
  parts.push({
    type: 'ellipse',
    cx: finLeftX,
    cy: finY,
    rx: finSize * 1.5,
    ry: finSize * 2.5,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1,
    transform: `rotate(-30 ${finLeftX} ${finY})`
  })
  
  parts.push({
    type: 'ellipse',
    cx: cx + bodySize * 4,
    cy: finY,
    rx: finSize * 1.5,
    ry: finSize * 2.5,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1,
    transform: `rotate(30 ${cx + bodySize * 4} ${finY})`
  })
  
  // Tail fin
  const tailX = cx + bodySize * 5.5
  const tailY = bodyY
  parts.push({
    type: 'path',
    d: `M ${tailX} ${tailY} L ${tailX + finSize * 2} ${tailY - finSize * 2.5} L ${tailX + finSize * 2} ${tailY + finSize * 2.5} Z`,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  // Eye
  const eyeX = cx - bodySize * 3
  const eyeY = bodyY - bodySize * 0.5
  parts.push({
    type: 'circle',
    cx: eyeX,
    cy: eyeY,
    r: bodySize * 0.8,
    fill: '#333',
    stroke: 'none',
    opacity: 1
  })
  
  return createModel(parts, svgWidth, svgHeight)
}

// Generate Fox Model (pointed ears, bushy tail)
function generateFoxModel(cx, cy, baseSize, headRatio, limbLength, bodyRatio, earSize, mainColor, accentColor, svgWidth, svgHeight) {
  const parts = []
  const bodySize = baseSize
  const headSize = bodySize * headRatio
  const armLength = bodySize * 0.35 * Math.max(0.5, Math.min(1.5, limbLength))
  const armWidth = bodySize * 0.22
  const legLength = bodySize * 0.45 * Math.max(0.5, Math.min(1.5, limbLength))
  const legWidth = bodySize * 0.25
  const earSizeScaled = headSize * 0.45 * Math.max(0.6, Math.min(1.2, earSize))
  
  const bodyY = cy + bodySize * 2
  const headY = bodyY - bodySize * 3.5
  
  // Body (sleek)
  parts.push({
    type: 'ellipse',
    cx: cx,
    cy: bodyY,
    rx: bodySize * 3.5 * bodyRatio,
    ry: bodySize * 2.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 3,
    opacity: 1
  })
  
  // Head (pointed snout)
  parts.push({
    type: 'ellipse',
    cx: cx,
    cy: headY,
    rx: headSize * 3,
    ry: headSize * 2.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 3,
    opacity: 1
  })
  
  // Pointed ears
  const earLeftX = cx - headSize * 2
  const earLeftY = headY - headSize * 2
  parts.push({
    type: 'path',
    d: `M ${earLeftX} ${earLeftY + earSizeScaled * 2} L ${earLeftX - earSizeScaled * 1.2} ${earLeftY} L ${earLeftX + earSizeScaled * 1.2} ${earLeftY} Z`,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 1
  })
  
  parts.push({
    type: 'path',
    d: `M ${cx + headSize * 2} ${earLeftY + earSizeScaled * 2} L ${cx + headSize * 2 - earSizeScaled * 1.2} ${earLeftY} L ${cx + headSize * 2 + earSizeScaled * 1.2} ${earLeftY} Z`,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 1
  })
  
  // Arms
  const armLeftX = cx - bodySize * 3.2
  const armLeftY = bodyY - bodySize * 0.5
  parts.push({
    type: 'ellipse',
    cx: armLeftX,
    cy: armLeftY,
    rx: armWidth * 3,
    ry: armLength * 3.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  parts.push({
    type: 'ellipse',
    cx: cx + bodySize * 3.2,
    cy: armLeftY,
    rx: armWidth * 3,
    ry: armLength * 3.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  // Legs
  const legLeftX = cx - bodySize * 1.5
  const legLeftY = bodyY + bodySize * 2.5
  parts.push({
    type: 'ellipse',
    cx: legLeftX,
    cy: legLeftY,
    rx: legWidth * 2.5,
    ry: legLength * 3.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  parts.push({
    type: 'ellipse',
    cx: cx + bodySize * 1.5,
    cy: legLeftY,
    rx: legWidth * 2.5,
    ry: legLength * 3.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  // Bushy tail
  const tailX = cx + bodySize * 3
  const tailY = bodyY - bodySize * 1
  parts.push({
    type: 'path',
    d: `M ${tailX} ${tailY} Q ${tailX + bodySize * 2} ${tailY - bodySize * 2.5} ${tailX + bodySize * 1} ${tailY - bodySize * 4}`,
    fill: 'none',
    stroke: accentColor,
    strokeWidth: bodySize * 1.2,
    strokeLinecap: 'round',
    opacity: 0.9
  })
  
  // Eyes (almond)
  const eyeY = headY + headSize * 0.5
  parts.push({
    type: 'ellipse',
    cx: cx - headSize * 1,
    cy: eyeY,
    rx: headSize * 0.8,
    ry: headSize * 0.5,
    fill: '#333',
    stroke: 'none',
    opacity: 1
  })
  
  parts.push({
    type: 'ellipse',
    cx: cx + headSize * 1,
    cy: eyeY,
    rx: headSize * 0.8,
    ry: headSize * 0.5,
    fill: '#333',
    stroke: 'none',
    opacity: 1
  })
  
  // Nose
  const noseY = headY + headSize * 1.5
  parts.push({
    type: 'ellipse',
    cx: cx,
    cy: noseY,
    rx: headSize * 0.5,
    ry: headSize * 0.4,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 1
  })
  
  return createModel(parts, svgWidth, svgHeight)
}

// Generate Panda Model (round, black patches)
function generatePandaModel(cx, cy, baseSize, headRatio, limbLength, bodyRatio, earSize, mainColor, accentColor, svgWidth, svgHeight) {
  const parts = []
  const bodySize = baseSize
  const headSize = bodySize * headRatio
  const armLength = bodySize * 0.4 * Math.max(0.5, Math.min(1.5, limbLength))
  const armWidth = bodySize * 0.25
  const legLength = bodySize * 0.5 * Math.max(0.5, Math.min(1.5, limbLength))
  const legWidth = bodySize * 0.3
  const earSizeScaled = headSize * 0.35 * Math.max(0.6, Math.min(1.2, earSize))
  
  const bodyY = cy + bodySize * 2
  const headY = bodyY - bodySize * 3.5
  
  // Body (white)
  parts.push({
    type: 'ellipse',
    cx: cx,
    cy: bodyY,
    rx: bodySize * 4 * bodyRatio,
    ry: bodySize * 3,
    fill: '#fff',
    stroke: '#333',
    strokeWidth: 3,
    opacity: 1
  })
  
  // Black patches on body
  parts.push({
    type: 'ellipse',
    cx: cx - bodySize * 1.5,
    cy: bodyY - bodySize * 1,
    rx: bodySize * 1.5,
    ry: bodySize * 2,
    fill: '#333',
    stroke: 'none',
    opacity: 1
  })
  
  parts.push({
    type: 'ellipse',
    cx: cx + bodySize * 1.5,
    cy: bodyY - bodySize * 1,
    rx: bodySize * 1.5,
    ry: bodySize * 2,
    fill: '#333',
    stroke: 'none',
    opacity: 1
  })
  
  // Head (white)
  parts.push({
    type: 'ellipse',
    cx: cx,
    cy: headY,
    rx: headSize * 3.5,
    ry: headSize * 3,
    fill: '#fff',
    stroke: '#333',
    strokeWidth: 3,
    opacity: 1
  })
  
  // Black ear patches
  parts.push({
    type: 'ellipse',
    cx: cx - headSize * 2.5,
    cy: headY - headSize * 2,
    rx: earSizeScaled * 2.5,
    ry: earSizeScaled * 2,
    fill: '#333',
    stroke: '#333',
    strokeWidth: 2,
    opacity: 1
  })
  
  parts.push({
    type: 'ellipse',
    cx: cx + headSize * 2.5,
    cy: headY - headSize * 2,
    rx: earSizeScaled * 2.5,
    ry: earSizeScaled * 2,
    fill: '#333',
    stroke: '#333',
    strokeWidth: 2,
    opacity: 1
  })
  
  // Black eye patches
  parts.push({
    type: 'ellipse',
    cx: cx - headSize * 1.2,
    cy: headY + headSize * 0.3,
    rx: headSize * 1.2,
    ry: headSize * 0.8,
    fill: '#333',
    stroke: 'none',
    opacity: 1
  })
  
  parts.push({
    type: 'ellipse',
    cx: cx + headSize * 1.2,
    cy: headY + headSize * 0.3,
    rx: headSize * 1.2,
    ry: headSize * 0.8,
    fill: '#333',
    stroke: 'none',
    opacity: 1
  })
  
  // Eyes
  const eyeY = headY + headSize * 0.5
  parts.push({
    type: 'circle',
    cx: cx - headSize * 1.2,
    cy: eyeY,
    r: headSize * 0.4,
    fill: '#fff',
    stroke: 'none',
    opacity: 1
  })
  
  parts.push({
    type: 'circle',
    cx: cx + headSize * 1.2,
    cy: eyeY,
    r: headSize * 0.4,
    fill: '#fff',
    stroke: 'none',
    opacity: 1
  })
  
  // Arms (black)
  const armLeftX = cx - bodySize * 3.5
  const armLeftY = bodyY - bodySize * 0.5
  parts.push({
    type: 'ellipse',
    cx: armLeftX,
    cy: armLeftY,
    rx: armWidth * 3,
    ry: armLength * 3.5,
    fill: '#333',
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  parts.push({
    type: 'ellipse',
    cx: cx + bodySize * 3.5,
    cy: armLeftY,
    rx: armWidth * 3,
    ry: armLength * 3.5,
    fill: '#333',
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  // Legs (black)
  const legLeftX = cx - bodySize * 1.8
  const legLeftY = bodyY + bodySize * 2.5
  parts.push({
    type: 'ellipse',
    cx: legLeftX,
    cy: legLeftY,
    rx: legWidth * 2.8,
    ry: legLength * 3.5,
    fill: '#333',
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  parts.push({
    type: 'ellipse',
    cx: cx + bodySize * 1.8,
    cy: legLeftY,
    rx: legWidth * 2.8,
    ry: legLength * 3.5,
    fill: '#333',
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  // Nose
  const noseY = headY + headSize * 1.8
  parts.push({
    type: 'ellipse',
    cx: cx,
    cy: noseY,
    rx: headSize * 0.6,
    ry: headSize * 0.5,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 1
  })
  
  return createModel(parts, svgWidth, svgHeight)
}

// Generate Fish Model (streamlined, fins, tail)
function generateFishModel(cx, cy, baseSize, headRatio, limbLength, bodyRatio, earSize, mainColor, accentColor, svgWidth, svgHeight) {
  const parts = []
  const bodySize = baseSize
  const finSize = bodySize * 0.3 * Math.max(0.5, Math.min(1.5, limbLength))
  
  const bodyY = cy + bodySize * 2
  
  // Fish body (oval, streamlined)
  parts.push({
    type: 'ellipse',
    cx: cx,
    cy: bodyY,
    rx: bodySize * 5 * bodyRatio,
    ry: bodySize * 2.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 3,
    opacity: 1
  })
  
  // Top fin
  const finTopY = bodyY - bodySize * 1.5
  parts.push({
    type: 'path',
    d: `M ${cx} ${finTopY} L ${cx - finSize * 1.5} ${finTopY - finSize * 2} L ${cx + finSize * 1.5} ${finTopY - finSize * 2} Z`,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  // Bottom fin
  const finBottomY = bodyY + bodySize * 1.5
  parts.push({
    type: 'path',
    d: `M ${cx} ${finBottomY} L ${cx - finSize * 1.2} ${finBottomY + finSize * 1.8} L ${cx + finSize * 1.2} ${finBottomY + finSize * 1.8} Z`,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  // Side fins
  const finLeftX = cx - bodySize * 3.5
  const finY = bodyY
  parts.push({
    type: 'ellipse',
    cx: finLeftX,
    cy: finY,
    rx: finSize * 1.2,
    ry: finSize * 2,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1,
    transform: `rotate(-20 ${finLeftX} ${finY})`
  })
  
  parts.push({
    type: 'ellipse',
    cx: cx + bodySize * 3.5,
    cy: finY,
    rx: finSize * 1.2,
    ry: finSize * 2,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1,
    transform: `rotate(20 ${cx + bodySize * 3.5} ${finY})`
  })
  
  // Tail fin
  const tailX = cx + bodySize * 4.5
  const tailY = bodyY
  parts.push({
    type: 'path',
    d: `M ${tailX} ${tailY} L ${tailX + finSize * 2.5} ${tailY - finSize * 2} L ${tailX + finSize * 2.5} ${tailY + finSize * 2} Z`,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  // Eye
  const eyeX = cx - bodySize * 2.5
  const eyeY = bodyY - bodySize * 0.3
  parts.push({
    type: 'circle',
    cx: eyeX,
    cy: eyeY,
    r: bodySize * 0.8,
    fill: '#333',
    stroke: 'none',
    opacity: 1
  })
  
  // Eye highlight
  parts.push({
    type: 'circle',
    cx: eyeX - bodySize * 0.2,
    cy: eyeY - bodySize * 0.2,
    r: bodySize * 0.3,
    fill: '#fff',
    stroke: 'none',
    opacity: 0.9
  })
  
  return createModel(parts, svgWidth, svgHeight)
}
