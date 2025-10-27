import { useState, useMemo, useEffect } from 'react'
import { mixColors, generateFormula } from '../utils/colorMixer'

function MixingStudio({ allPaints }) {
  const [selectedPaints, setSelectedPaints] = useState([])
  const [ratios, setRatios] = useState({})
  const [searchTerm, setSearchTerm] = useState('')

  // Initialize ratios when paints are selected
  useEffect(() => {
    if (selectedPaints.length > 0) {
      const equalRatio = 1 / selectedPaints.length
      const newRatios = {}
      selectedPaints.forEach(paint => {
        if (ratios[paint.id] === undefined) {
          newRatios[paint.id] = equalRatio
        } else {
          newRatios[paint.id] = ratios[paint.id]
        }
      })
      setRatios(newRatios)
    }
  }, [selectedPaints])

  const handleAddPaint = (paint) => {
    if (selectedPaints.length >= 4) {
      alert('Maximum 4 paints can be mixed')
      return
    }
    if (!selectedPaints.find(p => p.id === paint.id)) {
      setSelectedPaints([...selectedPaints, paint])
    }
  }

  const handleRemovePaint = (paintId) => {
    setSelectedPaints(selectedPaints.filter(p => p.id !== paintId))
    const newRatios = { ...ratios }
    delete newRatios[paintId]
    setRatios(newRatios)
  }

  const handleRatioChange = (paintId, value) => {
    setRatios({
      ...ratios,
      [paintId]: parseFloat(value) / 100
    })
  }

  // Normalize ratios to sum to 1
  const normalizedRatios = useMemo(() => {
    const total = Object.values(ratios).reduce((sum, val) => sum + val, 0)
    if (total === 0) return ratios
    const normalized = {}
    Object.keys(ratios).forEach(key => {
      normalized[key] = ratios[key] / total
    })
    return normalized
  }, [ratios])

  // Calculate mixed color
  const mixedColor = useMemo(() => {
    if (selectedPaints.length === 0) return null

    const paintsWithRatios = selectedPaints.map(paint => ({
      hex: paint.hex,
      ratio: normalizedRatios[paint.id] || 0
    }))

    return mixColors(paintsWithRatios)
  }, [selectedPaints, normalizedRatios])

  // Generate formula
  const formula = useMemo(() => {
    if (selectedPaints.length === 0) return ''

    const paintsWithRatios = selectedPaints.map(paint => ({
      name: paint.name,
      ratio: normalizedRatios[paint.id] || 0
    }))

    return generateFormula(paintsWithRatios)
  }, [selectedPaints, normalizedRatios])

  // Filter available paints for selection
  const filteredAvailablePaints = useMemo(() => {
    return allPaints.filter(paint =>
      paint.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedPaints.find(p => p.id === paint.id)
    )
  }, [allPaints, searchTerm, selectedPaints])

  return (
    <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-2xl p-8 border border-purple-100">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Paint Mixing Studio</h2>

      {/* Selected Paints */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Selected Paints <span className="text-purple-600">({selectedPaints.length}/4)</span>
        </h3>

        {selectedPaints.length === 0 ? (
          <div className="text-gray-500 italic bg-white p-6 rounded-xl border-2 border-dashed border-gray-300">
            No paints selected. Add paints below to start mixing.
          </div>
        ) : (
          <div className="space-y-4">
            {selectedPaints.map(paint => (
              <div key={paint.id} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200">
                <div
                  className="w-16 h-16 rounded-xl border-4 border-gray-200 flex-shrink-0 shadow-md"
                  style={{ backgroundColor: paint.hex }}
                ></div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 mb-2">{paint.name}</div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={Math.round((ratios[paint.id] || 0) * 100)}
                    onChange={(e) => handleRatioChange(paint.id, e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="text-sm font-semibold text-purple-600 mt-1">
                    {Math.round((normalizedRatios[paint.id] || 0) * 100)}%
                  </div>
                </div>
                <button
                  onClick={() => handleRemovePaint(paint.id)}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mixed Color Preview */}
      {mixedColor && (
        <div className="mb-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 rounded-2xl border-2 border-purple-200 shadow-xl">
          <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Color Preview</h3>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div
                className="relative w-48 h-48 rounded-2xl border-4 border-white shadow-2xl transform transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundColor: mixedColor }}
              ></div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block bg-white px-6 py-3 rounded-xl shadow-lg mb-4">
                <div className="text-xs text-gray-500 font-medium mb-1">HEX COLOR</div>
                <div className="text-3xl font-mono font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{mixedColor}</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md">
                <div className="text-xs text-gray-500 font-medium mb-2">FORMULA</div>
                <div className="text-base text-gray-700 leading-relaxed font-medium">{formula}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Paints */}
      {selectedPaints.length < 4 && (
        <div>
          <h3 className="text-xl font-bold mb-4 text-gray-800">Add Paints to Mix</h3>
          <input
            type="text"
            placeholder="Search paints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 py-3 mb-6 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all bg-white shadow-sm"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-1">
            {filteredAvailablePaints.slice(0, 20).map(paint => (
              <button
                key={paint.id}
                onClick={() => handleAddPaint(paint)}
                className="flex items-center gap-2 p-3 bg-white hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all text-left border border-gray-200 hover:border-purple-300 shadow-sm hover:shadow-md"
              >
                <div
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: paint.hex }}
                ></div>
                <div className="text-xs font-semibold text-gray-800 truncate">{paint.name}</div>
              </button>
            ))}
          </div>
          {filteredAvailablePaints.length > 20 && (
            <div className="text-sm text-gray-500 mt-4 text-center bg-white p-3 rounded-xl">
              Showing 20 of {filteredAvailablePaints.length} paints. Use search to narrow down.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MixingStudio
