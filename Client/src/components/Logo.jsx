export default function Logo({ className = "w-10 h-10" }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="noteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Music note - 3D style */}
      <g filter="url(#glow)">
        {/* Note stem */}
        <path
          d="M 35 75 L 35 30 C 35 28 36 27 38 27 L 58 23 C 60 22.5 62 24 62 26 L 62 70"
          stroke="url(#noteGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        {/* Note heads */}
        <ellipse cx="35" cy="78" rx="10" ry="8" fill="url(#noteGradient)" />
        <ellipse cx="62" cy="73" rx="10" ry="8" fill="url(#noteGradient)" />
        {/* Inner highlight */}
        <ellipse cx="33" cy="76" rx="4" ry="3" fill="#ffffff" opacity="0.4" />
        <ellipse cx="60" cy="71" rx="4" ry="3" fill="#ffffff" opacity="0.4" />
      </g>
      
      {/* Download arrow - 3D style */}
      <g filter="url(#glow)">
        {/* Arrow shaft */}
        <path
          d="M 85 35 L 85 75"
          stroke="url(#arrowGradient)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Arrow head */}
        <path
          d="M 70 62 L 85 77 L 100 62"
          stroke="url(#arrowGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Highlight on arrow */}
        <path
          d="M 83 35 L 83 70"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />
      </g>
    </svg>
  )
}
