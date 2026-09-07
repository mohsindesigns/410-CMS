/**
 * Permanently deletes the 13 duplicate/orphan service-detail Page documents
 * identified and trashed by scripts/fix_duplicate_service_pages.cjs on
 * 2026-09-07. Their URLs are already covered by active 301 redirects to the
 * canonical page (verified live), so deleting the underlying Page doc has no
 * effect on live behavior - it only removes clutter from Admin > Pages > Trash.
 *
 * Does NOT touch: the redirects themselves (still needed), the 10 real
 * services, or the unrelated trashed drafts (Contact Us, Meet The Team,
 * Join Our Team) - those are a separate, intentional decision.
 *
 * Run with: node scripts/purge_duplicate_service_pages.cjs
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
  'corrective-movement-therapy-maryland',
  'infrared-therapy-maryland',
  'maryland-fascial-stretch-therapy',
  'myofascial-release-therapy-maryland',
  'acupressure-massage-maryland',
  'maryland-sports-massage',
  'maryland-deep-tissue-massage',
  'maryland-cupping-therapy',
  'maryland-myofascial-release-therapy',
  'maryland-trigger-point-therapy',
  'maryland-scraping-therapy',
  'maryland-posture-correction-therapy',
  'maryland-percussive-therapy',
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

  const remaining = await pages.find({ isTrashed: true }).toArray();
  console.log(`\nRemaining trashed pages (should just be the 3 unrelated drafts): ${remaining.length}`);
  console.log(remaining.map((p) => ({ title: p.title, slug: p.slug })));

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
