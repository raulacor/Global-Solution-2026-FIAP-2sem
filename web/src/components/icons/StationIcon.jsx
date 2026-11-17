import { useId } from 'react'

// Detour's "search route" icon: a station ring with three tracks running through it.
// Drawn in currentColor, so it takes the button's text color (and its hover color).
// Size follows the font size by default (1em tall); pass className to change it.
export default function StationIcon({ className = 'h-[1em] w-auto', title }) {
  const maskId = useId()
  return (
    <svg
      viewBox="0 0 52 24"
      className={className}
      fill="currentColor"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title && <title>{title}</title>}
      <defs>
        {/* Cuts a gap in the tracks around the ring */}
        <mask id={maskId}>
          <rect width="52" height="24" fill="white" />
          <circle cx="26" cy="11" r="12.2" fill="black" />
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <rect x="0" y="5.4" width="52" height="2.4" />
        <rect x="0" y="9.8" width="52" height="2.4" />
        <rect x="0" y="14.2" width="52" height="2.4" />
      </g>
      <circle cx="26" cy="11" r="9.6" fill="none" stroke="currentColor" strokeWidth="2.6" />
    </svg>
  )
}
