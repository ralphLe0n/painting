function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search paints by name..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
      />
    </div>
  )
}

export default SearchBar
