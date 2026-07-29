import mmMonkey from "@/assets/mm-monkey.png";

// Mad Monkey wordmark — monkey head mark. On dark backgrounds we invert to render white.
export function Wordmark({ className = "", width = 130, tone = "white" }: { className?: string; width?: number; tone?: "white" | "ink" }) {
  return (
    <img
      src={mmMonkey}
      alt="Mad Monkey Hostels"
      className={className}
      style={{
        width,
        height: "auto",
        filter: tone === "white" ? "invert(1) brightness(2)" : undefined,
      }}
    />
  );
}
