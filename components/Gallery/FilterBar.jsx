const FilterBar = ({ selectedFilter, onFilterChange }) => {
    const filters = ['all', 'weather', 'finance', 'health', 'tech']
  
    return (
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-6 py-3 rounded-full font-medium capitalize transition-all duration-200 ${
              selectedFilter === filter
                ? 'bg-pink-400 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-pink-50 hover:text-pink-400'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    )
  }
  
  export default FilterBar