import { useEffect } from 'react'
import { Link } from 'react-router-dom'

function App() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('reveal-visible')
        })
      },
      { threshold: 0.12 },
    )

    els.forEach((el) => {
      el.classList.add('reveal-hidden')
      io.observe(el)
    })

    return () => io.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12">
      <header className="w-full max-w-4xl px-6 flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
          My<span className="text-green-700">IPo</span>
        </h1>

        <p className="mt-2 text-gray-600 text-center text-lg">
          <span className="text-green-700 font-semibold">Don't miss</span> another Ipo
        </p>

        <div className="mt-8 flex gap-4" data-reveal>
          <button
            className="px-6 py-3 bg-green-700 text-white rounded-lg shadow-md transform transition duration-200 hover:scale-105 active:scale-95 focus:outline-none"
          ><Link to="/Login">
              Login
            </Link>
          </button>

          <button
            className="px-6 py-3  text-white rounded-lg bg-green-700 shadow-sm transform transition duration-200 hover:scale-105 hover:text-white hover:bg-green-700 active:scale-95 focus:outline-none"
          ><Link to="/Signup">
            Signup
          </Link></button>
        </div>
      </header>

      <main className="w-full max-w-4xl px-6 mt-10 space-y-8">
        <section className="bg-white rounded-2xl p-8 shadow-lg" data-reveal>
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">What MyIPo does</h2>
          <p className="text-gray-700 leading-relaxed">
            MyIPo helps you to create an alert for any potential IPOs you might be interested in. Stay ahead of the market by getting timely notifications and updates on upcoming IPOs tailored to your preferences.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transform transition duration-300 hover:-translate-y-2" data-reveal>
            <h3 className="font-semibold text-lg mb-2 text-center">Get custom alerts</h3>
            
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transform transition duration-300 hover:-translate-y-2" data-reveal>
            <h3 className="font-semibold text-lg mb-2 text-center">Subscription</h3>
            
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transform transition duration-300 hover:-translate-y-2" data-reveal>
            <h3 className="font-semibold text-lg mb-2 text-center">Latest GMP</h3>
            
          </div>
        </section>

        <footer className="text-center text-sm text-gray-500 py-8" data-reveal>
          © {new Date().getFullYear()} MyIPo — create something great.
        </footer>
      </main>
    </div>
  )
}

export default App
