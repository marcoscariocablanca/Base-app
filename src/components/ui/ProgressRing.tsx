import { useId } from 'react'

interface ProgressRingProps {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  label?: string
  sublabel?: string
  color?: string
  trackColor?: string
}

export function ProgressRing({
  value,
  max,
  size = 96,
  strokeWidth = 5,
  label,
  sublabel,
  color = '#4A7C59',
  trackColor = '#252520',
}: ProgressRingProps) {
  const uid = useId().replace(/:/g, 'x')
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = max > 0 ? Math.min(value / max, 1) : 0
  const offset = circumference * (1 - progress)

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <defs>
            <linearGradient id={`ring-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={color} stopOpacity="0.7" />
            </linearGradient>
          </defs>
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={trackColor} strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={`url(#ring-${uid})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        {/* Center label */}
        {label && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-base-ivory font-semibold leading-none" style={{ fontSize: size * 0.22 }}>
              {label}
            </span>
            {sublabel && (
              <span className="text-base-stone leading-none mt-0.5" style={{ fontSize: size * 0.12 }}>
                {sublabel}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
