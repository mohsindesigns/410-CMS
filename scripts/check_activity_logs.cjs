const path = require('path');
const mongoose = require(path.resolve('./node_modules/mongoose'));
require(path.resolve('./node_modules/dotenv')).config({ path: '.env.local' });

async function checkActivityLogForPostUpdates() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  
  // Find activity logs for Post entity
  const postLogs = await db.collection('activitylogs').find({ 
    entity: 'Post'
  }).sort({ timestamp: -1 }).limit(20).toArray();

  console.log('Recent Post activity logs:', postLogs.length);
  postLogs.forEach(l => {
    const detailKeys = Object.keys(l.details || {});
    console.log(`  [${l.action}] ${l.timestamp} details keys: ${detailKeys.join(', ')}`);
    if (l.details && l.details.slug) console.log('    slug:', l.details.slug);
    if (l.details && l.details.previousData) console.log('    HAS previousData!');
    if (l.details && l.details.content) console.log('    HAS content! len:', JSON.stringify(l.details.content).length);
  });

  await mongoose.disconnect();
}
checkActivityLogForPostUpdates();
