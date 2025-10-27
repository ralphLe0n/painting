function ColorCard({ paint, onAddToStock, onAddToWishlist, isInStock, isInWishlist }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-200">
      <div
        className="w-full h-28 rounded-xl mb-3 border-4 border-gray-200 shadow-md"
        style={{ backgroundColor: paint.hex }}
      ></div>
      <h3 className="font-bold text-sm mb-2 text-gray-800 truncate">{paint.name}</h3>
      <div className="flex flex-wrap gap-1 mb-2">
        <span className="text-xs bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-2 py-1 rounded-lg font-medium">
          {paint.type}
        </span>
        <span className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-2 py-1 rounded-lg font-medium">
          {paint.primaryColor}
        </span>
      </div>
      <div className="text-xs text-gray-500 mb-3 font-mono font-semibold">{paint.hex}</div>
      <div className="flex gap-2">
        <button
          onClick={() => onAddToStock(paint)}
          className={`flex-1 text-xs px-3 py-2 rounded-lg font-semibold transition-all ${
            isInStock
              ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-green-100 hover:text-green-700'
          }`}
        >
          {isInStock ? 'In Stock' : 'Add Stock'}
        </button>
        <button
          onClick={() => onAddToWishlist(paint)}
          className={`flex-1 text-xs px-3 py-2 rounded-lg font-semibold transition-all ${
            isInWishlist
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100 hover:text-orange-700'
          }`}
        >
          {isInWishlist ? 'Wishlisted' : 'Add Wish'}
        </button>
      </div>
    </div>
  );
}

export default ColorCard;
