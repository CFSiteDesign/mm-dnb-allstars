// Central config - every editable fact lives here.
// Values marked CONFIRM are unconfirmed and should be verified before launch.

export const BRAND = {
  name: "Mad Monkey Hostels",
  slogan: "ALL IN",
  wordmark: "/mm-wordmark-white.png",
  instagram: "https://www.instagram.com/madmonkeyhostels/",
  instagramHandle: "@madmonkeyhostels",
  email: "cs@madmonkeyhostels.com",
  siteLinks: {
    ourStory: "https://madmonkeyhostels.com/our-story",
    hostels: "https://madmonkeyhostels.com/destination",
    experience: "https://madmonkeyhostels.com/tours-events",
    madLoyalty: "https://madmonkeyhostels.com/madloyalty",
  },
};

export const EVENT = {
  name: "DnB Allstars Thailand",
  location: "Phuket, Thailand",
  datesLabel: "22–24 January 2027",
  festivalStart: "2027-01-22", // used for age check
  festivalDays: 3,
  nights: 4,
  checkIn: "Thursday 21 January 2027",
  checkOut: "Monday 25 January 2027, 11:00",
  minAge: 20,
  airport: "Phuket International (HKT)",
  airportRoutes: "routes via Bangkok, KL and Singapore",
};

export const PRICING = {
  perPersonUSD: 250,
  currency: "USD",
  totalSpots: 8,
  spotsRemaining: 8,
  maxPerOrder: 4,
};

export const HOSTEL = {
  name: "Mad Monkey Phuket",
  area: "Patong Beach",
  room: "Mixed dorm",
  roomDetail: "Air-con mixed dorm, private bathroom, balcony.",
  walkToBeach: "4 minutes to the beach",
  mapQuery: "Mad Monkey Phuket, Patong, Thailand",
};

export const SHUTTLE = {
  durationEachWay: "about 40 minutes each way", // CONFIRM
  frequency: "once each way, every festival day", // CONFIRM
  departure: "TBC", // CONFIRM
  return: "TBC", // CONFIRM
  vehicle: "TBC", // CONFIRM
};

export const STRIPE = {
  // Setup: create a Stripe Payment Link for a fixed $250 USD product.
  // Enable "Adjustable quantity" with min 1 / max 4.
  // Under "Limit the number of payments" set the limit to 8 — that limit
  // is the REAL inventory cap for this drop, not the number on this page.
  // Paste the resulting link (starts with https://buy.stripe.com/...) here.
  paymentLink: "", // CONFIRM
};

// Optional: POST bookings and waitlist signups to your own endpoint.
// Leave empty to skip and fall back to localStorage / mailto.
export const ENDPOINTS = {
  booking: "",
  waitlist: "",
};

import poolAerial from "@/assets/mm-phuket-pool.avif.asset.json";
import poolVolley from "@/assets/mm-phuket-pool-volley.avif.asset.json";
import barPour from "@/assets/mm-phuket-bar.avif.asset.json";

export const GALLERY: {
  file: string;
  brief: string;
  alt: string;
  url?: string;
}[] = [
  { file: "01-crowd.jpg", brief: "Crowd, front of stage, 2026 Phuket edition — hands up, lasers, sweat", alt: "DnB Allstars Phuket crowd" },
  { file: "02-pool.jpg", brief: "Mad Monkey Phuket pool, people in it, mid-afternoon, not empty", alt: "Mad Monkey Phuket pool, aerial", url: poolAerial.url },
  { file: "03-patong-night.jpg", brief: "Patong at night, neon, wet street, motion blur", alt: "Patong at night" },
  { file: "04-stage.jpg", brief: "Main stage wide, dusk into night, CO2 jets", alt: "Main stage" },
  { file: "05-shuttle.jpg", brief: "The shuttle, people boarding, wristbands on, going out", alt: "Shuttle boarding" },
  { file: "06-rooftop.jpg", brief: "Rooftop bar, pre-party, DJ and a full deck", alt: "Mad Monkey Phuket bar", url: barPour.url },
  { file: "07-sunrise.jpg", brief: "Sunrise on the beach, the walk home, silhouettes", alt: "Sunrise walk home" },
  { file: "08-dorm.jpg", brief: "Dorm room, beds, balcony light, made up and clean", alt: "Mad Monkey Phuket pool volleyball", url: poolVolley.url },
];

export const COPY = {
  hero: {
    subLine1: "3 day pass, 4 nights, daily shuttle, pre-parties.",
    subLine2: "One payment.",
  },
  lowdown: {
    eyebrow: "The lowdown",
    heading: "Three days on the Andaman coast",
    p1: "DnB Allstars landed in Asia for the first time last January and it went off. It's back in Phuket for three days and nights on the Andaman coast, all stages, full weekend.",
    p2Prefix: "We've got ",
    p2Bold: "8 packages",
    p2Rest: ". Your 3 day pass, 4 nights at Mad Monkey, the shuttle to the venue and back every day, and the pre-party at ours before you go. One payment, no admin.",
    kicker: "Book the flight. That's your only other job.",
  },
  inclusions: [
    { n: "01", title: "3 day festival pass", body: "Full access to all stages, all three days and nights." },
    { n: "02", title: "4 night hostel stay", body: "Mad Monkey Phuket, Patong Beach, four minutes from the sand." },
    { n: "03", title: "Daily shuttle", body: "Hostel to venue and back, every day. Last one runs late." },
    { n: "04", title: "Pre party", body: "DJs at ours before every shuttle. Drinks deals on the wristband." },
  ],
  notIncluded: "Flights · Airport transfers · Food · Travel insurance",
  days: [
    { day: "DAY 1", date: "Wed 21 Jan", title: "Land and settle", body: "Check in, grab your welcome drink and your festival pack. Pool's open, Patong's a four-minute walk. Take it easy — or don't.", img: 2 },
    { day: "DAY 2", date: "Thu 22 Jan", title: "Day one, and it starts at ours", body: "Pre-party at the hostel, then the shuttle out. First day of DnB Allstars, every stage open, shuttle back when it's done. Pool bar's still going if you are.", img: 5 },
    { day: "DAY 3", date: "Fri 23 Jan", title: "The big one", body: "Pre-party from late afternoon, shuttle to the venue for the heaviest night of the weekend. Full lineup, every stage. Pace yourself. Or don't, again.", img: 3 },
    { day: "DAY 4", date: "Sat 24 Jan", title: "Last night standing", body: "Final pre-party, final shuttle, final night. Then the walk back along the beach as it gets light. This is the one you'll tell people about.", img: 6 },
    { day: "DAY 5", date: "Sun 25 Jan", title: "Out", body: "Check out at 11. Coffee, ferry, flight — or extend at the direct rate, just tell reception.", img: 1 },
  ],
  faq: [
    { q: "Is the festival ticket included?", a: "Yes. Full 3 day pass, all stages, in the price. Nothing to buy separately." },
    { q: "What about flights?", a: "On you. Fly into Phuket International (HKT) — plenty of routes via Bangkok, KL and Singapore." },
    { q: "How old do I need to be?", a: "20+. Bring photo ID — the venue checks, and they don't make exceptions." },
    { q: "Can I pay a deposit?", a: "No. There are 8 and they're paid in full to lock your ticket." },
    { q: "Can I book for a mate?", a: "Yes. Buy two spots in one go and fill in both sets of details at checkout." },
    { q: "Can I stay longer?", a: "Yes. Tell us at checkout or at reception and we'll extend you at the direct rate." },
    { q: "How does the shuttle work?", a: "Hostel to venue and back, every festival day, once each way. Roughly 40 minutes each way. Exact timings land in your confirmation." },
    { q: "Is there a group chat?", a: "Yes. Link comes in your confirmation email a week out." },
    { q: "What if I can't make it?", a: "Non-refundable — the ticket is allocated to you the moment you pay. You can transfer your spot to someone else up to 14 days out. Get travel insurance." },
  ],
  finePrint: [
    "$250 USD per person, paid in full at booking. Non-refundable. Transferable to another person up to 14 days before arrival — email cs@madmonkeyhostels.com.",
    "20+. Photo ID required at the venue. Date of birth is collected at checkout and is not optional.",
    "Check-in Thursday 21 January 2027. Check-out Monday 25 January 2027, 11:00. Mixed dorm bed. Tell us at checkout or at reception and we'll extend you at the direct rate.",
    "Flights are not included. Fly into Phuket International (HKT) — routes via Bangkok, KL and Singapore.",
    "Lineup and set times are set by DnB Allstars and can change. Festival ticket terms sit with the promoter.",
    "Travel insurance strongly recommended.",
  ],
};

export const SECTIONS = [
  { id: "lowdown", label: "The lowdown" },
  { id: "included", label: "What's included" },
  { id: "daytoday", label: "Day to day" },
  { id: "location", label: "Location" },
  { id: "accommodation", label: "The accommodation" },
  { id: "faq", label: "FAQ" },
];
