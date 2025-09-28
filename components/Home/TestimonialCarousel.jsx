'use client'
import { useState, useEffect } from 'react'
import { testimonials } from '../../lib/data'

const TestimonialCarousel = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-4xl font-bold text-gray-800 mb-12">
          What Creators Say
        </h2>
        <div className="relative">
          <div className="bg-gradient-to-br from-pink-50 to-blue-50 rounded-3xl p-8 md:p-12 shadow-lg">
            <div className="text-4xl mb-4">{testimonials[currentTestimonial].avatar}</div>
            <blockquote className="text-xl text-gray-700 mb-6 italic">
              "{testimonials[currentTestimonial].quote}"
            </blockquote>
            <cite className="font-semibold text-gray-800">
              — {testimonials[currentTestimonial].name}
            </cite>
          </div>
          
          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentTestimonial(idx)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  idx === currentTestimonial ? 'bg-pink-400' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialCarousel