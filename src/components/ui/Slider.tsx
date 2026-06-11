import { cn } from '../../lib/utils'

interface SliderProps {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  className?: string
}

export function Slider({ label, value, onChange, min = 1, max = 10, className }: SliderProps) {
  const steps = Array.from({ length: max - min + 1 }, (_, i) => i + min)

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between items-center">
        <span className="text-[0.6rem] uppercase tracking-widest text-base-stone">{label}</span>
        <span className="text-base-ivory font-medium text-sm tabular-nums">{value}<span className="text-base-stone text-xs">/{max}</span></span>
      </div>
      <div className="flex gap-1">
        {steps.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={cn(
              'flex-1 h-6 rounded transition-all duration-150 text-[0.55rem] font-medium',
              n <= value
                ? 'bg-base-forest border border-base-success/40 text-base-success'
                : 'bg-base-panel border border-base-border text-base-muted hover:border-base-stone/40'
            )}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}
