const path = require('path');
const mongoose = require(path.resolve('./node_modules/mongoose'));
require(path.resolve('./node_modules/dotenv')).config({ path: '.env.local' });

async function checkLogDetails() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  // Get the most recent UPDATE_POST logs
  const logs = await db.collection('activitylogs').find({
    entity: 'Post',
    action: 'UPDATE_POST',
    'details.before': { $exists: true }
  }).sort({ timestamp: -1 }).limit(5).toArray();

  for (const log of logs) {
    console.log(`\n=== Log: ${log.timestamp} ===`);
    const before = log.details.before;
    const after = log.details.after;
    
    console.log('Before keys:', Object.keys(before || {}));
    console.log('After keys:', Object.keys(after || {}));
    
    if (before && before.slug) console.log('Before slug:', before.slug);
    if (after && after.slug) console.log('After slug:', after.slug);
    
    // Check if before has content
    if (before && before.content) {
      console.log('Before content length:', before.content.length);
      console.log('Before content snippet:', before.content.substring(0, 200));
    } else {
      console.log('Before has no content field');
    }

    // Check if before has faq
    if (before && before.faq) {
      console.log('Before faq:', JSON.stringify(before.faq).substring(0, 300));
    }
  }

  await mongoose.disconnect();
}

checkLogDetails();
