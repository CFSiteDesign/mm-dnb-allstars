import { createFileRoute, Link } from "@tanstack/react-router";
import { BRAND } from "@/config";

export const Route = createFileRoute("/paid")({
  head: () => ({
    meta: [
      { title: "You're in — DnB Allstars Thailand × Mad Monkey" },
      { name: "description", content: "Payment received. Your DnB Allstars Thailand package is locked. Confirmation is on its way." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "You're in — DnB Allstars Thailand" },
      { property: "og:description", content: "Payment received. See you in Phuket." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PaidPage,
});

function PaidPage() {
  const ref = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("ref") : null;
  return (
    <main className="min-h-screen bg-deep-1 text-bone">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-5 py-10">
        <div className="inline-block self-start border-ink bg-yellow px-3 py-1 display text-xs text-ink hard-shadow-sm">YOU'RE IN</div>
        <h1 className="display mt-4 text-5xl leading-[0.9] text-yellow sm:text-6xl">Payment through.</h1>
        <p className="mt-4 text-lg text-bone/85">
          Your spot at DnB Allstars Thailand is locked. Confirmation email is on its way — check spam if it hasn't landed in five minutes.
        </p>
        {ref && (
          <div className="mt-6 border-ink bg-paper p-4 text-ink hard-shadow-sm">
            <div className="tracked text-ink/60">Booking reference</div>
            <div className="display mt-1 text-2xl">{ref}</div>
          </div>
        )}
        <p className="mt-6 text-sm text-bone/70">
          Group chat link comes about a week out. Bring photo ID. Any drama, DM us on Instagram{" "}
          <a href={BRAND.instagram} className="text-yellow underline">
            {BRAND.instagramHandle}
          </a>
          .
        </p>
        <Link to="/" className="mt-8 self-start border-ink bg-yellow px-5 py-3 text-ink display text-sm hard-shadow-sm">
          Back to the page
        </Link>
      </div>
    </main>
  );
}
