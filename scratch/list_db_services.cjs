const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not found");
    return;
  }
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('eagle_revolution');
    
    // Find all documents in 'site_contents'
    const site_contents = await db.collection('site_contents').find({}).toArray();
    console.log("=== SITE_CONTENTS DOCUMENTS ===");
    site_contents.forEach(c => {
      console.log(`Document Key: ${c.key}, Keys in data:`, Object.keys(c.data || {}));
    });
    
    const completeData = site_contents.find(c => c.key === 'complete_data');
    if (completeData) {
      console.log("\n=== COMPLETE_DATA SERVICES SECTION ===");
      console.dir(completeData.data.services, { depth: null });
    }
    
    // Find all documents in 'pages'
    const pages = await db.collection('pages').find({}).toArray();
    console.log(`\n=== PAGES COLLECTION (${pages.length} documents) ===`);
    pages.forEach(p => {
      console.log(`Page: ${p.title} (${p.slug}), status: ${p.status}, type: ${p.type}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
