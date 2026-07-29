import { createFileRoute } from "@tanstack/react-router";
import type { BookingRow } from "@/lib/booking.server";

// Stripe webhook — the ONLY thing that flips a booking to "paid" and sends
// the confirmation email. Never trust the browser for either.
// Configure this URL in Stripe Dashboard → Developers → Webhooks:
//   Events: checkout.session.completed, checkout.session.expired,
//           checkout.session.async_payment_succeeded,
//           checkout.session.async_payment_failed
export const Route = createFileRoute("/api/public/stripe/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.STRIPE_SECRET_KEY;
        const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!secret || !whSecret) {
          return new Response("Webhook not configured", { status: 500 });
        }
        const signature = request.headers.get("stripe-signature");
        if (!signature) return new Response("Missing signature", { status: 400 });

        const rawBody = await request.text();

        const Stripe = (await import("stripe")).default;
        const stripe = new Stripe(secret);

        let event: import("stripe").Stripe.Event;
        try {
          event = await stripe.webhooks.constructEventAsync(rawBody, signature, whSecret);
        } catch (err) {
          console.error("[stripe] signature verification failed:", (err as Error).message);
          return new Response("Invalid signature", { status: 400 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { sendConfirmationEmail } = await import("@/lib/booking.server");

        try {
          switch (event.type) {
            case "checkout.session.completed":
            case "checkout.session.async_payment_succeeded": {
              const session = event.data.object as import("stripe").Stripe.Checkout.Session;
              const reference =
                session.client_reference_id ?? (session.metadata?.reference as string | undefined);
              if (!reference) {
                console.error("[stripe] no reference on session", session.id);
                return new Response("ok", { status: 200 });
              }

              // Idempotency: skip if already paid.
              const { data: existing } = await supabaseAdmin
                .from("bookings")
                .select("*")
                .eq("reference", reference)
                .maybeSingle();
              if (!existing) {
                console.error("[stripe] booking not found for reference", reference);
                return new Response("ok", { status: 200 });
              }
              if (existing.status === "paid" && existing.email_sent_at) {
                return new Response("ok", { status: 200 });
              }

              const paymentIntent =
                typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null;

              const { data: updated, error: updateErr } = await supabaseAdmin
                .from("bookings")
                .update({
                  status: "paid",
                  paid_at: new Date().toISOString(),
                  stripe_session_id: session.id,
                  stripe_payment_intent: paymentIntent,
                })
                .eq("reference", reference)
                .select("*")
                .single();
              if (updateErr || !updated) throw new Error(updateErr?.message ?? "Update failed");

              // Send email once. If email fails we still return 200 so Stripe
              // doesn't retry the whole webhook; the email retry lives elsewhere.
              if (!updated.email_sent_at) {
                try {
                  const result = await sendConfirmationEmail(updated as unknown as BookingRow);
                  if (result.sent) {
                    await supabaseAdmin
                      .from("bookings")
                      .update({ email_sent_at: new Date().toISOString() })
                      .eq("reference", reference);
                  }
                } catch (err) {
                  console.error("[email] send failed:", (err as Error).message);
                }
              }
              break;
            }
            case "checkout.session.expired": {
              const session = event.data.object as import("stripe").Stripe.Checkout.Session;
              const reference =
                session.client_reference_id ?? (session.metadata?.reference as string | undefined);
              if (reference) {
                await supabaseAdmin
                  .from("bookings")
                  .update({ status: "expired" })
                  .eq("reference", reference)
                  .eq("status", "pending");
              }
              break;
            }
            case "checkout.session.async_payment_failed": {
              const session = event.data.object as import("stripe").Stripe.Checkout.Session;
              const reference =
                session.client_reference_id ?? (session.metadata?.reference as string | undefined);
              if (reference) {
                await supabaseAdmin
                  .from("bookings")
                  .update({ status: "failed" })
                  .eq("reference", reference);
              }
              break;
            }
            default:
              // Ignore unrelated events.
              break;
          }
        } catch (err) {
          console.error("[stripe] handler error:", err);
          return new Response("Internal error", { status: 500 });
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});
