import mmMonkeyAsset from "@/assets/mm-monkey-head.png.asset.json";
const mmMonkey = mmMonkeyAsset.url;

// Mad Monkey wordmark — used exactly as supplied, no filter.
export function Wordmark({ className = "", width = 130 }: { className?: string; width?: number; tone?: "white" | "ink" }) {
  return (
    <img
      src={mmMonkey}
      alt="Mad Monkey Hostels"
      className={className}
      style={{ width, height: "auto" }}
    />
  );
}
