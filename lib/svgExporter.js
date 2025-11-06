// SVG Export System for Felting Guides
export function exportKochSnowflakeSVG(segments, centerX, centerY, size, symmetry, colors) {
  const svgWidth = size * 3;
  const svgHeight = size * 3;
  
  let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<defs>`;
  
  // Define felting zones with different colors
  colors.forEach((color, index) => {
    svg += `<pattern id="felt-${index}" patternUnits="userSpaceOnUse" width="4" height="4">`;
    svg += `<rect width="4" height="4" fill="${color}"/>`;
    svg += `<circle cx="2" cy="2" r="1" fill="${color}" opacity="0.3"/>`;
    svg += `</pattern>`;
  });
  
  svg += `</defs>`;
  
  // Background
  svg += `<rect width="100%" height="100%" fill="#f8f9fa" stroke="#dee2e6" stroke-width="2"/>`;
  
  // Title
  svg += `<text x="${svgWidth/2}" y="30" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold">`;
  svg += `Koch Snowflake - ${symmetry}-fold Symmetry`;
  svg += `</text>`;
  
  // Instructions
  svg += `<text x="${svgWidth/2}" y="50" text-anchor="middle" font-family="Arial" font-size="12">`;
  svg += `Felting Guide: Use different colored wool for each zone`;
  svg += `</text>`;
  
  // Draw segments with felting zones
  segments.forEach((seg, index) => {
    const colorIndex = index % colors.length;
    svg += `<line x1="${seg.x1}" y1="${seg.y1}" x2="${seg.x2}" y2="${seg.y2}" `;
    svg += `stroke="url(#felt-${colorIndex})" stroke-width="3" stroke-linecap="round"/>`;
  });
  
  // Add measurement guides
  svg += `<line x1="${centerX - size}" y1="${centerY + size + 20}" x2="${centerX + size}" y2="${centerY + size + 20}" `;
  svg += `stroke="#666" stroke-width="1" stroke-dasharray="5,5"/>`;
  svg += `<text x="${centerX}" y="${centerY + size + 35}" text-anchor="middle" font-family="Arial" font-size="10">`;
  svg += `Size: ${Math.round(size * 2)} units`;
  svg += `</text>`;
  
  svg += `</svg>`;
  return svg;
}

export function exportMandelbrotWoolSVG(woolLayers, width, height, colors) {
  const svgWidth = width * 2;
  const svgHeight = height * 2;
  
  let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<defs>`;
  
  // Define wool texture patterns
  colors.forEach((color, index) => {
    svg += `<pattern id="wool-${index}" patternUnits="userSpaceOnUse" width="8" height="8">`;
    svg += `<rect width="8" height="8" fill="${color}"/>`;
    svg += `<circle cx="2" cy="2" r="1" fill="${color}" opacity="0.4"/>`;
    svg += `<circle cx="6" cy="6" r="1" fill="${color}" opacity="0.4"/>`;
    svg += `</pattern>`;
  });
  
  svg += `</defs>`;
  
  // Background
  svg += `<rect width="100%" height="100%" fill="#f8f9fa" stroke="#dee2e6" stroke-width="2"/>`;
  
  // Title
  svg += `<text x="${svgWidth/2}" y="30" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold">`;
  svg += `Mandelbrot Wool Layering Guide`;
  svg += `</text>`;
  
  // Draw wool layers
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const wool = woolLayers[y][x];
      if (wool.thickness > 0) {
        const colorIndex = Math.floor(wool.layers / 2) % colors.length;
        const opacity = wool.thickness;
        const size = Math.max(1, wool.layers);
        
        svg += `<rect x="${x * 2}" y="${y * 2}" width="${size}" height="${size}" `;
        svg += `fill="url(#wool-${colorIndex})" opacity="${opacity}"/>`;
      }
    }
  }
  
  // Legend
  svg += `<text x="20" y="${svgHeight - 60}" font-family="Arial" font-size="12" font-weight="bold">`;
  svg += `Wool Layering Guide:`;
  svg += `</text>`;
  svg += `<text x="20" y="${svgHeight - 40}" font-family="Arial" font-size="10">`;
  svg += `• Thickness: Darker = More wool layers`;
  svg += `</text>`;
  svg += `<text x="20" y="${svgHeight - 25}" font-family="Arial" font-size="10">`;
  svg += `• Colors: Different zones for different wool types`;
  svg += `</text>`;
  
  svg += `</svg>`;
  return svg;
}

export function exportPhiMatrixSVG(phiGrid, width, height, colors) {
  const svgWidth = width * 2;
  const svgHeight = height * 2;
  
  let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<defs>`;
  
  // Define golden ratio patterns
  colors.forEach((color, index) => {
    svg += `<pattern id="phi-${index}" patternUnits="userSpaceOnUse" width="16" height="16">`;
    svg += `<rect width="16" height="16" fill="${color}"/>`;
    svg += `<path d="M8,0 L16,8 L8,16 L0,8 Z" fill="${color}" opacity="0.3"/>`;
    svg += `</pattern>`;
  });
  
  svg += `</defs>`;
  
  // Background
  svg += `<rect width="100%" height="100%" fill="#f8f9fa" stroke="#dee2e6" stroke-width="2"/>`;
  
  // Title
  svg += `<text x="${svgWidth/2}" y="30" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold">`;
  svg += `Phi Matrix - Golden Ratio Sculpting Guide`;
  svg += `</text>`;
  
  // Draw golden ratio zones
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const phi = phiGrid[y][x];
      if (phi.golden) {
        const colorIndex = phi.fibonacci % colors.length;
        svg += `<rect x="${x * 2}" y="${y * 2}" width="2" height="2" `;
        svg += `fill="url(#phi-${colorIndex})" opacity="0.8"/>`;
      }
    }
  }
  
  // Add golden spiral
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  let spiralPath = `M ${centerX} ${centerY}`;
  
  for (let i = 0; i < 100; i++) {
    const angle = i * 0.1;
    const radius = i * 0.5;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    spiralPath += ` L ${x} ${y}`;
  }
  
  svg += `<path d="${spiralPath}" fill="none" stroke="#d4af37" stroke-width="2" opacity="0.6"/>`;
  
  // Legend
  svg += `<text x="20" y="${svgHeight - 60}" font-family="Arial" font-size="12" font-weight="bold">`;
  svg += `Golden Ratio Sculpting Guide:`;
  svg += `</text>`;
  svg += `<text x="20" y="${svgHeight - 40}" font-family="Arial" font-size="10">`;
  svg += `• Golden zones: Use Fibonacci proportions`;
  svg += `</text>`;
  svg += `<text x="20" y="${svgHeight - 25}" font-family="Arial" font-size="10">`;
  svg += `• Spiral: Follow golden ratio for natural flow`;
  svg += `</text>`;
  
  svg += `</svg>`;
  return svg;
}

export function exportGenericPatternSVG(pattern, colors, patternType) {
  const width = pattern[0]?.length || 1;
  const height = pattern.length;
  const svgWidth = width * 2;
  const svgHeight = height * 2;
  
  let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<defs>`;
  
  // Define generic felting patterns
  colors.forEach((color, index) => {
    svg += `<pattern id="pattern-${index}" patternUnits="userSpaceOnUse" width="6" height="6">`;
    svg += `<rect width="6" height="6" fill="${color}"/>`;
    svg += `<circle cx="3" cy="3" r="1" fill="${color}" opacity="0.4"/>`;
    svg += `</pattern>`;
  });
  
  svg += `</defs>`;
  
  // Background
  svg += `<rect width="100%" height="100%" fill="#f8f9fa" stroke="#dee2e6" stroke-width="2"/>`;
  
  // Title
  svg += `<text x="${svgWidth/2}" y="30" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold">`;
  svg += `${patternType.charAt(0).toUpperCase() + patternType.slice(1)} Pattern - Felting Guide`;
  svg += `</text>`;
  
  // Draw pattern
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const colorIndex = pattern[y][x] % colors.length;
      svg += `<rect x="${x * 2}" y="${y * 2}" width="2" height="2" `;
      svg += `fill="url(#pattern-${colorIndex})"/>`;
    }
  }
  
  // Legend
  svg += `<text x="20" y="${svgHeight - 40}" font-family="Arial" font-size="12" font-weight="bold">`;
  svg += `Felting Guide:`;
  svg += `</text>`;
  svg += `<text x="20" y="${svgHeight - 25}" font-family="Arial" font-size="10">`;
  svg += `• Each color represents a different wool type`;
  svg += `</text>`;
  
  svg += `</svg>`;
  return svg;
}

export function downloadSVG(svgContent, filename) {
  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Export 3D Animal Pattern as Multi-Page SVG
export function exportAnimal3DPatternSVG(animalPattern) {
  if (!animalPattern || !animalPattern.patternPieces) return ''
  
  const { animalName, patternPieces, assemblyInstructions, measurements, colors } = animalPattern
  
  // Create a multi-page SVG with all pattern pieces
  let svgPages = []
  
  // Get all pattern pieces
  const allPieces = []
  
  // Helper to extract pieces from nested structure
  function extractPieces(obj, prefix = '') {
    Object.keys(obj).forEach(key => {
      const value = obj[key]
      if (value && typeof value === 'object' && value.points) {
        // It's a pattern piece
        allPieces.push({
          name: prefix ? `${prefix}_${key}` : key,
          piece: value
        })
      } else if (value && typeof value === 'object') {
        // It's a nested object
        extractPieces(value, prefix ? `${prefix}_${key}` : key)
      }
    })
  }
  
  extractPieces(patternPieces)
  
  // Create SVG page for each piece (or group related pieces)
  const svgWidth = 600
  const svgHeight = 800
  
  // Page 1: All pattern pieces
  let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`
  svg += `<defs>`
  
  // Define colors
  colors.forEach((color, index) => {
    svg += `<pattern id="animal-pattern-${index}" patternUnits="userSpaceOnUse" width="6" height="6">`
    svg += `<rect width="6" height="6" fill="${color}"/>`
    svg += `<circle cx="3" cy="3" r="1" fill="${color}" opacity="0.4"/>`
    svg += `</pattern>`
  })
  
  svg += `</defs>`
  
  // Background
  svg += `<rect width="100%" height="100%" fill="#f8f9fa" stroke="#dee2e6" stroke-width="2"/>`
  
  // Title
  svg += `<text x="${svgWidth/2}" y="30" text-anchor="middle" font-family="Arial" font-size="18" font-weight="bold">`
  svg += `${animalName} - 3D Felting Pattern`
  svg += `</text>`
  
  // Measurements
  svg += `<text x="20" y="60" font-family="Arial" font-size="12" font-weight="bold">`
  svg += `Measurements:`
  svg += `</text>`
  
  let yPos = 80
  Object.keys(measurements).forEach(key => {
    svg += `<text x="40" y="${yPos}" font-family="Arial" font-size="10">`
    svg += `${key}: ${measurements[key]}`
    svg += `</text>`
    yPos += 20
  })
  
  // Draw pattern pieces
  let currentY = 180
  let currentX = 50
  const pieceSpacing = 120
  const maxWidth = svgWidth - 100
  let maxHeightInRow = 0
  
  allPieces.forEach((item, index) => {
    const { name, piece } = item
    const { points, width, height, color, seamAllowance } = piece
    
    // Check if we need a new row
    if (currentX + width > maxWidth) {
      currentX = 50
      currentY += maxHeightInRow + pieceSpacing
      maxHeightInRow = 0
    }
    
    // Track max height in current row
    maxHeightInRow = Math.max(maxHeightInRow, height)
    
    // Draw piece outline
    let pathData = `M ${currentX + points[0].x} ${currentY + points[0].y}`
    for (let i = 1; i < points.length; i++) {
      pathData += ` L ${currentX + points[i].x} ${currentY + points[i].y}`
    }
    pathData += ' Z'
    
    // Find color index
    const colorIndex = colors.indexOf(color) >= 0 ? colors.indexOf(color) : 0
    
    svg += `<path d="${pathData}" fill="url(#animal-pattern-${colorIndex})" stroke="#333" stroke-width="1"/>`
    
    // Add seam allowance line
    if (seamAllowance) {
      const innerPoints = points.map(p => ({
        x: p.x + seamAllowance * (p.x > width / 2 ? 1 : -1),
        y: p.y + seamAllowance * (p.y > height / 2 ? 1 : -1)
      }))
      let innerPath = `M ${currentX + innerPoints[0].x} ${currentY + innerPoints[0].y}`
      for (let i = 1; i < innerPoints.length; i++) {
        innerPath += ` L ${currentX + innerPoints[i].x} ${currentY + innerPoints[i].y}`
      }
      innerPath += ' Z'
      svg += `<path d="${innerPath}" fill="none" stroke="#999" stroke-width="0.5" stroke-dasharray="2,2"/>`
    }
    
    // Add piece label
    svg += `<text x="${currentX + width/2}" y="${currentY - 10}" text-anchor="middle" font-family="Arial" font-size="10" font-weight="bold">`
    svg += `${name.replace(/_/g, ' ')}`
    svg += `</text>`
    
    currentX += width + 30
  })
  
  svg += `</svg>`
  svgPages.push(svg)
  
  // Page 2: Assembly instructions
  let svg2 = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`
  svg2 += `<rect width="100%" height="100%" fill="#f8f9fa" stroke="#dee2e6" stroke-width="2"/>`
  
  svg2 += `<text x="${svgWidth/2}" y="30" text-anchor="middle" font-family="Arial" font-size="18" font-weight="bold">`
  svg2 += `${animalName} - Assembly Instructions`
  svg2 += `</text>`
  
  let instructionY = 80
  assemblyInstructions.forEach((instruction, index) => {
    svg2 += `<text x="40" y="${instructionY}" font-family="Arial" font-size="12">`
    svg2 += `${instruction}`
    svg2 += `</text>`
    instructionY += 25
  })
  
  svg2 += `</svg>`
  svgPages.push(svg2)
  
  // Return only the first page (single valid SVG)
  // Multiple pages would require separate files
  return svgPages[0] || svg
}
