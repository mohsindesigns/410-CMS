const path = require('path');
const mongoose = require(path.resolve('./node_modules/mongoose'));
require(path.resolve('./node_modules/dotenv')).config({ path: '.env.local' });

async function fixServicesAscending() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const content = await db.collection('site_contents').findOne({ key: 'complete_data' });
  if (content && content.data && content.data.services) {
    let services = content.data.services.services || [];
    let items = content.data.services.items || [];

    // Sort ascending by number/id
    const sortFn = (a, b) => {
      const numA = parseInt(a.number || a.id || '99', 10);
      const numB = parseInt(b.number || b.id || '99', 10);
      return numA - numB;
    };

    services.sort(sortFn);
    items.sort(sortFn);

    await db.collection('site_contents').updateOne(
      { key: 'complete_data' },
      {
        $set: {
          'data.services.services': services,
          'data.services.items': items
        }
      }
    );

    console.log('✓ Successfully sorted services.services and services.items in ascending order in MongoDB!');
    console.log('\nNew items order:');
    items.forEach((item, i) => {
      console.log(`  [${i}] number: ${item.number}, id: ${item.id}, name: ${item.name || item.title}`);
    });
  }

  await mongoose.disconnect();
}

fixServicesAscending();
