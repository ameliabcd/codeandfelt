// Image Storage using IndexedDB (much larger storage limit than localStorage)

const DB_NAME = 'WorkGalleryDB'
const DB_VERSION = 1
const STORE_NAME = 'images'

// Initialize IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })
}

// Save images to IndexedDB
export async function saveImages(images) {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    // Clear existing images
    await store.clear()

    // Add all images
    const promises = images.map(image => store.add(image))
    await Promise.all(promises)

    return true
  } catch (error) {
    console.error('Error saving images to IndexedDB:', error)
    throw error
  }
}

// Load images from IndexedDB
export async function loadImages() {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Error loading images from IndexedDB:', error)
    return []
  }
}

// Remove an image from IndexedDB
export async function removeImage(imageId) {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    await store.delete(imageId)
    return true
  } catch (error) {
    console.error('Error removing image from IndexedDB:', error)
    throw error
  }
}

// Clear all images from IndexedDB
export async function clearImages() {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    await store.clear()
    return true
  } catch (error) {
    console.error('Error clearing images from IndexedDB:', error)
    throw error
  }
}

// Get storage usage estimate
export async function getStorageInfo() {
  try {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      return {
        usage: estimate.usage || 0,
        quota: estimate.quota || 0,
        usagePercent: estimate.quota ? ((estimate.usage / estimate.quota) * 100).toFixed(2) : 0
      }
    }
    return null
  } catch (error) {
    console.error('Error getting storage info:', error)
    return null
  }
}

