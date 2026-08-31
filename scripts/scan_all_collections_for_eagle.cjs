const path = require('path');
const mongoose = require(path.resolve('./node_modules/mongoose'));
require(path.resolve('./node_modules/dotenv')).config({ path: '.env.local' });

async function scanAllCollectionsForEagle() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const collections = await db.listCollections().toArray();
  console.log(`Scanning ${collections.length} collections for 'eagle' or 'eaglerevolution'...\n`);

  let totalMatches = 0;

  for (const col of collections) {
    const name = col.name;
    const docs = await db.collection(name).find({}).toArray();
    let colMatches = 0;

    for (const doc of docs) {
      const json = JSON.stringify(doc);
      if (/eagle|eaglerevolution/i.test(json)) {
        colMatches++;
        totalMatches++;
        console.log(`\nFound match in collection [${name}], _id: ${doc._id}, slug/key/title: ${doc.slug || doc.key || doc.title || 'N/A'}`);
        
        // Find matching keys
        const matches = json.match(/"[^"]*":\s*"[^"]*(?:eagle|eaglerevolution)[^"]*"/gi) || [];
        matches.forEach(m => console.log(`    ${m.substring(0, 150)}`));
      }
    }

    if (colMatches > 0) {
      console.log(`--> Collection [${name}] had ${colMatches} matching documents.`);
    }
  }

  console.log(`\n========================================`);
  console.log(`Total documents containing 'eagle': ${totalMatches}`);
  console.log(`========================================\n`);

  await mongoose.disconnect();
}

scanAllCollectionsForEagle();
