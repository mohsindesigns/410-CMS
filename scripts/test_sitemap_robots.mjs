async function testSitemapAndRobots() {
  console.log('\n=== Testing /sitemap.xml, /robots.txt, and /llms.txt ===\n');

  const urls = [
    'http://localhost:3000/robots.txt',
    'http://localhost:3000/sitemap.xml',
    'http://localhost:3000/llms.txt'
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url);
      const text = await res.text();
      console.log(`\n--- Testing ${url} (Status: ${res.status}) ---`);
      
      const eagleMatches = text.match(/.{0,30}(?:eagle|eaglerevolution).{0,30}/gi) || [];
      if (eagleMatches.length > 0) {
        console.log(`❌ Found ${eagleMatches.length} eagle occurrences in ${url}:`);
        eagleMatches.forEach((m, i) => console.log(`   [${i+1}] ${m}`));
      } else {
        console.log(`✓ 100% CLEAN of 'eagle' references!`);
      }

      // Print first 400 chars of output
      console.log(`Preview:\n${text.substring(0, 350)}...\n`);
    } catch (e) {
      console.error(`Error fetching ${url}:`, e.message);
    }
  }
}

testSitemapAndRobots();
