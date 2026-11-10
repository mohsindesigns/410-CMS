/**
 * Certificates section of the home page (managed in Admin > Pages > Home > Certificates).
 *
 * Until an admin saves that tab, the defaults below are shown. They contain ONLY what is printed on the certificates
 * (course title, issuer, completion date when the certificate has one, hours/duration). The 4 Nineteen certificate
 * shows no completion date, so none is shown for it.
 */
export type CertificateItem = {
  id: string;
  /** certificate picture: an uploaded image URL or a /certificates/... file */
  image: string;
  title: string;
  issuer: string;
  /** e.g. "October 13, 2026" - leave empty when the certificate has no date */
  date: string;
  /** short factual line, e.g. "66-minute webinar and quiz" */
  detail: string;
  alt?: string;
};

export type CertificatesContent = {
  enabled?: boolean;
  label?: string;
  title1?: string;
  title2?: string;
  description?: string;
  /** button / image wording for screen readers and the full-size view */
  viewLabel?: string;
  closeLabel?: string;
  prevLabel?: string;
  nextLabel?: string;
  altPrefix?: string;
  items?: CertificateItem[];
};

export const MAX_CERTIFICATES = 12;

export const DEFAULT_CERTIFICATES: Required<Omit<CertificatesContent, "items">> & { items: CertificateItem[] } = {
  enabled: true,
  label: "Continuing Education",
  title1: "Ongoing Training,",
  title2: "Behind Your Care.",
  viewLabel: "View certificate",
  closeLabel: "Close",
  prevLabel: "Previous certificate",
  nextLabel: "Next certificate",
  altPrefix: "Certificate of completion",
  description:
    "Certificates of completion from continuing-education courses, including Graston Technique® University lessons and post-op lymphatic drainage massage training.",
  items: [
    {
      id: "cert-graston-shoulder",
      image: "/certificates/graston-shoulder-dysfunction.webp",
      title: "Applications for Shoulder Dysfunction",
      issuer: "Graston Technique® University",
      date: "October 13, 2026",
      detail: "66-minute webinar and quiz",
      alt: "Certificate of completion: Applications for Shoulder Dysfunction, Graston Technique University",
    },
    {
      id: "cert-graston-headaches",
      image: "/certificates/graston-tension-headaches.webp",
      title: "Applications for Tension Headaches",
      issuer: "Graston Technique® University",
      date: "May 25, 2026",
      detail: "60-minute webinar and quiz",
      alt: "Certificate of completion: Applications for Tension Headaches, Graston Technique University",
    },
    {
      id: "cert-graston-low-back",
      image: "/certificates/graston-low-back-pain.webp",
      title: "Applications for Low Back Pain",
      issuer: "Graston Technique® University",
      date: "August 24, 2025",
      detail: "53-minute webinar and quiz",
      alt: "Certificate of completion: Applications for Low Back Pain, Graston Technique University",
    },
    {
      id: "cert-4nineteen-post-op",
      image: "/certificates/post-op-lymphatic-drainage-4-nineteen.webp",
      title: "Post-Op Lymphatic Drainage Massage: Stomach & Lower Extremity",
      issuer: "4 Nineteen Education & Training",
      date: "",
      detail: "4 continuing education hours, online course",
      alt: "Certificate of completion: Post-Op Lymphatic Drainage Massage, Stomach and Lower Extremity, 4 Nineteen Education and Training",
    },
  ],
};

/** The block as stored (or nothing yet) merged with the defaults. A saved empty list hides the section. */
export function resolveCertificates(raw: any): Required<Omit<CertificatesContent, "items">> & { items: CertificateItem[] } {
  const r = raw && typeof raw === "object" ? raw : {};
  const pick = (v: any, d: string) => (typeof v === "string" && v.trim() ? v : d);
  return {
    enabled: r.enabled !== false,
    label: pick(r.label, DEFAULT_CERTIFICATES.label),
    title1: pick(r.title1, DEFAULT_CERTIFICATES.title1),
    title2: pick(r.title2, DEFAULT_CERTIFICATES.title2),
    description: typeof r.description === "string" ? r.description : DEFAULT_CERTIFICATES.description,
    viewLabel: pick(r.viewLabel, DEFAULT_CERTIFICATES.viewLabel),
    closeLabel: pick(r.closeLabel, DEFAULT_CERTIFICATES.closeLabel),
    prevLabel: pick(r.prevLabel, DEFAULT_CERTIFICATES.prevLabel),
    nextLabel: pick(r.nextLabel, DEFAULT_CERTIFICATES.nextLabel),
    altPrefix: pick(r.altPrefix, DEFAULT_CERTIFICATES.altPrefix),
    items: Array.isArray(r.items) ? (r.items as CertificateItem[]).filter((i) => i && i.image) : DEFAULT_CERTIFICATES.items,
  };
}
