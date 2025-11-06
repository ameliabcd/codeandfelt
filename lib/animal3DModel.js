// 3D Animal Model Generator
// Generates true 3D isometric visualization of felted animals

// Isometric projection helper (true 3D isometric view)
function isometricProject(x, y, z) {
  // Isometric projection with 30-degree angles
  // Scale factor for better visualization
  const scale = 2
  // Isometric projection: rotate 45° around z-axis, then 30° around x-axis
  // Simplified formula for isometric:
  const isoX = (x - y) * scale
  const isoY = ((x + y) / 2 - z) * scale
  return { x: isoX, y: isoY }
}

// Generate 3D model visualization of animal (always bear, fixed sizes)
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
  const armWidth = bodySize * 0.3
  const legLength = bodySize * 0.5
  const legWidth = bodySize * 0.35
  const earSize = headSize * 0.4
  
  // Center position in 3D space
  const centerX = 0
  const centerY = 0
  const centerZ = 0
  
  // 3D coordinates for each part
  const parts = []
  
  // Body (main oval - front view)
  const bodyFront = isometricProject(centerX, centerY, centerZ)
  parts.push({
    type: 'ellipse',
    cx: bodyFront.x,
    cy: bodyFront.y,
    rx: bodySize * 0.6,
    ry: bodySize * 0.4,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 0.95
  })
  
  // Head (above body, slightly forward)
  const headX = centerX
  const headY = centerY - bodySize * 0.5
  const headZ = centerZ + bodySize * 0.2
  
  const headPos = isometricProject(headX, headY, headZ)
  parts.push({
    type: 'ellipse',
    cx: headPos.x,
    cy: headPos.y,
    rx: headSize * 0.7,
    ry: headSize * 0.6,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 0.95
  })
  
  // Left Ear (on top-left of head)
  const earLeftPos = isometricProject(headX - headSize * 0.5, headY - headSize * 0.4, headZ + headSize * 0.2)
  parts.push({
    type: 'ellipse',
    cx: earLeftPos.x,
    cy: earLeftPos.y,
    rx: earSize * 0.8,
    ry: earSize * 0.6,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 1.5,
    opacity: 0.95
  })
  
  // Right Ear (on top-right of head)
  const earRightPos = isometricProject(headX + headSize * 0.5, headY - headSize * 0.4, headZ + headSize * 0.2)
  parts.push({
    type: 'ellipse',
    cx: earRightPos.x,
    cy: earRightPos.y,
    rx: earSize * 0.8,
    ry: earSize * 0.6,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 1.5,
    opacity: 0.95
  })
  
  // Left Arm (extending from left side of body)
  const armLeftBase = isometricProject(centerX - bodySize * 0.5, centerY - bodySize * 0.1, centerZ)
  const armLeftEnd = isometricProject(centerX - bodySize * 0.5 - armLength * 0.6, centerY - bodySize * 0.1, centerZ - armLength * 0.3)
  
  parts.push({
    type: 'ellipse',
    cx: (armLeftBase.x + armLeftEnd.x) / 2,
    cy: (armLeftBase.y + armLeftEnd.y) / 2,
    rx: armWidth * 0.8,
    ry: armLength * 0.6,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 1.5,
    opacity: 0.95,
    transform: `rotate(-20 ${(armLeftBase.x + armLeftEnd.x) / 2} ${(armLeftBase.y + armLeftEnd.y) / 2})`
  })
  
  // Right Arm (extending from right side of body)
  const armRightBase = isometricProject(centerX + bodySize * 0.5, centerY - bodySize * 0.1, centerZ)
  const armRightEnd = isometricProject(centerX + bodySize * 0.5 + armLength * 0.6, centerY - bodySize * 0.1, centerZ - armLength * 0.3)
  
  parts.push({
    type: 'ellipse',
    cx: (armRightBase.x + armRightEnd.x) / 2,
    cy: (armRightBase.y + armRightEnd.y) / 2,
    rx: armWidth * 0.8,
    ry: armLength * 0.6,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 1.5,
    opacity: 0.95,
    transform: `rotate(20 ${(armRightBase.x + armRightEnd.x) / 2} ${(armRightBase.y + armRightEnd.y) / 2})`
  })
  
  // Left Leg (below body, slightly forward)
  const legLeftBase = isometricProject(centerX - bodySize * 0.25, centerY + bodySize * 0.3, centerZ)
  const legLeftEnd = isometricProject(centerX - bodySize * 0.25, centerY + bodySize * 0.3 + legLength * 0.7, centerZ - legLength * 0.2)
  
  parts.push({
    type: 'ellipse',
    cx: (legLeftBase.x + legLeftEnd.x) / 2,
    cy: (legLeftBase.y + legLeftEnd.y) / 2,
    rx: legWidth * 0.7,
    ry: legLength * 0.6,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 1.5,
    opacity: 0.95
  })
  
  // Right Leg (below body, slightly forward)
  const legRightBase = isometricProject(centerX + bodySize * 0.25, centerY + bodySize * 0.3, centerZ)
  const legRightEnd = isometricProject(centerX + bodySize * 0.25, centerY + bodySize * 0.3 + legLength * 0.7, centerZ - legLength * 0.2)
  
  parts.push({
    type: 'ellipse',
    cx: (legRightBase.x + legRightEnd.x) / 2,
    cy: (legRightBase.y + legRightEnd.y) / 2,
    rx: legWidth * 0.7,
    ry: legLength * 0.6,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 1.5,
    opacity: 0.95
  })
  
  // Eyes (on the head)
  const eyeLeft = isometricProject(headX - headSize * 0.25, headY + headSize * 0.1, headZ + headSize * 0.15)
  const eyeRight = isometricProject(headX + headSize * 0.25, headY + headSize * 0.1, headZ + headSize * 0.15)
  
  parts.push({
    type: 'circle',
    cx: eyeLeft.x,
    cy: eyeLeft.y,
    r: 5,
    fill: '#333'
  })
  
  parts.push({
    type: 'circle',
    cx: eyeRight.x,
    cy: eyeRight.y,
    r: 5,
    fill: '#333'
  })
  
  // Nose (below eyes, center of head)
  const nose = isometricProject(headX, headY + headSize * 0.3, headZ + headSize * 0.2)
  
  parts.push({
    type: 'ellipse',
    cx: nose.x,
    cy: nose.y,
    rx: 7,
    ry: 5,
    fill: accentColor
  })
  
  // Calculate bounding box for viewBox
  let minX = Infinity, maxX = -Infinity
  let minY = Infinity, maxY = -Infinity
  
  parts.forEach(part => {
    if (part.type === 'ellipse') {
      const x = part.cx - part.rx
      const y = part.cy - part.ry
      const x2 = part.cx + part.rx
      const y2 = part.cy + part.ry
      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x2)
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y2)
    } else if (part.type === 'circle') {
      const x = part.cx - part.r
      const y = part.cy - part.r
      const x2 = part.cx + part.r
      const y2 = part.cy + part.r
      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x2)
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y2)
    }
  })
  
  // Add padding
  const padding = 50
  const width = (maxX - minX) + padding * 2
  const height = (maxY - minY) + padding * 2
  
  // Center the view
  const offsetX = -minX + padding
  const offsetY = -minY + padding
  
  // Adjust all parts positions
  const adjustedParts = parts.map(part => {
    const adjusted = { ...part }
    if (adjusted.cx !== undefined) adjusted.cx += offsetX
    if (adjusted.cy !== undefined) adjusted.cy += offsetY
    if (adjusted.d) {
      // Adjust path coordinates
      adjusted.d = adjusted.d.replace(/([ML])\s+([-\d.]+)\s+([-\d.]+)/g, (match, cmd, x, y) => {
        return `${cmd} ${parseFloat(x) + offsetX} ${parseFloat(y) + offsetY}`
      })
    }
    return adjusted
  })
  
  return {
    parts: adjustedParts,
    width: width,
    height: height,
    viewBox: `0 0 ${width} ${height}`
  }
}
