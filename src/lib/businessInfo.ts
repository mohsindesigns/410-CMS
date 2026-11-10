/**
 * Single source of truth for the business facts that are used as code-level defaults / fallbacks
 * (JSON-LD, footer fallbacks, admin editor starter text). CMS-entered values always win over these.
 */
export const BUSINESS = {
  name: "410 Muscle Therapy",
  phoneE164: "+1-443-473-2322",
  phoneDisplay: "(443) 473-2322",
  email: "antoine.lyles@yahoo.com",
  streetAddress: "1301 York Rd, 8th Floor, Suite 48",
  locality: "Timonium",
  region: "MD",
  postalCode: "21093",
  country: "US",
  // TODO(owner): these coordinates are NOT confirmed to be the exact pin of the clinic. They are kept
  // unchanged on purpose (no output change); the business owner must decide/verify them before they are edited.
  geo: { latitude: 39.4376, longitude: -76.6197 },
  bookingUrl: "https://www.styleseat.com/m/v/410muscletherapy",
  sameAs: [
    "https://www.instagram.com/410muscletherapy/",
    "https://www.tiktok.com/@410muscletherapy",
    "https://www.youtube.com/@Twon410",
  ],
  /** Machine-readable hours (schema.org OpeningHoursSpecification). */
  hours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "07:00", closes: "21:00" },
    { days: ["Sunday"], opens: "09:00", closes: "21:00" },
  ],
  /** Human readable hours, one line per group. */
  hoursDisplayLines: ["Mon–Sat: 7:00 AM – 9:00 PM", "Sun: 9:00 AM – 9:00 PM"],
  hoursDisplay: "Mon–Sat: 7:00 AM – 9:00 PM\nSun: 9:00 AM – 9:00 PM",
  /** One-line postal address for display. */
  addressDisplay: "1301 York Rd, 8th Floor, Suite 48, Timonium, MD 21093",
  /** Two-line postal address for the footer. */
  addressDisplayMultiline: "1301 York Rd, 8th Floor, Suite 48\nTimonium, MD 21093",
} as const;
