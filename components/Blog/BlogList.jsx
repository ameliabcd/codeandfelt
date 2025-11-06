'use client'
import { useState, useEffect } from 'react'
import { Calendar, User, Trash2, Eye } from 'lucide-react'
import { loadBlogs, deleteBlog } from '../../lib/blogStorage'

export default function BlogList({ onBlogSelect, refreshKey }) {
  const [blogs, setBlogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBlog, setSelectedBlog] = useState(null)

  useEffect(() => {
    loadBlogsList()
  }, [refreshKey])

  const loadBlogsList = async () => {
    try {
      setIsLoading(true)
      const loadedBlogs = await loadBlogs()
      setBlogs(loadedBlogs)
    } catch (error) {
      console.error('Error loading blogs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (blogId, e) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteBlog(blogId)
        setBlogs(prev => prev.filter(b => b.id !== blogId))
        if (selectedBlog && selectedBlog.id === blogId) {
          setSelectedBlog(null)
        }
      } catch (error) {
        console.error('Error deleting blog:', error)
        alert('Error deleting blog. Please try again.')
      }
    }
  }

  const handleBlogClick = (blog) => {
    setSelectedBlog(blog)
    if (onBlogSelect) {
      onBlogSelect(blog)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  // Render full blog view
  if (selectedBlog) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <button
          onClick={() => setSelectedBlog(null)}
          className="text-pink-500 hover:text-pink-600 font-medium mb-6 flex items-center gap-2"
        >
          ← Back to Blog List
        </button>
        
        <article>
          <h1 className="font-serif text-4xl font-bold text-gray-800 mb-4">
            {selectedBlog.title}
          </h1>
          
          <div className="flex items-center gap-4 text-gray-500 mb-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{selectedBlog.author || 'You'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(selectedBlog.publishedAt)}</span>
            </div>
          </div>

          {/* Blog Images */}
          {selectedBlog.images && selectedBlog.images.length > 0 && (
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedBlog.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={img.name}
                  className="w-full rounded-xl shadow-lg"
                />
              ))}
            </div>
          )}

          {/* Blog Content */}
          <div className="prose max-w-none">
            <div className="text-gray-700 leading-relaxed">
              {selectedBlog.content.split('\n').map((line, idx) => {
                // Check for images first
                if (line.match(/!\[.*?\]\(data:image/)) {
                  const match = line.match(/!\[.*?\]\((.*?)\)/)
                  if (match && match[1]) {
                    return (
                      <img
                        key={idx}
                        src={match[1]}
                        alt=""
                        className="w-full rounded-xl shadow-lg my-6"
                      />
                    )
                  }
                }
                
                // Check for bold text (can be inline)
                if (line.includes('**')) {
                  const parts = line.split(/(\*\*.*?\*\*)/g)
                  return (
                    <p key={idx} className="mb-4">
                      {parts.map((part, partIdx) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={partIdx}>{part.slice(2, -2)}</strong>
                        }
                        return <span key={partIdx}>{part}</span>
                      })}
                    </p>
                  )
                }
                
                // Check for italic text
                if (line.includes('*') && !line.includes('**')) {
                  const parts = line.split(/(\*.*?\*)/g)
                  return (
                    <p key={idx} className="mb-4">
                      {parts.map((part, partIdx) => {
                        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
                          return <em key={partIdx}>{part.slice(1, -1)}</em>
                        }
                        return <span key={partIdx}>{part}</span>
                      })}
                    </p>
                  )
                }
                
                // Check for bullet list
                if (line.trim().startsWith('- ')) {
                  return (
                    <li key={idx} className="ml-6 mb-2 list-disc">
                      {line.trim().slice(2)}
                    </li>
                  )
                }
                
                // Empty line
                if (line.trim() === '') {
                  return <br key={idx} />
                }
                
                // Regular paragraph
                return <p key={idx} className="mb-4">{line}</p>
              })}
            </div>
          </div>
        </article>
      </div>
    )
  }

  // Render blog list
  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
        <p className="text-gray-600">Loading blogs...</p>
      </div>
    )
  }

  if (blogs.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
        <p className="text-gray-600 mb-2">No blog posts yet</p>
        <p className="text-sm text-gray-500">Start writing your first blog post above!</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="font-serif text-4xl font-bold text-center text-gray-800 mb-8">
        Published Blog Posts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => {
          // Extract first image from content if available
          const imageMatch = blog.content.match(/!\[.*?\]\((data:image[^)]+)\)/)
          const firstImage = imageMatch ? imageMatch[1] : null
          const excerpt = blog.content.split('\n').slice(0, 3).join(' ').substring(0, 150) + '...'

          return (
            <article
              key={blog.id}
              className="pattern-card cursor-pointer"
              onClick={() => handleBlogClick(blog)}
            >
              {firstImage ? (
                <div className="h-48 overflow-hidden">
                  <img
                    src={firstImage}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-pink-100 to-blue-100 flex items-center justify-center text-6xl">
                  📝
                </div>
              )}
              <div className="p-6">
                <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">{blog.title}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(blog.publishedAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{blog.author || 'You'}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">{excerpt}</p>
                <div className="flex justify-between items-center">
                  <button className="text-pink-500 font-medium hover:text-pink-600 transition-colors flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Read More
                  </button>
                  <button
                    onClick={(e) => handleDelete(blog.id, e)}
                    className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete blog"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

