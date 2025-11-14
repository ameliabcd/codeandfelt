'use client'
import { useState, useRef, useEffect } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { saveImage, loadImages, removeImage as removeImageFromDB } from '../../lib/imageStorage'

// Compress and resize image
const compressImage = (file, maxWidth = 1920, maxHeight = 1920, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        // Draw and compress
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Failed to compress image'))
            }
          },
          'image/jpeg',
          quality
        )
      }
      img.onerror = reject
      img.src = e.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const WorkGallery = () => {
  const [images, setImages] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const fileInputRef = useRef(null)

  // Load images from server on mount
  useEffect(() => {
    const loadImagesFromServer = async () => {
      try {
        setIsLoading(true)
        const savedImages = await loadImages()
        setImages(savedImages || [])
        // Dispatch custom event to update HeroSection
        window.dispatchEvent(new Event('workGalleryUpdated'))
      } catch (error) {
        console.error('Error loading images:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadImagesFromServer()
  }, [])

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files)
    if (files.length === 0) return

    setIsUploading(true)

    try {
      const uploadedImages = []
      
      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} is not an image file. Please select image files only.`)
          continue
        }

        // Validate file size (max 10MB before compression)
        if (file.size > 10 * 1024 * 1024) {
          alert(`${file.name} is too large. Please select images smaller than 10MB.`)
          continue
        }

        try {
          // Compress image before uploading (target ~1MB to stay well under Vercel's 4.5MB limit)
          let compressedBlob = await compressImage(file, 1600, 1600, 0.7)
          
          // Progressive compression if still too large
          if (compressedBlob.size > 1.5 * 1024 * 1024) {
            compressedBlob = await compressImage(file, 1280, 1280, 0.6)
          }
          if (compressedBlob.size > 1.5 * 1024 * 1024) {
            compressedBlob = await compressImage(file, 1024, 1024, 0.5)
          }
          if (compressedBlob.size > 1.5 * 1024 * 1024) {
            alert(`${file.name} is still too large after compression (${(compressedBlob.size / 1024 / 1024).toFixed(2)}MB). Please use a smaller image.`)
            continue
          }

          // Convert compressed blob to base64 data URL
        const reader = new FileReader()
        const imageData = await new Promise((resolve, reject) => {
          reader.onload = (e) => resolve(e.target.result)
          reader.onerror = reject
            reader.readAsDataURL(compressedBlob)
        })

          const imageToSave = {
            id: `img-${Date.now()}-${Math.random()}`,
          url: imageData,
          name: file.name,
          uploadedAt: new Date().toISOString()
      }

          // Save to server
          try {
            const savedImage = await saveImage(imageToSave)
            uploadedImages.push(savedImage)
            setImages(prev => [...prev, savedImage])
          } catch (error) {
            console.error(`Error saving ${file.name}:`, error)
            const errorMessage = error.message || 'Unknown error occurred'
            alert(`Failed to upload ${file.name}: ${errorMessage}`)
          }
        } catch (compressionError) {
          console.error(`Error compressing ${file.name}:`, compressionError)
          alert(`Failed to process ${file.name}. Please try a different image.`)
        }
      }

      // Dispatch custom event to update HeroSection
      if (uploadedImages.length > 0) {
        window.dispatchEvent(new Event('workGalleryUpdated'))
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('Error uploading images. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = async (imageId) => {
    try {
      await removeImageFromDB(imageId)
      setImages(prev => prev.filter(img => img.id !== imageId))
      // Dispatch custom event to update HeroSection
      window.dispatchEvent(new Event('workGalleryUpdated'))
    } catch (error) {
      console.error('Error removing image:', error)
      alert('Failed to delete image. Please try again.')
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Content */}
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl font-bold text-gray-800 mb-4">
            Our Work Gallery
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Showcase your beautiful felting creations! Upload photos of your finished work to inspire others.
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={handleUploadClick}
            disabled={isUploading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
          >
            <Upload className="w-5 h-5" />
            {isUploading ? 'Uploading...' : 'Upload Photos'}
          </button>
        </div>

        {/* Gallery Horizontal Scroll */}
        {images.length > 0 ? (
          <div className="overflow-x-auto pb-4 -mx-4 px-4 scroll-smooth" style={{ scrollbarWidth: 'thin', scrollbarColor: '#f9a8d4 #f1f1f1' }}>
            <div className="flex gap-6 min-w-max">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="relative group bg-white rounded-xl shadow-lg overflow-hidden flex-shrink-0 w-64 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  {/* Image */}
                  <div className="aspect-square relative overflow-hidden bg-gray-100">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {/* Overlay with remove button */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveImage(image.id)
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                        aria-label="Remove image"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No images uploaded yet</p>
            <p className="text-sm text-gray-500">Click "Upload Photos" to add your work!</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default WorkGallery

