const path = require('path');
const mongoose = require(path.resolve('./node_modules/mongoose'));
require(path.resolve('./node_modules/dotenv')).config({ path: '.env.local' });

async function cleanFinalMediaSubmissions() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  // Clean media
  const mediaDocs = await db.collection('media').find({}).toArray();
  for (const m of mediaDocs) {
    const raw = JSON.stringify(m);
    if (/roof|siding|gutter|shingle|patio|eagle/i.test(raw)) {
      const cleaned = raw
        .replace(/roofing|shingle|siding|patio|gutter|eagle/gi, 'therapy')
        .replace(/roof/gi, 'recovery');
      const updated = JSON.parse(cleaned);
      delete updated._id;
      await db.collection('media').updateOne({ _id: m._id }, { $set: updated });
    }
  }

  // Delete legacy test submissions
  await db.collection('submissions').deleteMany({
    _id: {
      $in: [
        new mongoose.Types.ObjectId('69fa0ec810324eff34402280'),
        new mongoose.Types.ObjectId('6a565f05b7ae944e3360c0f1')
      ]
    }
  });

  console.log('✓ Final media and submissions cleaned!');
  await mongoose.disconnect();
}

cleanFinalMediaSubmissions();
