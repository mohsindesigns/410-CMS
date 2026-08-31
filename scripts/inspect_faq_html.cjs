const path = require('path');
const mongoose = require(path.resolve('./node_modules/mongoose'));
require(path.resolve('./node_modules/dotenv')).config({ path: '.env.local' });

async function inspectPostFaqHtml() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const slugs = [
    'complete-guide-for-best-deep-tissue-massage-near-me',
    'the-best-massage-therapy-for-pain-relief-and-wellness',
    'are-you-searching-for-the-best-massage-therapy-near-me',
    'where-to-get-a-foot-massage-near-me-for-pain-relief-and-recovery',
    'best-massage-services-in-maryland',
    'how-410-muscle-therapy-helps-with-true-relief',
    'what-is-russian-massage'
  ];

  for (const slug of slugs) {
    const post = await db.collection('posts').findOne({ slug });
    if (post) {
      console.log(`\n=================== [${slug}] ===================`);
      const content = post.content || '';
      const regex = /<h[1-6][^>]*>[^<]*(?:faq|frequently|questions|q&a|q\s*&amp;\s*a)[^<]*<\/h[1-6]>/i;
      const match = content.match(regex);
      if (match) {
        const start = content.indexOf(match[0]);
        console.log('CONTENT FROM FAQ HEADING TO END (or next major section):\n');
        console.log(content.substring(start, start + 1500));
      }
    }
  }

  await mongoose.disconnect();
}

inspectPostFaqHtml();
