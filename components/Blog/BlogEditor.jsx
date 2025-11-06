'use client'
import { useState, useRef } from 'react'
import { Upload, X, Save, Image as ImageIcon, Bold, Italic, List, Type, Plus } from 'lucide-react'
import { saveBlog, loadBlogs } from '../../lib/blogStorage'

export default function BlogEditor({ onPublish }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [images, setImages] = useState([])
  const [isPublishing, setIsPublishing] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const fileInputRef = useRef(null)
  const contentTextareaRef = useRef(null)

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files)
    if (files.length === 0) return

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file.`)
        continue
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 5MB.`)
        continue
      }

      const reader = new FileReader()
      const imageData = await new Promise((resolve, reject) => {
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const imageId = `img-${Date.now()}-${Math.random()}`
      setImages(prev => [...prev, { id: imageId, url: imageData, name: file.name }])
      
      // Insert image placeholder in content
      const imageMarkdown = `\n![${file.name}](${imageId})\n`
      const textarea = contentTextareaRef.current
      if (textarea) {
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const newContent = content.substring(0, start) + imageMarkdown + content.substring(end)
        setContent(newContent)
        // Set cursor after inserted image
        setTimeout(() => {
          textarea.focus()
          textarea.setSelectionRange(start + imageMarkdown.length, start + imageMarkdown.length)
        }, 0)
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId))
    // Remove image markdown from content
    setContent(prev => prev.replace(new RegExp(`!\\[.*?\\]\\(${imageId}\\)`, 'g'), ''))
  }

  const insertText = (before, after = '') => {
    const textarea = contentTextareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const newText = before + selectedText + after
    const newContent = content.substring(0, start) + newText + content.substring(end)
    setContent(newContent)
    
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + selectedText.length + after.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Please enter a title and content before publishing.')
      return
    }

    setIsPublishing(true)
    try {
      // Replace image placeholders with actual image URLs
      let finalContent = content
      images.forEach(img => {
        finalContent = finalContent.replace(
          new RegExp(`!\\[.*?\\]\\(${img.id}\\)`, 'g'),
          `![${img.name}](${img.url})`
        )
      })

      const blog = {
        id: `blog-${Date.now()}-${Math.random()}`,
        title: title.trim(),
        content: finalContent,
        images: images,
        publishedAt: new Date().toISOString(),
        author: 'You' // Could be made dynamic
      }

      await saveBlog(blog)
      
      // Reset form
      setTitle('')
      setContent('')
      setImages([])
      setShowForm(false)
      
      if (onPublish) {
        onPublish(blog)
      }
      
      alert('Blog published successfully!')
    } catch (error) {
      console.error('Error publishing blog:', error)
      alert('Error publishing blog. Please try again.')
    } finally {
      setIsPublishing(false)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setTitle('')
    setContent('')
    setImages([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (!showForm) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold text-gray-800 mb-4">Write a New Blog Post</h2>
          <p className="text-gray-600 mb-6">Share your thoughts, stories, and updates with our community</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add a New Blog Post
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-3xl font-bold text-gray-800">Write a New Blog Post</h2>
        <button
          onClick={handleCancel}
          className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Title Input */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your blog title..."
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors text-lg"
        />
      </div>

      {/* Content Editor Toolbar */}
      <div className="mb-4 flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
        <button
          onClick={() => insertText('**', '**')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => insertText('*', '*')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => insertText('- ')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Insert Image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Content Textarea */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Content
        </label>
        <textarea
          ref={contentTextareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your blog post here... You can use markdown formatting. Click the image icon to upload images."
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors min-h-[300px] resize-y"
        />
        <p className="text-xs text-gray-500 mt-2">
          Tip: Use **text** for bold, *text* for italic, and - for bullet lists
        </p>
      </div>

      {/* Image Upload Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Uploaded Images Preview */}
      {images.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Uploaded Images ({images.length})
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((img) => (
              <div key={img.id} className="relative group">
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  onClick={() => handleRemoveImage(img.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-500 text-white p-1 rounded-full transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
                <p className="text-xs text-gray-600 mt-1 truncate" title={img.name}>
                  {img.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Publish Button */}
      <div className="flex justify-end gap-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <Upload className="w-5 h-5" />
          Add Images
        </button>
        <button
          onClick={handlePublish}
          disabled={isPublishing || !title.trim() || !content.trim()}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          {isPublishing ? 'Publishing...' : 'Publish Blog'}
        </button>
      </div>
    </div>
  )
}

