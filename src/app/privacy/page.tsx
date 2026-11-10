"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Icon } from "../../config/icons";
import { BUSINESS } from "../../lib/businessInfo";

// Fixed date: update it only when the policy text actually changes (never render "today").
const LAST_UPDATED = "November 10, 2026";

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-card rounded-2xl border border-border p-6 md:p-8 ${className}`}>{children}</div>
);

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">{children}</h2>
);

const P = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-muted-foreground leading-relaxed ${className}`}>{children}</p>
);

const List = ({ items }: { items: React.ReactNode[] }) => (
  <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc pl-5">
    {items.map((it, i) => (
      <li key={i}>{it}</li>
    ))}
  </ul>
);

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-background overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.08)_0%,_transparent_70%)]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto px-6 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full border border-primary/10 mb-6">
              <Icon name="Shield" className="w-4 h-4 text-primary" />
              <span className="text-primary uppercase tracking-wider text-xs font-semibold">Legal</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground mb-4">
              Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Policy</span>
            </h1>
            <p className="text-muted-foreground text-lg">Last updated: {LAST_UPDATED}</p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative pb-24">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <Card>
              <H2>Who we are and what this policy covers</H2>
              <P className="mb-4">
                This policy explains how {BUSINESS.name}{" "}(&ldquo;we&rdquo;, &ldquo;us&rdquo;) handles personal information collected through this website,
                410-muscletherapy.com. We are a massage and performance-recovery practice at {BUSINESS.addressDisplay}.
              </P>
              <P>
                It covers this website only. Booking on StyleSeat, gift-card purchases and any other third-party site you reach from our pages are
                run by those companies under their own privacy policies.
              </P>
            </Card>

            <Card>
              <H2>Information we collect</H2>
              <h3 className="text-lg font-semibold text-foreground mb-2">Information you give us</h3>
              <P className="mb-3">When you use a form on this website we collect what you type into it:</P>
              <List
                items={[
                  <><strong>Contact and enquiry forms:</strong> your name, email address, phone number, the service you are interested in, and the message you choose to write.</>,
                  <><strong>Careers form:</strong> your name, email address, message and any r&eacute;sum&eacute; file you attach.</>,
                  <><strong>Quote requests:</strong> the same contact details plus the service you ask about.</>,
                ]}
              />
              <P className="mt-3">
                We do not collect payment card details on this website. Gift-card purchases and appointment bookings are completed on the
                payment and booking providers&rsquo; own sites.
              </P>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">Information collected automatically</h3>
              <P>
                When you visit, our servers and our analytics tool record technical information such as your IP address, browser and device type,
                the pages you view, how you arrived at the site and how long you stay. We use Google Analytics for this (see &ldquo;Cookies and
                analytics&rdquo; below).
              </P>
            </Card>

            <Card className="border-primary/30">
              <H2>Please keep medical details out of website forms</H2>
              <P className="mb-3">
                Our forms are simple contact forms. They are not a medical-records system. Please do not include diagnoses, detailed medical
                history, test results or other sensitive health information in a website form or message. Share health details with your therapist
                directly, at your appointment or by phone.
              </P>
              <P>
                If you do include health information in a message, we use it only to respond to you and we do not use it for marketing.
              </P>
            </Card>

            <Card>
              <H2>How we use your information</H2>
              <List
                items={[
                  "To reply to your enquiry and help you choose or book a service.",
                  "To review job applications you send us.",
                  "To keep a record of enquiries so we can follow up and handle any questions about them.",
                  "To understand how the website is used and to improve it, security and spam protection included.",
                  "To comply with legal obligations.",
                ]}
              />
            </Card>

            <Card>
              <H2>Who we share it with</H2>
              <P className="mb-3">
                We do not sell or rent your personal information. We share it only with service providers that help us run the website, and only
                as needed for that purpose:
              </P>
              <List
                items={[
                  <><strong>Email delivery (Resend):</strong> sends your form submission to us as an email.</>,
                  <><strong>Database and hosting providers:</strong> store form submissions and the website&rsquo;s content on our behalf.</>,
                  <><strong>Cloudflare:</strong> content delivery and security for the website.</>,
                  <><strong>Cloudinary:</strong> hosts and delivers the images on the website and may store files uploaded through the careers form.</>,
                  <><strong>Google Analytics and Google Maps:</strong> website analytics, and the map shown in the page footer.</>,
                  <><strong>StyleSeat:</strong> when you choose to book, you leave our site and are subject to StyleSeat&rsquo;s policies.</>,
                ]}
              />
              <P className="mt-3">
                We may also disclose information if required by law, to respond to valid legal process, or to protect the rights, safety and
                security of our clients, our business or others.
              </P>
            </Card>

            <Card>
              <H2>Cookies and analytics</H2>
              <P className="mb-3">
                This website uses Google Analytics, which sets cookies and collects usage data (for example pages viewed and approximate location
                derived from your IP address) so we can see how the site is used. This data does not include what you type into our forms.
              </P>
              <P>
                You can block or delete cookies in your browser settings, and you can opt out of Google Analytics with Google&rsquo;s browser
                add-on. Blocking cookies does not stop the website from working.
              </P>
            </Card>

            <Card>
              <H2>How long we keep it</H2>
              <P>
                We keep enquiries and job applications for as long as we need them to respond, to follow up and to keep ordinary business records,
                and delete them when they are no longer needed. You can ask us to delete your enquiry at any time (see &ldquo;Your choices&rdquo;).
              </P>
            </Card>

            <Card>
              <H2>How we protect it</H2>
              <P>
                The website uses HTTPS, form submissions are limited in size and checked before they are accepted, and access to the
                administration area where submissions are stored is restricted to authorised staff with a password. No website or method of
                transmission is completely secure, so we cannot guarantee absolute security.
              </P>
            </Card>

            <Card>
              <H2>Your choices</H2>
              <P className="mb-3">You can contact us at any time to:</P>
              <List
                items={[
                  "ask what personal information of yours we hold from the website;",
                  "ask us to correct it or delete it;",
                  "stop receiving emails or text messages from us.",
                ]}
              />
              <P className="mt-3">
                Depending on where you live you may have additional rights under local law. Contact us and we will respond as the law requires.
              </P>
            </Card>

            <Card className="bg-gradient-to-r from-primary/5 via-card to-primary/5 border-primary/20">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Icon name="MessageCircle" className="w-5 h-5 text-primary" />
                Text messages (SMS)
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>We send text messages only to people who gave us their phone number and agreed to receive them.</p>
                <p>Message frequency varies. Message and data rates may apply. Consent is not a condition of receiving any service.</p>
                <p>Reply STOP at any time to stop receiving messages, or HELP for help. If you stop by mistake, reply UNSTOP to start again.</p>
                <p>
                  We do not share your phone number with third parties for their own marketing. More details are in our{" "}
                  <Link href="/terms/" className="text-primary hover:underline">Terms &amp; Conditions</Link>.
                </p>
              </div>
            </Card>

            <Card>
              <H2>Children</H2>
              <P>
                This website is not directed to children under 13 and we do not knowingly collect personal information from them. If you believe
                a child has sent us personal information, contact us and we will delete it.
              </P>
            </Card>

            <Card>
              <H2>Changes to this policy</H2>
              <P>
                If our practices change we will update this page and the &ldquo;Last updated&rdquo; date at the top. Please check back from time
                to time.
              </P>
            </Card>

            <div className="bg-gradient-to-r from-primary/10 via-card to-primary/10 rounded-2xl border border-primary/30 p-6 md:p-8 text-center">
              <Icon name="Mail" className="w-10 h-10 text-primary mx-auto mb-4" />
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">Questions or requests</h2>
              <p className="text-muted-foreground mb-4">
                {BUSINESS.name}
                <br />
                {BUSINESS.addressDisplay}
                <br />
                <a href={`tel:${BUSINESS.phoneE164}`} className="text-primary hover:underline">{BUSINESS.phoneDisplay}</a>
              </p>
              <a
                href={`mailto:${BUSINESS.email}`}
                className="inline-flex items-center gap-2 text-primary hover:underline font-semibold"
              >
                {BUSINESS.email}
                <Icon name="ArrowRight" className="w-4 h-4" />
              </a>
            </div>

            <p className="text-center text-xs text-muted-foreground/60 pt-8">
              &copy; {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
