const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function scanDb() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  
  for (const col of collections) {
    const name = col.name;
    const docs = await db.collection(name).find({}).toArray();
    let count = 0;
    for (const doc of docs) {
      const str = JSON.stringify(doc);
      if (/eagle/i.test(str)) {
        count++;
      }
    }
    console.log(`Collection ${name}: ${count} / ${docs.length} docs matching 'eagle'`);
  }
  await mongoose.disconnect();
}
scanDb();
