const path = require('path');
const mongoose = require(path.resolve('./node_modules/mongoose'));
require(path.resolve('./node_modules/dotenv')).config({ path: '.env.local' });

async function sanitizeAllPagesInDb() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  // 1. Delete draft copy
  await db.collection('pages').deleteOne({ slug: 'home-copy-1787580873491' });

  // 2. Fetch all pages and clean any string containing legacy words
  const pages = await db.collection('pages').find({}).toArray();

  for (const page of pages) {
    const rawJson = JSON.stringify(page);
    if (/roof|shingle|siding|patio|gutter|eagle|door/i.test(rawJson)) {
      const cleanedJson = rawJson
        .replace(/roofing|shingle|siding|patio cover|patio|gutter/gi, 'massage therapy')
        .replace(/roof|door/gi, 'recovery session')
        .replace(/contractor|builder/gi, 'specialist')
        .replace(/eaglerevolution\.com/gi, '410-muscletherapy.com')
        .replace(/eagle-revolution/gi, '410-muscletherapy')
        .replace(/eagle revolution/gi, '410 Muscle Therapy')
        .replace(/eagle/gi, '410');

      const updatedObj = JSON.parse(cleanedJson);
      delete updatedObj._id;

      await db.collection('pages').updateOne(
        { _id: page._id },
        { $set: updatedObj }
      );
      console.log(`Sanitized page: "${page.title}" (slug: ${page.slug})`);
    }
  }

  console.log('✓ All pages in DB sanitized!');
  await mongoose.disconnect();
}

sanitizeAllPagesInDb();
