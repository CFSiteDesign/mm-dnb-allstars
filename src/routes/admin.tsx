import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { adminUnlock, adminLock, adminListBookings, type AdminBooking } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — DnB Allstars Thailand" },
      { name: "description", content: "Booking dashboard for DnB Allstars Thailand × Mad Monkey." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  loader: () => adminListBookings(),
  component: AdminPage,
});

function AdminPage() {
  const initial = Route.useLoaderData();
  const router = useRouter();
  const unlock = useServerFn(adminUnlock);
  const lock = useServerFn(adminLock);
  const [state, setState] = useState(initial);
  const [error, setError] = useState(false);
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);

  async function onUnlock(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(false);
    const { ok } = await unlock({ data: { password: pw } });
    setBusy(false);
    if (!ok) return setError(true);
    setPw("");
    await router.invalidate();
    // Re-fetch via loader invalidation
    const next = await (await import("@/lib/admin.functions")).adminListBookings();
    setState(next);
  }

  async function onLock() {
    await lock({});
    setState({ unlocked: false, bookings: [] });
  }

  if (!state.unlocked) {
    return (
      <main className="min-h-screen bg-deep-1 text-bone">
        <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
          <div className="inline-block self-start border-ink bg-yellow px-3 py-1 display text-xs text-ink hard-shadow-sm">
            ADMIN
          </div>
          <h1 className="display mt-4 text-4xl leading-[0.9] text-yellow sm:text-5xl">Locked.</h1>
          <p className="mt-3 text-bone/80">Enter the admin password to see bookings.</p>
          <form onSubmit={onUnlock} className="mt-6 flex flex-col gap-3">
            <input
              type="password"
              autoComplete="current-password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="border-ink bg-paper px-4 py-3 text-ink hard-shadow-sm"
              style={{ borderWidth: 3, fontSize: 16 }}
              placeholder="password"
              required
            />
            {error && <p className="text-sm" style={{ color: "#ff01aa" }}>Wrong password.</p>}
            <button
              type="submit"
              disabled={busy}
              className="border-ink bg-yellow px-5 py-3 text-ink display text-sm hard-shadow-sm disabled:opacity-60"
            >
              {busy ? "Checking…" : "Unlock"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  const paid = state.bookings.filter((b) => b.status === "paid");
  const spotsSold = paid.reduce((n, b) => n + b.quantity, 0);
  const revenue = paid.reduce((n, b) => n + b.total_usd, 0);

  return (
    <main className="min-h-screen bg-deep-1 text-bone">
      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="tracked text-yellow">DNB ALLSTARS THAILAND · ADMIN</div>
            <h1 className="display mt-1 text-4xl leading-[0.9] text-yellow sm:text-5xl">Buyers.</h1>
          </div>
          <button
            onClick={onLock}
            className="border-ink bg-paper px-4 py-2 text-ink display text-xs hard-shadow-sm"
          >
            Lock
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Bookings" value={state.bookings.length} />
          <Stat label="Paid bookings" value={paid.length} />
          <Stat label="Spots sold" value={spotsSold} />
          <Stat label="Revenue USD" value={`$${revenue.toLocaleString()}`} />
        </div>

        <div className="mt-8 space-y-4">
          {state.bookings.length === 0 && (
            <div className="border-ink bg-paper p-6 text-ink hard-shadow-sm">No bookings yet.</div>
          )}
          {state.bookings.map((b) => (
            <BookingCard key={b.reference} b={b} />
          ))}
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border-ink bg-paper p-4 text-ink hard-shadow-sm">
      <div className="tracked text-ink/60">{label}</div>
      <div className="display mt-1 text-2xl">{value}</div>
    </div>
  );
}

function BookingCard({ b }: { b: AdminBooking }) {
  const statusColor =
    b.status === "paid" ? "#ffc000" : b.status === "pending" ? "#f5efe2" : "#ff01aa";
  return (
    <div className="border-ink bg-paper p-5 text-ink hard-shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <div className="tracked text-ink/60">Booking ref</div>
          <div className="display text-xl">{b.reference}</div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="display text-xs px-2 py-1 border-ink"
            style={{ borderWidth: 3, background: statusColor }}
          >
            {b.status.toUpperCase()}
          </span>
          <div className="display text-lg">${b.total_usd}</div>
        </div>
      </div>
      <div className="mt-2 text-sm text-ink/70">
        {b.quantity} spot{b.quantity > 1 ? "s" : ""} · {b.contact_email} ·{" "}
        {b.paid_at ? `paid ${new Date(b.paid_at).toLocaleString()}` : `created ${new Date(b.created_at).toLocaleString()}`}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {(b.guests ?? []).map((g, i) => (
          <div key={i} className="border-ink p-3" style={{ borderWidth: 3 }}>
            <div className="tracked text-ink/60">Spot {i + 1}</div>
            <div className="display mt-1 text-base">{g.fullName}</div>
            <div className="text-xs text-ink/70">
              {g.nationality} · born {g.dob} · arrives {g.arrival}
            </div>
            <div className="mt-1 text-xs text-ink/70">
              {g.email} · WhatsApp {g.whatsapp}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
