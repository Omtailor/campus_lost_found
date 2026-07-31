import Select from '../ui/Select.jsx'
import { REPORT_CATEGORIES } from '../../constants/reportCategories.js'

function BrowseFilters({ typeFilter, categoryFilter, onTypeChange, onCategoryChange }) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex rounded-xl bg-gray-100 p-1">
        {['all', 'lost', 'found'].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onTypeChange(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
              typeFilter === type
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {type === 'all' ? 'All' : type === 'lost' ? 'Lost' : 'Found'}
          </button>
        ))}
      </div>

      <div className="w-48">
        <Select
          options={[{ value: 'all', label: 'All Categories' }, ...REPORT_CATEGORIES]}
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
        />
      </div>
    </div>
  )
}

export default BrowseFilters
