// All 17 Wallpaper Groups - Symmetry Grove
export const wallpaperGroups = [
  // p1 - Translation only
  { id: 'p1', name: 'p1 - Translation', description: 'Basic translation symmetry', symmetry: 'translation' },
  
  // p2 - 180° rotation
  { id: 'p2', name: 'p2 - 180° Rotation', description: '180-degree rotation centers', symmetry: 'rotation' },
  
  // pm - Mirror reflection
  { id: 'pm', name: 'pm - Mirror', description: 'Mirror reflection symmetry', symmetry: 'reflection' },
  
  // pg - Glide reflection
  { id: 'pg', name: 'pg - Glide Reflection', description: 'Glide reflection symmetry', symmetry: 'glide' },
  
  // cm - Centered mirror
  { id: 'cm', name: 'cm - Centered Mirror', description: 'Centered mirror symmetry', symmetry: 'centered' },
  
  // pmm - Mirror + 180° rotation
  { id: 'pmm', name: 'pmm - Mirror + Rotation', description: 'Mirror and 180° rotation', symmetry: 'mirror-rotation' },
  
  // pmg - Mirror + glide
  { id: 'pmg', name: 'pmg - Mirror + Glide', description: 'Mirror and glide reflection', symmetry: 'mirror-glide' },
  
  // pgg - Glide reflection + 180° rotation
  { id: 'pgg', name: 'pgg - Glide + Rotation', description: 'Glide and 180° rotation', symmetry: 'glide-rotation' },
  
  // cmm - Centered mirror + 180° rotation
  { id: 'cmm', name: 'cmm - Centered + Rotation', description: 'Centered mirror and rotation', symmetry: 'centered-rotation' },
  
  // p4 - 90° rotation
  { id: 'p4', name: 'p4 - 90° Rotation', description: '90-degree rotation symmetry', symmetry: 'quarter-rotation' },
  
  // p4m - 90° rotation + mirror
  { id: 'p4m', name: 'p4m - 90° + Mirror', description: '90° rotation and mirror', symmetry: 'quarter-mirror' },
  
  // p4g - 90° rotation + glide
  { id: 'p4g', name: 'p4g - 90° + Glide', description: '90° rotation and glide', symmetry: 'quarter-glide' },
  
  // p3 - 120° rotation
  { id: 'p3', name: 'p3 - 120° Rotation', description: '120-degree rotation symmetry', symmetry: 'third-rotation' },
  
  // p3m1 - 120° rotation + mirror
  { id: 'p3m1', name: 'p3m1 - 120° + Mirror', description: '120° rotation and mirror', symmetry: 'third-mirror' },
  
  // p31m - 120° rotation + centered mirror
  { id: 'p31m', name: 'p31m - 120° + Centered', description: '120° rotation and centered mirror', symmetry: 'third-centered' },
  
  // p6 - 60° rotation
  { id: 'p6', name: 'p6 - 60° Rotation', description: '60-degree rotation symmetry', symmetry: 'sixth-rotation' },
  
  // p6m - 60° rotation + mirror
  { id: 'p6m', name: 'p6m - 60° + Mirror', description: '60° rotation and mirror', symmetry: 'sixth-mirror' }
];

// Generate patterns for each wallpaper group
export function generateWallpaperPattern(width, height, groupId, params = {}) {
  const pattern = Array(height).fill().map(() => Array(width).fill(0));
  const group = wallpaperGroups.find(g => g.id === groupId);
  
  if (!group) return pattern;
  
  switch (groupId) {
    case 'p1':
      return generateTranslationPattern(width, height, params);
    case 'p2':
      return generateRotationPattern(width, height, 2, params);
    case 'pm':
      return generateMirrorPattern(width, height, params);
    case 'pg':
      return generateGlidePattern(width, height, params);
    case 'cm':
      return generateCenteredMirrorPattern(width, height, params);
    case 'pmm':
      return generateMirrorRotationPattern(width, height, 2, params);
    case 'pmg':
      return generateMirrorGlidePattern(width, height, params);
    case 'pgg':
      return generateGlideRotationPattern(width, height, 2, params);
    case 'cmm':
      return generateCenteredMirrorRotationPattern(width, height, 2, params);
    case 'p4':
      return generateRotationPattern(width, height, 4, params);
    case 'p4m':
      return generateMirrorRotationPattern(width, height, 4, params);
    case 'p4g':
      return generateGlideRotationPattern(width, height, 4, params);
    case 'p3':
      return generateRotationPattern(width, height, 3, params);
    case 'p3m1':
      return generateMirrorRotationPattern(width, height, 3, params);
    case 'p31m':
      return generateCenteredMirrorRotationPattern(width, height, 3, params);
    case 'p6':
      return generateRotationPattern(width, height, 6, params);
    case 'p6m':
      return generateMirrorRotationPattern(width, height, 6, params);
    default:
      return pattern;
  }
}

// Translation pattern (p1)
function generateTranslationPattern(width, height, params) {
  const pattern = Array(height).fill().map(() => Array(width).fill(0));
  const { cellSize = 20, offsetX = 0, offsetY = 0 } = params;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const gridX = Math.floor((x + offsetX) / cellSize);
      const gridY = Math.floor((y + offsetY) / cellSize);
      pattern[y][x] = (gridX + gridY) % 2;
    }
  }
  
  return pattern;
}

// Rotation pattern
function generateRotationPattern(width, height, fold, params) {
  const pattern = Array(height).fill().map(() => Array(width).fill(0));
  const { cellSize = 20, centerX = width / 2, centerY = height / 2 } = params;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      
      const normalizedAngle = (angle + Math.PI) / (2 * Math.PI);
      const rotationIndex = Math.floor(normalizedAngle * fold) % fold;
      
      pattern[y][x] = (rotationIndex + Math.floor(distance / cellSize)) % 2;
    }
  }
  
  return pattern;
}

// Mirror pattern
function generateMirrorPattern(width, height, params) {
  const pattern = Array(height).fill().map(() => Array(width).fill(0));
  const { cellSize = 20, mirrorAxis = 'vertical' } = params;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let mirroredX = x;
      let mirroredY = y;
      
      if (mirrorAxis === 'vertical') {
        mirroredX = x < width / 2 ? x : width - 1 - x;
      } else {
        mirroredY = y < height / 2 ? y : height - 1 - y;
      }
      
      pattern[y][x] = (Math.floor(mirroredX / cellSize) + Math.floor(mirroredY / cellSize)) % 2;
    }
  }
  
  return pattern;
}

// Glide reflection pattern
function generateGlidePattern(width, height, params) {
  const pattern = Array(height).fill().map(() => Array(width).fill(0));
  const { cellSize = 20, glideOffset = 10 } = params;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let glideX = x;
      let glideY = y;
      
      if (y < height / 2) {
        glideX = (x + glideOffset) % width;
      } else {
        glideX = (width - x + glideOffset) % width;
      }
      
      pattern[y][x] = (Math.floor(glideX / cellSize) + Math.floor(glideY / cellSize)) % 2;
    }
  }
  
  return pattern;
}

// Centered mirror pattern
function generateCenteredMirrorPattern(width, height, params) {
  const pattern = Array(height).fill().map(() => Array(width).fill(0));
  const { cellSize = 20, centerX = width / 2, centerY = height / 2 } = params;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = Math.abs(x - centerX);
      const dy = Math.abs(y - centerY);
      
      pattern[y][x] = (Math.floor(dx / cellSize) + Math.floor(dy / cellSize)) % 2;
    }
  }
  
  return pattern;
}

// Mirror + rotation pattern
function generateMirrorRotationPattern(width, height, fold, params) {
  const pattern = Array(height).fill().map(() => Array(width).fill(0));
  const { cellSize = 20, centerX = width / 2, centerY = height / 2 } = params;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      
      const normalizedAngle = (angle + Math.PI) / (2 * Math.PI);
      const rotationIndex = Math.floor(normalizedAngle * fold) % fold;
      
      // Apply mirror symmetry
      const mirroredDistance = Math.abs(distance);
      
      pattern[y][x] = (rotationIndex + Math.floor(mirroredDistance / cellSize)) % 2;
    }
  }
  
  return pattern;
}

// Mirror + glide pattern
function generateMirrorGlidePattern(width, height, params) {
  const pattern = Array(height).fill().map(() => Array(width).fill(0));
  const { cellSize = 20, glideOffset = 10 } = params;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let glideX = x;
      let glideY = y;
      
      if (y < height / 2) {
        glideX = (x + glideOffset) % width;
      } else {
        glideX = (width - x + glideOffset) % width;
      }
      
      // Apply mirror symmetry
      const mirroredY = y < height / 2 ? y : height - 1 - y;
      
      pattern[y][x] = (Math.floor(glideX / cellSize) + Math.floor(mirroredY / cellSize)) % 2;
    }
  }
  
  return pattern;
}

// Glide + rotation pattern
function generateGlideRotationPattern(width, height, fold, params) {
  const pattern = Array(height).fill().map(() => Array(width).fill(0));
  const { cellSize = 20, centerX = width / 2, centerY = height / 2, glideOffset = 10 } = params;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      
      const normalizedAngle = (angle + Math.PI) / (2 * Math.PI);
      const rotationIndex = Math.floor(normalizedAngle * fold) % fold;
      
      // Apply glide reflection
      let glideDistance = distance;
      if (y < height / 2) {
        glideDistance = distance + glideOffset;
      } else {
        glideDistance = distance - glideOffset;
      }
      
      pattern[y][x] = (rotationIndex + Math.floor(glideDistance / cellSize)) % 2;
    }
  }
  
  return pattern;
}

// Centered mirror + rotation pattern
function generateCenteredMirrorRotationPattern(width, height, fold, params) {
  const pattern = Array(height).fill().map(() => Array(width).fill(0));
  const { cellSize = 20, centerX = width / 2, centerY = height / 2 } = params;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = Math.abs(x - centerX);
      const dy = Math.abs(y - centerY);
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      
      const normalizedAngle = (angle + Math.PI) / (2 * Math.PI);
      const rotationIndex = Math.floor(normalizedAngle * fold) % fold;
      
      pattern[y][x] = (rotationIndex + Math.floor(distance / cellSize)) % 2;
    }
  }
  
  return pattern;
}
