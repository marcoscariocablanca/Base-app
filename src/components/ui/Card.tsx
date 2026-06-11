import { cn } from '../../lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  gold?: boolean // gold accent border variant
}

export function Card({ children, className, onClick, gold }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl p-4 transition-all duration-200',
        'border',
        gold
          ? 'border-base-gold/30 bg-gradient-to-b from-[#1E1C10] to-base-dim'
          : 'border-base-border bg-base-dim',
        onClick && 'cursor-pointer active:scale-[0.98] hover:border-[#353528]',
        className
      )}
      style={gold ? { boxShadow: '0 0 0 1px rgba(154,138,53,0.08)' } : undefined}
    >
      {children}
    </div>
  )
}

export function CardSection({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('space-y-3', className)}>
      {children}
    </div>
  )
}
