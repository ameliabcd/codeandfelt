// Impact Storage using API (server-side storage for sharing across users)

// Save an impact to server
export async function saveImpact(impact) {
  try {
    const response = await fetch('/api/impacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(impact),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.error || errorData.details || 'Failed to save impact'
      throw new Error(errorMessage)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error saving impact to server:', error)
    throw error
  }
}

// Load all impacts from server
export async function loadImpacts() {
  try {
    const response = await fetch('/api/impacts')
    if (!response.ok) {
      throw new Error('Failed to load impacts')
    }
    const impacts = await response.json()
    // Sort by date (newest first)
    impacts.sort((a, b) => {
      const dateA = a.date ? new Date(a.date) : new Date(a.createdAt || 0)
      const dateB = b.date ? new Date(b.date) : new Date(b.createdAt || 0)
      return dateB - dateA
    })
    return impacts || []
  } catch (error) {
    console.error('Error loading impacts from server:', error)
    return []
  }
}

// Get a single impact by ID from server
export async function getImpact(id) {
  try {
    const response = await fetch(`/api/impacts/${id}`)
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error('Failed to get impact')
    }
    return await response.json()
  } catch (error) {
    console.error('Error getting impact from server:', error)
    return null
  }
}

// Delete an impact from server
export async function deleteImpact(id) {
  try {
    const response = await fetch(`/api/impacts/${id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.error || errorData.details || `Failed to delete impact (${response.status})`
      throw new Error(errorMessage)
    }
    
    return true
  } catch (error) {
    console.error('Error deleting impact from server:', error)
    throw error
  }
}
