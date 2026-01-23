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
        <title>About & Blog - Modern Fiber Arts</title>
        <meta name="description" content="Learn about Modern Fiber Arts and read our latest blog posts" />
      </Head>
      
      <div className="min-h-screen bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Our Impacts Section */}
          <div className="mb-20">
            <ImpactsSection />
          </div>

          {/* Blog Section */}
          <div>
            {/* Blog Editor */}
            <div className="mb-12">
              <BlogEditor onPublish={handleBlogPublished} />
            </div>

            {/* Published Blog Posts */}
            <BlogList key={refreshKey} refreshKey={refreshKey} />
          </div>
        </div>
      </div>
    </>
  )
}