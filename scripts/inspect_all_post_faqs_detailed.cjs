const path = require('path');
const mongoose = require(path.resolve('./node_modules/mongoose'));
require(path.resolve('./node_modules/dotenv')).config({ path: '.env.local' });

async function inspectAllPostFaqs() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const posts = await db.collection('posts').find({ status: 'published' }).toArray();
  console.log('Total published posts:', posts.length);

  for (const post of posts) {
    const faqCount = post.faq && Array.isArray(post.faq) ? post.faq.length : 0;
    console.log(`- [${post.slug}] FAQs count: ${faqCount}`);
    if (faqCount > 0) {
      console.log('    First Q:', post.faq[0].question || post.faq[0].q);
    }
  }

  await mongoose.disconnect();
}

inspectAllPostFaqs();
