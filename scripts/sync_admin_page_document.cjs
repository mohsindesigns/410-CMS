const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function syncAdminPage() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('eagle_revolution');

    // 1. Get the authoritative complete_data
    const site = await db.collection('site_contents').findOne({ key: 'complete_data' });
    const content = site?.data || {};

    // 2. Remove duplicate home page document
    await db.collection('pages').deleteMany({
      _id: { $ne: new ObjectId('6a8c3b900cdd79ba5fdb50b5') },
      $or: [{ slug: 'home' }, { slug: '/' }, { template: 'home' }]
    });

    // 3. Update the exact document the admin panel opens (6a8c3b900cdd79ba5fdb50b5)
    await db.collection('pages').updateOne(
      { _id: new ObjectId('6a8c3b900cdd79ba5fdb50b5') },
      {
        $set: {
          title: 'Home Page',
          slug: 'home',
          template: 'home',
          status: 'published',
          isTrashed: false,
          content: content,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    console.log('✓ Successfully synced page 6a8c3b900cdd79ba5fdb50b5 with seeded content!');
  } catch (err) {
    console.error('Sync error:', err);
  } finally {
    await client.close();
  }
}

syncAdminPage();
