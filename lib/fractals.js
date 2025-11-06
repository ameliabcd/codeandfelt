// Fractal Pattern Generation Utilities

// Complex number operations
class Complex {
  constructor(real, imag) {
    this.real = real;
    this.imag = imag;
  }

  add(other) {
    return new Complex(this.real + other.real, this.imag + other.imag);
  }

  multiply(other) {
    return new Complex(
      this.real * other.real - this.imag * other.imag,
      this.real * other.imag + this.imag * other.real
    );
  }

  magnitude() {
    return Math.sqrt(this.real * this.real + this.imag * this.imag);
  }
}

// Mandelbrot Set Generator
export function generateMandelbrot(width, height, maxIterations = 100, zoom = 1, offsetX = 0, offsetY = 0) {
  const pattern = [];
  const scale = 4 / Math.min(width, height) / zoom;
  
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      // Map pixel coordinates to complex plane
      const real = (x - width / 2) * scale + offsetX;
      const imag = (y - height / 2) * scale + offsetY;
      
      const c = new Complex(real, imag);
      let z = new Complex(0, 0);
      let iterations = 0;
      
      // Iterate z = z^2 + c
      while (iterations < maxIterations && z.magnitude() < 2) {
        z = z.multiply(z).add(c);
        iterations++;
      }
      
      // Normalize iteration count to 0-1 range
      const normalized = iterations / maxIterations;
      row.push(normalized);
    }
    pattern.push(row);
  }
  
  return pattern;
}

// Julia Set Generator
export function generateJulia(width, height, maxIterations = 100, realC = -0.7, imagC = 0.27015, zoom = 1, offsetX = 0, offsetY = 0) {
  const pattern = [];
  const scale = 4 / Math.min(width, height) / zoom;
  const c = new Complex(realC, imagC);
  
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      // Map pixel coordinates to complex plane
      const real = (x - width / 2) * scale + offsetX;
      const imag = (y - height / 2) * scale + offsetY;
      
      let z = new Complex(real, imag);
      let iterations = 0;
      
      // Iterate z = z^2 + c
      while (iterations < maxIterations && z.magnitude() < 2) {
        z = z.multiply(z).add(c);
        iterations++;
      }
      
      // Normalize iteration count to 0-1 range
      const normalized = iterations / maxIterations;
      row.push(normalized);
    }
    pattern.push(row);
  }
  
  return pattern;
}

// Sierpinski Triangle Generator
export function generateSierpinski(width, height, iterations = 6) {
  const pattern = Array(height).fill().map(() => Array(width).fill(0));
  
  // Define triangle vertices
  const p1 = { x: width / 2, y: 20 };
  const p2 = { x: 20, y: height - 20 };
  const p3 = { x: width - 20, y: height - 20 };
  
  // Starting point (center of triangle)
  let point = {
    x: (p1.x + p2.x + p3.x) / 3,
    y: (p1.y + p2.y + p3.y) / 3
  };
  
  // Generate Sierpinski triangle points
  for (let i = 0; i < iterations * 1000; i++) {
    // Randomly choose one of the three vertices
    const vertices = [p1, p2, p3];
    const randomVertex = vertices[Math.floor(Math.random() * 3)];
    
    // Move halfway towards the chosen vertex
    point.x = (point.x + randomVertex.x) / 2;
    point.y = (point.y + randomVertex.y) / 2;
    
    // Mark the point in the pattern
    const x = Math.floor(point.x);
    const y = Math.floor(point.y);
    if (x >= 0 && x < width && y >= 0 && y < height) {
      pattern[y][x] = 1;
    }
  }
  
  return pattern;
}

// Dragon Curve Generator
export function generateDragonCurve(width, height, iterations = 12) {
  const pattern = Array(height).fill().map(() => Array(width).fill(0));
  
  // Starting line segment
  let segments = [
    { x1: width * 0.3, y1: height * 0.5, x2: width * 0.7, y2: height * 0.5 }
  ];
  
  for (let i = 0; i < iterations; i++) {
    const newSegments = [];
    
    for (const segment of segments) {
      const midX = (segment.x1 + segment.x2) / 2;
      const midY = (segment.y1 + segment.y2) / 2;
      
      // Calculate perpendicular direction
      const dx = segment.x2 - segment.x1;
      const dy = segment.y2 - segment.y1;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      // Perpendicular vector (rotated 90 degrees)
      const perpX = -dy / length * (length * 0.5);
      const perpY = dx / length * (length * 0.5);
      
      // Create two new segments
      newSegments.push({
        x1: segment.x1,
        y1: segment.y1,
        x2: midX + perpX,
        y2: midY + perpY
      });
      
      newSegments.push({
        x1: midX + perpX,
        y1: midY + perpY,
        x2: segment.x2,
        y2: segment.y2
      });
    }
    
    segments = newSegments;
  }
  
  // Draw segments on pattern
  for (const segment of segments) {
    drawLine(pattern, segment.x1, segment.y1, segment.x2, segment.y2);
  }
  
  return pattern;
}

// Helper function to draw lines
// Optimized fast line drawing for Koch snowflake
function drawLineFast(pattern, x1, y1, x2, y2) {
  const width = pattern[0].length;
  const height = pattern.length;
  
  // Convert to integers for faster math
  let x0 = Math.round(x1);
  let y0 = Math.round(y1);
  const x1_int = Math.round(x2);
  const y1_int = Math.round(y2);
  
  const dx = Math.abs(x1_int - x0);
  const dy = Math.abs(y1_int - y0);
  const sx = x0 < x1_int ? 1 : -1;
  const sy = y0 < y1_int ? 1 : -1;
  let err = dx - dy;
  
  // Pre-calculate bounds check
  const widthMinus1 = width - 1;
  const heightMinus1 = height - 1;
  
  // Draw line with optimized bounds checking
  while (true) {
    // Fast bounds check - only check if potentially out of bounds
    if (x0 >= 0 && x0 <= widthMinus1 && y0 >= 0 && y0 <= heightMinus1) {
      pattern[y0][x0] = 1;
    }
    
    if (x0 === x1_int && y0 === y1_int) break;
    
    const e2 = err << 1; // Multiply by 2 using bit shift (faster)
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
}

// Original drawLine function kept for other uses
function drawLine(pattern, x1, y1, x2, y2) {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;
  
  let x = x1;
  let y = y1;
  
  while (true) {
    if (x >= 0 && x < pattern[0].length && y >= 0 && y < pattern.length) {
      pattern[y][x] = 1;
    }
    
    if (x === x2 && y === y2) break;
    
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }
}

// Convert fractal pattern to color grid with enhanced structure visibility
export function fractalToColors(pattern, colors, invert = false) {
  const height = pattern.length;
  const width = pattern[0].length;
  const colorGrid = [];
  
  // Use fewer colors for fractals to make structure more visible
  const fractalColors = colors.length > 2 ? [colors[0], colors[2]] : colors;
  
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      let value = pattern[y][x];
      
      if (invert) {
        value = 1 - value;
      }
      
      // Apply stronger contrast to emphasize fractal boundaries
      value = Math.pow(value, 0.6); // More dramatic contrast
      
      // Create sharp boundaries to show fractal structure
      // Discretize into bands to make structure visible
      const numBands = Math.min(8, fractalColors.length * 2);
      const bandValue = Math.floor(value * numBands) / numBands;
      
      // Map to color with sharp transitions
      const colorIndex = Math.floor(bandValue * (fractalColors.length - 0.01));
      const color = fractalColors[Math.min(colorIndex, fractalColors.length - 1)];
      
      row.push(color);
    }
    colorGrid.push(row);
  }
  
  return colorGrid;
}

// Enhanced Koch Snowflake Generator with Symmetry Controls
export function generateKochSnowflake(width, height, iterations = 3, symmetry = 3, exportMode = false) {
  const pattern = Array(height).fill().map(() => Array(width).fill(0));
  
  // Limit iterations to 1 max for fast rendering (was causing slowdown)
  const maxIterations = Math.min(iterations, 1);
  
  const centerX = width / 2;
  const centerY = height / 2;
  const size = Math.min(width, height) * 0.35;
  
  // Generate base segments for the symmetry
  const segments = [];
  
  if (symmetry === 3) {
    // Classic triangle (3-fold symmetry)
    const angle1 = -Math.PI / 2;
    const angle2 = angle1 + (2 * Math.PI) / 3;
    const angle3 = angle2 + (2 * Math.PI) / 3;
    
    const p1 = { x: centerX + size * Math.cos(angle1), y: centerY + size * Math.sin(angle1) };
    const p2 = { x: centerX + size * Math.cos(angle2), y: centerY + size * Math.sin(angle2) };
    const p3 = { x: centerX + size * Math.cos(angle3), y: centerY + size * Math.sin(angle3) };
    
    collectKochSegments(p1, p2, maxIterations, segments);
    collectKochSegments(p2, p3, maxIterations, segments);
    collectKochSegments(p3, p1, maxIterations, segments);
  } else {
    // Multi-fold symmetry (4, 5, 6-fold)
    for (let i = 0; i < symmetry; i++) {
      const angle1 = (2 * Math.PI * i) / symmetry;
      const angle2 = (2 * Math.PI * (i + 1)) / symmetry;
      
      const p1 = { x: centerX + size * Math.cos(angle1), y: centerY + size * Math.sin(angle1) };
      const p2 = { x: centerX + size * Math.cos(angle2), y: centerY + size * Math.sin(angle2) };
      
      collectKochSegments(p1, p2, maxIterations, segments);
    }
  }
  
  // Use optimized fast line drawing for all segments
  segments.forEach(seg => {
    drawLineFast(pattern, seg.x1, seg.y1, seg.x2, seg.y2);
  });
  
  if (exportMode) {
    return { pattern, segments, centerX, centerY, size, symmetry };
  }
  
  return pattern;
}

// Collect Koch curve segments iteratively (faster than recursive drawing)
function collectKochSegments(start, end, depth, segments) {
  let currentSegments = [{ x1: start.x, y1: start.y, x2: end.x, y2: end.y }];
  
  for (let i = 0; i < depth; i++) {
    const nextSegments = [];
    
    currentSegments.forEach(seg => {
      const dx = seg.x2 - seg.x1;
      const dy = seg.y2 - seg.y1;
      
      // Divide line into three segments
      const p1 = { x: seg.x1 + dx / 3, y: seg.y1 + dy / 3 };
      const p2 = { x: seg.x1 + 2 * dx / 3, y: seg.y1 + 2 * dy / 3 };
      
      // Calculate peak point (equilateral triangle)
      const angle = Math.atan2(dy, dx) - Math.PI / 3;
      const length = Math.sqrt(dx * dx + dy * dy) / 3;
      const peak = {
        x: p1.x + length * Math.cos(angle),
        y: p1.y + length * Math.sin(angle)
      };
      
      // Add four new segments
      nextSegments.push(
        { x1: seg.x1, y1: seg.y1, x2: p1.x, y2: p1.y },
        { x1: p1.x, y1: p1.y, x2: peak.x, y2: peak.y },
        { x1: peak.x, y1: peak.y, x2: p2.x, y2: p2.y },
        { x1: p2.x, y1: p2.y, x2: seg.x2, y2: seg.y2 }
      );
    });
    
    currentSegments = nextSegments;
  }
  
  // Add all final segments to the result
  segments.push(...currentSegments);
}

// Mandelbrot Wool Layering Visualization
export function generateMandelbrotWoolLayers(width, height, maxIterations = 100, zoom = 1, offsetX = 0, offsetY = 0) {
  const pattern = Array(height).fill().map(() => Array(width).fill(0));
  const woolLayers = Array(height).fill().map(() => Array(width).fill({ thickness: 0, layers: 0 }));
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Map pixel coordinates to complex plane
      const real = (x - width / 2) * zoom / width + offsetX;
      const imag = (y - height / 2) * zoom / height + offsetY;
      
      let zReal = 0;
      let zImag = 0;
      let iterations = 0;
      
      // Mandelbrot iteration
      while (iterations < maxIterations && zReal * zReal + zImag * zImag < 4) {
        const temp = zReal * zReal - zImag * zImag + real;
        zImag = 2 * zReal * zImag + imag;
        zReal = temp;
        iterations++;
      }
      
      // Calculate wool properties based on escape behavior
      const escapeTime = iterations / maxIterations;
      const thickness = escapeTime < 1 ? 1 - escapeTime : 0;
      const layers = Math.floor(iterations / 10) + 1;
      
      pattern[y][x] = escapeTime;
      woolLayers[y][x] = { thickness, layers, iterations };
    }
  }
  
  return { pattern, woolLayers, maxIterations };
}

// Phi Matrix Composer - Golden Ratio Visualization
export function generatePhiMatrix(width, height, gridSize = 20, phiRatio = 1.618) {
  const pattern = Array(height).fill().map(() => Array(width).fill(0));
  const phiGrid = Array(height).fill().map(() => Array(width).fill({ ratio: 0, fibonacci: 0, golden: false }));
  
  // Calculate golden ratio and Fibonacci sequence
  const fibonacci = [1, 1];
  for (let i = 2; i < 20; i++) {
    fibonacci.push(fibonacci[i-1] + fibonacci[i-2]);
  }
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Create golden ratio grid
      const gridX = Math.floor(x / gridSize);
      const gridY = Math.floor(y / gridSize);
      
      // Calculate golden ratio proportions
      const ratio = (gridX + 1) / (gridY + 1);
      const isGolden = Math.abs(ratio - phiRatio) < 0.1;
      const fibonacciIndex = fibonacci.findIndex(f => Math.abs(ratio - (fibonacci[fibonacci.indexOf(f) + 1] / f)) < 0.1);
      
      // Create spiral pattern based on golden ratio
      const centerX = width / 2;
      const centerY = height / 2;
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      
      // Golden spiral calculation
      const goldenAngle = angle * phiRatio;
      const spiralValue = Math.sin(goldenAngle + distance * 0.1) * 0.5 + 0.5;
      
      pattern[y][x] = spiralValue;
      phiGrid[y][x] = { 
        ratio, 
        fibonacci: fibonacciIndex >= 0 ? fibonacci[fibonacciIndex] : 0,
        golden: isGolden,
        spiral: spiralValue
      };
    }
  }
  
  return { pattern, phiGrid, phiRatio, fibonacci };
}

// Generate random Julia set parameters
export function getRandomJuliaParams() {
  const params = [
    { real: -0.7, imag: 0.27015 },
    { real: -0.4, imag: 0.6 },
    { real: 0.285, imag: 0.01 },
    { real: -0.8, imag: 0.156 },
    { real: 0.3, imag: 0.5 },
    { real: -0.7269, imag: 0.1889 }
  ];
  
  return params[Math.floor(Math.random() * params.length)];
}
