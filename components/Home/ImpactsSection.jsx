'use client'
import { useState, useEffect, useRef } from 'react'
import { Heart, Calendar, MapPin, DollarSign, Users, Edit2, Plus, X, Save, Image as ImageIcon, Upload } from 'lucide-react'
import { loadImpacts, saveImpact, deleteImpact } from '../../lib/impactStorage'

export default function ImpactsSection() {
  const [impacts, setImpacts] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    amount: '',
    category: 'donation',
    image: null
  })

  useEffect(() => {
    loadImpactsData()
  }, [])

  const loadImpactsData = async () => {
    try {
      const loadedImpacts = await loadImpacts()
      setImpacts(loadedImpacts)
    } catch (error) {
      console.error('Error loading impacts:', error)
    }
  }

  const handleEdit = (impact) => {
    setEditingId(impact.id)
    setFormData({
      title: impact.title,
      description: impact.description,
      date: impact.date,
      location: impact.location || '',
      amount: impact.amount || '',
      category: impact.category || 'donation',
      image: impact.image || null
    })
    setIsEditing(true)
    setShowAddForm(true)
  }

  const handleAdd = () => {
    setEditingId(null)
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      amount: '',
      category: 'donation',
      image: null
    })
    setIsEditing(false)
    setShowAddForm(true)
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image is too large. Please select an image smaller than 5MB.')
      return
    }

    setIsUploadingImage(true)

    try {
      // Convert to base64 data URL
      const reader = new FileReader()
      const imageData = await new Promise((resolve, reject) => {
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      setFormData({ ...formData, image: imageData })
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image. Please try again.')
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: null })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSave = async () => {
    if (!formData.title || !formData.description || !formData.date) {
      alert('Please fill in title, description, and date')
      return
    }

    try {
      const impact = {
        id: editingId || Date.now().toString(),
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location: formData.location,
        amount: formData.amount,
        category: formData.category,
        image: formData.image,
        createdAt: editingId ? impacts.find(i => i.id === editingId)?.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await saveImpact(impact)
      await loadImpactsData()
      setShowAddForm(false)
      setIsEditing(false)
      setEditingId(null)
    } catch (error) {
      console.error('Error saving impact:', error)
      alert('Error saving impact. Please try again.')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this impact?')) return

    try {
      await deleteImpact(id)
      await loadImpactsData()
    } catch (error) {
      console.error('Error deleting impact:', error)
      alert('Error deleting impact. Please try again.')
    }
  }

  const handleCancel = () => {
    setShowAddForm(false)
    setIsEditing(false)
    setEditingId(null)
    setFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      amount: '',
      category: 'donation',
      image: null
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const formatAmount = (amount) => {
    if (!amount) return ''
    const num = parseFloat(amount)
    return isNaN(num) ? amount : `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'donation':
        return <DollarSign className="w-5 h-5" />
      case 'volunteer':
        return <Users className="w-5 h-5" />
      case 'event':
        return <Calendar className="w-5 h-5" />
      default:
        return <Heart className="w-5 h-5" />
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'donation':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'volunteer':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'event':
        return 'bg-purple-100 text-purple-700 border-purple-300'
      default:
        return 'bg-pink-100 text-pink-700 border-pink-300'
    }
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Impacts
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Making a difference in our community through donations, volunteer work, and community events
          </p>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="mb-8 bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {isEditing ? 'Edit Impact' : 'Add New Impact'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="e.g., California Wildfire Donation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="donation">Donation</option>
                  <option value="volunteer">Volunteer Work</option>
                  <option value="event">Community Event</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="e.g., California, USA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input
                  type="text"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="e.g., 5000 or $5,000"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Describe the impact and what was accomplished..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                {formData.image ? (
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-gray-300 mb-2"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="impact-image-upload"
                    />
                    <label
                      htmlFor="impact-image-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      {isUploadingImage ? (
                        <>
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                          <span className="text-sm text-gray-600">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400" />
                          <span className="text-sm text-gray-600">Click to upload an image</span>
                          <span className="text-xs text-gray-500">Max 5MB, JPG/PNG/GIF</span>
                        </>
                      )}
                    </label>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Add Button */}
        {!showAddForm && (
          <div className="mb-8 flex justify-center">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add New Impact
            </button>
          </div>
        )}

        {/* Impacts Grid */}
        {impacts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No impacts added yet. Click "Add New Impact" to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {impacts.map((impact) => (
              <div
                key={impact.id}
                className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-xl transition-shadow"
              >
                {/* Image */}
                {impact.image && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img
                      src={impact.image}
                      alt={impact.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}

                {/* Category Badge */}
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 border ${getCategoryColor(impact.category)}`}>
                  {getCategoryIcon(impact.category)}
                  <span className="capitalize">{impact.category}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-800 mb-3">{impact.title}</h3>

                {/* Date and Location */}
                <div className="flex flex-col gap-2 mb-4 text-sm text-gray-600">
                  {impact.date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(impact.date)}</span>
                    </div>
                  )}
                  {impact.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{impact.location}</span>
                    </div>
                  )}
                  {impact.amount && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold">{formatAmount(impact.amount)}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-4 line-clamp-3">{impact.description}</p>

                {/* Edit/Delete Buttons */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleEdit(impact)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(impact.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                  >
                    <X className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

