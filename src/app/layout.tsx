import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import SiteLayout from "@/components/SiteLayout";
import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";
import { BASE_URL } from "@/lib/constants";
import { SiteScriptsRenderer, SiteScript } from "@/lib/site-scripts";

import { getRobotsMetadata } from "@/lib/seo";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});


export async function generateMetadata(): Promise<Metadata> {
  let settings: any = {
    siteTitle: "",
    siteTemplate: "%s",
    favicon: "",
    siteDescription: "",
    siteKeywords: []
  };

  try {
    await connectToDatabase();
    const content = await SiteContent.findOne({ key: 'complete_data' }).lean() as any;
    if (content?.data?.settings) settings = content.data.settings;
  } catch (e) {
    console.error("Failed to fetch settings for metadata", e);
  }

  return {
    metadataBase: new URL(BASE_URL),
    // Google needs a SQUARE icon (multiple of 48px) on a crawlable URL. settings.favicon is the wide
    // 384x74 "410 | MUSCLE THERAPY" wordmark, which shrinks to an unreadable "410" in search results,
    // so the icon links point at square emblem files in /public/icons instead.
    icons: {
      icon: [
        { url: `${BASE_URL}/favicon.ico`, sizes: "48x48" },
        { url: `${BASE_URL}/icons/icon-48.png`, sizes: "48x48", type: "image/png" },
        { url: `${BASE_URL}/icons/icon-96.png`, sizes: "96x96", type: "image/png" },
        { url: `${BASE_URL}/icons/icon-192.png`, sizes: "192x192", type: "image/png" },
      ],
      shortcut: `${BASE_URL}/favicon.ico`,
      apple: [{ url: `${BASE_URL}/icons/apple-touch-icon.png`, sizes: "180x180", type: "image/png" }],
    },
    title: {
      default: settings.siteTitle,
      template: settings.siteTemplate,
    },
    description: settings.siteDescription,
    keywords: settings.siteKeywords || ["410 Muscle Therapy"],
    authors: [{ name: "410 Muscle Therapy", url: `${BASE_URL}/` }],
    creator: "410 Muscle Therapy",
    publisher: "410 Muscle Therapy",

    // ── Robots & Canonical ──
    robots: getRobotsMetadata(settings),
    alternates: {
      canonical: `${BASE_URL}/`,
    },

    // ── Open Graph (Facebook, LinkedIn) ──
    openGraph: {
      type: "website",
      locale: "en_US",
      url: `${BASE_URL}/`,
      siteName: "410 Muscle Therapy",
      title: settings.siteTitle,
      description: settings.siteDescription,
      images: [
        {
          url: `${BASE_URL}/og-default.png`,
          width: 1200,
          height: 630,
          alt: "410 Muscle Therapy – Performance Recovery & Clinical Bodywork Maryland",
          type: "image/png",
        },
      ],
    },

    // ── Twitter Cards ──
    twitter: {
      card: "summary_large_image",
      title: settings.siteTitle,
      description: settings.siteDescription,
      images: [`${BASE_URL}/og-default.png`],
      creator: "@410MuscleTherapy",
      site: "@410MuscleTherapy",
    },

    other: {
      "format-detection": "telephone=no",
    },
  };
}

import { ContentProvider } from "@/context/ContentContext";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ── Fetch CMS-managed tracking scripts from MongoDB ──
  let siteScripts: SiteScript[] = [];
  try {
    await connectToDatabase();
    const doc = await SiteContent.findOne({ key: 'site_scripts_v2' });
    if (Array.isArray(doc?.data)) siteScripts = doc.data;
  } catch (e) {
    // Non-fatal — site renders fine without CMS scripts
  }
  const activeScripts = siteScripts.filter((s) => s.active);
  const rawHeadScripts = activeScripts.filter((s) => s.location === 'head');
  const bodyStartScripts = activeScripts.filter((s) => s.location === 'body_start');
  const bodyEndScripts = activeScripts.filter((s) => s.location === 'body_end');

  // If a user saved a noscript-only snippet (e.g. GTM noscript) under 'head', safely route it to body_start for valid HTML5 execution
  const mislocatedNoscripts = rawHeadScripts.filter((s) => {
    const trimmed = (s.code || '').trim();
    return trimmed.includes('<noscript') && !trimmed.includes('<script');
  });
  const headScripts = rawHeadScripts.filter((s) => !mislocatedNoscripts.includes(s));
  const effectiveBodyStartScripts = [...bodyStartScripts, ...mislocatedNoscripts];

  // ── Fetch Global Content & Blogs for the Provider ──
  let initialGlobalData = null;
  let initialBlogs = [];
  try {
    const globalContent = await SiteContent.findOne({ key: 'complete_data' }).lean() as any;
    const mongoose = (await import('mongoose')).default;
    const Post = (await import('@/models/Post')).default;

    // Home/About "selected posts" resolve by _id against this list, and nested providers no
    // longer refetch /api/blog - so besides the 6 newest posts, always include the hand-picked ones.
    const selectedIds: string[] = (globalContent?.data?.blogSection?.selectedPosts || [])
      .map(String)
      .filter((id: string) => mongoose.isValidObjectId(id));
    const baseFilter = { status: 'published', isTrashed: { $ne: true } };
    const fields = 'title slug featuredImage excerpt date publishedAt author authorName categories';

    const [latest, picked] = await Promise.all([
      Post.find(baseFilter)
        .select(fields)
        // Post has no `date` field (only publishedAt/createdAt) - the old `date: -1` sort was a
        // no-op, so this returned the 6 OLDEST posts in insertion order.
        .sort({ publishedAt: -1, createdAt: -1 })
        .limit(6)
        .populate('categories', 'name')
        .populate('author', 'name')
        .lean(),
      selectedIds.length
        ? Post.find({ ...baseFilter, _id: { $in: selectedIds } })
            .select(fields)
            .populate('categories', 'name')
            .populate('author', 'name')
            .lean()
        : Promise.resolve([] as any[]),
    ]);

    const seen = new Set<string>();
    const blogPosts = [...latest, ...picked].filter((p: any) => {
      const id = String(p._id);
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });

    if (globalContent?.data) initialGlobalData = globalContent.data;
    initialBlogs = JSON.parse(JSON.stringify(blogPosts));
  } catch (e) {
    console.error("Failed to fetch initial data for provider", e);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Site-wide schemas removed - handled dynamically by pages/services */}
        {/* ── CMS-managed <head> scripts ── */}
        <SiteScriptsRenderer scripts={headScripts} location="head" />
      </head>
      <body className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}>
        {/* ── CMS-managed body_start scripts ── */}
        <SiteScriptsRenderer scripts={effectiveBodyStartScripts} location="body_start" />
        <ContentProvider initialData={initialGlobalData} initialBlogs={initialBlogs}>
          <Providers>
            <div className="relative min-h-screen flex flex-col">
              {/* Common background grid for all pages */}
              <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, #2563eb 1px, transparent 1px),
                      linear-gradient(to bottom, #2563eb 1px, transparent 1px)
                    `,
                    backgroundSize: '80px 80px',
                  }}
                />
              </div>

              <SiteLayout>{children}</SiteLayout>
            </div>
          </Providers>
        </ContentProvider>

        {/* ── CMS-managed body_end scripts ── */}
        <SiteScriptsRenderer scripts={bodyEndScripts} location="body_end" />
      </body>
    </html>
  );
}
