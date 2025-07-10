import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-6xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">🌱</span>
          </div>
          <span className="text-xl font-bold text-gray-800">EcoTrack</span>
        </div>
        <button className="text-gray-600 hover:text-emerald-600 transition-colors">
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Your Personal
              <span className="block text-emerald-600">Carbon Footprint</span>
              Tracker
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Track your carbon footprint and make a positive impact on the environment with AI-powered insights and personalized recommendations.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/journal">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Get Started Free
            </button>
            </Link>
            <button className="text-emerald-600 hover:text-emerald-700 font-semibold py-3 px-8 rounded-lg border-2 border-emerald-600 hover:bg-emerald-50 transition-all duration-200">
              Learn More
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center border border-gray-100 hover:border-emerald-200 group-hover:scale-105">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-200 transition-colors">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">TRACK</h3>
              <p className="text-gray-600 leading-relaxed">
                Log your daily activities across transportation, energy, food, and purchases with our intuitive interface.
              </p>
            </div>
          </div>

          <div className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center border border-gray-100 hover:border-emerald-200 group-hover:scale-105">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-200 transition-colors">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">ANALYZE</h3>
              <p className="text-gray-600 leading-relaxed">
                View detailed charts and trends to understand your environmental impact patterns over time.
              </p>
            </div>
          </div>

          <div className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center border border-gray-100 hover:border-emerald-200 group-hover:scale-105">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-200 transition-colors">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">IMPROVE</h3>
              <p className="text-gray-600 leading-relaxed">
                Get AI-powered recommendations tailored to your lifestyle to effectively reduce your carbon footprint.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">2.4T</div>
              <div className="text-sm text-gray-600">CO₂ Tracked</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">1.2K</div>
              <div className="text-sm text-gray-600">Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">35%</div>
              <div className="text-sm text-gray-600">Avg. Reduction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">15K</div>
              <div className="text-sm text-gray-600">Activities Logged</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-24">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              {/* <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">🌱</span>
              </div> */}
              {/* <span className="text-gray-600">© 2025 EcoTrack. Making the world greener, one step at a time.</span> */}
            </div>
            <div className="flex space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}