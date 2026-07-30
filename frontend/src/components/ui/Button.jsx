function Button({
  variant = 'primary',
  onClick,
  type = 'button',
  disabled = false,
  children,
  className = '',
  ...props
}) {
  const base = 'rounded-full font-medium transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2.5 text-sm'
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    outline: 'bg-transparent text-primary border border-primary hover:bg-primary/10',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
