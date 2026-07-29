// Slow-rotating roundel with text on a circular path around a monkey head.
export function Roundel({ size = 160 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }} className="relative shrink-0" aria-hidden>
      <svg viewBox="0 0 200 200" className="spin-slow absolute inset-0">
        <defs>
          <path id="mm-circle" d="M 100,100 m -80,0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0" />
        </defs>
        <text fontFamily="Montserrat, sans-serif" fontWeight={900} fontSize="16" letterSpacing="6" fill="#ffc000">
          <textPath href="#mm-circle" startOffset="0">MAD MONKEY · THAILAND · 2027 · ALL IN · </textPath>
        </text>
      </svg>
      {/* Monkey head — simple stylised silhouette */}
      <svg viewBox="0 0 200 200" className="absolute inset-0">
        <g fill="#ffc000" stroke="#0a0a0a" strokeWidth="3">
          <circle cx="100" cy="105" r="34" />
          <circle cx="72" cy="90" r="16" />
          <circle cx="128" cy="90" r="16" />
        </g>
        <g fill="#0a0a0a">
          <circle cx="88" cy="102" r="3.5" />
          <circle cx="112" cy="102" r="3.5" />
          <path d="M 88 122 Q 100 132 112 122" stroke="#0a0a0a" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
