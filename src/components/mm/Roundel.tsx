import mmAllIn from "@/assets/mm-allin.png";

// ALL IN lockup with the Mad Monkey Hostels circular badge.
// Slow gentle sway keeps it feeling alive without spinning the ALL IN text.
export function Roundel({ size = 160 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }} className="relative shrink-0" aria-hidden>
      <img
        src={mmAllIn}
        alt="Mad Monkey Hostels — ALL IN"
        className="spin-slow h-full w-full object-contain"
        style={{ filter: "invert(1) brightness(2)" }}
      />
    </div>
  );
}
