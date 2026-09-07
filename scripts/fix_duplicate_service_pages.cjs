/**
 * One-time cleanup for the service-page duplication issue found 2026-09-07.
 *
 * Background: the 10 real services (shown in Admin -> Services) are stored in
 * SiteContent.data.services.services[]. Separately, a past migration created
 * standalone Page documents (template: 'service-detail') for services, and
 * some of those ended up as near-duplicate slugs of the real 10 (e.g. both
 * /corrective-movement-maryland/ AND /corrective-movement-therapy-maryland/
 * were live at once, serving very similar content under two different URLs).
 * A handful of other Page docs (Trigger Point, Scraping, Posture Correction,
 * Percussive Therapy) don't correspond to any of the 10 services at all and
 * aren't linked from the public "Our Services" grid.
 *
 * This script:
 *   1. Restores the one Page doc that IS a real, needed service page but was
 *      sitting in Trash (Maryland Sports Massage Therapist).
 *   2. Moves the duplicate Page docs to Trash (if not already) so they stop
 *      being separately-crawlable duplicate content.
 *   3. Adds 301 redirects from every duplicate/orphan URL to its canonical
 *      URL (or to /services/ for the 4 orphans with no clear canonical match),
 *      so no inbound links / search rankings are lost outright to a 404.
 *
 * Safe to re-run: every step checks current state first.
 *
 * Run with: node scripts/fix_duplicate_service_pages.cjs
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

// slug -> canonical path it should redirect to
const REDIRECTS = [
  ['corrective-movement-therapy-maryland', '/corrective-movement-maryland/'],
  ['infrared-therapy-maryland', '/infrared-therapy-in-maryland/'],
  ['maryland-fascial-stretch-therapy', '/maryland-stretch-therapy/'],
  ['myofascial-release-therapy-maryland', '/myofascial-release-maryland/'],
  ['maryland-myofascial-release-therapy', '/myofascial-release-maryland/'],
  ['acupressure-massage-maryland', '/acupressure-maryland/'],
  ['maryland-sports-massage', '/maryland-sports-massage-therapist/'],
  ['maryland-deep-tissue-massage', '/deep-tissue-massage-maryland/'],
  ['maryland-cupping-therapy', '/cupping-therapy-maryland/'],
  // orphans not matching any of the 10 real services - send to the services hub
  ['maryland-trigger-point-therapy', '/services/'],
  ['maryland-scraping-therapy', '/services/'],
  ['maryland-posture-correction-therapy', '/services/'],
  ['maryland-percussive-therapy', '/services/'],
];

// slugs that are currently LIVE duplicates and need to be trashed
const SLUGS_TO_TRASH = [
  'corrective-movement-therapy-maryland',
  'infrared-therapy-maryland',
  'myofascial-release-therapy-maryland',
];

// the one real service page that's still incorrectly sitting in Trash
const SLUG_TO_RESTORE = 'maryland-sports-massage-therapist';

async function main() {
  await mongoose.connect(env.MONGODB_URI, { dbName: env.MONGODB_DB });
  const db = mongoose.connection.db;
  const pages = db.collection('pages');
  const redirects = db.collection('redirects');

  const restoreResult = await pages.updateOne(
    { slug: SLUG_TO_RESTORE },
    { $set: { isTrashed: false, trashedAt: null } }
  );
  console.log(`Restored "${SLUG_TO_RESTORE}": matched ${restoreResult.matchedCount}, modified ${restoreResult.modifiedCount}`);

  const trashResult = await pages.updateMany(
    { slug: { $in: SLUGS_TO_TRASH }, isTrashed: { $ne: true } },
    { $set: { isTrashed: true, trashedAt: new Date() } }
  );
  console.log(`Trashed duplicate pages: matched ${trashResult.matchedCount}, modified ${trashResult.modifiedCount}`);

  for (const [sourceSlug, targetUrl] of REDIRECTS) {
    const sourceUrl = `/${sourceSlug}/`;
    const existing = await redirects.findOne({ sourceUrl });
    if (existing) {
      console.log(`Redirect already exists for ${sourceUrl} -> ${existing.targetUrl}, skipping`);
      continue;
    }
    await redirects.insertOne({
      sourceUrl,
      targetUrl,
      statusCode: 301,
      queryParamMode: 'ignore',
      ignoreCase: true,
      ignoreSlash: true,
      isRegex: false,
      status: 'active',
      notes: 'Auto-added: consolidating duplicate/orphan service page into its canonical URL',
      hits: 0,
      lastAccessed: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`Created redirect ${sourceUrl} -> ${targetUrl}`);
  }

  console.log('\nDone. Recommended next steps:');
  console.log('1. Deploy the isTrashed render-guard fix in src/app/[...slug]/page.tsx and src/app/page.tsx.');
  console.log('2. Spot-check a couple of the redirected URLs once deployed to confirm they 301 correctly.');

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
