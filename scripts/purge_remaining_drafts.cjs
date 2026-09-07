/**
 * Permanently deletes the 3 remaining trashed pages (Contact Us, Meet The
 * Team, Join Our Team) per explicit user confirmation on 2026-09-07. These
 * were unrelated to the service-duplicate cleanup - they were unpublished
 * drafts sitting in trash already.
 *
 * Run with: node scripts/purge_remaining_drafts.cjs
 */
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach((line) => {
  const m = line.match(/^([^=#]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim();
});

const SLUGS_TO_DELETE = ['contact-us', 'about/team', 'about/careers'];

async function main() {
  await mongoose.connect(env.MONGODB_URI, { dbName: env.MONGODB_DB });
  const db = mongoose.connection.db;
  const pages = db.collection('pages');

  const toDelete = await pages.find({ slug: { $in: SLUGS_TO_DELETE } }).toArray();
  console.log(`Found ${toDelete.length} of ${SLUGS_TO_DELETE.length} expected pages to delete:`);
  console.log(toDelete.map((p) => ({ title: p.title, slug: p.slug, isTrashed: p.isTrashed, status: p.status })));

  const notTrashed = toDelete.filter((p) => !p.isTrashed);
  if (notTrashed.length > 0) {
    console.log('\nABORTING: the following matched pages are NOT trashed (unexpected) - refusing to delete for safety:');
    console.log(notTrashed.map((p) => p.slug));
    await mongoose.disconnect();
    process.exit(1);
  }

  const result = await pages.deleteMany({ slug: { $in: SLUGS_TO_DELETE }, isTrashed: true });
  console.log(`\nPermanently deleted ${result.deletedCount} pages.`);

  const remaining = await pages.find({ isTrashed: true }).toArray();
  console.log(`\nRemaining trashed pages (should be 0): ${remaining.length}`);

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
