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

// Koch Snowflake Generator
export function generateKochSnowflake(width, height, iterations = 4) {
  const pattern = Array(height).fill().map(() => Array(width).fill(0));
  
  const centerX = width / 2;
  const centerY = height / 2;
  const size = Math.min(width, height) * 0.35;
  
  // Starting triangle points (equilateral)
  const angle1 = -Math.PI / 2;
  const angle2 = angle1 + (2 * Math.PI) / 3;
  const angle3 = angle2 + (2 * Math.PI) / 3;
  
  const p1 = { x: centerX + size * Math.cos(angle1), y: centerY + size * Math.sin(angle1) };
  const p2 = { x: centerX + size * Math.cos(angle2), y: centerY + size * Math.sin(angle2) };
  const p3 = { x: centerX + size * Math.cos(angle3), y: centerY + size * Math.sin(angle3) };
  
  // Generate Koch curve for each side of the triangle
  drawKochCurve(pattern, p1, p2, iterations);
  drawKochCurve(pattern, p2, p3, iterations);
  drawKochCurve(pattern, p3, p1, iterations);
  
  return pattern;
}

// Recursive Koch curve drawing
function drawKochCurve(pattern, start, end, depth) {
  if (depth === 0) {
    drawLine(pattern, start.x, start.y, end.x, end.y);
    return;
  }
  
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  
  // Divide line into three segments
  const p1 = { x: start.x + dx / 3, y: start.y + dy / 3 };
  const p2 = { x: start.x + 2 * dx / 3, y: start.y + 2 * dy / 3 };
  
  // Calculate peak point (equilateral triangle)
  const angle = Math.atan2(dy, dx) - Math.PI / 3;
  const length = Math.sqrt(dx * dx + dy * dy) / 3;
  const peak = {
    x: p1.x + length * Math.cos(angle),
    y: p1.y + length * Math.sin(angle)
  };
  
  // Recursively draw four segments
  drawKochCurve(pattern, start, p1, depth - 1);
  drawKochCurve(pattern, p1, peak, depth - 1);
  drawKochCurve(pattern, peak, p2, depth - 1);
  drawKochCurve(pattern, p2, end, depth - 1);
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
