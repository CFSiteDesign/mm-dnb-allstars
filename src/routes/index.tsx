import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BRAND, EVENT, PRICING, HOSTEL, SHUTTLE, GALLERY, COPY, SECTIONS } from "@/config";
import { Photo } from "@/components/mm/Photo";
import { Wordmark } from "@/components/mm/Wordmark";
import { Roundel } from "@/components/mm/Roundel";
import { CheckoutModal } from "@/components/mm/Checkout";
import dnbAllstarsLogo from "@/assets/dnb-allstars-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DNB ALL STARS THAILAND × MAD MONKEY | 8 spots · $250" },
      { name: "description", content: "8 packages. Phuket, 22–24 Jan 2027. 3 day pass, 4 nights at Mad Monkey, daily shuttle, pre-parties. $250. All in." },
      { property: "og:title", content: "DNB ALL STARS THAILAND × MAD MONKEY — 8 spots, $250" },
      { property: "og:description", content: "3 day pass, 4 nights, daily shuttle, pre-parties. One payment. Book the flight." },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Page,
});

const soldOut = PRICING.spotsRemaining <= 0;

function Page() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const openCheckout = () => setCheckoutOpen(true);

  return (
    <div className="min-h-screen bg-deep-1 text-bone">
      <Header onCTA={openCheckout} />
      <Hero onCTA={openCheckout} />
      <Ticker text="3 DAY PASS ✦ 4 NIGHTS ✦ DAILY SHUTTLE ✦ PRE PARTIES ✦ ONLY 8 SPOTS ✦ ALL IN ✦ " />

      <main className="relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="order-2 lg:order-1 lg:col-span-8">
              <JumpNav />
              <Lowdown />
              <Included />
              <DayToDay />
              <Location />
              <Accommodation onCTA={openCheckout} />
              <FAQ />
              <FinePrint />
            </div>

            <aside className="order-1 lg:order-2 lg:col-span-4">
              <div className="mt-6 lg:sticky lg:top-8 lg:mt-8 lg:z-30">
                <PriceRail onCTA={openCheckout} />
              </div>
            </aside>
          </div>
        </div>

        <div className="mt-16">
          <Ticker text={`MAD MONKEY PHUKET ✦ PATONG BEACH ✦ MAKE IT COUNT ✦ ALL IN ✦ `} />
        </div>

        <PartnerStrip />
        <Footer onCTA={openCheckout} />
      </main>

      <StickyMobileCTA onCTA={openCheckout} />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </div>
  );
}

/* ---------------- HEADER ---------------- */
function Header({ onCTA }: { onCTA: () => void }) {
  const [open, setOpen] = useState(false);
  const links = [
    { label: "Our Story", href: BRAND.siteLinks.ourStory },
    { label: "Hostels", href: BRAND.siteLinks.hostels },
    { label: "Experience", href: BRAND.siteLinks.experience },
    { label: "Mad Loyalty", href: BRAND.siteLinks.madLoyalty },
  ];
  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="/" aria-label="Mad Monkey Hostels" className="inline-flex items-center">
          <Wordmark width={140} />
        </a>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="tracked text-bone/90 hover:text-yellow">
              {l.label}
            </a>
          ))}
          <CTAButton onClick={onCTA} size="sm">{soldOut ? "Waitlist" : "Grab a spot"}</CTAButton>
        </nav>
        <button aria-label="Menu" onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center border-ink bg-yellow text-ink hard-shadow-sm cta-press md:hidden">
          <span className="display text-lg">{open ? "✕" : "≡"}</span>
        </button>
      </div>
      {open && (
        <div className="mx-4 border-ink bg-deep-2 p-4 hard-shadow md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" onClick={() => setOpen(false)} className="tracked border-ink-bottom py-2 text-bone">
                {l.label}
              </a>
            ))}
            <CTAButton onClick={() => { setOpen(false); onCTA(); }}>{soldOut ? "Join the waitlist" : "Grab a spot"}</CTAButton>
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------------- HERO ---------------- */
function Hero({ onCTA }: { onCTA: () => void }) {
  return (
    <section className="relative isolate">
      <div className="relative h-[80vh] w-full overflow-hidden lg:h-[92vh]">
        <Photo slot={1} quiet />
        <div className="absolute inset-0 hero-wash" />

        {/* Centered DnB Allstars logo */}
        <div className="absolute inset-x-0 top-[18%] z-10 flex justify-center pointer-events-none px-4 sm:top-[20%]">
          <img
            src={dnbAllstarsLogo}
            alt="DnB Allstars"
            className="w-[55%] max-w-[460px] h-auto drop-shadow-[4px_4px_0_rgba(0,0,0,0.55)]"
          />
        </div>


        {/* Bottom-left lockup */}
        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8 lg:pb-16">
            <div className="mb-4">
              <span className="inline-block sticker-allin px-4 py-2 text-lg tracking-wider">ALL IN</span>
            </div>
            <h1 className="display text-bone" style={{ fontSize: "clamp(3.1rem, 12vw, 6.5rem)" }}>
              DNB All Stars
            </h1>
            <div className="script-yellow -mt-1" style={{ fontSize: "clamp(3.6rem, 14vw, 7rem)" }}>
              thailand
            </div>
            <p className="mt-4 max-w-xl text-lg text-bone/90 sm:text-xl">
              {COPY.hero.subLine1} <span className="text-yellow">{COPY.hero.subLine2}</span>
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Chip>PHUKET, THAILAND</Chip>
              <Chip>22–24 JANUARY 2027</Chip>
              <Chip>20+</Chip>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}


function Chip({ children }: { children: React.ReactNode }) {
  return <span className="tracked inline-block border-[3px] border-bone/80 px-3 py-1.5 text-bone">{children}</span>;
}

/* ---------------- TICKER ---------------- */
function Ticker({ text }: { text: string }) {
  const doubled = (text + text).repeat(1);
  return (
    <div className="relative overflow-hidden border-ink-top border-ink-bottom bg-yellow">
      <div className="marquee-track flex whitespace-nowrap py-3 will-change-transform">
        <span className="display px-4 text-2xl text-ink sm:text-3xl">{doubled}</span>
        <span className="display px-4 text-2xl text-ink sm:text-3xl" aria-hidden>{doubled}</span>
      </div>
    </div>
  );
}

/* ---------------- CTA BUTTON ---------------- */
function CTAButton({ children, onClick, size = "md", full = false }: { children: React.ReactNode; onClick: () => void; size?: "sm" | "md" | "lg"; full?: boolean }) {
  const pad = size === "lg" ? "px-6 py-4 text-lg" : size === "sm" ? "px-4 py-2 text-sm" : "px-5 py-3 text-base";
  return (
    <button onClick={onClick} className={`display border-ink bg-yellow text-ink hard-shadow cta-press ${pad} ${full ? "w-full" : ""}`}>
      {children}
    </button>
  );
}

/* ---------------- PRICE RAIL ---------------- */
function PriceRail({ onCTA }: { onCTA: () => void }) {
  return (
    <div className="relative border-ink bg-bone p-5 text-ink hard-shadow-lg sm:p-6">
      {/* Starburst */}
      <div className="pointer-events-none absolute -right-6 -top-6 sm:-right-8 sm:-top-8" style={{ transform: "rotate(12deg)" }} aria-hidden>
        <div className="grid h-28 w-28 place-items-center bg-yellow starburst sm:h-32 sm:w-32">
          <div className="text-center display text-ink" style={{ fontSize: 12, lineHeight: 1 }}>
            ONLY<br />8<br />SPOTS
          </div>
        </div>
      </div>

      <div className="tracked text-ink/70">The package</div>
      <div className="mt-1 flex items-end gap-2">
        <span className="display text-6xl leading-none">${PRICING.perPersonUSD}</span>
        <span className="tracked pb-1">USD PP</span>
      </div>

      <ul className="mt-5 border-ink">
        {[
          ["Price", `$${PRICING.perPersonUSD} USD per person`],
          ["Payment", "Paid in full"],
          ["Spots", `${PRICING.totalSpots} total`],
          ["Age", `${EVENT.minAge}+`],
        ].map(([k, v], i) => (
          <li key={k} className={`flex items-center justify-between px-3 py-2 text-sm ${i > 0 ? "border-t-[3px] border-ink" : ""}`}>
            <span className="tracked text-ink/70">{k}</span>
            <span className="display text-sm">{v}</span>
          </li>
        ))}
      </ul>

      <ul className="mt-5 space-y-2 text-sm">
        {["3 day festival pass", `${EVENT.nights} nights at ${HOSTEL.name}`, "Daily shuttle both ways", "Pre-party before every shuttle"].map((t) => (
          <li key={t} className="flex items-start gap-2">
            <span aria-hidden className="mt-[2px] inline-grid h-5 w-5 shrink-0 place-items-center bg-ink text-yellow display" style={{ fontSize: 12 }}>✓</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>

      <button onClick={onCTA} className="mt-5 w-full border-ink bg-yellow py-4 display text-lg hard-shadow cta-press">
        {soldOut ? "SOLD OUT — JOIN THE WAITLIST" : `GRAB A SPOT — $${PRICING.perPersonUSD}`}
      </button>
      <p className="mt-2 text-xs text-ink/60">Non-refundable · Transferable up to 14 days out</p>
    </div>
  );
}

/* ---------------- STICKY MOBILE CTA ---------------- */
function StickyMobileCTA({ onCTA }: { onCTA: () => void }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-ink-top bg-bone px-3 py-2 lg:hidden" style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}>
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 leading-tight">
          <div className="display text-lg text-ink">${PRICING.perPersonUSD} <span className="text-xs">/ PER PERSON</span></div>
          <div className="tracked text-ink/70">{PRICING.spotsRemaining} spots left</div>
        </div>
        <button onClick={onCTA} className="border-ink bg-yellow px-4 py-3 display text-sm text-ink hard-shadow-sm cta-press">
          {soldOut ? "Waitlist" : "Grab a spot"}
        </button>
      </div>
    </div>
  );
}

/* ---------------- JUMP NAV ---------------- */
function JumpNav() {
  return (
    <nav aria-label="Sections" className="mt-8 flex flex-wrap gap-2">
      {SECTIONS.map((s) => (
        <a key={s.id} href={`#${s.id}`} className="tracked inline-block border-ink bg-deep-2 px-3 py-1.5 text-bone hard-shadow-sm hover:bg-yellow hover:text-ink">
          {s.label}
        </a>
      ))}
    </nav>
  );
}

/* ---------------- SECTION HEADER ---------------- */
function SectionHead({ eyebrow, title, id }: { eyebrow: string; title: string; id: string }) {
  return (
    <header id={id} className="mb-6 scroll-mt-24 border-t border-bone/15 pt-10">
      <div className="tracked text-yellow">{eyebrow}</div>
      <h2 className="display mt-2 text-4xl text-bone sm:text-5xl lg:text-6xl">{title}</h2>
    </header>
  );
}

/* ---------------- LOWDOWN ---------------- */
function Lowdown() {
  return (
    <section className="mt-12">
      <SectionHead id="lowdown" eyebrow={COPY.lowdown.eyebrow} title={COPY.lowdown.heading} />
      <div className="mb-4 flex flex-wrap gap-2">
        <Chip>Phuket Thailand</Chip>
        <Chip>22–24 January 2027</Chip>
        <Chip>4 nights</Chip>
        <Chip>20+</Chip>
      </div>
      <p className="max-w-2xl text-lg text-bone/90">{COPY.lowdown.p1}</p>
      <p className="mt-4 max-w-2xl text-lg text-bone/90">
        {COPY.lowdown.p2Prefix}<strong className="display text-yellow">{COPY.lowdown.p2Bold}</strong>{COPY.lowdown.p2Rest}
      </p>
      <p className="display mt-8 text-3xl text-bone sm:text-4xl">Book the flight. <span className="text-yellow">That's your only other job.</span></p>
    </section>
  );
}

/* ---------------- INCLUDED ---------------- */
function Included() {
  return (
    <section className="mt-16">
      <SectionHead id="included" eyebrow="What's included" title="All of this, one payment" />
      <ul className="space-y-3">
        {COPY.inclusions.map((it) => (
          <li key={it.n} className="flex gap-4 p-5" style={{ background: "rgba(245,239,226,0.08)", borderLeft: "6px solid var(--mm-yellow)" }}>
            <div className="display text-2xl text-yellow">{it.n}</div>
            <div>
              <div className="tracked text-bone">{it.title}</div>
              <p className="mt-1 text-bone/85">{it.body}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="inline-block border-ink bg-paper px-3 py-1.5 display text-sm text-ink hard-shadow-sm">NOT INCLUDED</span>
        <span className="text-bone/60">{COPY.notIncluded}</span>
      </div>
    </section>
  );
}

/* ---------------- DAY TO DAY ---------------- */
function DayToDay() {
  const [open, setOpen] = useState<number>(0);
  return (
    <section className="mt-16">
      <SectionHead id="daytoday" eyebrow="Day to day" title="How it actually goes" />
      <ul className="space-y-3">
        {COPY.days.map((d, i) => {
          const isOpen = open === i;
          return (
            <li key={d.day} className="border-ink bg-deep-2 hard-shadow-sm">
              <button onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen} className="flex w-full items-center gap-4 px-4 py-4 text-left">
                <div className="tracked shrink-0 text-yellow">{d.day}</div>
                <div className="min-w-0 flex-1">
                  <div className="display text-xl text-bone sm:text-2xl">{d.title}</div>
                  <div className="tracked mt-1 text-bone/60">{d.date}</div>
                </div>
                <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center border-ink bg-yellow text-ink display text-xl transition-transform" style={{ transform: isOpen ? "rotate(45deg)" : "none" }}>+</span>
              </button>
              {isOpen && (
                <div className="grid grid-cols-1 gap-4 border-ink-top p-4 sm:grid-cols-5">
                  <div className="h-40 border-ink hard-shadow-sm sm:col-span-2 sm:h-56">
                    <Photo slot={d.img} quiet />
                  </div>
                  <p className="text-bone/90 sm:col-span-3">{d.body}</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ---------------- LOCATION ---------------- */
function Location() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(HOSTEL.mapQuery)}&output=embed`;
  return (
    <section className="mt-16">
      <SectionHead id="location" eyebrow="Location" title="You stay in Patong. We drive you to the rest." />
      <div className="border-ink hard-shadow bg-deep-2">
        <iframe
          title="Mad Monkey Phuket map"
          src={mapSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-[300px] w-full lg:h-[400px]"
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="border-ink bg-yellow p-5 text-ink hard-shadow">
          <div className="tracked">Where you sleep</div>
          <div className="display mt-1 text-2xl">Mad Monkey Phuket</div>
          <p className="mt-1">Patong Beach · 4 minutes to the sand.</p>
        </div>
        <div className="border-ink bg-deep-2 p-5 text-bone hard-shadow">
          <div className="tracked text-yellow">The festival site</div>
          <div className="display mt-1 text-2xl">South of town</div>
          <p className="mt-1 text-bone/90">About 40 minutes in the shuttle — and the shuttle's on us both ways, every day.</p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- ACCOMMODATION ---------------- */
function Accommodation({ onCTA }: { onCTA: () => void }) {
  return (
    <section className="mt-16">
      <SectionHead id="accommodation" eyebrow="The accommodation" title="Mad Monkey Phuket" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="h-56 border-ink hard-shadow"><Photo slot={2} quiet /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-36 border-ink hard-shadow-sm"><Photo slot={8} quiet /></div>
            <div className="h-36 border-ink hard-shadow-sm"><Photo slot={6} quiet /></div>
          </div>
        </div>
        <div>
          <p className="text-lg text-bone/90">Air-con dorms with private bathrooms and balconies. Outdoor pool, rooftop bar, restaurant running full English through to Thai. Four minutes to the beach.</p>
          <div className="mt-5 p-5" style={{ background: "rgba(245,239,226,0.08)", borderLeft: "6px solid var(--mm-yellow)" }}>
            <div className="tracked text-yellow">Your bed</div>
            <div className="display mt-1 text-2xl text-bone">Mixed dorm</div>
            <p className="mt-1 text-bone/85">{HOSTEL.roomDetail}</p>
          </div>
          <p className="mt-5 text-bone/85">
            Want a private? <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="text-yellow underline underline-offset-4 decoration-2">Message us</a> and we'll price the upgrade.
          </p>
          <div className="mt-6">
            <CTAButton onClick={onCTA} size="lg">{soldOut ? "SOLD OUT — WAITLIST" : `GRAB A SPOT — $${PRICING.perPersonUSD}`}</CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
function FAQ() {
  const [open, setOpen] = useState<number>(-1);
  return (
    <section className="mt-16">
      <SectionHead id="faq" eyebrow="FAQ" title="Before you ask" />
      <ul className="space-y-3">
        {COPY.faq.map((f, i) => {
          const isOpen = open === i;
          return (
            <li key={f.q} className="border-ink bg-deep-2 hard-shadow-sm">
              <button onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen} className="flex w-full items-center gap-4 px-4 py-4 text-left">
                <span className="display flex-1 text-lg text-bone sm:text-xl">{f.q}</span>
                <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center border-ink bg-yellow text-ink display text-xl transition-transform" style={{ transform: isOpen ? "rotate(45deg)" : "none" }}>+</span>
              </button>
              {isOpen && <div className="border-ink-top px-4 py-4 text-bone/90">{f.a}</div>}
            </li>
          );
        })}
      </ul>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="inline-block border-ink bg-yellow px-3 py-1.5 display text-sm text-ink hard-shadow-sm wobble">Still stuck?</span>
        <span className="text-bone/85">
          <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="text-yellow underline underline-offset-4 decoration-2">DM us on Instagram</a> — fastest way to get us.
        </span>
      </div>
    </section>
  );
}

/* ---------------- FINE PRINT ---------------- */
function FinePrint() {
  return (
    <section className="mt-16 mb-8">
      <SectionHead id="fineprint" eyebrow="Fine print" title="The boring, important bit" />
      <ul className="list-disc space-y-2 pl-5 text-sm text-bone/70">
        {COPY.finePrint.map((line, i) => (<li key={i}>{line}</li>))}
      </ul>
    </section>
  );
}

/* ---------------- PARTNER STRIP ---------------- */
function PartnerStrip() {
  return (
    <section className="mt-10 border-ink-top border-ink-bottom bg-deep-2">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-8 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <div>
          <div className="tracked text-bone/70">Brought to you by</div>
          <div className="mt-2"><Wordmark width={150} /></div>
        </div>
        <div className="display text-4xl text-bone/40">×</div>
        <div className="text-right">
          <div className="tracked text-bone/70">Official package for</div>
          <div className="display mt-2 text-3xl leading-none text-bone">DnB Allstars</div>
          <div className="display mt-1 text-xl leading-none" style={{ color: "#ff6600" }}>THAILAND 2027</div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer({ onCTA }: { onCTA: () => void }) {
  return (
    <footer className="mt-12 border-ink-top bg-deep-1 pb-24 lg:pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 py-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="display text-5xl text-bone sm:text-6xl lg:text-7xl">
              {PRICING.totalSpots} spots.
              <br />
              <span className="text-yellow">Then that's it.</span>
            </h2>
            <p className="tracked mt-4 text-bone/70">{EVENT.location.toUpperCase()} · {EVENT.datesLabel.toUpperCase()}</p>
            <div className="mt-6">
              <CTAButton onClick={onCTA} size="lg">{soldOut ? "JOIN THE WAITLIST" : `GRAB A SPOT — $${PRICING.perPersonUSD}`}</CTAButton>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <Roundel size={180} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 border-t border-bone/15 py-6 sm:grid-cols-3">
          <div>
            <div className="tracked text-bone/60">Email</div>
            <a href={`mailto:${BRAND.email}`} className="mt-1 block text-bone hover:text-yellow">{BRAND.email}</a>
          </div>
          <div>
            <div className="tracked text-bone/60">Instagram</div>
            <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="mt-1 block text-bone hover:text-yellow">{BRAND.instagramHandle}</a>
          </div>
          <div className="sm:text-right">
            <div className="tracked text-bone/60">© {new Date().getFullYear()} Mad Monkey Hostels</div>
            <div className="mt-2 flex sm:justify-end">
              <Wordmark width={130} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
