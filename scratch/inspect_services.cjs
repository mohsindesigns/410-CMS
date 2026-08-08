const { MongoClient } = require('mongodb');
require('dotenv').config({ path: './.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'eagle_revolution';

async function run() {
  if (!uri) {
    console.error("MONGODB_URI not found");
    return;
  }
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const doc = await db.collection('site_contents').findOne({ key: 'complete_data' });
    if (!doc) {
      console.log("No complete_data found!");
      return;
    }
    const services = doc.data?.services?.services || [];
    console.log(`Total services in complete_data: ${services.length}`);
    services.forEach(s => {
      console.log(`\nService: "${s.title}" (slug: "${s.slug}")`);
      console.log(`- has faq: ${!!s.faq} (type: ${typeof s.faq}, isArray: ${Array.isArray(s.faq)})`);
      if (s.faq) {
        console.log(`- faq length: ${s.faq.length}`);
        console.log(`- faq value:`, JSON.stringify(s.faq));
      }
      console.log(`- faqBadge: "${s.faqBadge}"`);
      console.log(`- faqTitle: "${s.faqTitle}"`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
run();
