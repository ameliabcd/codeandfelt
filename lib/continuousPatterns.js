// Continuous Pattern Generation with Smooth Interpolation

// Color utilities
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Smooth color interpolation
export function interpolateColor(color1, color2, factor) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return color1;
  
  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor);
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor);
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor);
  
  return rgbToHex(r, g, b);
}

// Multi-color interpolation
export function interpolateColors(colors, factor) {
  if (colors.length === 0) return '#000000';
  if (colors.length === 1) return colors[0];
  
  const scaledFactor = factor * (colors.length - 1);
  const index = Math.floor(scaledFactor);
  const localFactor = scaledFactor - index;
  
  if (index >= colors.length - 1) return colors[colors.length - 1];
  
  return interpolateColor(colors[index], colors[index + 1], localFactor);
}

// Smooth noise function (Perlin-like)
export function smoothNoise(x, y, scale = 1) {
  x *= scale;
  y *= scale;
  
  const intX = Math.floor(x);
  const intY = Math.floor(y);
  const fracX = x - intX;
  const fracY = y - intY;
  
  // Simple hash function for pseudo-random values
  const hash = (x, y) => {
    let h = x * 374761393 + y * 668265263;
    h = (h ^ (h >> 13)) * 1274126177;
    return (h ^ (h >> 16)) / 2147483648.0;
  };
  
  const a = hash(intX, intY);
  const b = hash(intX + 1, intY);
  const c = hash(intX, intY + 1);
  const d = hash(intX + 1, intY + 1);
  
  // Smooth interpolation
  const smoothstep = (t) => t * t * (3 - 2 * t);
  const u = smoothstep(fracX);
  const v = smoothstep(fracY);
  
  const i1 = a * (1 - u) + b * u;
  const i2 = c * (1 - u) + d * u;
  
  return i1 * (1 - v) + i2 * v;
}

// Octave noise (multiple layers)
export function octaveNoise(x, y, octaves = 4, persistence = 0.5, scale = 0.1) {
  let value = 0;
  let amplitude = 1;
  let frequency = scale;
  let maxValue = 0;
  
  for (let i = 0; i < octaves; i++) {
    value += smoothNoise(x, y, frequency) * amplitude;
    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= 2;
  }
  
  return value / maxValue;
}

// Generate continuous fractal pattern
export function generateContinuousFractal(width, height, fractalType, params, colors) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(width, height);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let value = 0;
      
      switch (fractalType) {
        case 'mandelbrot':
          value = calculateMandelbrotSmooth(x, y, width, height, params);
          break;
        case 'julia':
          value = calculateJuliaSmooth(x, y, width, height, params);
          break;
        case 'noise':
          value = octaveNoise(x, y, 6, 0.6, params.scale || 0.01);
          // Enhance contrast for sharper noise patterns
          value = Math.pow(value, 0.6);
          break;
        case 'waves':
          value = generateWavePattern(x, y, width, height, params);
          break;
        default:
          value = octaveNoise(x, y, 4, 0.5, 0.01);
      }
      
      // Normalize and apply color
      value = Math.max(0, Math.min(1, value));
      const color = interpolateColors(colors, value);
      const rgb = hexToRgb(color);
      
      const index = (y * width + x) * 4;
      imageData.data[index] = rgb.r;     // Red
      imageData.data[index + 1] = rgb.g; // Green
      imageData.data[index + 2] = rgb.b; // Blue
      imageData.data[index + 3] = 255;   // Alpha
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

// Sharp Mandelbrot calculation with defined boundaries
function calculateMandelbrotSmooth(x, y, width, height, params) {
  const { zoom = 1, offsetX = 0, offsetY = 0, maxIterations = 100 } = params;
  const scale = 4 / Math.min(width, height) / zoom;
  
  const real = (x - width / 2) * scale + offsetX;
  const imag = (y - height / 2) * scale + offsetY;
  
  let zReal = 0;
  let zImag = 0;
  let iterations = 0;
  
  while (iterations < maxIterations) {
    const zReal2 = zReal * zReal;
    const zImag2 = zImag * zImag;
    
    if (zReal2 + zImag2 > 4) {
      // Create sharper boundaries with less smoothing
      return Math.pow(iterations / maxIterations, 0.7); // Power function for sharper transitions
    }
    
    const newZReal = zReal2 - zImag2 + real;
    zImag = 2 * zReal * zImag + imag;
    zReal = newZReal;
    iterations++;
  }
  
  return 0;
}

// Sharp Julia calculation with defined boundaries
function calculateJuliaSmooth(x, y, width, height, params) {
  const { zoom = 1, offsetX = 0, offsetY = 0, maxIterations = 100, realC = -0.7, imagC = 0.27015 } = params;
  const scale = 4 / Math.min(width, height) / zoom;
  
  let zReal = (x - width / 2) * scale + offsetX;
  let zImag = (y - height / 2) * scale + offsetY;
  let iterations = 0;
  
  while (iterations < maxIterations) {
    const zReal2 = zReal * zReal;
    const zImag2 = zImag * zImag;
    
    if (zReal2 + zImag2 > 4) {
      // Create sharper boundaries with less smoothing
      return Math.pow(iterations / maxIterations, 0.7); // Power function for sharper transitions
    }
    
    const newZReal = zReal2 - zImag2 + realC;
    zImag = 2 * zReal * zImag + imagC;
    zReal = newZReal;
    iterations++;
  }
  
  return 0;
}

// Sharp wave pattern generator
function generateWavePattern(x, y, width, height, params) {
  const { frequency = 0.02, amplitude = 1, phase = 0 } = params;
  
  const wave1 = Math.sin(x * frequency + phase) * amplitude;
  const wave2 = Math.sin(y * frequency + phase) * amplitude;
  const wave3 = Math.sin((x + y) * frequency * 0.7 + phase) * amplitude;
  
  const combined = (wave1 + wave2 + wave3) / 3;
  const normalized = (combined + 1) / 2; // Normalize to 0-1
  
  // Apply contrast enhancement for sharper patterns
  return Math.pow(normalized, 0.6); // Increase contrast
}

// Generate marble-like pattern
export function generateMarblePattern(width, height, colors, params = {}) {
  const { scale = 0.01, turbulence = 0.5, veining = 2 } = params;
  
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(width, height);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Base marble pattern
      let value = octaveNoise(x, y, 6, 0.6, scale);
      
      // Add turbulence
      const turbX = octaveNoise(x, y, 4, 0.5, scale * 2) * turbulence;
      const turbY = octaveNoise(x + 100, y + 100, 4, 0.5, scale * 2) * turbulence;
      
      // Create sharp veining effect
      const veinValue = Math.sin((x + turbX * 50) * scale * veining) * 0.5 + 0.5;
      value = (value + veinValue) / 2;
      
      // Enhance contrast for sharper marble patterns
      value = Math.pow(value, 0.8);
      value = Math.max(0, Math.min(1, value));
      const color = interpolateColors(colors, value);
      const rgb = hexToRgb(color);
      
      const index = (y * width + x) * 4;
      imageData.data[index] = rgb.r;
      imageData.data[index + 1] = rgb.g;
      imageData.data[index + 2] = rgb.b;
      imageData.data[index + 3] = 255;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

// Generate wood grain pattern
export function generateWoodPattern(width, height, colors, params = {}) {
  const { ringSpacing = 0.02, irregularity = 0.3 } = params;
  
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(width, height);
  
  const centerX = width / 2;
  const centerY = height / 2;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Distance from center
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      
      // Add irregularity
      const noise = octaveNoise(x, y, 4, 0.5, 0.01) * irregularity;
      const adjustedDistance = distance + noise * 50;
      
      // Create sharp ring pattern
      let value = Math.sin(adjustedDistance * ringSpacing) * 0.5 + 0.5;
      
      // Add grain texture
      const grain = octaveNoise(x, y, 6, 0.4, 0.05) * 0.3;
      value = (value + grain) / 1.3;
      
      // Enhance contrast for sharper wood grain
      value = Math.pow(value, 0.7);
      value = Math.max(0, Math.min(1, value));
      const color = interpolateColors(colors, value);
      const rgb = hexToRgb(color);
      
      const index = (y * width + x) * 4;
      imageData.data[index] = rgb.r;
      imageData.data[index + 1] = rgb.g;
      imageData.data[index + 2] = rgb.b;
      imageData.data[index + 3] = 255;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}
