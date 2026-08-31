const path = require('path');
const fs = require('fs');
const mongoose = require(path.resolve('./node_modules/mongoose'));
require(path.resolve('./node_modules/dotenv')).config({ path: '.env.local' });

async function deepAudit() {
  console.log('========================================');
  console.log('    DEEP BRAND AUDIT FOR EAGLE / 410    ');
  console.log('========================================\n');

  // 1. Audit MongoDB
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();

  console.log('--- 1. MONGODB COLLECTIONS SCAN ---');
  const dbFindings = [];

  for (const col of collections) {
    const colName = col.name;
    // Skip activity logs if you only care about site content, but let's check it too
    const docs = await db.collection(colName).find({}).toArray();
    
    let matchCount = 0;
    for (const doc of docs) {
      const json = JSON.stringify(doc);
      if (/eagle|eaglerevolution|roofing|shingle|siding\b/i.test(json)) {
        matchCount++;
        if (colName !== 'activitylogs') {
          dbFindings.push({
            collection: colName,
            id: doc._id,
            title: doc.title || doc.name || doc.slug || doc.key || 'N/A',
            sample: json.substring(0, 200)
          });
        }
      }
    }
    console.log(`Collection "${colName}": ${matchCount} / ${docs.length} docs have potential legacy keywords`);
  }

  if (dbFindings.length > 0) {
    console.log('\nDetailed DB matches (excluding activitylogs):');
    for (const f of dbFindings) {
      console.log(`- [${f.collection}] ID: ${f.id} (${f.title})`);
    }
  } else {
    console.log('\n✓ MongoDB Content Collections are 100% CLEAN of legacy branding!');
  }

  // 2. Audit Filesystem (src directory)
  console.log('\n--- 2. SRC DIRECTORY SCAN ---');
  function scanDir(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanDir(fullPath, fileList);
      } else if (/\.(tsx|ts|jsx|js|json|css|html)$/i.test(file)) {
        fileList.push(fullPath);
      }
    }
    return fileList;
  }

  const srcFiles = scanDir(path.resolve('./src'));
  const fileFindings = [];

  for (const file of srcFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (/eagle|eaglerevolution/i.test(line)) {
        fileFindings.push({
          file: path.relative(process.cwd(), file),
          line: idx + 1,
          content: line.trim()
        });
      }
    });
  }

  if (fileFindings.length > 0) {
    console.log(`Found ${fileFindings.length} matches in src/:`);
    for (const f of fileFindings) {
      console.log(`- ${f.file}:${f.line} -> ${f.content}`);
    }
  } else {
    console.log('✓ src/ codebase is 100% CLEAN of Eagle / EagleRevolution keywords!');
  }

  // 3. Audit Public directory
  console.log('\n--- 3. PUBLIC DIRECTORY SCAN ---');
  const publicFiles = scanDir(path.resolve('./public'));
  const publicFindings = [];
  for (const file of publicFiles) {
    if (/eagle/i.test(file)) {
      publicFindings.push(path.relative(process.cwd(), file));
    }
  }
  if (publicFindings.length > 0) {
    console.log(`Found matching filenames in public/:`, publicFindings);
  } else {
    console.log('✓ public/ directory filenames are 100% CLEAN!');
  }

  console.log('\n========================================\n');
  await mongoose.disconnect();
}

deepAudit();
