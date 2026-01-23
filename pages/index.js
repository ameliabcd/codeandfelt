import Head from 'next/head'
import HeroSection from '../components/Home/HeroSection'
import StorySection from '../components/Home/StorySection'
import WorkGallery from '../components/Home/WorkGallery'
import NewsletterSignup from '../components/Home/NewsletterSignup'

export default function Home() {
  return (
    <>
      <Head>
        <title>Modern Fiber Arts: Needle Felters</title>
        <meta name="description" content="A student-led community exploring fiber art through creativity, collaboration, and care!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="gradient-bg">
        <HeroSection />
        <WorkGallery />
        <StorySection />
        <NewsletterSignup />
      </div>
    </>
  )
}