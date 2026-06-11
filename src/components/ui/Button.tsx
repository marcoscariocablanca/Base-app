import { cn } from '../../lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'gold' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-xl',
        'transition-all duration-200 active:scale-[0.96]',
        'disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100',
        {
          primary:   'bg-base-forest border border-base-forest/60 text-base-ivory hover:bg-base-success hover:border-base-success',
          secondary: 'bg-base-muted border border-base-border text-base-ivory hover:bg-[#3A3A34]',
          ghost:     'text-base-stone hover:text-base-ivory hover:bg-base-muted border border-transparent',
          success:   'bg-base-success border border-base-success/60 text-base-ivory',
          gold:      'border text-[#C8AE42] hover:text-[#D4B848] hover:bg-[#1A1808]',
          danger:    'bg-red-900/40 border border-red-900/50 text-red-400 hover:bg-red-900/60',
        }[variant],
        variant === 'gold' && 'border-base-gold/50',
        {
          sm: 'text-xs px-3 py-1.5 tracking-wide',
          md: 'text-sm px-4 py-2.5',
          lg: 'text-sm px-5 py-3 tracking-wider uppercase',
        }[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {children}
    </button>
  )
}
