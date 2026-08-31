const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function inspectPages() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const pages = await db.collection('pages').find({}).toArray();
  for (const page of pages) {
    const json = JSON.stringify(page);
    if (/eagle/i.test(json)) {
      console.log(`Page [${page.slug}] matches:`);
      if (page.seo?.canonicalUrl && /eagle/i.test(page.seo.canonicalUrl)) console.log(`  canonicalUrl: ${page.seo.canonicalUrl}`);
      if (page.seo?.ogImage && /eagle/i.test(page.seo.ogImage)) console.log(`  ogImage: ${page.seo.ogImage}`);
      if (page.seo?.featuredImage && /eagle/i.test(page.seo.featuredImage)) console.log(`  featuredImage: ${page.seo.featuredImage}`);
      if (page.seo?.metaTitle && /eagle/i.test(page.seo.metaTitle)) console.log(`  metaTitle: ${page.seo.metaTitle}`);
      if (page.seo?.metaDescription && /eagle/i.test(page.seo.metaDescription)) console.log(`  metaDescription: ${page.seo.metaDescription}`);
    }
  }
  await mongoose.disconnect();
}
inspectPages();
