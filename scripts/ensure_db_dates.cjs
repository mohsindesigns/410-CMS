const path = require('path');
const mongoose = require(path.resolve('./node_modules/mongoose'));
require(path.resolve('./node_modules/dotenv')).config({ path: '.env.local' });

async function ensureDbDates() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  console.log('\n=== Checking and Ensuring publish & modified dates in DB ===\n');

  const defaultPublishedDate = new Date('2025-02-07T15:28:30Z');
  const defaultModifiedDate = new Date('2026-07-24T16:08:21Z');

  // 1. Posts
  const posts = await db.collection('posts').find({}).toArray();
  let updatedPosts = 0;
  for (const p of posts) {
    const updates = {};
    if (!p.publishedAt) updates.publishedAt = p.createdAt || p.date || defaultPublishedDate;
    if (!p.createdAt) updates.createdAt = p.publishedAt || defaultPublishedDate;
    if (!p.updatedAt) updates.updatedAt = defaultModifiedDate;

    if (Object.keys(updates).length > 0) {
      await db.collection('posts').updateOne({ _id: p._id }, { $set: updates });
      updatedPosts++;
    }
  }
  console.log(`Posts checked: ${posts.length}, updated: ${updatedPosts}`);

  // 2. Pages
  const pages = await db.collection('pages').find({}).toArray();
  let updatedPages = 0;
  for (const pg of pages) {
    const updates = {};
    if (!pg.publishedAt) updates.publishedAt = pg.createdAt || defaultPublishedDate;
    if (!pg.createdAt) updates.createdAt = pg.publishedAt || defaultPublishedDate;
    if (!pg.updatedAt) updates.updatedAt = defaultModifiedDate;

    if (Object.keys(updates).length > 0) {
      await db.collection('pages').updateOne({ _id: pg._id }, { $set: updates });
      updatedPages++;
    }
  }
  console.log(`Pages checked: ${pages.length}, updated: ${updatedPages}`);

  // 3. SiteContent Services
  const content = await db.collection('site_contents').findOne({ key: 'complete_data' });
  if (content?.data?.services?.services) {
    let serviceUpdated = false;
    const services = content.data.services.services.map(s => {
      let mod = false;
      if (!s.publishedAt) { s.publishedAt = defaultPublishedDate; mod = true; }
      if (!s.createdAt) { s.createdAt = defaultPublishedDate; mod = true; }
      if (!s.updatedAt) { s.updatedAt = defaultModifiedDate; mod = true; }
      if (mod) serviceUpdated = true;
      return s;
    });

    if (serviceUpdated) {
      await db.collection('site_contents').updateOne(
        { key: 'complete_data' },
        { $set: { 'data.services.services': services } }
      );
      console.log(`Services in SiteContent updated with dates.`);
    } else {
      console.log(`All services already have date fields.`);
    }
  }

  console.log('\n=== Database Date Verification Complete ===\n');
  await mongoose.disconnect();
}

ensureDbDates();
