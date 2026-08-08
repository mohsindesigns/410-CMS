const { MongoClient } = require('mongodb');
require('dotenv').config({ path: './.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || '410_muscle_therapy';

async function run() {
  if (!uri) return;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const page = await db.collection('pages').findOne({ slug: 'blog' });
    console.log("Blog Page document:", JSON.stringify(page));
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
run();
