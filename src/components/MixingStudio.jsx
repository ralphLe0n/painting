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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Paint Mixing Studio</h2>

      {/* Selected Paints */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          Selected Paints ({selectedPaints.length}/4)
        </h3>

        {selectedPaints.length === 0 ? (
          <div className="text-gray-500 italic">No paints selected. Add paints below to start mixing.</div>
        ) : (
          <div className="space-y-3">
            {selectedPaints.map(paint => (
              <div key={paint.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <div
                  className="w-12 h-12 rounded border-2 border-gray-300 flex-shrink-0"
                  style={{ backgroundColor: paint.hex }}
                ></div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{paint.name}</div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={Math.round((ratios[paint.id] || 0) * 100)}
                    onChange={(e) => handleRatioChange(paint.id, e.target.value)}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-600">
                    {Math.round((normalizedRatios[paint.id] || 0) * 100)}%
                  </div>
                </div>
                <button
                  onClick={() => handleRemovePaint(paint.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
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
        <div className="mb-6 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Mixed Color</h3>
          <div className="flex items-center gap-6">
            <div
              className="w-32 h-32 rounded-lg border-4 border-gray-300 shadow-lg"
              style={{ backgroundColor: mixedColor }}
            ></div>
            <div className="flex-1">
              <div className="text-2xl font-mono font-bold text-gray-800 mb-2">{mixedColor}</div>
              <div className="text-sm text-gray-600 leading-relaxed">{formula}</div>
            </div>
          </div>
        </div>
      )}

      {/* Add Paints */}
      {selectedPaints.length < 4 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Add Paints to Mix</h3>
          <input
            type="text"
            placeholder="Search paints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 mb-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
            {filteredAvailablePaints.slice(0, 20).map(paint => (
              <button
                key={paint.id}
                onClick={() => handleAddPaint(paint)}
                className="flex items-center gap-2 p-2 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors text-left"
              >
                <div
                  className="w-8 h-8 rounded border-2 border-gray-300 flex-shrink-0"
                  style={{ backgroundColor: paint.hex }}
                ></div>
                <div className="text-xs font-medium text-gray-800 truncate">{paint.name}</div>
              </button>
            ))}
          </div>
          {filteredAvailablePaints.length > 20 && (
            <div className="text-sm text-gray-500 mt-2 text-center">
              Showing 20 of {filteredAvailablePaints.length} paints. Use search to narrow down.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MixingStudio
