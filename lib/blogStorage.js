// Blog Storage using IndexedDB

const DB_NAME = 'BlogDB'
const DB_VERSION = 1
const STORE_NAME = 'blogs'

// Initialize IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('publishedAt', 'publishedAt', { unique: false })
      }
    }
  })
}

// Save a blog post
export async function saveBlog(blog) {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    await store.put(blog)
    return true
  } catch (error) {
    console.error('Error saving blog to IndexedDB:', error)
    throw error
  }
}

// Load all blogs
export async function loadBlogs() {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => {
        const blogs = request.result || []
        // Sort by published date (newest first)
        blogs.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        resolve(blogs)
      }
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Error loading blogs from IndexedDB:', error)
    return []
  }
}

// Get a single blog by ID
export async function getBlog(id) {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    
    return new Promise((resolve, reject) => {
      const request = store.get(id)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Error getting blog from IndexedDB:', error)
    return null
  }
}

// Delete a blog
export async function deleteBlog(id) {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    await store.delete(id)
    return true
  } catch (error) {
    console.error('Error deleting blog from IndexedDB:', error)
    throw error
  }
}

