async function verifyNoEagleBrand() {
  console.log('\n=== Verifying Complete Absence of Eagle Branding Across Pages ===\n');

  const routes = ['/', '/services/', '/blogs/', '/about-us/', '/gallery/'];

  let foundIssues = 0;

  for (const route of routes) {
    try {
      const res = await fetch(`http://localhost:3000${route}`);
      const html = await res.text();

      const eagleMatches = html.match(/.{0,30}(?:eagle|eaglerevolution).{0,30}/gi) || [];

      if (eagleMatches.length > 0) {
        foundIssues += eagleMatches.length;
        console.log(`❌ Route [${route}] has ${eagleMatches.length} occurrences of 'eagle':`);
        eagleMatches.slice(0, 10).forEach((m, i) => console.log(`   [${i+1}] ...${m.trim()}...`));
      } else {
        console.log(`✓ Route [${route}] is 100% CLEAN of any 'eagle' or 'eaglerevolution' branding!`);
      }
    } catch (e) {
      console.error(`Error checking route ${route}:`, e.message);
    }
  }

  console.log(`\n========================================`);
  if (foundIssues === 0) {
    console.log('✓ SUCCESS: ZERO Eagle / EagleRevolution references found in output HTML!');
  } else {
    console.log(`❌ Total issues found: ${foundIssues}`);
  }
  console.log(`========================================\n`);
}

verifyNoEagleBrand();
