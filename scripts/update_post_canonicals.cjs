const path = require('path');
const mongoose = require(path.resolve('./node_modules/mongoose'));
require(path.resolve('./node_modules/dotenv')).config({ path: '.env.local' });

async function updatePostSeoCanonicals() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const posts = await db.collection('posts').find({}).toArray();
  let count = 0;

  for (const post of posts) {
    if (post.seo?.canonicalUrl && post.seo.canonicalUrl.includes('/blog/')) {
      const newCanonical = post.seo.canonicalUrl.replace('/blog/', '/blogs/');
      await db.collection('posts').updateOne(
        { _id: post._id },
        { $set: { 'seo.canonicalUrl': newCanonical } }
      );
      count++;
    }
  }

  console.log(`Updated canonicalUrl in ${count} posts to /blogs/!`);
  await mongoose.disconnect();
}

updatePostSeoCanonicals();
