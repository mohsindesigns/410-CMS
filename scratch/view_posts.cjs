const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const uri = process.env.MONGODB_URI;
const dbName = '410_muscle_therapy';

async function run() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db(dbName);
        const posts = await db.collection('posts').find({}).toArray();
        console.log("POSTS IN DB:");
        posts.forEach(p => {
            console.log(`- Title: ${p.title}\n  Slug: ${p.slug}\n  Image: ${p.featuredImage}\n  Status: ${p.status}`);
        });
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
run();
