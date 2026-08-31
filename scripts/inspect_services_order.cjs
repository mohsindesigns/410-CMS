const path = require('path');
const mongoose = require(path.resolve('./node_modules/mongoose'));
require(path.resolve('./node_modules/dotenv')).config({ path: '.env.local' });

async function checkServicesOrder() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const content = await db.collection('site_contents').findOne({ key: 'complete_data' });
  const s = content?.data?.services;

  console.log('=== services.items ===');
  if (s?.items) {
    s.items.forEach((item, i) => {
      console.log(`[${i}] number: ${item.number}, id: ${item.id}, name: ${item.name || item.title}`);
    });
  }

  console.log('\n=== services.services ===');
  if (s?.services) {
    s.services.forEach((item, i) => {
      console.log(`[${i}] number: ${item.number}, id: ${item.id}, name: ${item.name || item.title}`);
    });
  }

  await mongoose.disconnect();
}

checkServicesOrder();
