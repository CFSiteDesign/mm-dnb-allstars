import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";
import type { Guest } from "@/components/mm/Checkout";

type AdminSession = { unlocked?: boolean };

const sessionConfig = () => ({
  password: process.env.SESSION_SECRET!,
  name: "mm-admin",
  maxAge: 60 * 60 * 12,
  cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
});

function matches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

export const adminUnlock = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) throw new Error("ADMIN_PASSWORD is not set");
    if (!matches(data.password ?? "", expected)) return { ok: false as const };
    const session = await useSession<AdminSession>(sessionConfig());
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const adminLock = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

export type AdminBooking = {
  reference: string;
  status: string;
  quantity: number;
  total_usd: number;
  contact_email: string;
  guests: Guest[];
  paid_at: string | null;
  created_at: string;
  stripe_session_id: string | null;
};

export const adminListBookings = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  if (!session.data.unlocked) return { unlocked: false as const, bookings: [] as AdminBooking[] };

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select(
      "reference, status, quantity, total_usd, contact_email, guests, paid_at, created_at, stripe_session_id",
    )
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return { unlocked: true as const, bookings: (data ?? []) as unknown as AdminBooking[] };
});
