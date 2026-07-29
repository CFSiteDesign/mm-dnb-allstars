// Server-only helpers for the booking flow. Not importable from route/component code.
import type { Guest } from "@/components/mm/Checkout";

export type BookingRow = {
  id: string;
  reference: string;
  quantity: number;
  guests: Guest[];
  total_usd: number;
  contact_email: string;
  status: "pending" | "paid" | "expired" | "failed";
  stripe_session_id: string | null;
  stripe_payment_intent: string | null;
  paid_at: string | null;
  email_sent_at: string | null;
};

export function assertServerEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing server env var: ${name}`);
  return v;
}

// Very light sanity-check on incoming guest payloads before we spend Stripe API calls.
export function validateBookingPayload(quantity: number, guests: Guest[]) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 4) {
    throw new Error("Invalid quantity");
  }
  if (!Array.isArray(guests) || guests.length !== quantity) {
    throw new Error("Guest count doesn't match quantity");
  }
  const festivalStart = new Date("2027-01-22");
  for (const g of guests) {
    if (!g.fullName || g.fullName.trim().length < 2) throw new Error("Missing name");
    if (!g.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(g.email)) throw new Error("Invalid email");
    if (!g.dob) throw new Error("Missing DOB");
    const d = new Date(g.dob);
    if (Number.isNaN(d.getTime())) throw new Error("Invalid DOB");
    // Age check enforced server-side too — do not trust the client.
    let age = festivalStart.getFullYear() - d.getFullYear();
    const m = festivalStart.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && festivalStart.getDate() < d.getDate())) age--;
    if (age < 20) throw new Error("All guests must be 20+ on 22 Jan 2027");
    if (!g.nationality?.trim()) throw new Error("Missing nationality");
    if (!g.whatsapp || g.whatsapp.replace(/\D/g, "").length < 7) throw new Error("Invalid WhatsApp");
    if (!g.arrival) throw new Error("Missing arrival date");
  }
}

export function renderConfirmationEmailHtml(b: BookingRow): string {
  const rows = b.guests
    .map(
      (g, i) => `
      <tr><td style="padding:8px 0;border-top:3px solid #0a0a0a"><strong>Spot ${i + 1}</strong> — ${escapeHtml(
        g.fullName,
      )}<br/><span style="color:#555;font-size:13px">${escapeHtml(g.nationality)} · born ${escapeHtml(
        g.dob,
      )} · arrives ${escapeHtml(g.arrival)}</span></td></tr>`,
    )
    .join("");
  return `<!doctype html><html><body style="margin:0;background:#01142c;font-family:Montserrat,Arial,sans-serif;color:#0a0a0a">
    <div style="max-width:560px;margin:0 auto;background:#f5efe2;border:3px solid #0a0a0a">
      <div style="background:#ffc000;padding:20px 24px;border-bottom:3px solid #0a0a0a">
        <div style="font-size:11px;letter-spacing:0.22em;font-weight:700">YOU'RE IN</div>
        <div style="font-size:28px;font-weight:900;line-height:1;margin-top:6px">DNB ALL STARS THAILAND</div>
      </div>
      <div style="padding:24px">
        <p style="margin:0 0 12px 0">Payment through. Your ${b.quantity} spot${b.quantity > 1 ? "s" : ""} at DnB Allstars Thailand (22–24 Jan 2027) ${
          b.quantity > 1 ? "are" : "is"
        } locked.</p>
        <p style="margin:0 0 8px 0"><strong>Booking ref:</strong> ${escapeHtml(b.reference)}</p>
        <p style="margin:0 0 8px 0"><strong>Total paid:</strong> $${b.total_usd} USD</p>
        <table style="width:100%;border-collapse:collapse;margin-top:16px">${rows}</table>
        <p style="margin:24px 0 8px 0">You'll get the group chat link about a week out. Bring photo ID — the venue checks and they don't budge.</p>
        <p style="margin:0">Any drama, hit us on Instagram <a href="https://www.instagram.com/madmonkeyhostels/">@madmonkeyhostels</a> or reply here.</p>
      </div>
      <div style="background:#0a0a0a;color:#ffc000;padding:16px 24px;font-size:11px;letter-spacing:0.22em;font-weight:700">MAD MONKEY HOSTELS · ALL IN</div>
    </div>
  </body></html>`;
}

function escapeHtml(s: string): string {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

export async function sendConfirmationEmail(booking: BookingRow) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  if (!apiKey || !from) {
    console.warn("[email] RESEND_API_KEY or MAIL_FROM not set — skipping confirmation");
    return { sent: false, reason: "not_configured" as const };
  }
  const recipients = Array.from(new Set(booking.guests.map((g) => g.email).filter(Boolean)));
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      from,
      to: recipients,
      subject: `You're in — DnB Allstars Thailand · ${booking.reference}`,
      html: renderConfirmationEmailHtml(booking),
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend failed [${res.status}]: ${body}`);
  }
  return { sent: true as const };
}
