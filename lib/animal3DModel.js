// 3D Animal Model Generator
// Generates visual 3D representation of felted animals

// Generate 3D model visualization of animal
export function generateAnimal3DModel(animalId, params, colors) {
  if (!params) {
    console.error('No params provided to generateAnimal3DModel')
    return null
  }
  
  const { baseSize, headRatio, limbLength, roundness, bodyRatio, earSize, tailLength } = params
  
  // Use simplified colors - just 1-2 main colors (don't change colors much)
  const mainColor = colors && colors[0] ? colors[0] : '#FF6B6B'
  const accentColor = colors && colors[1] ? colors[1] : colors && colors[0] ? colors[0] : '#4ECDC4'
  
  const bodySize = baseSize
  const headSize = bodySize * headRatio
  
  // Generate model based on animal type
  switch (animalId) {
    case 'bear':
      return generateBearModel(bodySize, headSize, limbLength, mainColor, accentColor)
    case 'cat':
      return generateCatModel(bodySize, headSize, limbLength, tailLength, mainColor, accentColor)
    case 'dog':
      return generateDogModel(bodySize, headSize, limbLength, tailLength, mainColor, accentColor)
    case 'fish':
      return generateFishModel(bodySize, mainColor, accentColor)
    case 'rabbit':
      return generateRabbitModel(bodySize, headSize, limbLength, earSize, mainColor, accentColor)
    case 'bird':
      return generateBirdModel(bodySize, headSize, mainColor, accentColor)
    case 'owl':
      return generateOwlModel(bodySize, headSize, mainColor, accentColor)
    case 'penguin':
      return generatePenguinModel(bodySize, headSize, mainColor, accentColor)
    case 'elephant':
      return generateElephantModel(bodySize, headSize, limbLength, earSize, mainColor, accentColor)
    case 'whale':
      return generateWhaleModel(bodySize, mainColor, accentColor)
    case 'fox':
      return generateFoxModel(bodySize, headSize, limbLength, tailLength, mainColor, accentColor)
    case 'panda':
      return generatePandaModel(bodySize, headSize, limbLength, mainColor, accentColor)
    default:
      return generateBearModel(bodySize, headSize, limbLength, mainColor, accentColor)
  }
}

// Generate Bear Model (2D side view assembled)
function generateBearModel(bodySize, headSize, limbLength, mainColor, accentColor) {
  const scale = 2 // Scale for visualization
  const bodyWidth = bodySize * 0.8
  const bodyHeight = bodySize
  const headWidth = headSize * 0.9
  const headHeight = headSize
  const armLength = bodySize * 0.4 * limbLength
  const armWidth = bodySize * 0.3
  const legLength = bodySize * 0.5 * limbLength
  const legWidth = bodySize * 0.35
  const earSize = headSize * 0.4
  
  // Position components
  const centerX = 200
  const centerY = 200
  
  const parts = [
    // Body (main)
    {
      type: 'ellipse',
      cx: centerX,
      cy: centerY,
      rx: bodyWidth * scale,
      ry: bodyHeight * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 2
    },
    // Head
    {
      type: 'ellipse',
      cx: centerX,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.5,
      rx: headWidth * scale,
      ry: headHeight * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 2
    },
    // Left Ear
    {
      type: 'ellipse',
      cx: centerX - headWidth * scale * 0.6,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.8,
      rx: earSize * scale,
      ry: earSize * scale * 0.7,
      fill: accentColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    // Right Ear
    {
      type: 'ellipse',
      cx: centerX + headWidth * scale * 0.6,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.8,
      rx: earSize * scale,
      ry: earSize * scale * 0.7,
      fill: accentColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    // Left Arm
    {
      type: 'ellipse',
      cx: centerX - bodyWidth * scale - armLength * scale * 0.5,
      cy: centerY - bodyHeight * scale * 0.2,
      rx: armWidth * scale,
      ry: armLength * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 1.5,
      transform: `rotate(-30 ${centerX - bodyWidth * scale} ${centerY - bodyHeight * scale * 0.2})`
    },
    // Right Arm
    {
      type: 'ellipse',
      cx: centerX + bodyWidth * scale + armLength * scale * 0.5,
      cy: centerY - bodyHeight * scale * 0.2,
      rx: armWidth * scale,
      ry: armLength * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 1.5,
      transform: `rotate(30 ${centerX + bodyWidth * scale} ${centerY - bodyHeight * scale * 0.2})`
    },
    // Left Leg
    {
      type: 'ellipse',
      cx: centerX - bodyWidth * scale * 0.4,
      cy: centerY + bodyHeight * scale + legLength * scale * 0.5,
      rx: legWidth * scale,
      ry: legLength * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    // Right Leg
    {
      type: 'ellipse',
      cx: centerX + bodyWidth * scale * 0.4,
      cy: centerY + bodyHeight * scale + legLength * scale * 0.5,
      rx: legWidth * scale,
      ry: legLength * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    // Eyes
    {
      type: 'circle',
      cx: centerX - headWidth * scale * 0.3,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.6,
      r: 4,
      fill: '#333'
    },
    {
      type: 'circle',
      cx: centerX + headWidth * scale * 0.3,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.6,
      r: 4,
      fill: '#333'
    },
    // Nose
    {
      type: 'ellipse',
      cx: centerX,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.3,
      rx: 6,
      ry: 4,
      fill: accentColor
    }
  ]
  
  return {
    parts,
    width: 400,
    height: 400,
    viewBox: '0 0 400 400'
  }
}

// Generate Cat Model
function generateCatModel(bodySize, headSize, limbLength, tailLength, mainColor, accentColor) {
  const scale = 2
  const bodyWidth = bodySize * 0.8
  const bodyHeight = bodySize
  const headWidth = headSize * 0.85
  const headHeight = headSize
  const legLength = bodySize * 0.5 * limbLength
  const legWidth = bodySize * 0.3
  const tailLength_actual = bodySize * tailLength
  const earSize = headSize * 0.5
  
  const centerX = 200
  const centerY = 200
  
  const parts = [
    // Body
    {
      type: 'ellipse',
      cx: centerX,
      cy: centerY,
      rx: bodyWidth * scale,
      ry: bodyHeight * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 2
    },
    // Head
    {
      type: 'ellipse',
      cx: centerX,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.5,
      rx: headWidth * scale,
      ry: headHeight * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 2
    },
    // Pointed Ears
    {
      type: 'path',
      d: `M ${centerX - headWidth * scale * 0.5} ${centerY - bodyHeight * scale - headHeight * scale * 0.8} L ${centerX - headWidth * scale * 0.3} ${centerY - bodyHeight * scale - headHeight * scale * 1.1} L ${centerX - headWidth * scale * 0.1} ${centerY - bodyHeight * scale - headHeight * scale * 0.8} Z`,
      fill: accentColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    {
      type: 'path',
      d: `M ${centerX + headWidth * scale * 0.1} ${centerY - bodyHeight * scale - headHeight * scale * 0.8} L ${centerX + headWidth * scale * 0.3} ${centerY - bodyHeight * scale - headHeight * scale * 1.1} L ${centerX + headWidth * scale * 0.5} ${centerY - bodyHeight * scale - headHeight * scale * 0.8} Z`,
      fill: accentColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    // Tail
    {
      type: 'path',
      d: `M ${centerX + bodyWidth * scale} ${centerY} Q ${centerX + bodyWidth * scale + tailLength_actual * scale * 0.5} ${centerY - tailLength_actual * scale * 0.3} ${centerX + bodyWidth * scale + tailLength_actual * scale} ${centerY - tailLength_actual * scale * 0.5}`,
      fill: 'none',
      stroke: mainColor,
      strokeWidth: bodySize * scale * 0.15,
      strokeLinecap: 'round'
    },
    // Legs
    {
      type: 'ellipse',
      cx: centerX - bodyWidth * scale * 0.4,
      cy: centerY + bodyHeight * scale + legLength * scale * 0.5,
      rx: legWidth * scale,
      ry: legLength * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    {
      type: 'ellipse',
      cx: centerX + bodyWidth * scale * 0.4,
      cy: centerY + bodyHeight * scale + legLength * scale * 0.5,
      rx: legWidth * scale,
      ry: legLength * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    // Eyes
    {
      type: 'circle',
      cx: centerX - headWidth * scale * 0.3,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.6,
      r: 4,
      fill: '#333'
    },
    {
      type: 'circle',
      cx: centerX + headWidth * scale * 0.3,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.6,
      r: 4,
      fill: '#333'
    },
    // Nose
    {
      type: 'ellipse',
      cx: centerX,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.3,
      rx: 5,
      ry: 3,
      fill: accentColor
    }
  ]
  
  return {
    parts,
    width: 400,
    height: 400,
    viewBox: '0 0 400 400'
  }
}

// Generate Dog Model
function generateDogModel(bodySize, headSize, limbLength, tailLength, mainColor, accentColor) {
  const scale = 2
  const bodyWidth = bodySize * 0.8
  const bodyHeight = bodySize
  const headWidth = headSize * 0.9
  const headHeight = headSize
  const legLength = bodySize * 0.5 * limbLength
  const legWidth = bodySize * 0.32
  const tailLength_actual = bodySize * tailLength
  const earSize = headSize * 0.6
  
  const centerX = 200
  const centerY = 200
  
  const parts = [
    // Body
    {
      type: 'ellipse',
      cx: centerX,
      cy: centerY,
      rx: bodyWidth * scale,
      ry: bodyHeight * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 2
    },
    // Head
    {
      type: 'ellipse',
      cx: centerX,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.5,
      rx: headWidth * scale,
      ry: headHeight * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 2
    },
    // Floppy Ears
    {
      type: 'ellipse',
      cx: centerX - headWidth * scale * 0.5,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.5,
      rx: earSize * scale * 0.6,
      ry: earSize * scale,
      fill: accentColor,
      stroke: '#333',
      strokeWidth: 1.5,
      transform: `rotate(-20 ${centerX - headWidth * scale * 0.5} ${centerY - bodyHeight * scale - headHeight * scale * 0.5})`
    },
    {
      type: 'ellipse',
      cx: centerX + headWidth * scale * 0.5,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.5,
      rx: earSize * scale * 0.6,
      ry: earSize * scale,
      fill: accentColor,
      stroke: '#333',
      strokeWidth: 1.5,
      transform: `rotate(20 ${centerX + headWidth * scale * 0.5} ${centerY - bodyHeight * scale - headHeight * scale * 0.5})`
    },
    // Snout
    {
      type: 'ellipse',
      cx: centerX,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.2,
      rx: headSize * scale * 0.2,
      ry: headSize * scale * 0.15,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 1
    },
    // Tail (wagging)
    {
      type: 'path',
      d: `M ${centerX + bodyWidth * scale} ${centerY} Q ${centerX + bodyWidth * scale + tailLength_actual * scale * 0.4} ${centerY - tailLength_actual * scale * 0.2} ${centerX + bodyWidth * scale + tailLength_actual * scale * 0.8} ${centerY - tailLength_actual * scale * 0.4}`,
      fill: 'none',
      stroke: mainColor,
      strokeWidth: bodySize * scale * 0.2,
      strokeLinecap: 'round'
    },
    // Legs
    {
      type: 'ellipse',
      cx: centerX - bodyWidth * scale * 0.4,
      cy: centerY + bodyHeight * scale + legLength * scale * 0.5,
      rx: legWidth * scale,
      ry: legLength * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    {
      type: 'ellipse',
      cx: centerX + bodyWidth * scale * 0.4,
      cy: centerY + bodyHeight * scale + legLength * scale * 0.5,
      rx: legWidth * scale,
      ry: legLength * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    // Eyes
    {
      type: 'circle',
      cx: centerX - headWidth * scale * 0.3,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.6,
      r: 4,
      fill: '#333'
    },
    {
      type: 'circle',
      cx: centerX + headWidth * scale * 0.3,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.6,
      r: 4,
      fill: '#333'
    },
    // Nose
    {
      type: 'circle',
      cx: centerX,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.15,
      r: 3,
      fill: '#333'
    }
  ]
  
  return {
    parts,
    width: 400,
    height: 400,
    viewBox: '0 0 400 400'
  }
}

// Generate Fish Model
function generateFishModel(bodySize, mainColor, accentColor) {
  const scale = 2
  const bodyWidth = bodySize
  const bodyHeight = bodySize * 0.6
  
  const centerX = 200
  const centerY = 200
  
  const parts = [
    // Fish Body
    {
      type: 'ellipse',
      cx: centerX,
      cy: centerY,
      rx: bodyWidth * scale,
      ry: bodyHeight * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 2
    },
    // Top Fin
    {
      type: 'path',
      d: `M ${centerX} ${centerY - bodyHeight * scale} L ${centerX - bodyWidth * scale * 0.3} ${centerY - bodyHeight * scale * 1.5} L ${centerX + bodyWidth * scale * 0.3} ${centerY - bodyHeight * scale * 1.5} Z`,
      fill: accentColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    // Bottom Fin
    {
      type: 'path',
      d: `M ${centerX} ${centerY + bodyHeight * scale} L ${centerX - bodyWidth * scale * 0.2} ${centerY + bodyHeight * scale * 1.3} L ${centerX + bodyWidth * scale * 0.2} ${centerY + bodyHeight * scale * 1.3} Z`,
      fill: accentColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    // Side Fin
    {
      type: 'ellipse',
      cx: centerX - bodyWidth * scale * 0.6,
      cy: centerY,
      rx: bodyWidth * scale * 0.2,
      ry: bodyHeight * scale * 0.4,
      fill: accentColor,
      stroke: '#333',
      strokeWidth: 1
    },
    // Tail
    {
      type: 'path',
      d: `M ${centerX + bodyWidth * scale} ${centerY} L ${centerX + bodyWidth * scale * 1.5} ${centerY - bodyHeight * scale * 0.5} L ${centerX + bodyWidth * scale * 1.5} ${centerY + bodyHeight * scale * 0.5} Z`,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 2
    },
    // Eye
    {
      type: 'circle',
      cx: centerX - bodyWidth * scale * 0.3,
      cy: centerY - bodyHeight * scale * 0.3,
      r: 6,
      fill: '#FFF',
      stroke: '#333',
      strokeWidth: 1
    },
    {
      type: 'circle',
      cx: centerX - bodyWidth * scale * 0.3,
      cy: centerY - bodyHeight * scale * 0.3,
      r: 3,
      fill: '#333'
    }
  ]
  
  return {
    parts,
    width: 400,
    height: 400,
    viewBox: '0 0 400 400'
  }
}

// Generate Rabbit Model
function generateRabbitModel(bodySize, headSize, limbLength, earSize, mainColor, accentColor) {
  const scale = 2
  const bodyWidth = bodySize * 0.8
  const bodyHeight = bodySize
  const headWidth = headSize * 0.9
  const headHeight = headSize
  const legLength = bodySize * 0.5 * limbLength
  const legWidth = bodySize * 0.3
  const earLength = headSize * 1.5 * earSize
  
  const centerX = 200
  const centerY = 200
  
  const parts = [
    // Body
    {
      type: 'ellipse',
      cx: centerX,
      cy: centerY,
      rx: bodyWidth * scale,
      ry: bodyHeight * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 2
    },
    // Head
    {
      type: 'ellipse',
      cx: centerX,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.5,
      rx: headWidth * scale,
      ry: headHeight * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 2
    },
    // Long Ears
    {
      type: 'ellipse',
      cx: centerX - headWidth * scale * 0.4,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.8 - earLength * scale * 0.5,
      rx: earLength * scale * 0.2,
      ry: earLength * scale,
      fill: accentColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    {
      type: 'ellipse',
      cx: centerX + headWidth * scale * 0.4,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.8 - earLength * scale * 0.5,
      rx: earLength * scale * 0.2,
      ry: earLength * scale,
      fill: accentColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    // Puff Tail
    {
      type: 'circle',
      cx: centerX + bodyWidth * scale,
      cy: centerY - bodyHeight * scale * 0.3,
      r: bodySize * scale * 0.15,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    // Legs
    {
      type: 'ellipse',
      cx: centerX - bodyWidth * scale * 0.4,
      cy: centerY + bodyHeight * scale + legLength * scale * 0.5,
      rx: legWidth * scale,
      ry: legLength * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    {
      type: 'ellipse',
      cx: centerX + bodyWidth * scale * 0.4,
      cy: centerY + bodyHeight * scale + legLength * scale * 0.5,
      rx: legWidth * scale,
      ry: legLength * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    // Eyes
    {
      type: 'circle',
      cx: centerX - headWidth * scale * 0.3,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.6,
      r: 4,
      fill: '#333'
    },
    {
      type: 'circle',
      cx: centerX + headWidth * scale * 0.3,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.6,
      r: 4,
      fill: '#333'
    },
    // Nose
    {
      type: 'ellipse',
      cx: centerX,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.3,
      rx: 5,
      ry: 3,
      fill: accentColor
    }
  ]
  
  return {
    parts,
    width: 400,
    height: 400,
    viewBox: '0 0 400 400'
  }
}

// Generate Bird Model
function generateBirdModel(bodySize, headSize, mainColor, accentColor) {
  const scale = 2
  const bodyWidth = bodySize * 0.8
  const bodyHeight = bodySize
  const headWidth = headSize * 0.9
  const headHeight = headSize
  
  const centerX = 200
  const centerY = 200
  
  const parts = [
    // Body
    {
      type: 'ellipse',
      cx: centerX,
      cy: centerY,
      rx: bodyWidth * scale,
      ry: bodyHeight * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 2
    },
    // Head
    {
      type: 'circle',
      cx: centerX,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.5,
      r: headWidth * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 2
    },
    // Wings
    {
      type: 'ellipse',
      cx: centerX - bodyWidth * scale * 0.6,
      cy: centerY - bodyHeight * scale * 0.2,
      rx: bodyWidth * scale * 0.6,
      ry: bodyHeight * scale * 0.4,
      fill: accentColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    {
      type: 'ellipse',
      cx: centerX + bodyWidth * scale * 0.6,
      cy: centerY - bodyHeight * scale * 0.2,
      rx: bodyWidth * scale * 0.6,
      ry: bodyHeight * scale * 0.4,
      fill: accentColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    // Beak
    {
      type: 'path',
      d: `M ${centerX} ${centerY - bodyHeight * scale - headHeight * scale * 0.5} L ${centerX + headWidth * scale * 0.3} ${centerY - bodyHeight * scale - headHeight * scale * 0.4} L ${centerX} ${centerY - bodyHeight * scale - headHeight * scale * 0.3} Z`,
      fill: accentColor,
      stroke: '#333',
      strokeWidth: 1
    },
    // Tail
    {
      type: 'path',
      d: `M ${centerX} ${centerY + bodyHeight * scale} L ${centerX - bodyWidth * scale * 0.3} ${centerY + bodyHeight * scale * 1.3} L ${centerX + bodyWidth * scale * 0.3} ${centerY + bodyHeight * scale * 1.3} Z`,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    // Eye
    {
      type: 'circle',
      cx: centerX - headWidth * scale * 0.3,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.6,
      r: 4,
      fill: '#333'
    }
  ]
  
  return {
    parts,
    width: 400,
    height: 400,
    viewBox: '0 0 400 400'
  }
}

// Generate Owl Model
function generateOwlModel(bodySize, headSize, mainColor, accentColor) {
  const scale = 2
  const bodyWidth = bodySize * 0.8
  const bodyHeight = bodySize
  const headWidth = headSize * 1.2
  const headHeight = headSize * 1.2
  
  const centerX = 200
  const centerY = 200
  
  const parts = [
    // Body
    {
      type: 'ellipse',
      cx: centerX,
      cy: centerY,
      rx: bodyWidth * scale,
      ry: bodyHeight * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 2
    },
    // Large Head
    {
      type: 'circle',
      cx: centerX,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.5,
      r: headWidth * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 2
    },
    // Wings
    {
      type: 'ellipse',
      cx: centerX - bodyWidth * scale * 0.7,
      cy: centerY - bodyHeight * scale * 0.1,
      rx: bodyWidth * scale * 0.7,
      ry: bodyHeight * scale * 0.5,
      fill: accentColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    {
      type: 'ellipse',
      cx: centerX + bodyWidth * scale * 0.7,
      cy: centerY - bodyHeight * scale * 0.1,
      rx: bodyWidth * scale * 0.7,
      ry: bodyHeight * scale * 0.5,
      fill: accentColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    // Large Eyes
    {
      type: 'circle',
      cx: centerX - headWidth * scale * 0.3,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.5,
      r: 12,
      fill: '#FFF',
      stroke: '#333',
      strokeWidth: 2
    },
    {
      type: 'circle',
      cx: centerX + headWidth * scale * 0.3,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.5,
      r: 12,
      fill: '#FFF',
      stroke: '#333',
      strokeWidth: 2
    },
    {
      type: 'circle',
      cx: centerX - headWidth * scale * 0.3,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.5,
      r: 6,
      fill: '#333'
    },
    {
      type: 'circle',
      cx: centerX + headWidth * scale * 0.3,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.5,
      r: 6,
      fill: '#333'
    },
    // Beak
    {
      type: 'path',
      d: `M ${centerX} ${centerY - bodyHeight * scale - headHeight * scale * 0.3} L ${centerX - 5} ${centerY - bodyHeight * scale - headHeight * scale * 0.1} L ${centerX + 5} ${centerY - bodyHeight * scale - headHeight * scale * 0.1} Z`,
      fill: accentColor,
      stroke: '#333',
      strokeWidth: 1
    }
  ]
  
  return {
    parts,
    width: 400,
    height: 400,
    viewBox: '0 0 400 400'
  }
}

// Generate Penguin Model
function generatePenguinModel(bodySize, headSize, mainColor, accentColor) {
  const scale = 2
  const bodyWidth = bodySize * 0.8
  const bodyHeight = bodySize
  const headWidth = headSize * 0.9
  const headHeight = headSize
  
  const centerX = 200
  const centerY = 200
  
  const parts = [
    // Body (wider at top)
    {
      type: 'ellipse',
      cx: centerX,
      cy: centerY,
      rx: bodyWidth * scale,
      ry: bodyHeight * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 2
    },
    // Head
    {
      type: 'ellipse',
      cx: centerX,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.5,
      rx: headWidth * scale,
      ry: headHeight * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 2
    },
    // Wings
    {
      type: 'ellipse',
      cx: centerX - bodyWidth * scale * 0.5,
      cy: centerY - bodyHeight * scale * 0.2,
      rx: bodyWidth * scale * 0.5,
      ry: bodyHeight * scale * 0.4,
      fill: accentColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    {
      type: 'ellipse',
      cx: centerX + bodyWidth * scale * 0.5,
      cy: centerY - bodyHeight * scale * 0.2,
      rx: bodyWidth * scale * 0.5,
      ry: bodyHeight * scale * 0.4,
      fill: accentColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    // Beak
    {
      type: 'path',
      d: `M ${centerX} ${centerY - bodyHeight * scale - headHeight * scale * 0.5} L ${centerX + headWidth * scale * 0.3} ${centerY - bodyHeight * scale - headHeight * scale * 0.4} L ${centerX} ${centerY - bodyHeight * scale - headHeight * scale * 0.3} Z`,
      fill: accentColor,
      stroke: '#333',
      strokeWidth: 1
    },
    // Feet
    {
      type: 'ellipse',
      cx: centerX - bodyWidth * scale * 0.3,
      cy: centerY + bodyHeight * scale,
      rx: bodyWidth * scale * 0.4,
      ry: bodyHeight * scale * 0.2,
      fill: accentColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    {
      type: 'ellipse',
      cx: centerX + bodyWidth * scale * 0.3,
      cy: centerY + bodyHeight * scale,
      rx: bodyWidth * scale * 0.4,
      ry: bodyHeight * scale * 0.2,
      fill: accentColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    // Eye
    {
      type: 'circle',
      cx: centerX - headWidth * scale * 0.3,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.6,
      r: 4,
      fill: '#333'
    }
  ]
  
  return {
    parts,
    width: 400,
    height: 400,
    viewBox: '0 0 400 400'
  }
}

// Generate Elephant Model
function generateElephantModel(bodySize, headSize, limbLength, earSize, mainColor, accentColor) {
  const scale = 2
  const bodyWidth = bodySize * 0.8
  const bodyHeight = bodySize
  const headWidth = headSize * 0.9
  const headHeight = headSize
  const legLength = bodySize * 0.6 * limbLength
  const legWidth = bodySize * 0.4
  const earSize_actual = headSize * 1.5 * earSize
  
  const centerX = 200
  const centerY = 200
  
  const parts = [
    // Body
    {
      type: 'ellipse',
      cx: centerX,
      cy: centerY,
      rx: bodyWidth * scale,
      ry: bodyHeight * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 2
    },
    // Head
    {
      type: 'ellipse',
      cx: centerX,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.5,
      rx: headWidth * scale,
      ry: headHeight * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 2
    },
    // Large Ears
    {
      type: 'ellipse',
      cx: centerX - headWidth * scale * 0.8,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.5,
      rx: earSize_actual * scale * 0.8,
      ry: earSize_actual * scale,
      fill: accentColor,
      stroke: '#333',
      strokeWidth: 2
    },
    {
      type: 'ellipse',
      cx: centerX + headWidth * scale * 0.8,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.5,
      rx: earSize_actual * scale * 0.8,
      ry: earSize_actual * scale,
      fill: accentColor,
      stroke: '#333',
      strokeWidth: 2
    },
    // Trunk
    {
      type: 'ellipse',
      cx: centerX,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.2,
      rx: bodySize * scale * 0.1,
      ry: bodySize * scale * 0.8,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    // Legs (thick)
    {
      type: 'ellipse',
      cx: centerX - bodyWidth * scale * 0.5,
      cy: centerY + bodyHeight * scale + legLength * scale * 0.5,
      rx: legWidth * scale,
      ry: legLength * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    {
      type: 'ellipse',
      cx: centerX + bodyWidth * scale * 0.5,
      cy: centerY + bodyHeight * scale + legLength * scale * 0.5,
      rx: legWidth * scale,
      ry: legLength * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    // Eye
    {
      type: 'circle',
      cx: centerX - headWidth * scale * 0.3,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.6,
      r: 4,
      fill: '#333'
    }
  ]
  
  return {
    parts,
    width: 400,
    height: 400,
    viewBox: '0 0 400 400'
  }
}

// Generate Whale Model
function generateWhaleModel(bodySize, mainColor, accentColor) {
  const scale = 2
  const bodyWidth = bodySize * 1.5
  const bodyHeight = bodySize
  
  const centerX = 200
  const centerY = 200
  
  const parts = [
    // Whale Body (large)
    {
      type: 'ellipse',
      cx: centerX,
      cy: centerY,
      rx: bodyWidth * scale,
      ry: bodyHeight * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 2
    },
    // Top Fin
    {
      type: 'path',
      d: `M ${centerX} ${centerY - bodyHeight * scale} L ${centerX - bodyWidth * scale * 0.2} ${centerY - bodyHeight * scale * 1.5} L ${centerX + bodyWidth * scale * 0.2} ${centerY - bodyHeight * scale * 1.5} Z`,
      fill: accentColor,
      stroke: '#333',
      strokeWidth: 2
    },
    // Side Fin
    {
      type: 'ellipse',
      cx: centerX - bodyWidth * scale * 0.4,
      cy: centerY,
      rx: bodyWidth * scale * 0.3,
      ry: bodyHeight * scale * 0.5,
      fill: accentColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    // Large Tail
    {
      type: 'path',
      d: `M ${centerX + bodyWidth * scale} ${centerY} L ${centerX + bodyWidth * scale * 1.8} ${centerY - bodyHeight * scale * 0.6} L ${centerX + bodyWidth * scale * 1.8} ${centerY + bodyHeight * scale * 0.6} Z`,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 2
    },
    // Eye
    {
      type: 'circle',
      cx: centerX - bodyWidth * scale * 0.3,
      cy: centerY - bodyHeight * scale * 0.3,
      r: 6,
      fill: '#FFF',
      stroke: '#333',
      strokeWidth: 1
    },
    {
      type: 'circle',
      cx: centerX - bodyWidth * scale * 0.3,
      cy: centerY - bodyHeight * scale * 0.3,
      r: 3,
      fill: '#333'
    }
  ]
  
  return {
    parts,
    width: 400,
    height: 400,
    viewBox: '0 0 400 400'
  }
}

// Generate Fox Model
function generateFoxModel(bodySize, headSize, limbLength, tailLength, mainColor, accentColor) {
  const scale = 2
  const bodyWidth = bodySize * 0.8
  const bodyHeight = bodySize
  const headWidth = headSize * 0.85
  const headHeight = headSize
  const legLength = bodySize * 0.5 * limbLength
  const legWidth = bodySize * 0.3
  const tailLength_actual = bodySize * tailLength * 1.2
  
  const centerX = 200
  const centerY = 200
  
  const parts = [
    // Body
    {
      type: 'ellipse',
      cx: centerX,
      cy: centerY,
      rx: bodyWidth * scale,
      ry: bodyHeight * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 2
    },
    // Head
    {
      type: 'ellipse',
      cx: centerX,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.5,
      rx: headWidth * scale,
      ry: headHeight * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 2
    },
    // Pointed Ears
    {
      type: 'path',
      d: `M ${centerX - headWidth * scale * 0.5} ${centerY - bodyHeight * scale - headHeight * scale * 0.8} L ${centerX - headWidth * scale * 0.3} ${centerY - bodyHeight * scale - headHeight * scale * 1.1} L ${centerX - headWidth * scale * 0.1} ${centerY - bodyHeight * scale - headHeight * scale * 0.8} Z`,
      fill: accentColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    {
      type: 'path',
      d: `M ${centerX + headWidth * scale * 0.1} ${centerY - bodyHeight * scale - headHeight * scale * 0.8} L ${centerX + headWidth * scale * 0.3} ${centerY - bodyHeight * scale - headHeight * scale * 1.1} L ${centerX + headWidth * scale * 0.5} ${centerY - bodyHeight * scale - headHeight * scale * 0.8} Z`,
      fill: accentColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    // Fluffy Tail
    {
      type: 'path',
      d: `M ${centerX + bodyWidth * scale} ${centerY} Q ${centerX + bodyWidth * scale + tailLength_actual * scale * 0.4} ${centerY - tailLength_actual * scale * 0.3} ${centerX + bodyWidth * scale + tailLength_actual * scale * 0.8} ${centerY - tailLength_actual * scale * 0.5}`,
      fill: 'none',
      stroke: mainColor,
      strokeWidth: bodySize * scale * 0.2,
      strokeLinecap: 'round'
    },
    // Legs
    {
      type: 'ellipse',
      cx: centerX - bodyWidth * scale * 0.4,
      cy: centerY + bodyHeight * scale + legLength * scale * 0.5,
      rx: legWidth * scale,
      ry: legLength * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    {
      type: 'ellipse',
      cx: centerX + bodyWidth * scale * 0.4,
      cy: centerY + bodyHeight * scale + legLength * scale * 0.5,
      rx: legWidth * scale,
      ry: legLength * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    // Eyes
    {
      type: 'circle',
      cx: centerX - headWidth * scale * 0.3,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.6,
      r: 4,
      fill: '#333'
    },
    {
      type: 'circle',
      cx: centerX + headWidth * scale * 0.3,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.6,
      r: 4,
      fill: '#333'
    },
    // Nose
    {
      type: 'ellipse',
      cx: centerX,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.3,
      rx: 5,
      ry: 3,
      fill: accentColor
    }
  ]
  
  return {
    parts,
    width: 400,
    height: 400,
    viewBox: '0 0 400 400'
  }
}

// Generate Panda Model
function generatePandaModel(bodySize, headSize, limbLength, mainColor, accentColor) {
  const scale = 2
  const bodyWidth = bodySize * 0.8
  const bodyHeight = bodySize
  const headWidth = headSize
  const headHeight = headSize
  const armLength = bodySize * 0.4 * limbLength
  const armWidth = bodySize * 0.35
  const legLength = bodySize * 0.5 * limbLength
  const legWidth = bodySize * 0.4
  const earSize = headSize * 0.5
  
  const centerX = 200
  const centerY = 200
  
  const parts = [
    // Body (main)
    {
      type: 'ellipse',
      cx: centerX,
      cy: centerY,
      rx: bodyWidth * scale,
      ry: bodyHeight * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 2
    },
    // Head (round)
    {
      type: 'circle',
      cx: centerX,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.5,
      r: headWidth * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 2
    },
    // Ears
    {
      type: 'circle',
      cx: centerX - headWidth * scale * 0.6,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.8,
      r: earSize * scale,
      fill: accentColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    {
      type: 'circle',
      cx: centerX + headWidth * scale * 0.6,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.8,
      r: earSize * scale,
      fill: accentColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    // Arms
    {
      type: 'ellipse',
      cx: centerX - bodyWidth * scale - armLength * scale * 0.5,
      cy: centerY - bodyHeight * scale * 0.2,
      rx: armWidth * scale,
      ry: armLength * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 1.5,
      transform: `rotate(-30 ${centerX - bodyWidth * scale} ${centerY - bodyHeight * scale * 0.2})`
    },
    {
      type: 'ellipse',
      cx: centerX + bodyWidth * scale + armLength * scale * 0.5,
      cy: centerY - bodyHeight * scale * 0.2,
      rx: armWidth * scale,
      ry: armLength * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 1.5,
      transform: `rotate(30 ${centerX + bodyWidth * scale} ${centerY - bodyHeight * scale * 0.2})`
    },
    // Legs (thick)
    {
      type: 'ellipse',
      cx: centerX - bodyWidth * scale * 0.4,
      cy: centerY + bodyHeight * scale + legLength * scale * 0.5,
      rx: legWidth * scale,
      ry: legLength * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    {
      type: 'ellipse',
      cx: centerX + bodyWidth * scale * 0.4,
      cy: centerY + bodyHeight * scale + legLength * scale * 0.5,
      rx: legWidth * scale,
      ry: legLength * scale,
      fill: mainColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    // Eyes
    {
      type: 'ellipse',
      cx: centerX - headWidth * scale * 0.3,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.5,
      rx: 8,
      ry: 10,
      fill: accentColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    {
      type: 'ellipse',
      cx: centerX + headWidth * scale * 0.3,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.5,
      rx: 8,
      ry: 10,
      fill: accentColor,
      stroke: '#333',
      strokeWidth: 1.5
    },
    // Nose
    {
      type: 'ellipse',
      cx: centerX,
      cy: centerY - bodyHeight * scale - headHeight * scale * 0.3,
      rx: 6,
      ry: 4,
      fill: accentColor
    }
  ]
  
  return {
    parts,
    width: 400,
    height: 400,
    viewBox: '0 0 400 400'
  }
}

