import { useEffect, useRef, useState } from "react";
import { GALLERY } from "@/config";

type Props = {
  slot: number; // 1-based
  className?: string;
  quiet?: boolean;
  alt?: string;
  onClick?: () => void;
};

// Photo tries /gallery/<file> and, on error, renders a branded placeholder
// showing the shot brief + the exact file path so nothing looks broken and
// it's obvious which image belongs where.
export function Photo({ slot, className = "", quiet = false, alt, onClick }: Props) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const item = GALLERY[slot - 1];

  // Catch images that already errored before hydration (SSR-rendered <img>).
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (!item) return null;
  const path = `/gallery/${item.file}`;

  if (!failed) {
    return (
      <img
        ref={imgRef}
        src={path}
        alt={alt ?? item.alt}
        onClick={onClick}
        onError={() => setFailed(true)}
        className={`block h-full w-full object-cover ${className}`}
        loading={slot > 1 ? "lazy" : "eager"}
      />
    );
  }

  return (
    <div
      className={`relative block h-full w-full overflow-hidden bg-[#02203f] ${className}`}
      role="img"
      aria-label={item.alt}
      onClick={onClick}
    >
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id={`sky-${slot}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#032f5c" />
            <stop offset="55%" stopColor="#0081f7" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#01142c" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill={`url(#sky-${slot})`} />
        <circle cx="300" cy="170" r="42" fill="#ffc000" opacity="0.9" />
        <rect x="0" y="200" width="400" height="100" fill="#01142c" />
        {/* palm silhouettes */}
        <g fill="#0a0a0a">
          <path d="M 60 300 L 60 200 Q 40 180 20 190 Q 40 190 55 200 Q 30 170 10 175 Q 40 180 55 200 Q 55 175 40 155 Q 55 178 60 200 Q 65 175 80 158 Q 65 178 65 200 Q 85 175 110 175 Q 85 180 65 200 Z" />
          <path d="M 340 300 L 340 210 Q 315 195 295 205 Q 320 200 335 210 Q 310 185 290 190 Q 320 195 335 210 Q 335 188 320 170 Q 336 190 340 210 Q 344 190 358 175 Q 345 195 345 210 Q 365 195 388 200 Q 365 205 345 210 Z" />
        </g>
      </svg>
      {!quiet && (
        <>
          <div className="absolute left-0 right-0 top-0 flex items-center justify-between border-ink-bottom bg-yellow px-3 py-1">
            <span className="tracked text-ink">PHOTO SLOT {String(slot).padStart(2, "0")}</span>
            <span className="tracked text-ink">{item.file}</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 border-ink-top bg-ink/85 px-3 py-2 text-xs text-bone">
            {item.brief}
            <div className="mt-1 tracked text-yellow">DROP AT {path}</div>
          </div>
        </>
      )}
    </div>
  );
}
