import mmAllIn from "@/assets/mm-allin.png";

// ALL IN badge sits static in the center; text circles around it.
export function Roundel({ size = 180 }: { size?: number }) {
  const text = "MAD MONKEY · DNB ALLSTARS · THAILAND 2027 · ";
  const r = size / 2 - 10;
  const cx = size / 2;
  const cy = size / 2;
  return (
    <div style={{ width: size, height: size }} className="relative shrink-0" aria-hidden>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="spin-slow absolute inset-0"
      >
        <defs>
          <path
            id="mm-roundel-circle"
            d={`M ${cx},${cy} m -${r},0 a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 -${r * 2},0`}
          />
        </defs>
        <text
          fill="#ffc000"
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 900,
            fontSize: size * 0.09,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <textPath href="#mm-roundel-circle" startOffset="0">
            {text + text}
          </textPath>
        </text>
      </svg>
      <img
        src={mmAllIn}
        alt="Mad Monkey Hostels — ALL IN"
        className="absolute inset-0 h-full w-full object-contain"
        style={{ padding: size * 0.22 }}
      />
    </div>
  );
}
