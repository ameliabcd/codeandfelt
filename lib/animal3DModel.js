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
  
  // Body (ellipsoid in 3D)
  const bodyDepth = bodySize * 0.6
  parts.push({
    type: 'ellipse',
    cx: isometricProject(centerX, centerY, centerZ).x,
    cy: isometricProject(centerX, centerY, centerZ).y,
    rx: bodySize * 0.8,
    ry: bodySize * 0.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 0.9
  })
  
  // Body depth (ellipse for back)
  parts.push({
    type: 'ellipse',
    cx: isometricProject(centerX, centerY + bodyDepth, centerZ).x,
    cy: isometricProject(centerX, centerY + bodyDepth, centerZ).y,
    rx: bodySize * 0.8,
    ry: bodySize * 0.5,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 0.7
  })
  
  // Body side (connecting front and back)
  const bodyTop = isometricProject(centerX, centerY, centerZ + bodySize * 0.5).y
  const bodyBottom = isometricProject(centerX, centerY, centerZ - bodySize * 0.5).y
  const bodyBackTop = isometricProject(centerX, centerY + bodyDepth, centerZ + bodySize * 0.5).y
  const bodyBackBottom = isometricProject(centerX, centerY + bodyDepth, centerZ - bodySize * 0.5).y
  
  parts.push({
    type: 'path',
    d: `M ${isometricProject(centerX - bodySize * 0.8, centerY, centerZ + bodySize * 0.5).x} ${bodyTop}
         L ${isometricProject(centerX - bodySize * 0.8, centerY + bodyDepth, centerZ + bodySize * 0.5).x} ${bodyBackTop}
         L ${isometricProject(centerX - bodySize * 0.8, centerY + bodyDepth, centerZ - bodySize * 0.5).x} ${bodyBackBottom}
         L ${isometricProject(centerX - bodySize * 0.8, centerY, centerZ - bodySize * 0.5).x} ${bodyBottom}
         Z`,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 1.5,
    opacity: 0.8
  })
  
  // Head (in front, above body)
  const headX = centerX
  const headY = centerY - bodySize * 0.3
  const headZ = centerZ + bodySize * 0.5
  
  parts.push({
    type: 'ellipse',
    cx: isometricProject(headX, headY, headZ).x,
    cy: isometricProject(headX, headY, headZ).y,
    rx: headSize * 0.9,
    ry: headSize * 0.7,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 0.9
  })
  
  // Head depth
  const headDepth = headSize * 0.5
  parts.push({
    type: 'ellipse',
    cx: isometricProject(headX, headY + headDepth, headZ).x,
    cy: isometricProject(headX, headY + headDepth, headZ).y,
    rx: headSize * 0.9,
    ry: headSize * 0.7,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 2,
    opacity: 0.7
  })
  
  // Left Ear (front)
  const earLeftX = headX - headSize * 0.6
  const earLeftY = headY - headSize * 0.3
  const earLeftZ = headZ + headSize * 0.3
  
  parts.push({
    type: 'ellipse',
    cx: isometricProject(earLeftX, earLeftY, earLeftZ).x,
    cy: isometricProject(earLeftX, earLeftY, earLeftZ).y,
    rx: earSize,
    ry: earSize * 0.7,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 1.5,
    opacity: 0.9
  })
  
  // Right Ear (front)
  const earRightX = headX + headSize * 0.6
  const earRightY = headY - headSize * 0.3
  const earRightZ = headZ + headSize * 0.3
  
  parts.push({
    type: 'ellipse',
    cx: isometricProject(earRightX, earRightY, earRightZ).x,
    cy: isometricProject(earRightX, earRightY, earRightZ).y,
    rx: earSize,
    ry: earSize * 0.7,
    fill: accentColor,
    stroke: '#333',
    strokeWidth: 1.5,
    opacity: 0.9
  })
  
  // Left Arm (front)
  const armLeftX = centerX - bodySize * 0.8
  const armLeftY = centerY - bodySize * 0.2
  const armLeftZ = centerZ + bodySize * 0.2
  
  const armLeftEnd = isometricProject(armLeftX - armLength, armLeftY, armLeftZ)
  const armLeftStart = isometricProject(armLeftX, armLeftY, armLeftZ)
  
  parts.push({
    type: 'ellipse',
    cx: armLeftStart.x,
    cy: armLeftStart.y,
    rx: armWidth,
    ry: armLength,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 1.5,
    opacity: 0.9,
    transform: `rotate(-30 ${armLeftStart.x} ${armLeftStart.y})`
  })
  
  // Right Arm (front)
  const armRightX = centerX + bodySize * 0.8
  const armRightY = centerY - bodySize * 0.2
  const armRightZ = centerZ + bodySize * 0.2
  
  const armRightStart = isometricProject(armRightX, armRightY, armRightZ)
  
  parts.push({
    type: 'ellipse',
    cx: armRightStart.x,
    cy: armRightStart.y,
    rx: armWidth,
    ry: armLength,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 1.5,
    opacity: 0.9,
    transform: `rotate(30 ${armRightStart.x} ${armRightStart.y})`
  })
  
  // Left Leg (front)
  const legLeftX = centerX - bodySize * 0.4
  const legLeftY = centerY + bodySize * 0.5
  const legLeftZ = centerZ - bodySize * 0.3
  
  const legLeftStart = isometricProject(legLeftX, legLeftY, legLeftZ)
  
  parts.push({
    type: 'ellipse',
    cx: legLeftStart.x,
    cy: legLeftStart.y,
    rx: legWidth,
    ry: legLength,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 1.5,
    opacity: 0.9
  })
  
  // Right Leg (front)
  const legRightX = centerX + bodySize * 0.4
  const legRightY = centerY + bodySize * 0.5
  const legRightZ = centerZ - bodySize * 0.3
  
  const legRightStart = isometricProject(legRightX, legRightY, legRightZ)
  
  parts.push({
    type: 'ellipse',
    cx: legRightStart.x,
    cy: legRightStart.y,
    rx: legWidth,
    ry: legLength,
    fill: mainColor,
    stroke: '#333',
    strokeWidth: 1.5,
    opacity: 0.9
  })
  
  // Eyes
  const eyeLeft = isometricProject(headX - headSize * 0.3, headY, headZ + headSize * 0.2)
  const eyeRight = isometricProject(headX + headSize * 0.3, headY, headZ + headSize * 0.2)
  
  parts.push({
    type: 'circle',
    cx: eyeLeft.x,
    cy: eyeLeft.y,
    r: 4,
    fill: '#333'
  })
  
  parts.push({
    type: 'circle',
    cx: eyeRight.x,
    cy: eyeRight.y,
    r: 4,
    fill: '#333'
  })
  
  // Nose
  const nose = isometricProject(headX, headY + headSize * 0.2, headZ + headSize * 0.4)
  
  parts.push({
    type: 'ellipse',
    cx: nose.x,
    cy: nose.y,
    rx: 6,
    ry: 4,
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
