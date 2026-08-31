const path = require('path');
const mongoose = require(path.resolve('./node_modules/mongoose'));
require(path.resolve('./node_modules/dotenv')).config({ path: '.env.local' });

async function publishPages() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  await db.collection('pages').updateMany(
    { slug: { $in: ['privacy', 'terms', 'contact-us', 'faq', 'reviews', 'about'] } },
    { $set: { status: 'published' } }
  );

  console.log('Published core system pages in DB!');
  await mongoose.disconnect();
}
publishPages();
