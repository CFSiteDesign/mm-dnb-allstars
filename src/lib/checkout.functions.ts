import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import type { Guest } from "@/components/mm/Checkout";
import { assertServerEnv, validateBookingPayload } from "./booking.server";

// Client → server: hand off qty + guest fieldsets, get back a Stripe Checkout URL.
// The booking row is created here in `pending` status; the webhook flips it to `paid`.
export const createStripeCheckout = createServerFn({ method: "POST" })
  .inputValidator((input: { quantity: number; guests: Guest[]; reference: string }) => input)
  .handler(async ({ data }) => {
    const { quantity, guests, reference } = data;
    validateBookingPayload(quantity, guests);

    const perPerson = 250;
    const total = perPerson * quantity;
    const contactEmail = guests[0].email;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Insert pending booking. Reference is unique — if the client retries we upsert on it.
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
    if (insertError || !inserted) throw new Error(insertError?.message ?? "Failed to save booking");

    const stripeSecret = assertServerEnv("STRIPE_SECRET_KEY");
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeSecret);

    // Build the origin from the current request so preview + prod both work
    // without hardcoding a domain.
    const host = getRequestHeader("host");
    const proto = getRequestHeader("x-forwarded-proto") ?? "https";
    const origin = host ? `${proto}://${host}` : "";

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
              description: "3 day pass · 4 nights Mad Monkey Phuket · shuttle · pre-parties",
            },
          },
        },
      ],
      metadata: { reference, quantity: String(quantity) },
      payment_intent_data: { metadata: { reference } },
      success_url: `${origin}/paid?ref=${encodeURIComponent(reference)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?cancelled=1&ref=${encodeURIComponent(reference)}`,
    });

    // Save the session id so the webhook can double-key by session or reference.
    await supabaseAdmin
      .from("bookings")
      .update({ stripe_session_id: session.id })
      .eq("reference", reference);

    if (!session.url) throw new Error("Stripe returned no checkout URL");
    return { url: session.url, reference };
  });
