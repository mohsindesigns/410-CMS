export interface FeatureCardItem {
  icon: string;
  title: string;
  description: string;
  /** Small pill shown on the card (optional), e.g. "5.0 ★ RATED" */
  tag?: string;
  /** Optional link on the card */
  linkText?: string;
  linkUrl?: string;
}

export interface FeatureCardsContent {
  /** Set to false to hide the whole section on the home page */
  enabled: boolean;
  label: string;
  titleLine1: string;
  titleLine2: string;
  titleItalicWord: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  items: FeatureCardItem[];
}

export const MAX_FEATURE_CARDS = 12;

/**
 * Starter content for the section, used until it is edited in the dashboard
 * (Admin → Pages → Home → "4. Feature Cards"). Only uses facts already stated elsewhere on the site.
 */
export const DEFAULT_FEATURE_CARDS: FeatureCardsContent = {
  enabled: true,
  label: "WHY 410 MUSCLE THERAPY",
  titleLine1: "Care That Goes",
  titleLine2: "Beyond The",
  titleItalicWord: "Massage Table.",
  description:
    "From the first conversation to the final stretch, every session is built around how you move, where you hurt, and what you want to get back to.",
  ctaText: "",
  ctaUrl: "",
  items: [
    {
      icon: "Award",
      title: "Eight Years Of Experience",
      description:
        "Skilled observation and hands-on work guide every session, especially when pain has more than one contributor.",
      tag: "CERTIFIED CARE",
    },
    {
      icon: "Star",
      title: "Five-Star Reputation",
      description:
        "A 5.0 Google rating gives you confidence before you book. Clients praise our targeted work and lasting relief.",
      tag: "5.0 ★ RATED",
    },
    {
      icon: "ShieldCheck",
      title: "100% Satisfaction Guarantee",
      description:
        "We explain each technique, invite feedback on pressure, and adjust so you always feel in control of your session.",
      tag: "GUARANTEED",
    },
    {
      icon: "Target",
      title: "Personalized Protocols",
      description:
        "No generic routine. Therapy is shaped around your body, your goals, and what you can comfortably do.",
      tag: "TAILORED",
    },
    {
      icon: "MapPin",
      title: "Convenient Timonium Location",
      description:
        "Located on York Road in Timonium, serving Towson, Lutherville, Cockeysville, and Baltimore County.",
      tag: "TIMONIUM, MD",
    },
    {
      icon: "Clock",
      title: "Open Seven Days",
      description:
        "Early and late appointments make it easier to fit recovery into training, work, and family schedules.",
      tag: "7 DAYS A WEEK",
    },
  ],
};
