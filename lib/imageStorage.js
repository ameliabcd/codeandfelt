// Image Storage using API (server-side storage for sharing across users)

// Save images to server
export async function saveImages(images) {
  try {
    // Save each image individually
    for (const image of images) {
      await fetch('/api/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(image),
      })
    }
    return true
  } catch (error) {
    console.error('Error saving images to server:', error)
    throw error
  }
}

// Save a single image to server
export async function saveImage(image) {
  try {
    const response = await fetch('/api/images', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(image),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData,
        url: response.url
      })
      const errorMessage = errorData.error || errorData.details || `Failed to save image (${response.status})`
      const debugInfo = errorData.debug ? ` Debug: ${JSON.stringify(errorData.debug)}` : ''
      throw new Error(errorMessage + debugInfo)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error saving image to server:', error)
    throw error
  }
}

// Load images from server
export async function loadImages() {
  try {
    const response = await fetch('/api/images')
    if (!response.ok) {
      throw new Error('Failed to load images')
    }
    const images = await response.json()
    return images || []
  } catch (error) {
    console.error('Error loading images from server:', error)
    return []
  }
}

// Remove an image from server
export async function removeImage(imageId) {
  try {
    const response = await fetch(`/api/images/${imageId}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete image')
    }
    
    return true
  } catch (error) {
    console.error('Error removing image from server:', error)
    throw error
  }
}

// Clear all images from server (by fetching all and deleting each)
export async function clearImages() {
  try {
    const images = await loadImages()
    for (const image of images) {
      await removeImage(image.id)
    }
    return true
  } catch (error) {
    console.error('Error clearing images from server:', error)
    throw error
  }
}

// Get storage info (not applicable for server storage, but keeping for compatibility)
export async function getStorageInfo() {
  try {
    const images = await loadImages()
    // Estimate size (rough calculation)
    let totalSize = 0
    images.forEach(img => {
      if (img.url && img.url.startsWith('data:')) {
        // Base64 data URL size estimate
        totalSize += img.url.length * 0.75 // Approximate binary size
      }
    })
    
      return {
      usage: totalSize,
      quota: null, // No quota for server storage
      usagePercent: null,
      count: images.length
      }
  } catch (error) {
    console.error('Error getting storage info:', error)
    return null
  }
}
