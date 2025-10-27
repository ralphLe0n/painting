import { useState, useMemo } from 'react'
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-700 mb-2">Loading...</div>
          <div className="text-gray-500">Loading your paint collection</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-8 shadow-2xl">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-2 tracking-tight">Citadel Paint Mixer</h1>
          <p className="text-purple-100 text-lg">Manage your paint collection and create custom mixes</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex gap-4 flex-wrap">
          <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-sm font-medium opacity-90">In Stock</div>
            <div className="text-2xl font-bold">{stock.length}</div>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-sm font-medium opacity-90">Wishlist</div>
            <div className="text-2xl font-bold">{wishlist.length}</div>
          </div>
        </div>

        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <div className="mb-8 flex flex-wrap gap-4 bg-white p-6 rounded-xl shadow-md">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filter by Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all bg-gray-50 hover:bg-white"
            >
              {paintTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filter by Color
            </label>
            <select
              value={filterColor}
              onChange={(e) => setFilterColor(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all bg-gray-50 hover:bg-white"
            >
              {primaryColors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>
          {(searchTerm || filterType !== 'All' || filterColor !== 'All') && (
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilterType('All')
                  setFilterColor('All')
                }}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Mixing Studio */}
        <div className="mb-8">
          <MixingStudio allPaints={citadelColors} />
        </div>

        {/* Paint Library */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Paint Library</h2>
          <div className="text-gray-600 font-medium">
            Showing {filteredPaints.length} of {citadelColors.length} paints
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
      </main>
    </div>
  )
}

export default App
