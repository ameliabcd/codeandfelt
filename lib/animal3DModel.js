// 3D Animal Model Generator
// Generates realistic front-view visualization of felted animals

// Generate front-view model visualization of animal (always bear, fixed sizes)
export function generateAnimal3DModel(data) {
  if (!data || !data.data || data.data.length === 0) {
    console.error('No data provided to generateAnimal3DModel')
    return null
  }
  
  // Use fixed colors (don't change based on data)
  const mainColor = '#FF6B6B' // Fixed pink
  const accentColor = '#4ECDC4' // Fixed teal
  
  // Calculate overall size based on data (only thing that changes)
  const allValues = []
  data.data.forEach(row => {
    row.forEach(val => {
      if (typeof val === 'number') allValues.push(val)
    })
  })
  
  const avgValue = allValues.length > 0 
    ? allValues.reduce((sum, val) => sum + val, 0) / allValues.length 
    : 0.5
  
  // Map average value to base size (5cm to 15cm)
  const baseSize = 5 + (avgValue * 10)
  
  // Fixed proportions (don't change)
  const bodySize = baseSize
  const headSize = bodySize * 0.5
  const armLength = bodySize * 0.4
  const armWidth = bodySize * 0.25
  const legLength = bodySize * 0.5
  const legWidth = bodySize * 0.3
  const earSize = headSize * 0.35
  
  // SVG dimensions
  const svgWidth = 400
  const svgHeight = 500
  const centerX = svgWidth / 2
  const centerY = svgHeight / 2
  
  // 3D coordinates for each part (front view - no Z depth)
  const parts = []
  
  // Body (main oval - centered)
  const bodyY = centerY + bodySize * 2
  parts.push({
    type: 'ellipse',
    cx: centerX,
    cy: bodyY,
    rx: bodySize * 4,
    ry: bodySize * 3,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 3,
    opacity: 1
  })
  
  // Add body shading for depth
  parts.push({
    type: 'ellipse',
    cx: centerX - bodySize * 1.5,
    cy: bodyY - bodySize * 0.5,
    rx: bodySize * 2.5,
    ry: bodySize * 2,
    fill: 'rgba(255, 255, 255, 0.2)',
    stroke: 'none',
    opacity: 0.8
  })
  
  // Head (above body, centered)
  const headY = bodyY - bodySize * 3.5
  parts.push({
    type: 'ellipse',
    cx: centerX,
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
    cx: centerX - headSize * 1.5,
    cy: headY - headSize * 0.5,
    rx: headSize * 2,
    ry: headSize * 1.5,
    fill: 'rgba(255, 255, 255, 0.2)',
    stroke: 'none',
    opacity: 0.8
  })
  
  // Left Ear (on top-left of head)
  const earLeftX = centerX - headSize * 2.5
  const earLeftY = headY - headSize * 2
  parts.push({
    type: 'ellipse',
    cx: earLeftX,
    cy: earLeftY,
    rx: earSize * 2.5,
    ry: earSize * 2,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 1
  })
  
  // Left ear inner detail
  parts.push({
    type: 'ellipse',
    cx: earLeftX + earSize * 0.5,
    cy: earLeftY + earSize * 0.5,
    rx: earSize * 1.2,
    ry: earSize * 1,
    fill: 'rgba(255, 255, 255, 0.3)',
    stroke: 'none',
    opacity: 0.9
  })
  
  // Right Ear (on top-right of head)
  const earRightX = centerX + headSize * 2.5
  const earRightY = headY - headSize * 2
  parts.push({
    type: 'ellipse',
    cx: earRightX,
    cy: earRightY,
    rx: earSize * 2.5,
    ry: earSize * 2,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 1
  })
  
  // Right ear inner detail
  parts.push({
    type: 'ellipse',
    cx: earRightX - earSize * 0.5,
    cy: earRightY + earSize * 0.5,
    rx: earSize * 1.2,
    ry: earSize * 1,
    fill: 'rgba(255, 255, 255, 0.3)',
    stroke: 'none',
    opacity: 0.9
  })
  
  // Left Arm (extending from left side of body)
  const armLeftX = centerX - bodySize * 3.5
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
  
  // Left arm shading
  parts.push({
    type: 'ellipse',
    cx: armLeftX - armWidth * 0.8,
    cy: armLeftY - armLength * 0.5,
    rx: armWidth * 1.5,
    ry: armLength * 1.5,
    fill: 'rgba(255, 255, 255, 0.2)',
    stroke: 'none',
    opacity: 0.8
  })
  
  // Right Arm (extending from right side of body)
  const armRightX = centerX + bodySize * 3.5
  const armRightY = bodyY - bodySize * 0.5
  parts.push({
    type: 'ellipse',
    cx: armRightX,
    cy: armRightY,
    rx: armWidth * 3,
    ry: armLength * 3.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  // Right arm shading
  parts.push({
    type: 'ellipse',
    cx: armRightX + armWidth * 0.8,
    cy: armRightY - armLength * 0.5,
    rx: armWidth * 1.5,
    ry: armLength * 1.5,
    fill: 'rgba(255, 255, 255, 0.2)',
    stroke: 'none',
    opacity: 0.8
  })
  
  // Left Leg (below body)
  const legLeftX = centerX - bodySize * 1.8
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
  
  // Left leg shading
  parts.push({
    type: 'ellipse',
    cx: legLeftX - legWidth * 0.8,
    cy: legLeftY - legLength * 0.5,
    rx: legWidth * 1.2,
    ry: legLength * 1.5,
    fill: 'rgba(255, 255, 255, 0.2)',
    stroke: 'none',
    opacity: 0.8
  })
  
  // Right Leg (below body)
  const legRightX = centerX + bodySize * 1.8
  const legRightY = bodyY + bodySize * 2.5
  parts.push({
    type: 'ellipse',
    cx: legRightX,
    cy: legRightY,
    rx: legWidth * 2.8,
    ry: legLength * 3.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2.5,
    opacity: 1
  })
  
  // Right leg shading
  parts.push({
    type: 'ellipse',
    cx: legRightX + legWidth * 0.8,
    cy: legRightY - legLength * 0.5,
    rx: legWidth * 1.2,
    ry: legLength * 1.5,
    fill: 'rgba(255, 255, 255, 0.2)',
    stroke: 'none',
    opacity: 0.8
  })
  
  // Eyes (on the head)
  const eyeLeftX = centerX - headSize * 1.2
  const eyeRightX = centerX + headSize * 1.2
  const eyeY = headY + headSize * 0.5
  
  // Left eye
  parts.push({
    type: 'circle',
    cx: eyeLeftX,
    cy: eyeY,
    r: headSize * 0.8,
    fill: '#333',
    stroke: 'none',
    opacity: 1
  })
  
  // Left eye highlight
  parts.push({
    type: 'circle',
    cx: eyeLeftX - headSize * 0.2,
    cy: eyeY - headSize * 0.2,
    r: headSize * 0.3,
    fill: '#fff',
    stroke: 'none',
    opacity: 0.9
  })
  
  // Right eye
  parts.push({
    type: 'circle',
    cx: eyeRightX,
    cy: eyeY,
    r: headSize * 0.8,
    fill: '#333',
    stroke: 'none',
    opacity: 1
  })
  
  // Right eye highlight
  parts.push({
    type: 'circle',
    cx: eyeRightX - headSize * 0.2,
    cy: eyeY - headSize * 0.2,
    r: headSize * 0.3,
    fill: '#fff',
    stroke: 'none',
    opacity: 0.9
  })
  
  // Nose (below eyes, center of head)
  const noseX = centerX
  const noseY = headY + headSize * 1.8
  
  // Nose (inverted triangle shape)
  parts.push({
    type: 'path',
    d: `M ${noseX} ${noseY} L ${noseX - headSize * 0.8} ${noseY + headSize * 1.2} L ${noseX + headSize * 0.8} ${noseY + headSize * 1.2} Z`,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 1
  })
  
  // Nose highlight
  parts.push({
    type: 'ellipse',
    cx: noseX - headSize * 0.2,
    cy: noseY + headSize * 0.3,
    rx: headSize * 0.3,
    ry: headSize * 0.2,
    fill: 'rgba(255, 255, 255, 0.4)',
    stroke: 'none',
    opacity: 0.9
  })
  
  // Mouth (below nose)
  const mouthY = noseY + headSize * 1.5
  parts.push({
    type: 'path',
    d: `M ${noseX - headSize * 0.6} ${mouthY} Q ${noseX} ${mouthY + headSize * 0.8} ${noseX + headSize * 0.6} ${mouthY}`,
    fill: 'none',
    stroke: '#333',
    strokeWidth: 2,
    strokeLinecap: 'round',
    opacity: 0.8
  })
  
  return {
    parts: parts,
    width: svgWidth,
    height: svgHeight,
    viewBox: `0 0 ${svgWidth} ${svgHeight}`
  }
}
