const path = require('path');
const mongoose = require(path.resolve('./node_modules/mongoose'));
require(path.resolve('./node_modules/dotenv')).config({ path: '.env.local' });

async function inspectPageMatches() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const pageIds = [
    '69fb4408ed7caa1140bf2659',
    '69fcb5e5f559ecaafaebcb8b',
    '6a479a1d4110008a67b64ba8',
    '6a4ba4c861712eb6eebb90f0',
    '6a550882732ae6e6eb7f7b43'
  ];

  for (const id of pageIds) {
    const page = await db.collection('pages').findOne({ _id: new mongoose.Types.ObjectId(id) });
    console.log(`\n=== Page: "${page.title}" (slug: ${page.slug}) ===`);
    const json = JSON.stringify(page, null, 2);
    const lines = json.split('\n');
    lines.forEach((line, idx) => {
      if (/eagle|eaglerevolution|roofing|shingle|siding\b/i.test(line)) {
        console.log(`  Line ${idx + 1}: ${line.trim()}`);
      }
    });
  }

  await mongoose.disconnect();
}

inspectPageMatches();
