import { cn } from '../../lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

const labelClass = 'text-[0.6rem] uppercase tracking-widest text-base-stone'

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className={labelClass}>{label}</label>}
      <input
        {...props}
        className={cn(
          'w-full bg-base-panel border border-base-border rounded-xl px-4 py-3',
          'text-base-ivory placeholder-base-muted text-sm',
          'outline-none focus:border-base-gold/50 focus:ring-0',
          'transition-colors duration-200',
          error && 'border-red-800/60',
          className
        )}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

export function TextArea({ label, className, ...props }: TextAreaProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className={labelClass}>{label}</label>}
      <textarea
        {...props}
        className={cn(
          'w-full bg-base-panel border border-base-border rounded-xl px-4 py-3',
          'text-base-ivory placeholder-base-muted text-sm',
          'outline-none focus:border-base-gold/50',
          'transition-colors duration-200',
          className
        )}
      />
    </div>
  )
}
