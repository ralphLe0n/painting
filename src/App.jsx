import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Palette, Image } from 'lucide-react'
import PaintLibrary from './components/PaintLibrary'
import { MiniatureCanvas } from './components/MiniaturePreview/MiniatureCanvas'
import { usePaint } from './context/PaintContext'

function Navigation() {
  const location = useLocation()

  return (
    <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2">
          <Link
            to="/"
            className={`px-6 py-4 font-semibold transition-all flex items-center gap-2 border-b-4 ${
              location.pathname === '/'
                ? 'text-indigo-400 border-indigo-400'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:border-slate-600'
            }`}
          >
            <Palette className="w-5 h-5" />
            Paint Library
          </Link>
          <Link
            to="/preview"
            className={`px-6 py-4 font-semibold transition-all flex items-center gap-2 border-b-4 ${
              location.pathname === '/preview'
                ? 'text-indigo-400 border-indigo-400'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:border-slate-600'
            }`}
          >
            <Image className="w-5 h-5" />
            Miniature Preview
          </Link>
        </div>
      </div>
    </nav>
  )
}

function App() {
  const { loading } = usePaint()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse bg-slate-700 rounded-lg h-24 w-64 mb-4"></div>
          <div className="text-xl font-medium text-slate-300">Loading your paint collection...</div>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <header className="bg-slate-800 border-b border-slate-700 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-3">
              <Palette className="w-8 h-8 text-indigo-400" />
              <h1 className="text-3xl font-bold text-slate-100">Citadel Paint Mixer</h1>
            </div>
            <p className="text-slate-400 mt-2">Manage your paint collection and create custom mixes</p>
          </div>
        </header>

        <Navigation />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<PaintLibrary />} />
            <Route path="/preview" element={<MiniatureCanvas />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
