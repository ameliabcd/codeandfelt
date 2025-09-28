import { useState } from 'react'

const NewsletterSignup = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log('Newsletter signup:', email)
    setEmail('')
    alert('Thanks for subscribing!')
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-pink-100 to-blue-100">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-4xl font-bold text-gray-800 mb-6">
          Stay in the Loop
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Get the latest patterns, tutorials, and data knitting inspiration.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field flex-1"
          />
          <button type="submit" className="btn-primary">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  )
}

export default NewsletterSignup