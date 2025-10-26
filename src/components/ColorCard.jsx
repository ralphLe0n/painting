function ColorCard({ paint, onAddToStock, onAddToWishlist, isInStock, isInWishlist }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition-shadow">
      <div
        className="w-full h-24 rounded-md mb-2 border-2 border-gray-300"
        style={{ backgroundColor: paint.hex }}
      ></div>
      <h3 className="font-semibold text-sm mb-1 text-gray-800">{paint.name}</h3>
      <div className="flex flex-wrap gap-1 mb-2">
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {paint.type}
        </span>
        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
          {paint.primaryColor}
        </span>
      </div>
      <div className="text-xs text-gray-600 mb-2">{paint.hex}</div>
      <div className="flex gap-2">
        <button
          onClick={() => onAddToStock(paint)}
          className={`flex-1 text-xs px-2 py-1 rounded ${
            isInStock
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-green-100'
          }`}
        >
          {isInStock ? 'In Stock' : 'Add Stock'}
        </button>
        <button
          onClick={() => onAddToWishlist(paint)}
          className={`flex-1 text-xs px-2 py-1 rounded ${
            isInWishlist
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-yellow-100'
          }`}
        >
          {isInWishlist ? 'Wishlisted' : 'Add Wish'}
        </button>
      </div>
    </div>
  );
}

export default ColorCard;
