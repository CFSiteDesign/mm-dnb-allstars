import { createFileRoute } from "@tanstack/react-router";
import type { Guest } from "@/components/mm/Checkout";
import { assertServerEnv, validateBookingPayload } from "@/lib/booking.server";

// Public HTTP endpoint so the marketing page can live on any host
// (e.g. madmonkeyhostels.com/events/dnb-all-stars) and still POST here
// to create the Stripe Checkout Session. Server functions can't be called
// cross-origin (they use TanStack's internal RPC protocol), so this is a
// raw server route with permissive CORS.

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
} as const;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });

export const Route = createFileRoute("/api/public/checkout")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS_HEADERS }),

      POST: async ({ request }) => {
        let payload: { quantity?: number; guests?: Guest[]; reference?: string; returnOrigin?: string };
        try {
          payload = await request.json();
        } catch {
          return json({ error: "Invalid JSON body" }, 400);
        }

        const { quantity, guests, reference, returnOrigin } = payload;
        if (
          typeof quantity !== "number" ||
          !Array.isArray(guests) ||
          typeof reference !== "string" ||
          !reference
        ) {
          return json({ error: "Missing quantity, guests, or reference" }, 400);
        }

        try {
          validateBookingPayload(quantity, guests);
        } catch (err) {
          return json({ error: err instanceof Error ? err.message : "Invalid payload" }, 400);
        }

        const perPerson = 250;
        const total = perPerson * quantity;
        const contactEmail = guests[0].email;

        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

          const { data: inserted, error: insertError } = await supabaseAdmin
            .from("bookings")
            .upsert(
              {
                reference,
                quantity,
                guests: guests as unknown as never,
                total_usd: total,
                contact_email: contactEmail,
                status: "pending",
              },
              { onConflict: "reference" },
            )
            .select("id, reference")
            .single();
          if (insertError || !inserted) {
            console.error("[checkout] upsert failed", insertError);
            return json({ error: "Failed to save booking" }, 500);
          }

          const stripeSecret = assertServerEnv("STRIPE_SECRET_KEY");
          const Stripe = (await import("stripe")).default;
          const stripe = new Stripe(stripeSecret);

          // Where to send the buyer after Stripe. Prefer the caller-supplied
          // origin (so buyers coming from madmonkeyhostels.com/events/dnb-all-stars
          // land back there); fall back to the Origin header, then to the
          // Lovable deployment.
          const referer = request.headers.get("origin") ?? request.headers.get("referer") ?? "";
          const originGuess = (() => {
            try { return new URL(referer).origin; } catch { return ""; }
          })();
          const returnBase =
            (returnOrigin && /^https?:\/\//.test(returnOrigin) ? returnOrigin.replace(/\/$/, "") : "") ||
            originGuess ||
            "https://mm-dnb-allstars.lovable.app";

          const session = await stripe.checkout.sessions.create({
            mode: "payment",
            client_reference_id: reference,
            customer_email: contactEmail,
            line_items: [
              {
                quantity,
                price_data: {
                  currency: "usd",
                  unit_amount: perPerson * 100,
                  product_data: {
                    name: "DnB Allstars Thailand × Mad Monkey — package",
                    description:
                      "3 day pass · 4 nights Mad Monkey Phuket · shuttle · pre-parties",
                  },
                },
              },
            ],
            metadata: { reference, quantity: String(quantity) },
            payment_intent_data: { metadata: { reference } },
            adaptive_pricing: { enabled: false },
            success_url: `${returnBase}/paid?ref=${encodeURIComponent(reference)}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${returnBase}/?cancelled=1&ref=${encodeURIComponent(reference)}`,
          });

          await supabaseAdmin
            .from("bookings")
            .update({ stripe_session_id: session.id })
            .eq("reference", reference);

          if (!session.url) return json({ error: "Stripe returned no checkout URL" }, 502);
          return json({ url: session.url, reference });
        } catch (err) {
          console.error("[checkout] failed", err);
          return json(
            { error: err instanceof Error ? err.message : "Checkout failed" },
            500,
          );
        }
      },
    },
  },
});
