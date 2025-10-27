import { Plus, Star, Check } from 'lucide-react'

function ColorCard({ paint, onAddToStock, onAddToWishlist, isInStock, isInWishlist }) {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 hover:border-indigo-500 transition-all duration-200 shadow-lg">
      {/* Large color swatch at top */}
      <div
        className="w-full h-24 rounded-lg mb-3 shadow-inner border-2 border-slate-600"
        style={{backgroundColor: paint.hex}}
      />

      {/* Paint name */}
      <h3 className="font-semibold text-slate-100 mb-1 truncate">{paint.name}</h3>

      {/* Type & color badges */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-md">
          {paint.type}
        </span>
        <span className="text-xs bg-indigo-900/30 text-indigo-300 px-2 py-1 rounded-md">
          {paint.primaryColor}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onAddToStock(paint)}
          className={`flex-1 text-sm font-medium px-3 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1 ${
            isInStock
              ? 'bg-green-600 hover:bg-green-500 text-white'
              : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
          }`}
        >
          {isInStock ? (
            <>
              <Check className="w-4 h-4" />
              Stock
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Stock
            </>
          )}
        </button>
        <button
          onClick={() => onAddToWishlist(paint)}
          className={`flex-1 text-sm font-medium px-3 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1 ${
            isInWishlist
              ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
              : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
          }`}
        >
          <Star className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
          {isInWishlist ? 'Wish' : 'Wish'}
        </button>
      </div>
    </div>
  );
}

export default ColorCard;
