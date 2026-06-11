import { cn } from '../../lib/utils'

interface PageHeaderProps {
  title: string
  subtitle?: string
  right?: React.ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, right, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between mb-6', className)}>
      <div>
        <h1
          className="font-semibold text-base-ivory"
          style={{ fontSize: '1.2rem', letterSpacing: '0.02em' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-base-stone text-xs mt-0.5" style={{ letterSpacing: '0.04em' }}>
            {subtitle}
          </p>
        )}
      </div>
      {right && <div className="ml-4 flex-shrink-0">{right}</div>}
    </div>
  )
}
