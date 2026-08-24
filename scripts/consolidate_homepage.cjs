const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function consolidate() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('eagle_revolution');

    const site = await db.collection('site_contents').findOne({ key: 'complete_data' });
    const completeData = site?.data || {};

    // Remove any stale or duplicate home documents
    await db.collection('pages').deleteMany({
      $or: [{ slug: '/' }, { slug: 'home' }, { template: 'home' }]
    });

    // Insert a single clean, canonical Home Page document
    await db.collection('pages').insertOne({
      _id: new ObjectId('6a8c3b900cdd79ba5fdb50b5'),
      title: 'Home Page',
      slug: 'home',
      template: 'home',
      status: 'published',
      isTrashed: false,
      seo: {
        metaTitle: '410 Muscle Therapy | Performance Recovery & Sports Massage in Maryland',
        metaDescription: 'Specialized sports massage, corrective movement therapy, and fascial stretch therapy in Timonium, Maryland.',
        canonicalUrl: 'https://410-muscletherapy.com/'
      },
      content: completeData,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('✓ Successfully consolidated into a single Home Page document (slug: home)!');
  } catch (err) {
    console.error('Error consolidating:', err);
  } finally {
    await client.close();
  }
}

consolidate();
