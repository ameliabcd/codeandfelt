import Link from 'next/link'

const HeroSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight">
            Turn Data Into
            <span className="text-gradient">
              {" "}Knitting Patterns
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Transform your spreadsheets, APIs, and data files into beautiful, knittable patterns. 
            Where code meets craft, and data becomes art.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/generator" className="btn-primary">
              Try the Generator
            </Link>
            <Link href="/about" className="btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-16">
          <div className="text-center text-6xl md:text-8xl mb-4">📊➡️🧶</div>
          <p className="text-gray-500 text-center">Interactive demo visualization</p>
        </div>
      </div>
    </section>
  )
}

export default HeroSection