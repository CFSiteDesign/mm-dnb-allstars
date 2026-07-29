// Inline SVG fallback for the Mad Monkey wordmark. Design system requires
// referencing /mm-wordmark-white.png in header/footer/partner strip — this
// component is used as a robust fallback until the real artwork is dropped in.
export function Wordmark({ className = "", width = 130, tone = "white" }: { className?: string; width?: number; tone?: "white" | "ink" }) {
  const color = tone === "ink" ? "#0a0a0a" : "#ffffff";
  return (
    <span className={`inline-flex items-center ${className}`} style={{ width }} aria-label="Mad Monkey Hostels">
      <img
        src="/mm-wordmark-white.png"
        alt=""
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        style={{ width: 0, height: 0 }}
        aria-hidden
      />
      <svg viewBox="0 0 260 44" width={width} role="img" aria-label="Mad Monkey Hostels">
        <g fill={color} fontFamily="Montserrat, sans-serif" fontWeight={900} letterSpacing="-0.02em">
          <text x="0" y="20" fontSize="20">MAD MONKEY</text>
          <text x="0" y="40" fontSize="11" letterSpacing="0.22em" fontWeight={700} opacity="0.85">HOSTELS · ALL IN</text>
        </g>
      </svg>
    </span>
  );
}
