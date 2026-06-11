import { useId } from 'react'

interface BaseLogoProps {
  size?: number
}

/**
 * BASE icon mark — two concentric A-frames.
 *
 * Outer A-frame: large, slightly thin.
 * Inner A-frame: same design, smaller, centered inside with a visible gap.
 * Both represent the two mountains: ascent and base.
 */
export function BaseLogo({ size = 48 }: BaseLogoProps) {
  const uid = useId().replace(/:/g, 'x')
  const gId = `baseOlive${uid}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gId} x1="40%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%"   stopColor="#9A9848" />
          <stop offset="50%"  stopColor="#767430" />
          <stop offset="100%" stopColor="#4E4C1A" />
        </linearGradient>
      </defs>

      {/*
        OUTER A-frame (slightly thinner than before):
        Outer boundary: apex(50,8) · left(6,90) · right(94,90)
        Inner boundary: apex(50,21) · left(20,90) · right(80,90)
        Frame thickness ≈ 12 units
      */}
      <path
        d="M6,90 L50,8 L94,90 L80,90 L50,21 L20,90 Z"
        fill={`url(#${gId})`}
      />

      {/*
        INNER A-frame (same design, smaller, ~9 unit gap from outer inner boundary):
        Outer boundary: apex(50,33) · left(29,90) · right(71,90)
        Inner boundary: apex(50,44) · left(38,90) · right(62,90)
        Gap from outer frame's inner edge: ~9 units
      */}
      <path
        d="M29,90 L50,33 L71,90 L62,90 L50,44 L38,90 Z"
        fill={`url(#${gId})`}
      />
    </svg>
  )
}
