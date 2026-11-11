import { BUSINESS } from "./businessInfo";
import { TERMS_UPDATED } from "./legalDates";
import { resolveLegal, type PrivacyContent } from "./privacy";

/**
 * Terms & Conditions content, managed in Admin > Settings > Terms & Conditions (stored in complete_data.termsPage).
 * Until it is saved there, the text below is shown. Same plain-text format as the privacy page:
 *   - blank line = new paragraph, lines starting with "- " = bullet list, **bold** and [link text](/path) are supported.
 */
const B = BUSINESS;

export const DEFAULT_TERMS: PrivacyContent = {
  label: "Legal",
  title1: "Terms &",
  title2: "Conditions",
  updatedPrefix: "Last updated",
  updatedLabel: TERMS_UPDATED.label,
  updatedIso: TERMS_UPDATED.iso,
  contactHeading: "Questions about these terms",
  contactBody: `${B.name}\n${B.addressDisplay}\n${B.phoneDisplay}\n${B.email}`,
  sections: [
    {
      id: "intro",
      heading: "1. Introduction",
      body:
        `Welcome to ${B.name}. By using this website or booking a service with us, you agree to these Terms & Conditions.\n\n` +
        `${B.name} provides **clinical bodywork, mobility restoration and athletic recovery services** at ${B.addressDisplay}. These terms apply to this website and to the sessions and consultations you book with us. How we handle personal information is explained in our [Privacy Policy](/privacy/).`,
    },
    {
      id: "appointments",
      heading: "2. Appointments and intake",
      body:
        `- All clients complete a health intake assessment before receiving bodywork.\n- Please arrive 10 minutes before your scheduled session.\n- Sessions are customized to your individual biomechanical and recovery goals.`,
    },
    {
      id: "health",
      heading: "3. Your health and your session",
      body:
        `Tell your therapist about any health conditions, injuries or medications that may affect your session, and speak up at any time if you want the pressure or technique changed or the session stopped.\n\n` +
        `Our services support recovery and mobility. They are not a substitute for diagnosis or treatment by a physician.`,
    },
    {
      id: "payment",
      heading: "4. Payment",
      body:
        `- Payment is due when each session is completed, or when a package is booked.\n- Accepted payment methods: credit card, debit, cash and approved digital methods.`,
    },
    {
      id: "cancellation",
      heading: "5. Cancellation and rescheduling",
      body:
        `- We ask for at least 24 hours' notice to cancel or reschedule.\n- Late cancellations and missed appointments may be subject to a cancellation fee.\n- Pre-paid sessions may be rescheduled with proper advance notice.`,
    },
    {
      id: "ip",
      heading: "6. Intellectual property",
      body:
        `All content on this website, including text, graphics, logos, images and software, is the property of ${B.name} and is protected by United States copyright and trademark laws. You may not reproduce, distribute or create derivative works from it without our express written permission.`,
    },
    {
      id: "liability",
      heading: "7. Limitation of liability",
      body:
        `To the fullest extent permitted by law, ${B.name} is not liable for any indirect, incidental, special, consequential or punitive damages arising from your use of our website or services. Our total liability will not exceed the amount you paid us.`,
    },
    {
      id: "law",
      heading: "8. Governing law",
      body:
        `These terms are governed by the laws of the United States. Any legal action arising out of these terms must be brought in the courts located in the United States.`,
    },
    {
      id: "sms",
      heading: "9. Text messages (SMS)",
      style: "highlight",
      body:
        `By giving us your phone number you agree to receive text messages from ${B.name} about service updates and appointment reminders.\n\n` +
        `Message frequency varies. Message and data rates may apply. Reply **STOP** at any time to opt out, or **HELP** for help. Consent is not a condition of receiving any service.\n\n` +
        `More details are in our [Privacy Policy](/privacy/).`,
    },
    {
      id: "changes",
      heading: "10. Changes to these terms",
      body: `We may update these terms from time to time. The version on this page is always the current one.`,
    },
  ],
};

export function resolveTerms(raw: any): PrivacyContent {
  return resolveLegal(raw, DEFAULT_TERMS);
}
