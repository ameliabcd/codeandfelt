'use client'
import { useState } from 'react'
import Head from 'next/head'

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert('Message sent successfully!')
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: ''
    })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
      <Head>
        <title>Contact - Code & Felt</title>
        <meta name="description" content="Get in touch with Code & Felt" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-serif text-5xl font-bold text-gray-800 mb-4">Get in Touch</h1>
            <p className="text-xl text-gray-600">We'd love to hear from you</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  required
                  className="input-field resize-none"
                  placeholder="Tell us about your project or question..."
                />
              </div>
              
              <div className="text-center">
                <button type="submit" className="btn-primary">
                  Send Message
                </button>
              </div>
            </form>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-3xl shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                📧
              </div>
              <h3 className="font-serif text-lg font-bold text-gray-800 mb-2">Email Us</h3>
              <p className="text-gray-600">hello@codeandfelt.com</p>
            </div>
            
            <div className="bg-white rounded-3xl shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                💬
              </div>
              <h3 className="font-serif text-lg font-bold text-gray-800 mb-2">Join Community</h3>
              <p className="text-gray-600">Discord & Forums</p>
            </div>
            
            <div className="bg-white rounded-3xl shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                📚
              </div>
              <h3 className="font-serif text-lg font-bold text-gray-800 mb-2">Documentation</h3>
              <p className="text-gray-600">API & Tutorials</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}