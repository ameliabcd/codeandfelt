'use client'
import { useState, useCallback } from 'react'
import { Upload, FileText, X, CheckCircle } from 'lucide-react'

export default function FileUpload({ onFileUpload, acceptedTypes = '.csv,.json,.txt,.xlsx' }) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [error, setError] = useState(null)

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    setError(null)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleChange = (e) => {
    e.preventDefault()
    setError(null)
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    // Validate file type
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    const allowedTypes = acceptedTypes.split(',')
    
    if (!allowedTypes.includes(fileExtension)) {
      setError(`Invalid file type. Please upload ${acceptedTypes} files.`)
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum size is 10MB.')
      return
    }

    setUploadedFile(file)
    
    // Read the file
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const content = e.target.result
      if (onFileUpload) {
        onFileUpload(file, content)
      }
    }

    // Read as text for CSV, JSON, TXT
    if (fileExtension === '.json' || fileExtension === '.csv' || fileExtension === '.txt') {
      reader.readAsText(file)
    } else {
      // For binary files like Excel
      reader.readAsArrayBuffer(file)
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    setError(null)
    if (onFileUpload) {
      onFileUpload(null, null)
    }
  }

  return (
    <div className="w-full">
      {!uploadedFile ? (
        <div
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
            dragActive 
              ? 'border-blue-400 bg-blue-50' 
              : error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-gray-400 bg-white'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput').click()}
        >
          <input
            id="fileInput"
            type="file"
            className="hidden"
            accept={acceptedTypes}
            onChange={handleChange}
          />
          
          <Upload className={`w-12 h-12 mx-auto mb-4 ${error ? 'text-red-400' : 'text-blue-400'}`} />
          
          {error ? (
            <>
              <p className="text-lg text-red-600 mb-2 font-medium">{error}</p>
              <p className="text-sm text-red-500">Please try again with a valid file</p>
            </>
          ) : (
            <>
              <p className="text-lg text-gray-700 mb-2 font-medium">
                {dragActive ? 'Drop your file here' : 'Drag & Drop or Click to Upload'}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supports CSV, JSON, TXT, Excel files (max 10MB)
              </p>
              <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Choose File
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="border-2 border-green-300 bg-green-50 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-800 mb-1">File Uploaded Successfully</h3>
              <p className="text-sm text-gray-600 truncate mb-2">{uploadedFile.name}</p>
              <p className="text-xs text-gray-500">
                Size: {(uploadedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                removeFile()
              }}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-100 rounded-lg transition-colors"
              title="Remove file"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

