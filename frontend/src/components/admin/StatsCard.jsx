import GlassCard from '../ui/GlassCard.jsx'

function StatsCard({ title, value, icon: Icon, loading }) {
  if (loading) {
    return (
      <GlassCard className="p-5 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-6 w-16 bg-gray-200 rounded" />
          </div>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          {Icon && <Icon size={24} />}
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </GlassCard>
  )
}

export default StatsCard
