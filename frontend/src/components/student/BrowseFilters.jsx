import Select from '../ui/Select.jsx'

const CATEGORY_OPTIONS = [
  { value: 'backpack', label: 'Backpack' },
  { value: 'wallet', label: 'Wallet' },
  { value: 'laptop', label: 'Laptop' },
  { value: 'phone', label: 'Phone' },
  { value: 'earbuds', label: 'Earbuds' },
  { value: 'keys', label: 'Keys' },
  { value: 'id-card', label: 'ID Card' },
  { value: 'water-bottle', label: 'Water Bottle' },
  { value: 'books', label: 'Books' },
  { value: 'eyeglasses', label: 'Eyeglasses' },
  { value: 'watch', label: 'Watch' },
  { value: 'helmet', label: 'Helmet' },
  { value: 'other', label: 'Other' },
]

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
          options={[{ value: 'all', label: 'All Categories' }, ...CATEGORY_OPTIONS]}
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
        />
      </div>
    </div>
  )
}

export default BrowseFilters
