import { BUSINESS } from "./businessInfo";
import { PRIVACY_UPDATED } from "./legalDates";

/**
 * Privacy policy content, managed in Admin > Settings > Privacy Policy (stored in complete_data.privacyPage).
 * Until it is saved there, the text below is shown. Section text format (plain text):
 *   - blank line = new paragraph
 *   - lines starting with "- " = bullet list
 *   - **bold**  and  [link text](/path)  are supported
 */
export type PrivacySection = { id: string; heading: string; body: string; style?: "normal" | "highlight" };

export type PrivacyContent = {
  label: string;
  title1: string;
  title2: string;
  updatedPrefix: string;
  updatedLabel: string;
  updatedIso: string;
  sections: PrivacySection[];
  contactHeading: string;
  /** one line per row; emails and phone numbers become links */
  contactBody: string;
};

const B = BUSINESS;

export const DEFAULT_PRIVACY: PrivacyContent = {
  label: "Legal",
  title1: "Privacy",
  title2: "Policy",
  updatedPrefix: "Last updated",
  updatedLabel: PRIVACY_UPDATED.label,
  updatedIso: PRIVACY_UPDATED.iso,
  contactHeading: "Questions or requests",
  contactBody: `${B.name}\n${B.addressDisplay}\n${B.phoneDisplay}\n${B.email}`,
  sections: [
    {
      id: "scope",
      heading: "Who we are and what this policy covers",
      body:
        `This policy explains how ${B.name} ("we", "us") handles personal information collected through this website, 410-muscletherapy.com. We are a massage and performance-recovery practice at ${B.addressDisplay}.\n\n` +
        `It covers this website only. Booking on StyleSeat, gift-card purchases and any other third-party site you reach from our pages are run by those companies under their own privacy policies.`,
    },
    {
      id: "collect",
      heading: "Information we collect",
      body:
        `**Information you give us**\n\nWhen you use a form on this website we collect what you type into it:\n\n` +
        `- **Contact and enquiry forms:** your name, email address, phone number, the service you are interested in, and the message you choose to write.\n` +
        `- **Careers form:** your name, email address, message and any résumé file you attach.\n` +
        `- **Quote requests:** the same contact details plus the service you ask about.\n\n` +
        `We do not collect payment card details on this website. Gift-card purchases and appointment bookings are completed on the payment and booking providers' own sites.\n\n` +
        `**Information collected automatically**\n\nWhen you visit, our servers and our analytics tool record technical information such as your IP address, browser and device type, the pages you view, how you arrived at the site and how long you stay. We use Google Analytics for this (see "Cookies and analytics" below).`,
    },
    {
      id: "medical",
      heading: "Please keep medical details out of website forms",
      style: "highlight",
      body:
        `Our forms are simple contact forms. They are not a medical-records system. Please do not include diagnoses, detailed medical history, test results or other sensitive health information in a website form or message. Share health details with your therapist directly, at your appointment or by phone.\n\n` +
        `If you do include health information in a message, we use it only to respond to you and we do not use it for marketing.`,
    },
    {
      id: "use",
      heading: "How we use your information",
      body:
        `- To reply to your enquiry and help you choose or book a service.\n- To review job applications you send us.\n- To keep a record of enquiries so we can follow up and handle any questions about them.\n- To understand how the website is used and to improve it, security and spam protection included.\n- To comply with legal obligations.`,
    },
    {
      id: "share",
      heading: "Who we share it with",
      body:
        `We do not sell or rent your personal information. We share it only with service providers that help us run the website, and only as needed for that purpose:\n\n` +
        `- **Email delivery (Resend):** sends your form submission to us as an email.\n- **Database and hosting providers:** store form submissions and the website's content on our behalf.\n- **Cloudflare:** content delivery and security for the website.\n- **Cloudinary:** hosts and delivers the images on the website and may store files uploaded through the careers form.\n- **Google Analytics and Google Maps:** website analytics, and the map shown in the page footer.\n- **StyleSeat:** when you choose to book, you leave our site and are subject to StyleSeat's policies.\n\n` +
        `We may also disclose information if required by law, to respond to valid legal process, or to protect the rights, safety and security of our clients, our business or others.`,
    },
    {
      id: "cookies",
      heading: "Cookies and analytics",
      body:
        `This website uses Google Analytics, which sets cookies and collects usage data (for example pages viewed and approximate location derived from your IP address) so we can see how the site is used. This data does not include what you type into our forms.\n\n` +
        `You can block or delete cookies in your browser settings, and you can opt out of Google Analytics with Google's browser add-on. Blocking cookies does not stop the website from working.`,
    },
    {
      id: "retention",
      heading: "How long we keep it",
      body:
        `We keep enquiries and job applications for as long as we need them to respond, to follow up and to keep ordinary business records, and delete them when they are no longer needed. You can ask us to delete your enquiry at any time (see "Your choices").`,
    },
    {
      id: "security",
      heading: "How we protect it",
      body:
        `The website uses HTTPS, form submissions are limited in size and checked before they are accepted, and access to the administration area where submissions are stored is restricted to authorised staff with a password. No website or method of transmission is completely secure, so we cannot guarantee absolute security.`,
    },
    {
      id: "choices",
      heading: "Your choices",
      body:
        `You can contact us at any time to:\n\n- ask what personal information of yours we hold from the website;\n- ask us to correct it or delete it;\n- stop receiving emails or text messages from us.\n\n` +
        `Depending on where you live you may have additional rights under local law. Contact us and we will respond as the law requires.`,
    },
    {
      id: "sms",
      heading: "Text messages (SMS)",
      style: "highlight",
      body:
        `We send text messages only to people who gave us their phone number and agreed to receive them.\n\n` +
        `Message frequency varies. Message and data rates may apply. Consent is not a condition of receiving any service.\n\n` +
        `Reply STOP at any time to stop receiving messages, or HELP for help. If you stop by mistake, reply UNSTOP to start again.\n\n` +
        `We do not share your phone number with third parties for their own marketing. More details are in our [Terms & Conditions](/terms/).`,
    },
    {
      id: "children",
      heading: "Children",
      body:
        `This website is not directed to children under 13 and we do not knowingly collect personal information from them. If you believe a child has sent us personal information, contact us and we will delete it.`,
    },
    {
      id: "changes",
      heading: "Changes to this policy",
      body: `If our practices change we will update this page and the "Last updated" date at the top. Please check back from time to time.`,
    },
  ],
};

/** stored block merged with the defaults (a saved, non-empty list of sections replaces the default sections) */
export function resolvePrivacy(raw: any): PrivacyContent {
  return resolveLegal(raw, DEFAULT_PRIVACY);
}

/** same merge for any legal page (privacy, terms) */
export function resolveLegal(raw: any, DEFAULT_PRIVACY: PrivacyContent): PrivacyContent {
  const r = raw && typeof raw === "object" ? raw : {};
  const pick = (v: any, d: string) => (typeof v === "string" && v.trim() ? v : d);
  const sections: PrivacySection[] = Array.isArray(r.sections)
    ? r.sections.filter((s: any) => s && (s.heading || s.body))
    : DEFAULT_PRIVACY.sections;
  return {
    label: pick(r.label, DEFAULT_PRIVACY.label),
    title1: pick(r.title1, DEFAULT_PRIVACY.title1),
    title2: pick(r.title2, DEFAULT_PRIVACY.title2),
    updatedPrefix: pick(r.updatedPrefix, DEFAULT_PRIVACY.updatedPrefix),
    updatedLabel: pick(r.updatedLabel, DEFAULT_PRIVACY.updatedLabel),
    updatedIso: pick(r.updatedIso, DEFAULT_PRIVACY.updatedIso),
    contactHeading: pick(r.contactHeading, DEFAULT_PRIVACY.contactHeading),
    contactBody: typeof r.contactBody === "string" ? r.contactBody : DEFAULT_PRIVACY.contactBody,
    sections,
  };
}

export type PrivacyBlock = { type: "p"; text: string } | { type: "ul"; items: string[] };

/** plain-text body -> paragraphs and bullet lists */
export function parsePrivacyBody(body: string): PrivacyBlock[] {
  const blocks: PrivacyBlock[] = [];
  const lines = String(body || "").replace(/\r\n/g, "\n").split("\n");
  let para: string[] = [];
  let list: string[] = [];
  const flushPara = () => { if (para.length) { blocks.push({ type: "p", text: para.join(" ") }); para = []; } };
  const flushList = () => { if (list.length) { blocks.push({ type: "ul", items: list }); list = []; } };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flushPara(); flushList(); continue; }
    if (/^[-•]\s+/.test(line)) { flushPara(); list.push(line.replace(/^[-•]\s+/, "")); }
    else { flushList(); para.push(line); }
  }
  flushPara();
  flushList();
  return blocks;
}

/** "November 10, 2026" for an ISO date (UTC), used by the editor */
export const formatLegalDate = (iso: string): string => {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
};
