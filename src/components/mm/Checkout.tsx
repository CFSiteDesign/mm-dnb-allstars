import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { EVENT, PRICING, ENDPOINTS, BRAND } from "@/config";
import { createStripeCheckout } from "@/lib/checkout.functions";

// WHY we collect guest details in-app instead of leaning on Stripe:
// a Stripe Payment Link collects only ONE set of custom fields per session
// regardless of quantity — buy 4 spots and Stripe returns a single passport
// name. The venue checks a name and a DOB for EVERY person, so we collect
// them ourselves before handing off to Stripe for the money bit.

export type Guest = {
  fullName: string;
  dob: string;
  nationality: string;
  email: string;
  whatsapp: string;
  arrival: string;
};

const empty = (): Guest => ({ fullName: "", dob: "", nationality: "", email: "", whatsapp: "", arrival: "" });

// Age at festival start — "20+ on 22 Jan 2027", not "20+ today".
function ageOnFestival(dob: string): number | null {
  if (!dob) return null;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  const f = new Date(EVENT.festivalStart);
  let age = f.getFullYear() - d.getFullYear();
  const m = f.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && f.getDate() < d.getDate())) age--;
  return age;
}

function validateGuest(g: Guest): Partial<Record<keyof Guest, string>> {
  const errs: Partial<Record<keyof Guest, string>> = {};
  if (!g.fullName.trim() || g.fullName.trim().length < 2) errs.fullName = "Full name as it appears on your passport.";
  if (!g.dob) errs.dob = "We need a date of birth — the venue checks ID.";
  else {
    const age = ageOnFestival(g.dob);
    if (age === null || age < EVENT.minAge) errs.dob = `You need to be ${EVENT.minAge} by 22–24 Jan 2027. The door won't budge on this.`;
  }
  if (!g.nationality.trim()) errs.nationality = "Required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(g.email)) errs.email = "We send the confirmation and the group chat link here.";
  const digits = g.whatsapp.replace(/\D/g, "");
  if (digits.length < 7) errs.whatsapp = "Include the country code.";
  if (!g.arrival) errs.arrival = "Roughly when you land in Phuket.";
  return errs;
}

function makeRef(guests: Guest[]) {
  const surname = (guests[0]?.fullName.trim().split(/\s+/).pop() ?? "GUEST")
    .toUpperCase().replace(/[^A-Z]/g, "").slice(0, 10) || "GUEST";
  const rand = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5).padEnd(5, "X");
  return `DNB-${surname}-${rand}`;
}

export function CheckoutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const soldOut = PRICING.spotsRemaining <= 0;
  const [step, setStep] = useState(1);
  const [qty, setQty] = useState(1);
  const [guests, setGuests] = useState<Guest[]>([empty()]);
  const [errors, setErrors] = useState<Record<number, Partial<Record<keyof Guest, string>>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const firstErrorRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      // reset after close animation
      const t = setTimeout(() => { setStep(1); setQty(1); setGuests([empty()]); setErrors({}); setNotice(null); }, 100);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    setGuests((prev) => {
      const next = [...prev];
      while (next.length < qty) next.push(empty());
      next.length = qty;
      return next;
    });
  }, [qty]);

  const total = qty * PRICING.perPersonUSD;

  const updateGuest = (i: number, patch: Partial<Guest>) => {
    setGuests((prev) => prev.map((g, idx) => (idx === i ? { ...g, ...patch } : g)));
  };

  const goToDetails = () => setStep(2);

  const submitDetails = () => {
    const allErrs: Record<number, Partial<Record<keyof Guest, string>>> = {};
    guests.forEach((g, i) => {
      const e = validateGuest(g);
      if (Object.keys(e).length) allErrs[i] = e;
    });
    setErrors(allErrs);
    if (Object.keys(allErrs).length === 0) {
      setStep(3);
      return;
    }
    // Scroll first invalid field into view + focus
    setTimeout(() => {
      const first = dialogRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
      if (first) {
        first.scrollIntoView({ behavior: "smooth", block: "center" });
        first.focus({ preventScroll: true });
        firstErrorRef.current = first;
      }
    }, 30);
  };

  const startCheckout = useServerFn(createStripeCheckout);
  const pay = async () => {
    setSubmitting(true);
    setNotice(null);
    const reference = makeRef(guests);
    try {
      localStorage.setItem(`booking:${reference}`, JSON.stringify({ reference, quantity: qty, guests, totalUSD: total, createdAt: new Date().toISOString() }));
    } catch {}
    try {
      const { url } = await startCheckout({ data: { quantity: qty, guests, reference } });
      window.location.href = url;
    } catch (err) {
      console.error(err);
      setNotice("Payment isn't live yet. DM us on Instagram and we'll sort you out.");
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/70 sm:items-center" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        className="relative flex max-h-[92vh] w-full flex-col overflow-hidden border-ink bg-bone text-ink hard-shadow-lg sm:max-w-xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-ink-bottom bg-yellow px-4 py-3">
          <div id="checkout-title" className="display text-lg">{soldOut ? "Waitlist" : `Step ${step} of 3`}</div>
          <button aria-label="Close" onClick={onClose} className="grid h-9 w-9 place-items-center border-ink bg-bone text-ink hard-shadow-sm cta-press">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          {soldOut ? (
            <WaitlistBody onDone={onClose} />
          ) : step === 1 ? (
            <StepQty qty={qty} setQty={setQty} onNext={goToDetails} />
          ) : step === 2 ? (
            <StepDetails guests={guests} errors={errors} onChange={updateGuest} onBack={() => setStep(1)} onNext={submitDetails} />
          ) : (
            <StepReview guests={guests} qty={qty} total={total} onBack={() => setStep(2)} onPay={pay} submitting={submitting} notice={notice} />
          )}
        </div>
      </div>
    </div>
  );
}

function StepQty({ qty, setQty, onNext }: { qty: number; setQty: (n: number) => void; onNext: () => void }) {
  const cap = Math.min(PRICING.maxPerOrder, PRICING.spotsRemaining);
  return (
    <div className="space-y-6">
      <div>
        <div className="tracked text-ink/70">How many spots?</div>
        <h2 className="display mt-1 text-3xl">Rally the crew.</h2>
        <p className="mt-2 text-sm text-ink/70">Up to {cap} in one go. Each spot gets its own bed and its own wristband.</p>
      </div>
      <div className="flex items-center justify-between border-ink bg-paper p-3 hard-shadow-sm">
        <button aria-label="Decrease" onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-14 w-14 place-items-center border-ink bg-bone display text-2xl cta-press">−</button>
        <div className="grid h-16 w-24 place-items-center bg-ink" aria-live="polite">
          <span className="display text-4xl text-yellow">{qty}</span>
        </div>
        <button aria-label="Increase" onClick={() => setQty(Math.min(cap, qty + 1))} className="grid h-14 w-14 place-items-center border-ink bg-yellow display text-2xl cta-press">+</button>
      </div>
      <div className="border-ink bg-paper p-4 hard-shadow-sm">
        <div className="flex items-baseline justify-between">
          <span className="tracked">Running total</span>
          <span className="display text-3xl">${qty * PRICING.perPersonUSD} <span className="text-sm">USD</span></span>
        </div>
      </div>
      <button onClick={onNext} className="w-full border-ink bg-yellow py-4 display text-lg hard-shadow cta-press">Next — your details</button>
    </div>
  );
}

function Field({
  label, value, onChange, error, type = "text", autoComplete, inputMode, id, name, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; error?: string; type?: string;
  autoComplete?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]; id: string; name: string; placeholder?: string;
}) {
  const errId = `${id}-err`;
  return (
    <label htmlFor={id} className="block">
      <div className="tracked mb-1 text-ink/70">{label}</div>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
        className={`block w-full border-[3px] bg-paper px-3 py-3 text-ink outline-none ${error ? "border-[#ff01aa]" : "border-ink"} focus:border-yellow`}
        style={{ fontSize: 16 }}
      />
      {error && <div id={errId} className="mt-1 text-xs text-[#ff01aa]">{error}</div>}
    </label>
  );
}

function StepDetails({
  guests, errors, onChange, onBack, onNext,
}: {
  guests: Guest[]; errors: Record<number, Partial<Record<keyof Guest, string>>>;
  onChange: (i: number, patch: Partial<Guest>) => void; onBack: () => void; onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <div className="tracked text-ink/70">Who's coming?</div>
        <h2 className="display mt-1 text-3xl">Real names. Passport spelling.</h2>
      </div>
      {guests.map((g, i) => {
        const e = errors[i] ?? {};
        return (
          <fieldset key={i} className="border-ink bg-paper p-4 hard-shadow-sm">
            <legend className="inline-block border-ink bg-ink px-3 py-1 display text-xs text-yellow">Spot {i + 1} of {guests.length}</legend>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field id={`name-${i}`} name={`name-${i}`} label="Full name (as per passport)" value={g.fullName} onChange={(v) => onChange(i, { fullName: v })} error={e.fullName} autoComplete="name" />
              </div>
              <Field id={`dob-${i}`} name={`dob-${i}`} label="Date of birth" value={g.dob} onChange={(v) => onChange(i, { dob: v })} error={e.dob} type="date" autoComplete="bday" />
              <Field id={`nat-${i}`} name={`nat-${i}`} label="Nationality" value={g.nationality} onChange={(v) => onChange(i, { nationality: v })} error={e.nationality} autoComplete="country-name" />
              <Field id={`email-${i}`} name={`email-${i}`} label="Email" value={g.email} onChange={(v) => onChange(i, { email: v })} error={e.email} type="email" autoComplete="email" inputMode="email" />
              <Field id={`wa-${i}`} name={`wa-${i}`} label="WhatsApp number" value={g.whatsapp} onChange={(v) => onChange(i, { whatsapp: v })} error={e.whatsapp} type="tel" autoComplete="tel" inputMode="tel" placeholder="+44 7…" />
              <div className="sm:col-span-2">
                <Field id={`arr-${i}`} name={`arr-${i}`} label="Arrival date in Phuket" value={g.arrival} onChange={(v) => onChange(i, { arrival: v })} error={e.arrival} type="date" />
              </div>
            </div>
          </fieldset>
        );
      })}
      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 border-ink bg-bone py-4 display text-sm hard-shadow-sm cta-press">Back</button>
        <button onClick={onNext} className="flex-[2] border-ink bg-yellow py-4 display text-base hard-shadow cta-press">Review order</button>
      </div>
    </div>
  );
}

function StepReview({ guests, qty, total, onBack, onPay, submitting, notice }: { guests: Guest[]; qty: number; total: number; onBack: () => void; onPay: () => void; submitting: boolean; notice: string | null }) {
  return (
    <div className="space-y-5">
      <div>
        <div className="tracked text-ink/70">Check it, then pay</div>
        <h2 className="display mt-1 text-3xl">Last look.</h2>
      </div>
      <ul className="space-y-3">
        {guests.map((g, i) => (
          <li key={i} className="border-ink bg-paper p-4 hard-shadow-sm">
            <div className="tracked text-ink/60">Spot {i + 1}</div>
            <div className="display mt-1 text-2xl leading-tight">{g.fullName || "—"}</div>
            <div className="mt-1 text-sm text-ink/80">{g.nationality} · born {g.dob} · arrives {g.arrival}</div>
            <div className="mt-1 text-xs text-ink/60">{g.email} · {g.whatsapp}</div>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between border-ink bg-ink px-4 py-4">
        <span className="display text-bone">{qty} × ${PRICING.perPersonUSD} USD</span>
        <span className="display text-3xl text-yellow">${total}</span>
      </div>
      <p className="text-xs text-ink/70">Non-refundable · Transferable up to 14 days out · By paying you accept the fine print above.</p>
      {notice && <div className="border-ink bg-yellow p-3 text-sm text-ink">{notice}</div>}
      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 border-ink bg-bone py-4 display text-sm hard-shadow-sm cta-press">Back</button>
        <button onClick={onPay} disabled={submitting} className="flex-[2] border-ink bg-yellow py-4 display text-base hard-shadow cta-press disabled:opacity-60">
          {submitting ? "Sending you to Stripe…" : `Pay $${total}`}
        </button>
      </div>
    </div>
  );
}

function WaitlistBody({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr("Real email please."); return; }
    setErr(null);
    if (ENDPOINTS.waitlist) {
      try { await fetch(ENDPOINTS.waitlist, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) }); }
      catch {}
      setDone(true);
      return;
    }
    // fallback so the form still works
    const subject = encodeURIComponent("Waitlist — DnB Allstars Thailand");
    const body = encodeURIComponent(`Add me to the waitlist: ${email}`);
    window.location.href = `mailto:${BRAND.email}?subject=${subject}&body=${body}`;
    setDone(true);
  };
  if (done) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto inline-block border-ink bg-yellow px-4 py-2 display text-sm hard-shadow-sm">YOU'RE IN LINE</div>
        <h2 className="display text-3xl">We've got you.</h2>
        <p className="text-ink/80">When one drops back in, you'll be first to know.</p>
        <button onClick={onDone} className="mt-2 border-ink bg-ink py-3 px-6 display text-yellow hard-shadow-sm cta-press">Close</button>
      </div>
    );
  }
  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="inline-block border-ink bg-yellow px-3 py-1 display text-xs hard-shadow-sm">SOLD OUT</div>
      <h2 className="display text-3xl">All 8 are gone.</h2>
      <p className="text-ink/80">Spots are transferable up to 14 days out, so they do come back. Leave your email and you'll be first to know.</p>
      <Field id="wl-email" name="wl-email" label="Email" value={email} onChange={setEmail} error={err ?? undefined} type="email" inputMode="email" autoComplete="email" />
      <button className="w-full border-ink bg-yellow py-4 display text-lg hard-shadow cta-press">Join the waitlist</button>
    </form>
  );
}
