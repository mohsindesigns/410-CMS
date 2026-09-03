import { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/constants';
import connectToDatabase from '@/lib/mongodb';
import SiteContent from '@/models/Content';

export const dynamic = 'force-dynamic';

export default async function robots(): Promise<MetadataRoute.Robots> {
  let isNoIndex = false;
  try {
    await connectToDatabase();
    const content = await SiteContent.findOne({ key: 'complete_data' }).lean() as any;
    if (content?.data?.settings?.noIndexNoFollow || content?.data?.settings?.globalNoIndex) {
      isNoIndex = true;
    }
  } catch (e) {
    console.error("Failed to fetch settings for robots.txt", e);
  }

  const sitemapUrl = `${BASE_URL}/sitemap.xml`;

  if (isNoIndex) {
    return {
      rules: [
        {
          userAgent: '*',
          disallow: '/',
        },
      ],
      sitemap: sitemapUrl,
    };
  }

  // Crawl-waste disallow paths to prevent wasting crawl budget on low-value/dynamic/WordPress URLs
  const crawlWasteDisallows = [
    // WordPress Admin & Security Files
    '/wp-admin/',
    '/wp-login.php',
    '/wp-signup.php',
    '/wp-cron.php',
    '/wp-trackback.php',
    '/wp-comments-post.php',
    '/xmlrpc.php',

    // Feed Pages (duplicates)
    '/feed/',
    '/comments/feed/',
    '/*?feed=',

    // Search Pages
    '/?s=',
    '/search/',

    // Print & Share URLs
    '/*?print=',
    '/*?share=',

    // Pagination (low value)
    '/*?page=',
    '/page/',

    // Query String Parameters (duplicates)
    '/*?et_blog',
    '/*?preview=',

    // Tag Archives (soft 404 issues)
    '/tag/',

    // Author Archives (low value)
    '/author/',

    // Technical / Internal Next.js & API
    '/api/',
    '/_next/',
  ];

  // Specific AI bots, modern crawlers, and international search engines
  const allowedBots = [
    'GPTBot',
    'anthropic-ai',
    'Claude-Web',
    'PerplexityBot',
    'Google-Extended',
    'CCBot',
    'Bingbot',
    'Applebot',
    'facebookexternalhit',
    'Bytespider',
    'Yandex',
    'Baiduspider',
    'Sogou',
    'DuckDuckBot',
    'Exabot',
    'MJ12bot',
  ];

  const rules: MetadataRoute.Robots['rules'] = [
    // Explicitly allow and enforce crawl waste restrictions for each specified bot
    // to prevent bot-specific rules from bypassing the global crawl waste disallows
    ...allowedBots.map((bot) => ({
      userAgent: bot,
      allow: '/',
      disallow: crawlWasteDisallows,
    })),
    // Fallback for all other crawlers
    {
      userAgent: '*',
      allow: '/',
      disallow: crawlWasteDisallows,
    },
  ];

  return {
    rules,
    sitemap: sitemapUrl,
  };
}

