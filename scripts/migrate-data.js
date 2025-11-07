// Migration script to export IndexedDB data to JSON files
// Run this in the browser console to save your current data

async function migrateData() {
  console.log('Starting data migration...')
  
  const results = {
    images: [],
    blogs: [],
    impacts: []
  }

  // Migrate Images
  try {
    const { loadImages } = await import('../lib/imageStorage.js')
    const images = await loadImages()
    results.images = images
    console.log(`✓ Exported ${images.length} images`)
  } catch (error) {
    console.error('Error migrating images:', error)
  }

  // Migrate Blogs
  try {
    const { loadBlogs } = await import('../lib/blogStorage.js')
    const blogs = await loadBlogs()
    results.blogs = blogs
    console.log(`✓ Exported ${blogs.length} blogs`)
  } catch (error) {
    console.error('Error migrating blogs:', error)
  }

  // Migrate Impacts
  try {
    const { loadImpacts } = await import('../lib/impactStorage.js')
    const impacts = await loadImpacts()
    results.impacts = impacts
    console.log(`✓ Exported ${impacts.length} impacts`)
  } catch (error) {
    console.error('Error migrating impacts:', error)
  }

  // Create downloadable JSON file
  const dataStr = JSON.stringify(results, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `migrated-data-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  console.log('✓ Migration complete! File downloaded.')
  console.log('Summary:', {
    images: results.images.length,
    blogs: results.blogs.length,
    impacts: results.impacts.length
  })

  return results
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.migrateData = migrateData
  console.log('Migration function available. Run: migrateData()')
}

export default migrateData

