// Blog Storage using API (server-side storage for sharing across users)

// Save a blog post to server
export async function saveBlog(blog) {
  try {
    const response = await fetch('/api/blogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blog),
    })
    
    if (!response.ok) {
      throw new Error('Failed to save blog')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error saving blog to server:', error)
    throw error
  }
}

// Load all blogs from server
export async function loadBlogs() {
  try {
    const response = await fetch('/api/blogs')
    if (!response.ok) {
      throw new Error('Failed to load blogs')
    }
    const blogs = await response.json()
    // Sort by published date (newest first)
    blogs.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    return blogs || []
  } catch (error) {
    console.error('Error loading blogs from server:', error)
    return []
  }
}

// Get a single blog by ID from server
export async function getBlog(id) {
  try {
    const response = await fetch(`/api/blogs/${id}`)
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error('Failed to get blog')
    }
    return await response.json()
  } catch (error) {
    console.error('Error getting blog from server:', error)
    return null
  }
}

// Delete a blog from server
export async function deleteBlog(id) {
  try {
    const response = await fetch(`/api/blogs/${id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.error || errorData.details || `Failed to delete blog (${response.status})`
      throw new Error(errorMessage)
    }
    
    return true
  } catch (error) {
    console.error('Error deleting blog from server:', error)
    throw error
  }
}
