'use client'
import { useState } from 'react'
import Head from 'next/head'
import BlogEditor from '../components/Blog/BlogEditor'
import BlogList from '../components/Blog/BlogList'
import ImpactsSection from '../components/Home/ImpactsSection'

export default function About() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleBlogPublished = () => {
    // Trigger refresh of blog list
    setRefreshKey(prev => prev + 1)
  }
  return (
    <>
      <Head>
        <title>About & Blog - Math & Felt</title>
        <meta name="description" content="Learn about Math & Felt and read our latest blog posts" />
      </Head>
      
      <div className="min-h-screen bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h1 className="font-serif text-5xl font-bold text-gray-800 mb-6">Our Story</h1>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Math & Felt was born from the intersection of two passions: data science and fiber arts. 
                We believe that data can be beautiful, tactile, and deeply personal.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our platform transforms the abstract nature of data into something you can touch, 
                wear, and share. Every dataset tells a story, and we help you tell it through yarn.
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-100 to-blue-100 rounded-3xl p-12 text-center">
              <div className="text-8xl mb-4">🧶📊</div>
              <p className="text-gray-600">Where data meets craft</p>
            </div>
          </div>

          {/* Mission Section */}
          <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-3xl p-12 mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="font-serif text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed">
                  To make data accessible, beautiful, and meaningful by transforming it into 
                  feltable art that tells personal and collective stories.
                </p>
              </div>
              <div>
                <h2 className="font-serif text-3xl font-bold text-gray-800 mb-4">Our Vision</h2>
                <p className="text-gray-600 leading-relaxed">
                  A world where everyone can see the beauty in their data and create 
                  something meaningful with their hands.
                </p>
              </div>
            </div>
          </div>

          {/* Blog Section */}
          <div>
            <h2 className="font-serif text-4xl font-bold text-center text-gray-800 mb-8">
              Latest from Our Blog
            </h2>
            <BlogList key={refreshKey} refreshKey={refreshKey} />
          </div>

          {/* Our Impacts Section */}
          <div className="mt-20">
            <ImpactsSection />
          </div>

          {/* Blog Editor */}
          <div className="mt-20">
            <BlogEditor onPublish={handleBlogPublished} />
          </div>
        </div>
      </div>
    </>
  )
}