// Impact Storage using IndexedDB

const DB_NAME = 'ImpactDB'
const DB_VERSION = 1
const STORE_NAME = 'impacts'

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
        store.createIndex('date', 'date', { unique: false })
      }
    }
  })
}

// Save an impact
export async function saveImpact(impact) {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    await store.put(impact)
    return true
  } catch (error) {
    console.error('Error saving impact to IndexedDB:', error)
    throw error
  }
}

// Load all impacts
export async function loadImpacts() {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => {
        const impacts = request.result || []
        // Sort by date (newest first)
        impacts.sort((a, b) => new Date(b.date) - new Date(a.date))
        resolve(impacts)
      }
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Error loading impacts from IndexedDB:', error)
    return []
  }
}

// Get a single impact by ID
export async function getImpact(id) {
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
    console.error('Error getting impact from IndexedDB:', error)
    return null
  }
}

// Delete an impact
export async function deleteImpact(id) {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    await store.delete(id)
    return true
  } catch (error) {
    console.error('Error deleting impact from IndexedDB:', error)
    throw error
  }
}

