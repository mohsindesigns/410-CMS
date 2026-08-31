const path = require('path');
const mongoose = require(path.resolve('./node_modules/mongoose'));
require(path.resolve('./node_modules/dotenv')).config({ path: '.env.local' });

async function checkOriginalFaqs() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const posts = await db.collection('posts').find({ status: 'published' }).toArray();
  console.log('Total published posts:', posts.length);

  let hasEmbeddedFaq = 0;
  let noEmbeddedFaq = 0;
  let postsWithFaq = [];
  let postsWithoutFaq = [];

  for (const post of posts) {
    const content = post.content || '';
    const faqHeadingRegex = /<h[1-6][^>]*>[^<]*(?:FAQ|Frequently Asked|Common Questions)[^<]*<\/h[1-6]>/i;
    
    if (faqHeadingRegex.test(content)) {
      hasEmbeddedFaq++;
      postsWithFaq.push(post.slug);
    } else {
      noEmbeddedFaq++;
      postsWithoutFaq.push(post.slug);
    }
  }

  console.log(`\nPosts that STILL have FAQ in content HTML: ${hasEmbeddedFaq}`);
  postsWithFaq.forEach(s => console.log(`  ✓ ${s}`));
  
  console.log(`\nPosts that DO NOT have FAQ in content HTML (already removed): ${noEmbeddedFaq}`);
  postsWithoutFaq.forEach(s => console.log(`  ✗ ${s}`));

  // For the first post that still has FAQ, show what the FAQ section looks like
  if (postsWithFaq.length > 0) {
    const sample = await db.collection('posts').findOne({ slug: postsWithFaq[0], status: 'published' });
    const content = sample.content || '';
    const match = content.match(/<h[1-6][^>]*>[^<]*(?:FAQ|Frequently Asked|Common Questions)[^<]*<\/h[1-6]>/i);
    if (match) {
      const startIdx = content.indexOf(match[0]);
      console.log(`\n\n=== Sample FAQ content from [${postsWithFaq[0]}] ===`);
      console.log(content.substring(startIdx, startIdx + 2000));
    }
  }

  await mongoose.disconnect();
}

checkOriginalFaqs();
