const path = require('path');
const mongoose = require(path.resolve('./node_modules/mongoose'));
require(path.resolve('./node_modules/dotenv')).config({ path: '.env.local' });

async function listAllPages() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const pages = await db.collection('pages').find({}).toArray();
  console.log(`Total Pages in DB: ${pages.length}\n`);

  for (const p of pages) {
    const json = JSON.stringify(p);
    const hasLegacy = /roof|shingle|siding|patio|gutter|eagle|door/i.test(json);
    console.log(`- ID: ${p._id} | Slug: "${p.slug}" | Title: "${p.title}" | Status: ${p.status} | Template: ${p.template} | LegacyMatch: ${hasLegacy}`);
  }

  await mongoose.disconnect();
}

listAllPages();
