import Head from 'next/head'
import HeroSection from '../components/Home/HeroSection'
import PatternGrid from '../components/Home/PatternGrid'
import TestimonialCarousel from '../components/Home/TestimonialCarousel'
import NewsletterSignup from '../components/Home/NewsletterSignup'

export default function Home() {
  return (
    <>
      <Head>
        <title>Code & Felt - Turn Data Into Felting Patterns</title>
        <meta name="description" content="Transform your spreadsheets, APIs, and data files into beautiful, feltable patterns." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="gradient-bg">
        <HeroSection />
        <PatternGrid />
        <TestimonialCarousel />
        <NewsletterSignup />
      </div>
    </>
  )
}