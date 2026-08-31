const path = require('path');
const mongoose = require(path.resolve('./node_modules/mongoose'));
require(path.resolve('./node_modules/dotenv')).config({ path: '.env.local' });

async function inspectBlogLinks() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const posts = await db.collection('posts').find({}).toArray();
  const pages = await db.collection('pages').find({}).toArray();
  const siteContent = await db.collection('site_contents').findOne({ key: 'complete_data' });
  const services = siteContent?.data?.services?.services || [];

  const postSlugs = new Set(posts.map(p => p.slug));
  const pageSlugs = new Set(pages.map(p => p.slug));
  const serviceSlugs = new Set(services.map(s => s.slug));

  console.log(`\n=== Total Posts in DB: ${posts.length} ===\n`);

  const linkRegex = /href=["']([^"']+)["']/gi;
  const linkReport = [];
  const domain = "https://410-muscletherapy.com";

  for (const post of posts) {
    const content = post.content || "";
    let match;
    const postLinks = [];

    while ((match = linkRegex.exec(content)) !== null) {
      const rawHref = match[1];
      postLinks.push(rawHref);
    }

    const problematicLinks = [];

    for (const href of postLinks) {
      // Ignore mailto, tel, external google, youtube, styleseat, etc.
      if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) continue;
      
      const isInternal = href.startsWith('https://410-muscletherapy.com') || 
                         href.startsWith('http://410-muscletherapy.com') || 
                         href.startsWith('/') ||
                         href.includes('eaglerevolution') ||
                         href.includes('muscletherapy');

      if (!isInternal) continue;

      // Extract path
      let cleanPath = href
        .replace(/^https?:\/\/410-muscletherapy\.com/i, '')
        .replace(/^https?:\/\/www\.410-muscletherapy\.com/i, '')
        .replace(/^\/+|\/+$/g, '');

      // Check if it's an old category-based blog link (e.g. health-wellness/some-post-slug)
      const parts = cleanPath.split('/');
      let suggestedHref = href;
      let reason = "";

      if (href.includes('eaglerevolution')) {
        reason = "Legacy Eagle URL";
        suggestedHref = href.replace(/eaglerevolution\.com/gi, '410-muscletherapy.com');
      } else if (parts.length === 2 && (parts[0] === 'health-wellness' || parts[0] === 'uncategorized' || parts[0] === 'blog-posts' || parts[0] === 'category')) {
        const potentialSlug = parts[1];
        if (postSlugs.has(potentialSlug)) {
          reason = `Old category URL: /${parts[0]}/${potentialSlug} -> should be /blog/${potentialSlug}/`;
          suggestedHref = `${domain}/blog/${potentialSlug}/`;
        }
      } else if (parts.length === 1 && parts[0] && postSlugs.has(parts[0])) {
        reason = `Direct post slug missing /blog/: /${parts[0]} -> should be /blog/${parts[0]}/`;
        suggestedHref = `${domain}/blog/${parts[0]}/`;
      } else if (parts.length === 2 && parts[0] === 'blog' && postSlugs.has(parts[1])) {
        // Correct blog format, check trailing slash
        if (!href.endsWith('/')) {
          reason = "Missing trailing slash";
          suggestedHref = `${href}/`;
        }
      } else if (parts.length === 1 && parts[0] && (pageSlugs.has(parts[0]) || serviceSlugs.has(parts[0]))) {
        // Page or service URL
        if (!href.endsWith('/')) {
          reason = "Service/Page URL missing trailing slash";
          suggestedHref = `${href}/`;
        }
      }

      if (reason) {
        problematicLinks.push({
          current: href,
          suggested: suggestedHref,
          reason: reason
        });
      }
    }

    if (problematicLinks.length > 0) {
      linkReport.push({
        postTitle: post.title,
        postSlug: post.slug,
        links: problematicLinks
      });
    }
  }

  console.log(`Found ${linkReport.length} posts with old / incorrect interlinked URLs:\n`);
  let totalIssueLinks = 0;

  for (const item of linkReport) {
    console.log(`Post: "${item.postTitle}" (slug: ${item.postSlug})`);
    for (const l of item.links) {
      totalIssueLinks++;
      console.log(`  - [CURRENT]   : ${l.current}`);
      console.log(`    [SUGGESTED] : ${l.suggested}`);
      console.log(`    [REASON]    : ${l.reason}`);
    }
    console.log('');
  }

  console.log(`\n=== SUMMARY: ${totalIssueLinks} total links in ${linkReport.length} posts need updating ===\n`);

  await mongoose.disconnect();
}

inspectBlogLinks();
