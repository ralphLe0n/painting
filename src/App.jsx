import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Palette, Image } from 'lucide-react'
import PaintLibrary from './components/PaintLibrary'
import { MiniatureCanvas } from './components/MiniaturePreview/MiniatureCanvas'
import { usePaint } from './context/PaintContext'

function Navigation() {
  const location = useLocation()

  return (
    <nav className="bg-white/80 backdrop-blur-sm shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex gap-2">
          <Link
            to="/"
            className={`px-6 py-4 font-semibold transition-all flex items-center gap-2 border-b-4 ${
              location.pathname === '/'
                ? 'text-indigo-600 border-indigo-600'
                : 'text-gray-600 hover:text-indigo-600 border-transparent hover:border-indigo-300'
            }`}
          >
            <Palette className="w-5 h-5" />
            Paint Library
          </Link>
          <Link
            to="/preview"
            className={`px-6 py-4 font-semibold transition-all flex items-center gap-2 border-b-4 ${
              location.pathname === '/preview'
                ? 'text-indigo-600 border-indigo-600'
                : 'text-gray-600 hover:text-indigo-600 border-transparent hover:border-indigo-300'
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-700 mb-2">Loading...</div>
          <div className="text-gray-500">Loading your paint collection</div>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-8 shadow-2xl">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold mb-2 tracking-tight">Citadel Paint Mixer</h1>
            <p className="text-purple-100 text-lg">Manage your paint collection and create custom mixes</p>
          </div>
        </header>

        <Navigation />

        <main className="container mx-auto px-4 py-8">
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
