// 3D Animal Pattern Generation System
// Generates pattern pieces for felted animals from data

// Animal templates with parametric shapes
export const animalTemplates = [
  { id: 'bear', name: 'Bear', icon: '🐻', description: 'Cuddly teddy bear', parts: ['body', 'head', 'ears', 'arms', 'legs'] },
  { id: 'cat', name: 'Cat', icon: '🐱', description: 'Friendly feline', parts: ['body', 'head', 'ears', 'tail', 'legs'] },
  { id: 'dog', name: 'Dog', icon: '🐶', description: 'Lovable puppy', parts: ['body', 'head', 'ears', 'tail', 'legs', 'snout'] },
  { id: 'fish', name: 'Fish', icon: '🐠', description: 'Colorful fish', parts: ['body', 'fins', 'tail'] },
  { id: 'rabbit', name: 'Rabbit', icon: '🐰', description: 'Fluffy bunny', parts: ['body', 'head', 'ears', 'tail', 'legs'] },
  { id: 'bird', name: 'Bird', icon: '🐦', description: 'Chirpy bird', parts: ['body', 'head', 'wings', 'beak', 'tail'] },
  { id: 'owl', name: 'Owl', icon: '🦉', description: 'Wise owl', parts: ['body', 'head', 'wings', 'beak', 'eyes'] },
  { id: 'penguin', name: 'Penguin', icon: '🐧', description: 'Adorable penguin', parts: ['body', 'head', 'wings', 'beak', 'feet'] },
  { id: 'elephant', name: 'Elephant', icon: '🐘', description: 'Gentle giant', parts: ['body', 'head', 'trunk', 'ears', 'legs', 'tail'] },
  { id: 'whale', name: 'Whale', icon: '🐋', description: 'Ocean giant', parts: ['body', 'fins', 'tail'] },
  { id: 'fox', name: 'Fox', icon: '🦊', description: 'Clever fox', parts: ['body', 'head', 'ears', 'tail', 'legs'] },
  { id: 'panda', name: 'Panda', icon: '🐼', description: 'Cute panda', parts: ['body', 'head', 'ears', 'arms', 'legs'] }
]

// Generate 3D animal pattern from data
export function generateAnimal3DPattern(animalId, data, colors, fractalParams) {
  try {
    const template = animalTemplates.find(a => a.id === animalId)
    if (!template) {
      console.error('Animal template not found:', animalId)
      return null
    }

    if (!data || !data.data || data.data.length === 0) {
      console.error('Invalid data provided')
      return null
    }

    if (!colors || !Array.isArray(colors) || colors.length === 0) {
      console.error('Invalid colors provided')
      return null
    }

    if (!fractalParams) {
      console.error('Invalid fractalParams provided')
      return null
    }

    // Extract parameters from data
    const params = dataToAnimalParams(data, fractalParams)
    
    // Generate pattern pieces based on animal type
    let patternPieces = {}
    
    switch (animalId) {
    case 'bear':
      patternPieces = generateBearPattern(params, colors)
      break
    case 'cat':
      patternPieces = generateCatPattern(params, colors)
      break
    case 'dog':
      patternPieces = generateDogPattern(params, colors)
      break
    case 'fish':
      patternPieces = generateFishPattern(params, colors)
      break
    case 'rabbit':
      patternPieces = generateRabbitPattern(params, colors)
      break
    case 'bird':
      patternPieces = generateBirdPattern(params, colors)
      break
    case 'owl':
      patternPieces = generateOwlPattern(params, colors)
      break
    case 'penguin':
      patternPieces = generatePenguinPattern(params, colors)
      break
    case 'elephant':
      patternPieces = generateElephantPattern(params, colors)
      break
    case 'whale':
      patternPieces = generateWhalePattern(params, colors)
      break
    case 'fox':
      patternPieces = generateFoxPattern(params, colors)
      break
    case 'panda':
      patternPieces = generatePandaPattern(params, colors)
      break
    default:
      patternPieces = generateBearPattern(params, colors)
    }
    
    // Validate pattern pieces were generated
    if (!patternPieces || Object.keys(patternPieces).length === 0) {
      console.error('Pattern pieces not generated for animal:', animalId)
      return null
    }
    
    const assemblyInstructions = generateAssemblyInstructions(animalId, params)
    const measurements = calculateMeasurements(params)
    
    return {
      animalId,
      animalName: template.name,
      patternPieces,
      assemblyInstructions,
      measurements,
      colors
    }
  } catch (error) {
    console.error('Error in generateAnimal3DPattern:', error)
    console.error('Error details:', { animalId, hasData: !!data, hasColors: !!colors, hasFractalParams: !!fractalParams })
    return null
  }
}

// Map data to animal parameters
export function dataToAnimalParams(data, fractalParams) {
  const { columnAverages, dataFingerprint, rowCount } = fractalParams || {}
  const fingerprintFactor = dataFingerprint ? (dataFingerprint % 1000) / 1000 : 0.5
  
  // Base size from data (5cm to 25cm)
  const baseSize = 5 + ((columnAverages?.[0] || 0.5) * 0.7 + fingerprintFactor * 0.3) * 20
  
  // Head to body ratio (0.3 to 0.7)
  const headRatio = 0.3 + ((columnAverages?.[1] || 0.5) * 0.7 + fingerprintFactor * 0.3) * 0.4
  
  // Limb length (0.3x to 2.5x body) - MORE DRAMATIC variation for arms/legs
  const limbLength = 0.3 + ((columnAverages?.[2] || 0.5) * 0.7 + fingerprintFactor * 0.3) * 2.2
  
  // Roundness/curvature (0.5 to 1.5)
  const roundness = 0.5 + ((columnAverages?.[3] || 0.5) * 0.7 + fingerprintFactor * 0.3) * 1.0
  
  // Body width to height ratio (0.6 to 1.4)
  const bodyRatio = 0.6 + ((columnAverages?.[4] || 0.5) * 0.7 + fingerprintFactor * 0.3) * 0.8
  
  // Ear size (0.5x to 1.5x head)
  const earSize = 0.5 + ((columnAverages?.[5] || 0.5) * 0.7 + fingerprintFactor * 0.3) * 1.0
  
  // Tail length (0.3x to 2.0x body)
  const tailLength = 0.3 + ((columnAverages?.[6] || 0.5) * 0.7 + fingerprintFactor * 0.3) * 1.7
  
  return {
    baseSize,
    headRatio,
    limbLength,
    roundness,
    bodyRatio,
    earSize,
    tailLength,
    fingerprintFactor
  }
}

// Helper function to get simplified colors (1-2 colors only)
function getSimplifiedColors(colors) {
  const mainColor = colors && colors[0] ? colors[0] : '#FF6B6B'
  const accentColor = colors && colors[1] ? colors[1] : mainColor
  return { mainColor, accentColor }
}

// Generate Bear Pattern
function generateBearPattern(params, colors) {
  const { baseSize, headRatio, limbLength, roundness, bodyRatio, earSize } = params
  const bodySize = baseSize
  const headSize = bodySize * headRatio
  const earSize_actual = headSize * earSize
  
  // Use simplified colors - just 1-2 colors (don't change colors much)
  const { mainColor, accentColor } = getSimplifiedColors(colors)
  
  // Make arm/leg size adjustments more dramatic based on limbLength
  const armLength = bodySize * 0.4 * limbLength // More noticeable variation
  const legLength = bodySize * 0.5 * limbLength // More noticeable variation
  
  return {
    body: {
      front: generateOvalPattern(bodySize, bodySize * bodyRatio, roundness, mainColor),
      back: generateOvalPattern(bodySize, bodySize * bodyRatio, roundness, mainColor)
    },
    head: {
      front: generateOvalPattern(headSize, headSize * 0.9, roundness, mainColor),
      back: generateOvalPattern(headSize, headSize * 0.9, roundness, mainColor)
    },
    ears: {
      front: generateEarPattern(earSize_actual, roundness, accentColor),
      back: generateEarPattern(earSize_actual, roundness, accentColor)
    },
    arms: {
      front: generateLimbPattern(armLength, bodySize * 0.3, roundness, mainColor),
      back: generateLimbPattern(armLength, bodySize * 0.3, roundness, mainColor)
    },
    legs: {
      front: generateLimbPattern(legLength, bodySize * 0.35, roundness, mainColor),
      back: generateLimbPattern(legLength, bodySize * 0.35, roundness, mainColor)
    }
  }
}

// Generate Cat Pattern
function generateCatPattern(params, colors) {
  const { baseSize, headRatio, limbLength, roundness, bodyRatio, earSize, tailLength } = params
  const bodySize = baseSize
  const headSize = bodySize * headRatio
  
  // Use simplified colors - just 1-2 colors
  const { mainColor, accentColor } = getSimplifiedColors(colors)
  
  // Make leg size adjustments more dramatic
  const legLength = bodySize * 0.5 * limbLength
  
  return {
    body: {
      front: generateOvalPattern(bodySize, bodySize * bodyRatio, roundness, mainColor),
      back: generateOvalPattern(bodySize, bodySize * bodyRatio, roundness, mainColor)
    },
    head: {
      front: generateOvalPattern(headSize, headSize * 0.85, roundness, mainColor),
      back: generateOvalPattern(headSize, headSize * 0.85, roundness, mainColor)
    },
    ears: {
      front: generatePointedEarPattern(headSize * 0.5 * earSize, roundness, accentColor),
      back: generatePointedEarPattern(headSize * 0.5 * earSize, roundness, accentColor)
    },
    tail: {
      front: generateTailPattern(bodySize * tailLength, bodySize * 0.15, roundness, mainColor),
      back: generateTailPattern(bodySize * tailLength, bodySize * 0.15, roundness, mainColor)
    },
    legs: {
      front: generateLimbPattern(legLength, bodySize * 0.3, roundness, mainColor),
      back: generateLimbPattern(legLength, bodySize * 0.3, roundness, mainColor)
    }
  }
}

// Generate Dog Pattern
function generateDogPattern(params, colors) {
  const { baseSize, headRatio, limbLength, roundness, bodyRatio, earSize, tailLength } = params
  const bodySize = baseSize
  const headSize = bodySize * headRatio
  
  const { mainColor, accentColor } = getSimplifiedColors(colors)
  const legLength = bodySize * 0.5 * limbLength
  
  return {
    body: {
      front: generateOvalPattern(bodySize, bodySize * bodyRatio, roundness, mainColor),
      back: generateOvalPattern(bodySize, bodySize * bodyRatio, roundness, mainColor)
    },
    head: {
      front: generateOvalPattern(headSize, headSize * 0.9, roundness, mainColor),
      back: generateOvalPattern(headSize, headSize * 0.9, roundness, mainColor)
    },
    ears: {
      front: generateFlopEarPattern(headSize * 0.6 * earSize, roundness, accentColor),
      back: generateFlopEarPattern(headSize * 0.6 * earSize, roundness, accentColor)
    },
    snout: {
      front: generateSnoutPattern(headSize * 0.4, roundness, mainColor),
      back: generateSnoutPattern(headSize * 0.4, roundness, mainColor)
    },
    tail: {
      front: generateTailPattern(bodySize * tailLength, bodySize * 0.2, roundness, mainColor),
      back: generateTailPattern(bodySize * tailLength, bodySize * 0.2, roundness, mainColor)
    },
    legs: {
      front: generateLimbPattern(legLength, bodySize * 0.32, roundness, mainColor),
      back: generateLimbPattern(legLength, bodySize * 0.32, roundness, mainColor)
    }
  }
}

// Generate Fish Pattern
function generateFishPattern(params, colors) {
  const { baseSize, roundness, bodyRatio } = params
  const bodySize = baseSize
  
  const { mainColor, accentColor } = getSimplifiedColors(colors)
  
  return {
    body: {
      front: generateFishBodyPattern(bodySize, bodySize * bodyRatio, roundness, mainColor),
      back: generateFishBodyPattern(bodySize, bodySize * bodyRatio, roundness, mainColor)
    },
    fins: {
      top: generateFinPattern(bodySize * 0.4, roundness, accentColor),
      bottom: generateFinPattern(bodySize * 0.3, roundness, accentColor),
      side: generateFinPattern(bodySize * 0.35, roundness, accentColor)
    },
    tail: {
      front: generateFishTailPattern(bodySize * 0.5, roundness, mainColor),
      back: generateFishTailPattern(bodySize * 0.5, roundness, mainColor)
    }
  }
}

// Generate Rabbit Pattern
function generateRabbitPattern(params, colors) {
  const { baseSize, headRatio, limbLength, roundness, bodyRatio, earSize, tailLength } = params
  const bodySize = baseSize
  const headSize = bodySize * headRatio
  
  const { mainColor, accentColor } = getSimplifiedColors(colors)
  const legLength = bodySize * 0.5 * limbLength
  
  return {
    body: {
      front: generateOvalPattern(bodySize, bodySize * bodyRatio, roundness, mainColor),
      back: generateOvalPattern(bodySize, bodySize * bodyRatio, roundness, mainColor)
    },
    head: {
      front: generateOvalPattern(headSize, headSize * 0.9, roundness, mainColor),
      back: generateOvalPattern(headSize, headSize * 0.9, roundness, mainColor)
    },
    ears: {
      front: generateLongEarPattern(headSize * 1.5 * earSize, roundness, accentColor),
      back: generateLongEarPattern(headSize * 1.5 * earSize, roundness, accentColor)
    },
    tail: {
      front: generatePuffTailPattern(bodySize * 0.3 * tailLength, roundness, mainColor),
      back: generatePuffTailPattern(bodySize * 0.3 * tailLength, roundness, mainColor)
    },
    legs: {
      front: generateLimbPattern(legLength, bodySize * 0.3, roundness, mainColor),
      back: generateLimbPattern(legLength, bodySize * 0.3, roundness, mainColor)
    }
  }
}

// Generate Bird Pattern
function generateBirdPattern(params, colors) {
  const { baseSize, headRatio, roundness, bodyRatio } = params
  const bodySize = baseSize
  const headSize = bodySize * headRatio
  
  const { mainColor, accentColor } = getSimplifiedColors(colors)
  
  return {
    body: {
      front: generateOvalPattern(bodySize, bodySize * bodyRatio, roundness, mainColor),
      back: generateOvalPattern(bodySize, bodySize * bodyRatio, roundness, mainColor)
    },
    head: {
      front: generateOvalPattern(headSize, headSize * 0.9, roundness, mainColor),
      back: generateOvalPattern(headSize, headSize * 0.9, roundness, mainColor)
    },
    wings: {
      front: generateWingPattern(bodySize * 0.6, roundness, accentColor),
      back: generateWingPattern(bodySize * 0.6, roundness, accentColor)
    },
    beak: {
      front: generateBeakPattern(headSize * 0.3, roundness, accentColor),
      back: generateBeakPattern(headSize * 0.3, roundness, accentColor)
    },
    tail: {
      front: generateFeatherTailPattern(bodySize * 0.5, roundness, mainColor),
      back: generateFeatherTailPattern(bodySize * 0.5, roundness, mainColor)
    }
  }
}

// Generate Owl Pattern
function generateOwlPattern(params, colors) {
  const { baseSize, headRatio, roundness, bodyRatio } = params
  const bodySize = baseSize
  const headSize = bodySize * headRatio * 1.2 // Owls have larger heads
  
  const { mainColor, accentColor } = getSimplifiedColors(colors)
  
  return {
    body: {
      front: generateOvalPattern(bodySize, bodySize * bodyRatio, roundness, mainColor),
      back: generateOvalPattern(bodySize, bodySize * bodyRatio, roundness, mainColor)
    },
    head: {
      front: generateOvalPattern(headSize, headSize, roundness, mainColor),
      back: generateOvalPattern(headSize, headSize, roundness, mainColor)
    },
    wings: {
      front: generateWingPattern(bodySize * 0.7, roundness, accentColor),
      back: generateWingPattern(bodySize * 0.7, roundness, accentColor)
    },
    beak: {
      front: generateBeakPattern(headSize * 0.25, roundness, accentColor),
      back: generateBeakPattern(headSize * 0.25, roundness, accentColor)
    },
    eyes: {
      front: generateEyePattern(headSize * 0.3, roundness, accentColor),
      back: generateEyePattern(headSize * 0.3, roundness, accentColor)
    }
  }
}

// Generate Penguin Pattern
function generatePenguinPattern(params, colors) {
  const { baseSize, headRatio, roundness, bodyRatio } = params
  const bodySize = baseSize
  const headSize = bodySize * headRatio
  
  const { mainColor, accentColor } = getSimplifiedColors(colors)
  
  return {
    body: {
      front: generatePenguinBodyPattern(bodySize, bodySize * bodyRatio, roundness, mainColor),
      back: generatePenguinBodyPattern(bodySize, bodySize * bodyRatio, roundness, mainColor)
    },
    head: {
      front: generateOvalPattern(headSize, headSize * 0.9, roundness, mainColor),
      back: generateOvalPattern(headSize, headSize * 0.9, roundness, mainColor)
    },
    wings: {
      front: generatePenguinWingPattern(bodySize * 0.5, roundness, accentColor),
      back: generatePenguinWingPattern(bodySize * 0.5, roundness, accentColor)
    },
    beak: {
      front: generateBeakPattern(headSize * 0.3, roundness, accentColor),
      back: generateBeakPattern(headSize * 0.3, roundness, accentColor)
    },
    feet: {
      front: generateFeetPattern(bodySize * 0.4, roundness, accentColor),
      back: generateFeetPattern(bodySize * 0.4, roundness, accentColor)
    }
  }
}

// Generate Elephant Pattern
function generateElephantPattern(params, colors) {
  const { baseSize, headRatio, limbLength, roundness, bodyRatio, earSize } = params
  const bodySize = baseSize
  const headSize = bodySize * headRatio
  
  const { mainColor, accentColor } = getSimplifiedColors(colors)
  const legLength = bodySize * 0.6 * limbLength
  
  return {
    body: {
      front: generateOvalPattern(bodySize, bodySize * bodyRatio, roundness, mainColor),
      back: generateOvalPattern(bodySize, bodySize * bodyRatio, roundness, mainColor)
    },
    head: {
      front: generateOvalPattern(headSize, headSize * 0.9, roundness, mainColor),
      back: generateOvalPattern(headSize, headSize * 0.9, roundness, mainColor)
    },
    trunk: {
      front: generateTrunkPattern(bodySize * 0.8, bodySize * 0.2, roundness, mainColor),
      back: generateTrunkPattern(bodySize * 0.8, bodySize * 0.2, roundness, mainColor)
    },
    ears: {
      front: generateLargeEarPattern(headSize * 1.5 * earSize, roundness, accentColor),
      back: generateLargeEarPattern(headSize * 1.5 * earSize, roundness, accentColor)
    },
    legs: {
      front: generateLimbPattern(legLength, bodySize * 0.4, roundness, mainColor),
      back: generateLimbPattern(legLength, bodySize * 0.4, roundness, mainColor)
    },
    tail: {
      front: generateTailPattern(bodySize * 0.5, bodySize * 0.15, roundness, mainColor),
      back: generateTailPattern(bodySize * 0.5, bodySize * 0.15, roundness, mainColor)
    }
  }
}

// Generate Whale Pattern
function generateWhalePattern(params, colors) {
  const { baseSize, roundness, bodyRatio } = params
  const bodySize = baseSize
  
  const { mainColor, accentColor } = getSimplifiedColors(colors)
  
  return {
    body: {
      front: generateWhaleBodyPattern(bodySize, bodySize * bodyRatio * 1.5, roundness, mainColor),
      back: generateWhaleBodyPattern(bodySize, bodySize * bodyRatio * 1.5, roundness, mainColor)
    },
    fins: {
      top: generateFinPattern(bodySize * 0.5, roundness, accentColor),
      side: generateFinPattern(bodySize * 0.4, roundness, accentColor)
    },
    tail: {
      front: generateWhaleTailPattern(bodySize * 0.8, roundness, mainColor),
      back: generateWhaleTailPattern(bodySize * 0.8, roundness, mainColor)
    }
  }
}

// Generate Fox Pattern
function generateFoxPattern(params, colors) {
  const { baseSize, headRatio, limbLength, roundness, bodyRatio, earSize, tailLength } = params
  const bodySize = baseSize
  const headSize = bodySize * headRatio
  
  const { mainColor, accentColor } = getSimplifiedColors(colors)
  const legLength = bodySize * 0.5 * limbLength
  
  return {
    body: {
      front: generateOvalPattern(bodySize, bodySize * bodyRatio, roundness, mainColor),
      back: generateOvalPattern(bodySize, bodySize * bodyRatio, roundness, mainColor)
    },
    head: {
      front: generateOvalPattern(headSize, headSize * 0.85, roundness, mainColor),
      back: generateOvalPattern(headSize, headSize * 0.85, roundness, mainColor)
    },
    ears: {
      front: generatePointedEarPattern(headSize * 0.6 * earSize, roundness, accentColor),
      back: generatePointedEarPattern(headSize * 0.6 * earSize, roundness, accentColor)
    },
    tail: {
      front: generateFluffyTailPattern(bodySize * tailLength * 1.2, bodySize * 0.2, roundness, mainColor),
      back: generateFluffyTailPattern(bodySize * tailLength * 1.2, bodySize * 0.2, roundness, mainColor)
    },
    legs: {
      front: generateLimbPattern(legLength, bodySize * 0.3, roundness, mainColor),
      back: generateLimbPattern(legLength, bodySize * 0.3, roundness, mainColor)
    }
  }
}

// Generate Panda Pattern
function generatePandaPattern(params, colors) {
  const { baseSize, headRatio, limbLength, roundness, bodyRatio, earSize } = params
  const bodySize = baseSize
  const headSize = bodySize * headRatio
  
  const { mainColor, accentColor } = getSimplifiedColors(colors)
  const armLength = bodySize * 0.4 * limbLength
  const legLength = bodySize * 0.5 * limbLength
  
  return {
    body: {
      front: generateOvalPattern(bodySize, bodySize * bodyRatio, roundness, mainColor),
      back: generateOvalPattern(bodySize, bodySize * bodyRatio, roundness, mainColor)
    },
    head: {
      front: generateOvalPattern(headSize, headSize, roundness, mainColor),
      back: generateOvalPattern(headSize, headSize, roundness, mainColor)
    },
    ears: {
      front: generateEarPattern(headSize * 0.5 * earSize, roundness, accentColor),
      back: generateEarPattern(headSize * 0.5 * earSize, roundness, accentColor)
    },
    arms: {
      front: generateLimbPattern(armLength, bodySize * 0.35, roundness, mainColor),
      back: generateLimbPattern(armLength, bodySize * 0.35, roundness, mainColor)
    },
    legs: {
      front: generateLimbPattern(legLength, bodySize * 0.4, roundness, mainColor),
      back: generateLimbPattern(legLength, bodySize * 0.4, roundness, mainColor)
    }
  }
}

// Pattern Piece Generators

// Generate oval pattern (for body, head, etc.)
function generateOvalPattern(width, height, roundness, color) {
  const seamAllowance = 0.5 // 0.5cm seam allowance
  const w = width + seamAllowance * 2
  const h = height + seamAllowance * 2
  
  // Create oval shape with rounded edges
  const points = []
  const segments = Math.max(16, Math.floor(roundness * 8))
  
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2
    const rx = w / 2
    const ry = h / 2
    const x = rx * Math.cos(angle) + w / 2
    const y = ry * Math.sin(angle) + h / 2
    points.push({ x, y })
  }
  
  return {
    type: 'oval',
    points,
    width: w,
    height: h,
    color,
    seamAllowance
  }
}

// Generate ear pattern
function generateEarPattern(size, roundness, color) {
  const seamAllowance = 0.5
  const w = size + seamAllowance * 2
  const h = size * 0.7 + seamAllowance * 2
  
  const points = []
  const segments = 8
  
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2
    const rx = w / 2
    const ry = h / 2
    const x = rx * Math.cos(angle) * 0.8 + w / 2
    const y = ry * Math.sin(angle) + h / 2
    points.push({ x, y })
  }
  
  return {
    type: 'ear',
    points,
    width: w,
    height: h,
    color,
    seamAllowance
  }
}

// Generate pointed ear (cat, fox)
function generatePointedEarPattern(size, roundness, color) {
  const seamAllowance = 0.5
  const w = size + seamAllowance * 2
  const h = size * 1.2 + seamAllowance * 2
  
  const points = [
    { x: w / 2, y: h - seamAllowance }, // Bottom center
    { x: seamAllowance, y: h * 0.4 }, // Left side
    { x: w / 2, y: seamAllowance }, // Top point
    { x: w - seamAllowance, y: h * 0.4 } // Right side
  ]
  
  return {
    type: 'pointed-ear',
    points,
    width: w,
    height: h,
    color,
    seamAllowance
  }
}

// Generate floppy ear (dog)
function generateFlopEarPattern(size, roundness, color) {
  const seamAllowance = 0.5
  const w = size + seamAllowance * 2
  const h = size * 1.5 + seamAllowance * 2
  
  const points = []
  for (let i = 0; i <= 12; i++) {
    const t = i / 12
    const x = w / 2 + (w * 0.4) * Math.cos(t * Math.PI * 2)
    const y = h * 0.3 + (h * 0.7) * t
    points.push({ x, y })
  }
  
  return {
    type: 'flop-ear',
    points,
    width: w,
    height: h,
    color,
    seamAllowance
  }
}

// Generate long ear (rabbit)
function generateLongEarPattern(size, roundness, color) {
  const seamAllowance = 0.5
  const w = size * 0.4 + seamAllowance * 2
  const h = size + seamAllowance * 2
  
  const points = []
  for (let i = 0; i <= 8; i++) {
    const t = i / 8
    const x = w / 2 + (w * 0.3) * Math.cos(t * Math.PI)
    const y = h * t
    points.push({ x, y })
  }
  
  return {
    type: 'long-ear',
    points,
    width: w,
    height: h,
    color,
    seamAllowance
  }
}

// Generate large ear (elephant)
function generateLargeEarPattern(size, roundness, color) {
  const seamAllowance = 0.5
  const w = size + seamAllowance * 2
  const h = size * 0.8 + seamAllowance * 2
  
  const points = []
  for (let i = 0; i <= 16; i++) {
    const angle = (i / 16) * Math.PI * 2
    const rx = w / 2
    const ry = h / 2
    const x = rx * Math.cos(angle) + w / 2
    const y = ry * Math.sin(angle) + h / 2
    points.push({ x, y })
  }
  
  return {
    type: 'large-ear',
    points,
    width: w,
    height: h,
    color,
    seamAllowance
  }
}

// Generate limb pattern (arms, legs)
function generateLimbPattern(length, width, roundness, color) {
  const seamAllowance = 0.5
  const w = width + seamAllowance * 2
  const h = length + seamAllowance * 2
  
  const points = []
  const segments = Math.max(8, Math.floor(roundness * 4))
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const angle = t * Math.PI * 2
    const rx = w / 2
    const ry = h / 2
    const x = rx * Math.cos(angle) + w / 2
    const y = ry * Math.sin(angle) + h / 2
    points.push({ x, y })
  }
  
  return {
    type: 'limb',
    points,
    width: w,
    height: h,
    color,
    seamAllowance
  }
}

// Generate tail pattern
function generateTailPattern(length, width, roundness, color) {
  const seamAllowance = 0.5
  const w = width + seamAllowance * 2
  const h = length + seamAllowance * 2
  
  const points = []
  for (let i = 0; i <= 8; i++) {
    const t = i / 8
    const angle = t * Math.PI * 2
    const rx = w / 2 * (1 - t * 0.3) // Taper
    const ry = h / 2
    const x = rx * Math.cos(angle) + w / 2
    const y = h * t
    points.push({ x, y })
  }
  
  return {
    type: 'tail',
    points,
    width: w,
    height: h,
    color,
    seamAllowance
  }
}

// Generate puff tail (rabbit)
function generatePuffTailPattern(size, roundness, color) {
  return generateOvalPattern(size, size, roundness, color)
}

// Generate fluffy tail (fox)
function generateFluffyTailPattern(length, width, roundness, color) {
  const seamAllowance = 0.5
  const w = width + seamAllowance * 2
  const h = length + seamAllowance * 2
  
  const points = []
  for (let i = 0; i <= 12; i++) {
    const t = i / 12
    const angle = t * Math.PI * 2
    const rx = w / 2 * (1 + Math.sin(t * Math.PI) * 0.2) // Fluffy
    const ry = h / 2
    const x = rx * Math.cos(angle) + w / 2
    const y = h * t
    points.push({ x, y })
  }
  
  return {
    type: 'fluffy-tail',
    points,
    width: w,
    height: h,
    color,
    seamAllowance
  }
}

// Generate fish body pattern
function generateFishBodyPattern(length, width, roundness, color) {
  const seamAllowance = 0.5
  const w = width + seamAllowance * 2
  const h = length + seamAllowance * 2
  
  const points = []
  for (let i = 0; i <= 16; i++) {
    const t = i / 16
    const angle = t * Math.PI * 2
    // Fish shape: wider in middle, tapered at ends
    const rx = w / 2 * Math.sin(t * Math.PI)
    const ry = h / 2
    const x = rx * Math.cos(angle) + w / 2
    const y = h * t
    points.push({ x, y })
  }
  
  return {
    type: 'fish-body',
    points,
    width: w,
    height: h,
    color,
    seamAllowance
  }
}

// Generate fin pattern
function generateFinPattern(size, roundness, color) {
  const seamAllowance = 0.5
  const w = size + seamAllowance * 2
  const h = size * 0.6 + seamAllowance * 2
  
  const points = [
    { x: w / 2, y: h - seamAllowance }, // Bottom
    { x: seamAllowance, y: h * 0.5 }, // Left
    { x: w / 2, y: seamAllowance }, // Top
    { x: w - seamAllowance, y: h * 0.5 } // Right
  ]
  
  return {
    type: 'fin',
    points,
    width: w,
    height: h,
    color,
    seamAllowance
  }
}

// Generate fish tail pattern
function generateFishTailPattern(size, roundness, color) {
  const seamAllowance = 0.5
  const w = size + seamAllowance * 2
  const h = size * 0.5 + seamAllowance * 2
  
  const points = [
    { x: w / 2, y: h - seamAllowance }, // Bottom center
    { x: seamAllowance, y: h * 0.3 }, // Left
    { x: w / 2, y: seamAllowance }, // Top center
    { x: w - seamAllowance, y: h * 0.3 } // Right
  ]
  
  return {
    type: 'fish-tail',
    points,
    width: w,
    height: h,
    color,
    seamAllowance
  }
}

// Generate wing pattern (bird)
function generateWingPattern(size, roundness, color) {
  const seamAllowance = 0.5
  const w = size + seamAllowance * 2
  const h = size * 0.7 + seamAllowance * 2
  
  const points = []
  for (let i = 0; i <= 12; i++) {
    const t = i / 12
    const angle = t * Math.PI * 2
    const rx = w / 2 * (1 - Math.abs(Math.cos(angle * 2)) * 0.3)
    const ry = h / 2
    const x = rx * Math.cos(angle) + w / 2
    const y = ry * Math.sin(angle) + h / 2
    points.push({ x, y })
  }
  
  return {
    type: 'wing',
    points,
    width: w,
    height: h,
    color,
    seamAllowance
  }
}

// Generate beak pattern
function generateBeakPattern(size, roundness, color) {
  const seamAllowance = 0.5
  const w = size + seamAllowance * 2
  const h = size * 0.5 + seamAllowance * 2
  
  const points = [
    { x: w / 2, y: h - seamAllowance }, // Bottom
    { x: seamAllowance, y: h / 2 }, // Left
    { x: w / 2, y: seamAllowance }, // Top point
    { x: w - seamAllowance, y: h / 2 } // Right
  ]
  
  return {
    type: 'beak',
    points,
    width: w,
    height: h,
    color,
    seamAllowance
  }
}

// Generate snout pattern (dog)
function generateSnoutPattern(size, roundness, color) {
  const seamAllowance = 0.5
  const w = size + seamAllowance * 2
  const h = size * 0.6 + seamAllowance * 2
  
  return generateOvalPattern(w, h, roundness, color)
}

// Generate trunk pattern (elephant)
function generateTrunkPattern(length, width, roundness, color) {
  return generateLimbPattern(length, width, roundness, color)
}

// Generate feather tail (bird)
function generateFeatherTailPattern(size, roundness, color) {
  const seamAllowance = 0.5
  const w = size + seamAllowance * 2
  const h = size * 0.8 + seamAllowance * 2
  
  const points = []
  for (let i = 0; i <= 10; i++) {
    const t = i / 10
    const angle = t * Math.PI * 2
    const rx = w / 2 * (1 - t * 0.4)
    const ry = h / 2
    const x = rx * Math.cos(angle) + w / 2
    const y = h * t
    points.push({ x, y })
  }
  
  return {
    type: 'feather-tail',
    points,
    width: w,
    height: h,
    color,
    seamAllowance
  }
}

// Generate eye pattern (owl)
function generateEyePattern(size, roundness, color) {
  return generateOvalPattern(size, size, roundness, color)
}

// Generate penguin body pattern
function generatePenguinBodyPattern(length, width, roundness, color) {
  const seamAllowance = 0.5
  const w = width + seamAllowance * 2
  const h = length + seamAllowance * 2
  
  const points = []
  for (let i = 0; i <= 16; i++) {
    const t = i / 16
    const angle = t * Math.PI * 2
    // Penguin shape: wider at top, narrower at bottom
    const rx = w / 2 * (1 - t * 0.2)
    const ry = h / 2
    const x = rx * Math.cos(angle) + w / 2
    const y = h * t
    points.push({ x, y })
  }
  
  return {
    type: 'penguin-body',
    points,
    width: w,
    height: h,
    color,
    seamAllowance
  }
}

// Generate penguin wing pattern
function generatePenguinWingPattern(size, roundness, color) {
  const seamAllowance = 0.5
  const w = size + seamAllowance * 2
  const h = size * 0.5 + seamAllowance * 2
  
  const points = []
  for (let i = 0; i <= 10; i++) {
    const t = i / 10
    const angle = t * Math.PI * 2
    const rx = w / 2 * (1 - Math.abs(Math.cos(angle)) * 0.4)
    const ry = h / 2
    const x = rx * Math.cos(angle) + w / 2
    const y = ry * Math.sin(angle) + h / 2
    points.push({ x, y })
  }
  
  return {
    type: 'penguin-wing',
    points,
    width: w,
    height: h,
    color,
    seamAllowance
  }
}

// Generate feet pattern (penguin)
function generateFeetPattern(size, roundness, color) {
  const seamAllowance = 0.5
  const w = size + seamAllowance * 2
  const h = size * 0.4 + seamAllowance * 2
  
  const points = []
  for (let i = 0; i <= 8; i++) {
    const t = i / 8
    const angle = t * Math.PI * 2
    const rx = w / 2 * (1 + Math.sin(t * Math.PI * 2) * 0.1)
    const ry = h / 2
    const x = rx * Math.cos(angle) + w / 2
    const y = ry * Math.sin(angle) + h / 2
    points.push({ x, y })
  }
  
  return {
    type: 'feet',
    points,
    width: w,
    height: h,
    color,
    seamAllowance
  }
}

// Generate whale body pattern
function generateWhaleBodyPattern(length, width, roundness, color) {
  const seamAllowance = 0.5
  const w = width + seamAllowance * 2
  const h = length + seamAllowance * 2
  
  const points = []
  for (let i = 0; i <= 20; i++) {
    const t = i / 20
    const angle = t * Math.PI * 2
    // Whale shape: wider in middle, tapered at ends
    const rx = w / 2 * Math.sin(t * Math.PI) * 1.2
    const ry = h / 2
    const x = rx * Math.cos(angle) + w / 2
    const y = h * t
    points.push({ x, y })
  }
  
  return {
    type: 'whale-body',
    points,
    width: w,
    height: h,
    color,
    seamAllowance
  }
}

// Generate whale tail pattern
function generateWhaleTailPattern(size, roundness, color) {
  const seamAllowance = 0.5
  const w = size + seamAllowance * 2
  const h = size * 0.6 + seamAllowance * 2
  
  const points = [
    { x: w / 2, y: h - seamAllowance }, // Bottom center
    { x: seamAllowance, y: h * 0.4 }, // Left
    { x: w / 2, y: seamAllowance }, // Top center
    { x: w - seamAllowance, y: h * 0.4 } // Right
  ]
  
  return {
    type: 'whale-tail',
    points,
    width: w,
    height: h,
    color,
    seamAllowance
  }
}

// Generate assembly instructions
function generateAssemblyInstructions(animalId, params) {
  const instructions = {
    bear: [
      '1. Felt the body front and back pieces together',
      '2. Attach the head front and back pieces to the body',
      '3. Add ears to the head',
      '4. Attach arms to the sides of the body',
      '5. Attach legs to the bottom of the body',
      '6. Add facial features (eyes, nose) with embroidery or felt'
    ],
    cat: [
      '1. Felt the body front and back pieces together',
      '2. Attach the head front and back pieces to the body',
      '3. Add pointed ears to the head',
      '4. Attach the tail to the back of the body',
      '5. Attach legs to the bottom of the body',
      '6. Add facial features (eyes, nose) with embroidery or felt'
    ],
    dog: [
      '1. Felt the body front and back pieces together',
      '2. Attach the head front and back pieces to the body',
      '3. Add floppy ears to the head',
      '4. Attach the snout to the front of the head',
      '5. Attach the tail to the back of the body',
      '6. Attach legs to the bottom of the body',
      '7. Add facial features (eyes, nose) with embroidery or felt'
    ],
    fish: [
      '1. Felt the body front and back pieces together',
      '2. Attach the top fin to the top of the body',
      '3. Attach the bottom fin to the bottom of the body',
      '4. Attach the side fins to the sides of the body',
      '5. Attach the tail to the back of the body',
      '6. Add eye details with embroidery or felt'
    ],
    rabbit: [
      '1. Felt the body front and back pieces together',
      '2. Attach the head front and back pieces to the body',
      '3. Add long ears to the head',
      '4. Attach the puff tail to the back of the body',
      '5. Attach legs to the bottom of the body',
      '6. Add facial features (eyes, nose) with embroidery or felt'
    ],
    bird: [
      '1. Felt the body front and back pieces together',
      '2. Attach the head front and back pieces to the body',
      '3. Add wings to the sides of the body',
      '4. Attach the beak to the front of the head',
      '5. Attach the feather tail to the back of the body',
      '6. Add eye details with embroidery or felt'
    ],
    owl: [
      '1. Felt the body front and back pieces together',
      '2. Attach the large head front and back pieces to the body',
      '3. Add wings to the sides of the body',
      '4. Attach the beak to the front of the head',
      '5. Add large eyes to the front of the head',
      '6. Add feather details with embroidery'
    ],
    penguin: [
      '1. Felt the body front and back pieces together',
      '2. Attach the head front and back pieces to the body',
      '3. Add wings to the sides of the body',
      '4. Attach the beak to the front of the head',
      '5. Attach the feet to the bottom of the body',
      '6. Add eye details with embroidery or felt'
    ],
    elephant: [
      '1. Felt the body front and back pieces together',
      '2. Attach the head front and back pieces to the body',
      '3. Add the trunk to the front of the head',
      '4. Attach large ears to the sides of the head',
      '5. Attach legs to the bottom of the body',
      '6. Attach the tail to the back of the body',
      '7. Add eye details with embroidery or felt'
    ],
    whale: [
      '1. Felt the large body front and back pieces together',
      '2. Attach the top fin to the top of the body',
      '3. Attach the side fins to the sides of the body',
      '4. Attach the large tail to the back of the body',
      '5. Add eye details with embroidery or felt'
    ],
    fox: [
      '1. Felt the body front and back pieces together',
      '2. Attach the head front and back pieces to the body',
      '3. Add pointed ears to the head',
      '4. Attach the fluffy tail to the back of the body',
      '5. Attach legs to the bottom of the body',
      '6. Add facial features (eyes, nose) with embroidery or felt'
    ],
    panda: [
      '1. Felt the body front and back pieces together',
      '2. Attach the head front and back pieces to the body',
      '3. Add ears to the head',
      '4. Attach arms to the sides of the body',
      '5. Attach legs to the bottom of the body',
      '6. Add facial features (eyes, nose) with embroidery or felt',
      '7. Add black patches for panda markings'
    ]
  }
  
  return instructions[animalId] || instructions.bear
}

// Calculate measurements
function calculateMeasurements(params) {
  const { baseSize, headRatio, limbLength, tailLength } = params
  
  return {
    bodySize: `${baseSize.toFixed(1)}cm`,
    headSize: `${(baseSize * headRatio).toFixed(1)}cm`,
    limbLength: `${(baseSize * 0.5 * limbLength).toFixed(1)}cm`,
    tailLength: tailLength ? `${(baseSize * tailLength).toFixed(1)}cm` : 'N/A',
    totalHeight: `${(baseSize + baseSize * headRatio).toFixed(1)}cm`
  }
}

