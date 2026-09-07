/**
 * Consolidates all 10 services into ONE place: SiteContent.data.services.services[]
 * (the "Services" admin panel), per user request on 2026-09-07 to stop having
 * services split between Admin > Services and Admin > Pages.
 *
 * 5 of the 10 services currently live as Page documents (template:
 * 'service-detail') and win at render time over their SiteContent array
 * counterpart (same slug). This script:
 *   1. For each of those 5, copies the Page doc's CURRENT title, seo, and
 *      content fields into the matching services.services[] array entry
 *      (so nothing reverts to stale/old array data).
 *   2. Trashes (does not hard-delete) those 5 Page docs, so the array entry
 *      is what actually renders going forward - trashed, not deleted, so
 *      there's a rollback safety net until you confirm everything looks right.
 *
 * No redirects needed - the slugs are identical, so the URL doesn't change,
 * only which data source serves it.
 *
 * Run with: node scripts/migrate_services_to_single_source.cjs
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

const SLUGS_TO_MIGRATE = [
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
  const siteContents = db.collection('site_contents');

  const contentDoc = await siteContents.findOne({ key: 'complete_data' });
  if (!contentDoc) throw new Error('complete_data document not found');

  const services = contentDoc.data.services.services;
  const pageIdsToTrash = [];

  for (const slug of SLUGS_TO_MIGRATE) {
    const page = await pages.findOne({ slug, isTrashed: { $ne: true } });
    if (!page) {
      console.log(`SKIP "${slug}": no live Page doc found (already migrated or missing)`);
      continue;
    }

    const idx = services.findIndex((s) => s.slug === slug);
    if (idx === -1) {
      console.log(`WARNING "${slug}": Page doc found but no matching services[] entry - skipping to avoid creating a mismatched record`);
      continue;
    }

    const existing = services[idx];
    services[idx] = {
      ...existing,
      ...(page.content || {}),
      title: page.title || existing.title,
      seo: { ...(existing.seo || {}), ...(page.seo || {}) },
      slug: existing.slug,
      id: existing.id,
      status: existing.status,
    };

    pageIdsToTrash.push(page._id);
    console.log(`Migrated "${slug}" from Page doc -> services[] entry`);
  }

  if (pageIdsToTrash.length === 0) {
    console.log('\nNothing to migrate. Exiting.');
    await mongoose.disconnect();
    return;
  }

  await siteContents.updateOne(
    { key: 'complete_data' },
    { $set: { 'data.services.services': services, lastUpdated: new Date() } }
  );
  console.log(`\nSaved updated services[] array (${services.length} total entries).`);

  const trashResult = await pages.updateMany(
    { _id: { $in: pageIdsToTrash } },
    { $set: { isTrashed: true, trashedAt: new Date() } }
  );
  console.log(`Trashed ${trashResult.modifiedCount} now-redundant Page docs.`);

  console.log('\nDone. Recommended next steps:');
  console.log('1. Spot-check each migrated service live URL to confirm content/SEO look right.');
  console.log('2. Once confirmed, permanently delete those 5 trashed Page docs (same pattern as before).');

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
