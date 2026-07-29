import mmAllIn from "@/assets/mm-allin.png";

export function Roundel({ size = 180 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }} className="relative shrink-0" aria-hidden>
      <img
        src={mmAllIn}
        alt="Mad Monkey Hostels — ALL IN"
        className="h-full w-full object-contain"
      />
    </div>
  );
}
