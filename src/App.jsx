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
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold">Citadel Paint Mixer</h1>
        <p className="text-blue-100 mt-1">Manage your paint collection and create custom mixes</p>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex gap-4">
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow">
            In Stock: {stock.length}
          </div>
          <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow">
            Wishlist: {wishlist.length}
          </div>
        </div>

        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              {paintTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Color
            </label>
            <select
              value={filterColor}
              onChange={(e) => setFilterColor(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
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
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
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
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Paint Library</h2>
        <div className="mb-4 text-gray-600">
          Showing {filteredPaints.length} of {citadelColors.length} paints
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
