function GlassCard({ className = '', children, ...props }) {
  return (
    <div
      className={`bg-white/70 backdrop-blur-md rounded-xl2 shadow-glass border border-white/40 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default GlassCard
