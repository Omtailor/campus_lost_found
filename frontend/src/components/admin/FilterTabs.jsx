const TABS = [
  { key: 'all', label: 'All' },
  { key: 'lost', label: 'Lost' },
  { key: 'found', label: 'Found' },
  { key: 'pending', label: 'Pending' },
  { key: 'resolved', label: 'Resolved' },
]

function FilterTabs({ activeTab, onTabChange }) {
  return (
    <div className="flex rounded-xl bg-gray-100 p-1 w-fit">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onTabChange(tab.key)}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
            activeTab === tab.key
              ? 'bg-primary text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default FilterTabs
