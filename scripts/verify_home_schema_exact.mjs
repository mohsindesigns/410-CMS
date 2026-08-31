async function verifyExactHomeSchemas() {
  console.log('\n=== Verifying Exact Homepage Schema Render ===\n');

  try {
    const res = await fetch('http://localhost:3000/');
    const html = await res.text();

    const scriptRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    let count = 0;

    while ((match = scriptRegex.exec(html)) !== null) {
      count++;
      console.log(`\n--- [Script Tag #${count}] ---`);
      try {
        const parsed = JSON.parse(match[1]);
        console.log(JSON.stringify(parsed, null, 2));
      } catch (e) {
        console.log('Raw content:', match[1]);
      }
    }

    console.log(`\nFound ${count} JSON-LD schemas rendered on Homepage!\n`);
  } catch (e) {
    console.error('Verification failed:', e.message);
  }
}

verifyExactHomeSchemas();
