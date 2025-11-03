import { useState, useMemo } from 'react'
import { Palette, Filter } from 'lucide-react'
import ColorCard from './components/ColorCard'
import SearchBar from './components/SearchBar'
import MixingStudio from './components/MixingStudio'
import { usePaint } from './context/PaintContext'
import citadelColors from './data/citadelColors.json'

function App() {
  const { stock, wishlist, loading, addToStock, removeFromStock, addToWishlist, removeFromWishlist } = usePaint()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [filterColor, setFilterColor] = useState('All')

  const handleAddToStock = (paint) => {
    if (stock.find(p => p.id === paint.id)) {
      removeFromStock(paint)
    } else {
      addToStock(paint)
    }
  }

  const handleAddToWishlist = (paint) => {
    if (wishlist.find(p => p.id === paint.id)) {
      removeFromWishlist(paint)
    } else {
      addToWishlist(paint)
    }
  }

  // Get unique types and colors for filters
  const paintTypes = ['All', ...new Set(citadelColors.map(p => p.type))]
  const primaryColors = ['All', ...new Set(citadelColors.map(p => p.primaryColor))]

  // Filter paints based on search and filters
  const filteredPaints = useMemo(() => {
    return citadelColors.filter(paint => {
      const matchesSearch = paint.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === 'All' || paint.type === filterType
      const matchesColor = filterColor === 'All' || paint.primaryColor === filterColor
      return matchesSearch && matchesType && matchesColor
    })
  }, [searchTerm, filterType, filterColor])

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
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="bg-slate-800 border-b border-slate-700 shadow-lg mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Palette className="w-8 h-8 text-indigo-400" />
            <h1 className="text-3xl font-bold text-slate-100">Citadel Paint Mixer</h1>
          </div>
          <p className="text-slate-400 mt-2">Manage your paint collection and create custom mixes</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Stats */}
          <div className="flex gap-4 flex-wrap">
            <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg px-6 py-4">
              <div className="text-sm font-medium text-slate-400 mb-1">In Stock</div>
              <div className="text-3xl font-bold text-green-400">{stock.length}</div>
            </div>
            <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg px-6 py-4">
              <div className="text-sm font-medium text-slate-400 mb-1">Wishlist</div>
              <div className="text-3xl font-bold text-yellow-400">{wishlist.length}</div>
            </div>
          </div>

          {/* Search Bar */}
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

          {/* Filter Panel */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-semibold text-slate-100">Filters</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Filter by Type
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  {paintTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Filter by Color
                </label>
                <select
                  value={filterColor}
                  onChange={(e) => setFilterColor(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  {primaryColors.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
            </div>

            {(searchTerm || filterType !== 'All' || filterColor !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilterType('All')
                  setFilterColor('All')
                }}
                className="w-full mt-4 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Mixing Studio */}
          <MixingStudio allPaints={citadelColors} />

          {/* Paint Library */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-2">Paint Library</h2>
              <div className="text-slate-400 font-medium">
                Showing {filteredPaints.length} of {citadelColors.length} paints
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredPaints.map(paint => (
                <ColorCard
                  key={paint.id}
                  paint={paint}
                  onAddToStock={handleAddToStock}
                  onAddToWishlist={handleAddToWishlist}
                  isInStock={!!stock.find(p => p.id === paint.id)}
                  isInWishlist={!!wishlist.find(p => p.id === paint.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
