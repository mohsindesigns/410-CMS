const path = require('path');
const mongoose = require(path.resolve('./node_modules/mongoose'));
require(path.resolve('./node_modules/dotenv')).config({ path: '.env.local' });

async function inspectBlogFaqs() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const posts = await db.collection('posts').find({ status: 'published' }).toArray();
  console.log('Total published posts:', posts.length);

  let faqInContentCount = 0;
  let postFaqFieldCount = 0;

  for (const p of posts) {
    const hasFaqField = p.faq && Array.isArray(p.faq) && p.faq.length > 0;
    if (hasFaqField) postFaqFieldCount++;

    const content = p.content || '';
    const headingMatches = content.match(/<h[1-6][^>]*>[^<]*(?:FAQ|Frequently Asked)[^<]*<\/h[1-6]>/gi);
    if (headingMatches) {
      faqInContentCount++;
      console.log(`- [${p.slug}] post.faq count: ${p.faq?.length || 0} | Headings: ${headingMatches.join(', ')}`);
    }
  }

  console.log(`\nSummary: Posts with FAQ field: ${postFaqFieldCount}, Posts with FAQ text in content: ${faqInContentCount}`);

  // Inspect the first post's FAQ structure in content
  const sample = posts.find(p => /<h[1-6][^>]*>[^<]*(?:FAQ|Frequently Asked)[^<]*<\/h[1-6]>/i.test(p.content || ''));
  if (sample) {
    console.log('\n--- Sample Post FAQ content snippet [' + sample.slug + '] ---');
    const idx = sample.content.search(/<h[1-6][^>]*>[^<]*(?:FAQ|Frequently Asked)[^<]*<\/h[1-6]>/i);
    console.log(sample.content.substring(idx, idx + 1200));
    console.log('\n--- Sample post.faq field ---');
    console.log(JSON.stringify(sample.faq, null, 2));
  }

  await mongoose.disconnect();
}

inspectBlogFaqs();
