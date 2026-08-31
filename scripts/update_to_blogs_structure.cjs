const path = require('path');
const mongoose = require(path.resolve('./node_modules/mongoose'));
require(path.resolve('./node_modules/dotenv')).config({ path: '.env.local' });

async function updateToBlogsStructure() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  console.log('=== Step 1: Update Pages Collection ===');
  const blogPage = await db.collection('pages').findOne({ slug: 'blog' });
  if (blogPage) {
    await db.collection('pages').updateOne(
      { _id: blogPage._id },
      { 
        $set: { 
          slug: 'blogs', 
          'seo.canonicalUrl': 'https://410-muscletherapy.com/blogs/',
          'seo.metaTitle': blogPage.seo?.metaTitle || 'Our Blogs | 410 Muscle Therapy',
          'seo.metaDescription': blogPage.seo?.metaDescription || 'Explore our latest articles, insights, and clinical recovery tips.'
        } 
      }
    );
    console.log('Updated page slug: "blog" -> "blogs"');
  }

  console.log('\n=== Step 2: Update Site Content Navigation ===');
  const siteContentDoc = await db.collection('site_contents').findOne({ key: 'complete_data' });
  if (siteContentDoc) {
    let rawStr = JSON.stringify(siteContentDoc.data);
    const updatedStr = rawStr
      .replace(/["']\/blog\/?["']/g, '"/blogs/"')
      .replace(/["']https:\/\/410-muscletherapy\.com\/blog\/?["']/g, '"https://410-muscletherapy.com/blogs/"');
    
    if (rawStr !== updatedStr) {
      const updatedData = JSON.parse(updatedStr);
      await db.collection('site_contents').updateOne(
        { key: 'complete_data' },
        { $set: { data: updatedData } }
      );
      console.log('Updated SiteContent navigation & menu links to /blogs/');
    } else {
      console.log('SiteContent navigation already clean.');
    }
  }

  console.log('\n=== Step 3: Update Internal Links in Posts Content ===');
  const posts = await db.collection('posts').find({}).toArray();
  let updatedPosts = 0;
  let updatedLinks = 0;

  for (const post of posts) {
    let content = post.content || "";
    let contentChanged = false;

    // Replace /blog/{slug}/ with /blogs/{slug}/
    const linkRegex = /href=(["'])(https?:\/\/410-muscletherapy\.com)?\/blog\/([^"']+)\/?\1/gi;
    const newContent = content.replace(linkRegex, (match, quote, domain, slug) => {
      contentChanged = true;
      updatedLinks++;
      const cleanSlug = slug.replace(/^\/+|\/+$/g, '');
      return `href=${quote}https://410-muscletherapy.com/blogs/${cleanSlug}/${quote}`;
    });

    if (contentChanged) {
      await db.collection('posts').updateOne(
        { _id: post._id },
        { $set: { content: newContent } }
      );
      updatedPosts++;
      console.log(`Updated post: "${post.title}" (slug: ${post.slug})`);
    }
  }

  console.log(`\nUpdated ${updatedLinks} links in ${updatedPosts} posts to /blogs/{slug}/`);

  await mongoose.disconnect();
}

updateToBlogsStructure();
