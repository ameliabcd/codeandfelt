'use client'
import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function ContactsAdmin() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/contact')
      if (!response.ok) {
        throw new Error('Failed to load contacts')
      }
      const data = await response.json()
      setContacts(data)
      setError(null)
    } catch (err) {
      console.error('Error loading contacts:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <>
      <Head>
        <title>Contact Submissions - Admin - Modern Fiber Arts</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-bold text-gray-800 mb-2">Contact Submissions</h1>
            <p className="text-gray-600">View all contact form submissions</p>
            <button
              onClick={loadContacts}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Refresh
            </button>
          </div>

          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading contacts...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
              Error: {error}
            </div>
          )}

          {!loading && !error && contacts.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-600">No contact submissions yet.</p>
            </div>
          )}

          {!loading && !error && contacts.length > 0 && (
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-pink-500">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-gray-800">
                        {contact.firstName} {contact.lastName}
                      </h3>
                      <p className="text-gray-600">{contact.email}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(contact.submittedAt)}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <span className="text-sm font-semibold text-gray-700">Subject: </span>
                    <span className="text-gray-800">{contact.subject}</span>
                  </div>
                  
                  <div>
                    <span className="text-sm font-semibold text-gray-700">Message: </span>
                    <p className="text-gray-800 mt-1 whitespace-pre-wrap">{contact.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

