const path = require('path');
const mongoose = require(path.resolve('./node_modules/mongoose'));
require(path.resolve('./node_modules/dotenv')).config({ path: '.env.local' });

async function migrateBlogLinks() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const posts = await db.collection('posts').find({}).toArray();
  const pages = await db.collection('pages').find({}).toArray();
  const siteContent = await db.collection('site_contents').findOne({ key: 'complete_data' });
  const services = siteContent?.data?.services?.services || [];

  const postSlugs = new Set(posts.map(p => p.slug));
  const pageSlugs = new Set(pages.map(p => p.slug));
  const serviceSlugs = new Set(services.map(s => s.slug));

  const domain = "https://410-muscletherapy.com";
  let updatedPostsCount = 0;
  let totalLinksReplaced = 0;

  for (const post of posts) {
    let content = post.content || "";
    let contentChanged = false;

    // Replace all href="..." links
    const linkRegex = /href=(["'])([^"']+)\1/gi;
    const newContent = content.replace(linkRegex, (fullMatch, quote, href) => {
      if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
        return fullMatch;
      }

      const isInternal = href.startsWith('https://410-muscletherapy.com') ||
                         href.startsWith('http://410-muscletherapy.com') ||
                         href.startsWith('/') ||
                         href.includes('eaglerevolution') ||
                         href.includes('muscletherapy');

      if (!isInternal) return fullMatch;

      let cleanPath = href
        .replace(/^https?:\/\/410-muscletherapy\.com/i, '')
        .replace(/^https?:\/\/www\.410-muscletherapy\.com/i, '')
        .replace(/^\/+|\/+$/g, '');

      const parts = cleanPath.split('/');
      let newHref = href;

      if (parts.length === 2 && (parts[0] === 'health-wellness' || parts[0] === 'uncategorized' || parts[0] === 'blog-posts' || parts[0] === 'category')) {
        const potentialSlug = parts[1];
        if (postSlugs.has(potentialSlug)) {
          newHref = `${domain}/blog/${potentialSlug}/`;
        }
      } else if (parts.length === 1 && parts[0] && postSlugs.has(parts[0])) {
        newHref = `${domain}/blog/${parts[0]}/`;
      } else if (parts.length === 2 && parts[0] === 'blog' && postSlugs.has(parts[1])) {
        if (!href.endsWith('/')) {
          newHref = `${href}/`;
        }
      } else if (parts.length === 1 && parts[0] && (pageSlugs.has(parts[0]) || serviceSlugs.has(parts[0]))) {
        if (!href.endsWith('/')) {
          newHref = `${href}/`;
        }
      }

      if (newHref !== href) {
        contentChanged = true;
        totalLinksReplaced++;
        return `href=${quote}${newHref}${quote}`;
      }

      return fullMatch;
    });

    if (contentChanged) {
      await db.collection('posts').updateOne(
        { _id: post._id },
        { $set: { content: newContent, updatedAt: new Date() } }
      );
      updatedPostsCount++;
      console.log(`Updated post: "${post.title}" (slug: ${post.slug})`);
    }
  }

  console.log(`\n=== Migration Complete ===`);
  console.log(`Successfully updated ${totalLinksReplaced} links across ${updatedPostsCount} posts!\n`);

  await mongoose.disconnect();
}

migrateBlogLinks();
