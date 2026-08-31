const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

function deepReplace(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') {
    return obj
      .replace(/https?:\/\/eaglerevolution\.com\/?/gi, 'https://410-muscletherapy.com/')
      .replace(/https?:\/\/www\.eaglerevolution\.com\/?/gi, 'https://410-muscletherapy.com/')
      .replace(/eaglerevolution\.com/gi, '410-muscletherapy.com')
      .replace(/eagle_revolutionllc/gi, '410muscletherapy')
      .replace(/eagle-revolution\/people\/?/gi, '410muscletherapy')
      .replace(/eagle-revolution/gi, '410-muscletherapy')
      .replace(/THE EAGLE EDGE/gi, 'THE 410 ADVANTAGE')
      .replace(/Eagle Edge/gi, '410 Advantage')
      .replace(/Eagle Revolution/gi, '410 Muscle Therapy')
      .replace(/eaglerevolution/gi, '410muscletherapy')
      .replace(/eagle-logo\.png/gi, 'logo.png')
      .replace(/eaglelogo\.png/gi, 'logo.png');
  }
  if (Array.isArray(obj)) {
    return obj.map(deepReplace);
  }
  if (typeof obj === 'object') {
    if (obj instanceof mongoose.Types.ObjectId || obj instanceof Date) return obj;
    const res = {};
    for (const key of Object.keys(obj)) {
      res[key] = deepReplace(obj[key]);
    }
    return res;
  }
  return obj;
}

async function migrate() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  console.log('1. Cleaning pages...');
  const pages = await db.collection('pages').find({}).toArray();
  for (const page of pages) {
    const originalStr = JSON.stringify(page);
    const updated = deepReplace(page);
    const updatedStr = JSON.stringify(updated);
    if (originalStr !== updatedStr) {
      delete updated._id;
      await db.collection('pages').updateOne({ _id: page._id }, { $set: updated });
    }
  }

  console.log('2. Cleaning users...');
  await db.collection('users').deleteOne({ username: 'admin' });

  console.log('Done!');
  await mongoose.disconnect();
}

migrate().catch(console.error);
