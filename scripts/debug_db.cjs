const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const uri = process.env.MONGODB_URI;
const dbName = 'eagle_revolution';

async function debug() {
    console.log("URI present:", !!uri);
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db(dbName);
        const collections = await db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));
        
        for (const col of collections) {
            const count = await db.collection(col.name).countDocuments();
            console.log(`Collection ${col.name} has ${count} documents`);
            const first = await db.collection(col.name).findOne();
            console.log(`First doc in ${col.name}:`, JSON.stringify(first).slice(0, 300));
        }
    } catch (err) {
        console.error("DB Error:", err);
    } finally {
        await client.close();
    }
}
debug();
