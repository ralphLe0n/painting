import { useState, useMemo, useEffect } from 'react'
import { Palette, Trash2 } from 'lucide-react'
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
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <Palette className="w-6 h-6 text-indigo-400" />
        <h2 className="text-2xl font-bold text-slate-100">Paint Mixing Studio</h2>
      </div>

      {/* Selected paints with sliders */}
      <div className="space-y-4 mb-6">
        {selectedPaints.length === 0 ? (
          <div className="text-slate-400 italic text-center py-8 bg-slate-700/30 rounded-lg border-2 border-dashed border-slate-600">
            No paints selected. Add paints below to start mixing.
          </div>
        ) : (
          selectedPaints.map(paint => (
            <div key={paint.id} className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg border-2 border-slate-600 shadow-md hover:scale-110 transition-transform duration-200"
                  style={{backgroundColor: paint.hex}}
                />
                <span className="font-medium text-slate-100 flex-1">{paint.name}</span>
                <button
                  onClick={() => handleRemovePaint(paint.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round((ratios[paint.id] || 0) * 100)}
                onChange={(e) => handleRatioChange(paint.id, e.target.value)}
                className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="text-right text-sm text-slate-400 mt-1">
                {Math.round((normalizedRatios[paint.id] || 0) * 100)}%
              </div>
            </div>
          ))
        )}
      </div>

      {/* Color preview */}
      {mixedColor && (
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 mb-6">
          <h3 className="text-sm font-medium text-slate-400 mb-3">Mixed Color Preview</h3>
          <div className="w-full h-32 rounded-xl shadow-2xl border-2 border-slate-600 mb-4" style={{backgroundColor: mixedColor}} />
          <div className="text-center">
            <div className="text-xl font-mono font-bold text-slate-100 mb-2">{mixedColor}</div>
            <div className="text-sm text-slate-400">
              {formula}
            </div>
          </div>
        </div>
      )}

      {/* Add paints section */}
      {selectedPaints.length < 4 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-100 mb-3">
            Add Paints to Mix ({selectedPaints.length}/4)
          </h3>
          <input
            type="text"
            placeholder="Search paints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all mb-4"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto scrollbar-thin">
            {filteredAvailablePaints.slice(0, 20).map(paint => (
              <button
                key={paint.id}
                onClick={() => handleAddPaint(paint)}
                className="flex items-center gap-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-200 text-left border border-slate-600"
              >
                <div
                  className="w-8 h-8 rounded border-2 border-slate-600 flex-shrink-0"
                  style={{backgroundColor: paint.hex}}
                />
                <div className="text-xs font-medium text-slate-100 truncate">{paint.name}</div>
              </button>
            ))}
          </div>
          {filteredAvailablePaints.length > 20 && (
            <div className="text-sm text-slate-400 mt-2 text-center">
              Showing 20 of {filteredAvailablePaints.length} paints. Use search to narrow down.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MixingStudio
