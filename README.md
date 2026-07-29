# Monkey Business Booking

Build a single-page landing site that sells 8 travel packages for a drum & bass festival trip. Mobile-first — nearly all traffic arrives from an Instagram DM.

Brand: MAD MONKEY HOSTELS. Gen Z, party-forward social hostel brand. Slogan "ALL IN". Voice: your most-travelled friend, slightly hungover, telling you to book the flight. Short, punchy, self-aware. Never use the words "premium", "boutique", "curated", "experiences", "hospitality solutions".

=========================
NON-NEGOTIABLE DESIGN RULES
=========================
This page runs YELLOW ON DEEP BLUE and no third colour.
- Yellow #ffc000, brand blue #0081f7
- Deep blue grounds (dark stops of the same hue): #01142c (page bg), #02203f (panels), #032f5c
- Anchors: #0a0a0a Mad Black, #f5efe2 Bone (body text on dark), #ffffff Paper
- ONE exception: #ff6600 orange appears exactly once, in the partner strip, for the DnB Allstars lockup. Nowhere else.

Type:
- Montserrat only for display and body. 900 weight, UPPERCASE, letter-spacing -0.02em, line-height 0.88 for all display headings. 400–600 sentence case for body.
- Bungee for sticker accents ONLY (the ALL IN sticker, small pill stickers).
- Caveat (700) for one word: the word "thailand" in the hero, in yellow script.
- A repeated "tracked" label style: uppercase, letter-spacing 0.22em, weight 700, ~0.6rem, used for eyebrows and small labels.

Shadows are HARD-OFFSET, never blurred: box-shadow: 6px 6px 0 0 #0a0a0a (also 4px and 8px variants). No blur, no backdrop-blur, no glassmorphism, no gradient soup.
Borders are thick: 3px solid #0a0a0a. Border radius 0 everywhere — square corners. No 8–12px rounded Tailwind-default buttons. No thin 1px borders. No decorative emoji.

Brand devices — use several: an "ALL IN" diagonal sticker (yellow, black 3px border, hard shadow, rotated -4deg, Bungee, gentle wobble animation); a spiky CSS starburst (yellow, clip-path polygon with ~32 points) reading "ONLY 8 SPOTS"; small speech pills; a full-bleed scrolling ticker-tape band (yellow ground, black Montserrat 900 text, marquee animation, black 3px top and bottom borders); and a circular "MAD MONKEY THAILAND" roundel with text on a slow-rotating SVG textPath around a monkey head.

The Mad Monkey wordmark must appear bottom-right in the footer, about 120–140px wide, white version on the dark background. Use a placeholder image at /mm-wordmark-white.png and also reference it in the header top-left (h-9) and in the partner strip.

Respect prefers-reduced-motion. Inputs must be 16px font-size so iOS Safari doesn't zoom on focus.

=========================
CENTRAL CONFIG FILE
=========================
Put EVERY editable fact in one file, src/config.ts — price, dates, spot count, min age, hostel details, shuttle details, Stripe link, the gallery manifest, and all copy blocks (inclusions, day-to-day, FAQ, fine print). Nothing hardcoded in components. Mark unconfirmed values with a "CONFIRM" comment.

Values:
- Event: DnB Allstars Thailand, Phuket Thailand, 22–24 January 2027. Festival start date 2027-01-22. 3 festival days, 4 nights.
- Check-in Thursday 21 January 2027. Check-out Monday 25 January 2027, 11:00.
- Price: 250 USD per person, paid in full. totalSpots 8, spotsRemaining 8, maxPerOrder 4.
- minAge: 20
- Hostel: Mad Monkey Phuket, Patong Beach, mixed dorm, air-con with private bathroom and balcony, 4 minutes to the beach. Map query string "Mad Monkey Phuket, Patong, Thailand".
- Shuttle: about 40 minutes each way, once each way every festival day. Departure/return times and vehicle are TBC — mark CONFIRM.
- Contact email cs@madmonkeyhostels.com, Instagram https://www.instagram.com/madmonkeyhostels/
- Airport: Phuket International (HKT), routes via Bangkok, KL and Singapore.
- STRIPE.paymentLink: empty string for now, with a comment explaining the setup needed (fixed $250 USD, adjustable quantity 1–4, "limit the number of payments" set to 8 — that limit is the real inventory cap, not the page).

=========================
PAGE STRUCTURE
=========================

HEADER — transparent, absolutely positioned over the hero. Mad Monkey wordmark left. Desktop nav links: Our Story, Hostels, Experience, Mad Loyalty (all pointing at madmonkeyhostels.com routes, target _blank). A yellow "Grab a spot" button opens the checkout. Hamburger + slide-down panel on mobile.

HERO — full-bleed photo, 80vh on mobile / 92vh on desktop, with a dusk gradient wash over it (transparent at top to near-solid #01142c at the bottom). Bottom-left lockup:
- ALL IN sticker
- H1 in Montserrat 900 uppercase, huge (3.1rem mobile → 6.5rem desktop): "DNB All Stars"
- directly under it, on its own line, the word "thailand" in Caveat, yellow, even larger (3.6rem → 7rem), normal case
- Sub: "3 day pass, 4 nights, daily shuttle, pre-parties." then "One payment." in yellow
- Three small bordered chips: "PHUKET, THAILAND", "22–24 JANUARY 2027", "20+"
A vertical thumbnail rail of 5 gallery images sits top-right on desktop; on mobile a horizontal scrolling thumbnail strip sits directly under the hero. Clicking a thumbnail swaps the hero image.

TICKER BAND right after the hero: "3 DAY PASS ✦ 4 NIGHTS ✦ DAILY SHUTTLE ✦ PRE PARTIES ✦ ONLY 8 SPOTS ✦ ALL IN" scrolling infinitely.

PRICE RAIL — the key commercial element. Bone (#f5efe2) card, 3px black border, hard 8px shadow, with the spiky yellow starburst "ONLY 8 SPOTS" pinned to its top-right corner, rotated. Contents: "THE PACKAGE" eyebrow, "$250" in huge Montserrat 900 with "USD PP" beside it, then a bordered fact list (Price / $250 USD per person, Payment / Paid in full, Spots / 8 total, Age / 20+), then four ticked lines (3 day festival pass, 4 nights at Mad Monkey Phuket, Daily shuttle both ways, Pre-party before every shuttle), then a full-width yellow CTA "GRAB A SPOT — $250" with hard shadow that presses in on active, and small print "Non-refundable · Transferable up to 14 days out".
Layout: on desktop this sits in a 2-column page grid (content 8 cols / rail 4 cols) and is STICKY (top-8) so it follows the whole page down; give it a negative top margin so it overlaps up into the hero and the ticker like a pasted-on poster element, with z-index above both. On mobile it appears inline right below the hero (order-first), and a separate sticky bottom bar handles the follow-along CTA.

STICKY MOBILE CTA BAR (lg:hidden) — fixed to the bottom, bone background, 3px black top border: "$250 / PER PERSON · 8 SPOTS" on the left, yellow "GRAB A SPOT" button on the right.

SECTION JUMP-NAV — a horizontal row of small bordered pills linking to each section anchor: The lowdown, What's included, Day to day, Location, The accommodation, FAQ.

Then these sections, each separated by a thin bone/15 top border, each with a small yellow uppercase tracked eyebrow above a big Montserrat 900 heading:

1. THE LOWDOWN — heading "Three days on the Andaman coast". Chips: Phuket Thailand / 22–24 January 2027 / 4 nights / 20+. Body:
"DnB Allstars landed in Asia for the first time last January and it went off. It's back in Phuket for three days and nights on the Andaman coast, all stages, full weekend."
"We've got 8 packages (bold, yellow). Your 3 day pass, 4 nights at Mad Monkey, the shuttle to the venue and back every day, and the pre-party at ours before you go. One payment, no admin."
Then a large display line: "Book the flight. That's your only other job."

2. WHAT'S INCLUDED — heading "All of this, one payment". Four stacked semi-transparent bars (background rgba(245,239,226,0.08), 6px solid yellow left border, generous padding), each with a small yellow 01/02/03/04 number, a wide-tracked uppercase title, and a sentence under it:
01 3 day festival pass — Full access to all stages, all three days and nights.
02 4 night hostel stay — Mad Monkey Phuket, Patong Beach, four minutes from the sand.
03 Daily shuttle — Hostel to venue and back, every day. Last one runs late.
04 Pre party — DJs at ours before every shuttle. Drinks deals on the wristband.
Underneath, a white speech pill reading "NOT INCLUDED" next to muted text: "Flights · Airport transfers · Food · Travel insurance".

3. DAY TO DAY — heading "How it actually goes". An accordion, one row per day, first row open by default. Each row: small yellow "DAY 1" label, the title in display type, the date in small tracked caps beneath, and a square yellow-bordered "+" that rotates 45° when open. Open panel shows an image on the left (2/5) and copy on the right (3/5).
Day 1 · Wed 21 Jan · "Land and settle" — Check in, grab your welcome drink and your festival pack. Pool's open, Patong's a four-minute walk. Take it easy — or don't.
Day 2 · Thu 22 Jan · "Day one, and it starts at ours" — Pre-party at the hostel, then the shuttle out. First day of DnB Allstars, every stage open, shuttle back when it's done. Pool bar's still going if you are.
Day 3 · Fri 23 Jan · "The big one" — Pre-party from late afternoon, shuttle to the venue for the heaviest night of the weekend. Full lineup, every stage. Pace yourself. Or don't, again.
Day 4 · Sat 24 Jan · "Last night standing" — Final pre-party, final shuttle, final night. Then the walk back along the beach as it gets light. This is the one you'll tell people about.
Day 5 · Sun 25 Jan · "Out" — Check out at 11. Coffee, ferry, flight — or extend at the direct rate, just tell reception.

4. LOCATION — heading "You stay in Patong. We drive you to the rest." A Google Maps embed (no API key: https://www.google.com/maps?q=<encoded query>&output=embed), 3px black border and hard shadow, ~300px tall on mobile / 400px desktop. Below it, two cards side by side: a solid YELLOW card with black text — "WHERE YOU SLEEP / Mad Monkey Phuket / Patong Beach · 4 minutes to the sand." — and a deep blue bordered card — "THE FESTIVAL SITE / South of town / about 40 minutes in the shuttle — and the shuttle's on us both ways, every day." Do not invent a venue address; the site is only ever described as "south of town".

5. THE ACCOMMODATION — heading "Mad Monkey Phuket". Left: an image collage (one wide image above two smaller ones), all with black borders and hard shadows. Right: "Air-con dorms with private bathrooms and balconies. Outdoor pool, rooftop bar, restaurant running full English through to Thai. Four minutes to the beach." Then a yellow-left-bordered callout: "YOUR BED / Mixed dorm / Air-con mixed dorm, private bathroom, balcony." Then: "Want a private? Message us (link to Instagram, yellow underlined) and we'll price the upgrade." Then a yellow CTA button "GRAB A SPOT — $250".

6. FAQ — heading "Before you ask". Accordion, all closed by default, same +/rotate treatment:
Is the festival ticket included? → Yes. Full 3 day pass, all stages, in the price. Nothing to buy separately.
What about flights? → On you. Fly into Phuket International (HKT) — plenty of routes via Bangkok, KL and Singapore.
How old do I need to be? → 20+. Bring photo ID — the venue checks, and they don't make exceptions.
Can I pay a deposit? → No. There are 8 and they're paid in full to lock your ticket.
Can I book for a mate? → Yes. Buy two spots in one go and fill in both sets of details at checkout.
Can I stay longer? → Yes. Tell us at checkout or at reception and we'll extend you at the direct rate.
How does the shuttle work? → Hostel to venue and back, every festival day, once each way. Roughly 40 minutes each way. Exact timings land in your confirmation.
Is there a group chat? → Yes. Link comes in your confirmation email a week out.
What if I can't make it? → Non-refundable — the ticket is allocated to you the moment you pay. You can transfer your spot to someone else up to 14 days out. Get travel insurance.
Under the accordion: a yellow "Still stuck?" sticker next to "DM us on Instagram — fastest way to get us."

7. FINE PRINT — heading "The boring, important bit". A muted bulleted list:
- $250 USD per person, paid in full at booking. Non-refundable. Transferable to another person up to 14 days before arrival — email cs@madmonkeyhostels.com.
- 20+. Photo ID required at the venue. Date of birth is collected at checkout and is not optional.
- Check-in Thursday 21 January 2027. Check-out Monday 25 January 2027, 11:00. Mixed dorm bed. Tell us at checkout or at reception and we'll extend you at the direct rate.
- Flights are not included. Fly into Phuket International (HKT) — routes via Bangkok, KL and Singapore.
- Lineup and set times are set by DnB Allstars and can change. Festival ticket terms sit with the promoter.
- Travel insurance strongly recommended.

Then a second ticker band: "MAD MONKEY PHUKET ✦ PATONG BEACH ✦ MAKE IT COUNT ✦ ALL IN".

PARTNER STRIP — deep blue band, 3px black top and bottom borders. Left: "BROUGHT TO YOU BY" tracked label above the Mad Monkey wordmark. A large "×" between. Right: "OFFICIAL PACKAGE FOR" above a type lockup reading "DnB Allstars" with "THAILAND 2027" beneath it, in #ff6600 — this is the ONLY place orange is allowed.

FOOTER — big display line "8 spots. / Then that's it." (second line yellow), the location and dates, a yellow CTA, the rotating Mad Monkey Thailand roundel to the right, then a divider with the contact email, the Instagram handle, a copyright line, and the Mad Monkey wordmark bottom-right.

=========================
GALLERY / IMAGE PLACEHOLDERS
=========================
There are 8 photo slots and no photos yet. Build a <Photo> component that tries /gallery/<filename> and, on error, renders a branded deep-blue placeholder instead — an inline SVG of a dusk horizon with palm silhouettes and a soft yellow sun, plus a "PHOTO SLOT" label and a caption bar showing that slot's shot brief and its exact file path. Add a `quiet` prop that renders artwork only, with no text, used for the full-bleed hero and for the small thumbnails so the placeholder never fights the headline. This way nothing looks broken and it's obvious what image belongs where.
Slots and their briefs:
01-crowd.jpg — Crowd, front of stage, 2026 Phuket edition — hands up, lasers, sweat
02-pool.jpg — Mad Monkey Phuket pool, people in it, mid-afternoon, not empty
03-patong-night.jpg — Patong at night, neon, wet street, motion blur
04-stage.jpg — Main stage wide, dusk into night, CO2 jets
05-shuttle.jpg — The shuttle, people boarding, wristbands on, going out
06-rooftop.jpg — Rooftop bar, pre-party, DJ and a full deck
07-sunrise.jpg — Sunrise on the beach, the walk home, silhouettes
08-dorm.jpg — Dorm room, beds, balcony light, made up and clean

=========================
CHECKOUT — READ THIS CAREFULLY
=========================
A modal (bottom sheet on mobile, centred on desktop), bone background, 3px black border, hard shadow, with a sticky yellow header bar showing "Step N of 3" and a square close button. Closes on Escape and on backdrop click; locks body scroll while open.

Step 1 — How many spots? A big − / quantity / + stepper (quantity shown in a black box with yellow numerals), capped at 4, with a live running total. Button: "Next — your details".

Step 2 — Who's coming? Render ONE fieldset per spot, legend "Spot 1 of N" on a black tab. Each fieldset collects: Full name as per passport (full width), Date of birth, Nationality, Email, WhatsApp number, Arrival date in Phuket. All required.

WHY per-person and not via Stripe: a Stripe Payment Link collects only ONE set of custom fields per checkout session regardless of quantity — buy 4 spots and Stripe returns a single passport name. The venue checks a name and a DOB for every person, so we must collect them ourselves before handing off. Put this reasoning in a code comment.

AGE VALIDATION — this is the important bit. The rule is "20+ on the first day of the festival", NOT "20+ today". Compute age as of 2027-01-22. Someone who turns 20 the week before the event passes; someone who turns 20 on 30 January 2027 must be REJECTED, with the error shown on their date-of-birth field reading "You need to be 20 by 22–24 Jan 2027. The door won't budge on this." Getting this right avoids a refund conversation in January.
Other validation messages, in this voice:
- name: "Full name as it appears on your passport."
- missing dob: "We need a date of birth — the venue checks ID."
- nationality: "Required."
- email: "We send the confirmation and the group chat link here."
- whatsapp (keep it loose, international formats vary — just require 7+ digits): "Include the country code."
- arrival: "Roughly when you land in Phuket."
Invalid fields get a pink border and the message beneath, with aria-invalid and aria-describedby wired up. On a failed submit, scroll the FIRST erroring field into view (block: center) and focus it — on a phone the bad field is usually off-screen, so this matters.

Step 3 — Check it, then pay. List each person back (name in display type, then nationality · born · arrives, then email · whatsapp), a black total bar showing "N × $250 USD" and the total in yellow, the terms line, Back and "Pay $N" buttons.

On pay: generate a booking reference like DNB-SURNAME-K3M2X, save the full booking (reference, quantity, guests, total) to localStorage AND POST it to an optional configurable endpoint, then redirect to the Stripe payment link with quantity, prefilled_email and client_reference_id query params. If the Stripe link is not configured yet, show a clear message saying so rather than silently doing nothing.

SOLD OUT STATE — when spotsRemaining is 0, every CTA on the page becomes "Sold out — join the waitlist" and the modal shows a waitlist form instead: a "SOLD OUT" sticker, "All 8 are gone", "Spots are transferable up to 14 days out, so they do come back. Leave your email and you'll be first to know.", an email field and a "Join the waitlist" button, then a confirmation state. If no waitlist endpoint is configured, fall back to a mailto: draft to cs@madmonkeyhostels.com so the form still works.

=========================
FINALLY
=========================
Page title: "DNB ALL STARS THAILAND × MAD MONKEY | 8 spots · $250". Add Open Graph tags — this gets shared in DMs constantly. theme-color #01142c.

Build the whole page in one go. Prioritise the mobile layout.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/951dd0d7-31bc-4048-9acc-b0ad64b863ac).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
