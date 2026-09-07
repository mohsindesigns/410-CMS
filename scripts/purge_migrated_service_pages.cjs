/**
 * Final cleanup step after migrate_services_to_single_source.cjs: permanently
 * deletes the 5 Page documents that were trashed once their content/SEO was
 * copied into services.services[]. Verified live on 2026-09-07 that all 5
 * services render correctly from the array now, so these Page docs are pure
 * dead weight.
 *
 * Run with: node scripts/purge_migrated_service_pages.cjs
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

const SLUGS_TO_DELETE = [
  'maryland-sports-massage-therapist',
  'hot-towel-massage-maryland',
  'cupping-therapy-maryland',
  'hot-stone-massage-maryland',
  'deep-tissue-massage-maryland',
];

async function main() {
  await mongoose.connect(env.MONGODB_URI, { dbName: env.MONGODB_DB });
  const db = mongoose.connection.db;
  const pages = db.collection('pages');

  const toDelete = await pages.find({ slug: { $in: SLUGS_TO_DELETE } }).toArray();
  console.log(`Found ${toDelete.length} of ${SLUGS_TO_DELETE.length} expected pages to delete:`);
  console.log(toDelete.map((p) => ({ title: p.title, slug: p.slug, isTrashed: p.isTrashed })));

  const notTrashed = toDelete.filter((p) => !p.isTrashed);
  if (notTrashed.length > 0) {
    console.log('\nABORTING: the following matched pages are NOT trashed (unexpected) - refusing to delete for safety:');
    console.log(notTrashed.map((p) => p.slug));
    await mongoose.disconnect();
    process.exit(1);
  }

  const result = await pages.deleteMany({ slug: { $in: SLUGS_TO_DELETE }, isTrashed: true });
  console.log(`\nPermanently deleted ${result.deletedCount} pages.`);

  const remainingServicePages = await pages.countDocuments({ template: 'service-detail' });
  console.log(`\nRemaining service-detail Page docs (should be 0): ${remainingServicePages}`);

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
