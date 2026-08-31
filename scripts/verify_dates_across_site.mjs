async function verifyDatesAcrossSite() {
  console.log('\n=== Verifying datePublished & dateModified Across Site ===\n');

  const testUrls = [
    'http://localhost:3000/',
    'http://localhost:3000/blogs/',
    'http://localhost:3000/blogs/complete-guide-for-best-deep-tissue-massage-near-me/',
    'http://localhost:3000/maryland-sports-massage-therapist/'
  ];

  for (const url of testUrls) {
    console.log(`\n--------------------------------------------`);
    console.log(`Testing: ${url}`);
    console.log(`--------------------------------------------`);

    try {
      const res = await fetch(url);
      const html = await res.text();

      // Check OpenGraph dates
      const pubMeta = html.match(/<meta[^>]*property=["'](?:article:published_time|og:published_time)["'][^>]*content=["']([^"']+)["']/i);
      const modMeta = html.match(/<meta[^>]*property=["'](?:article:modified_time|og:modified_time)["'][^>]*content=["']([^"']+)["']/i);
      if (pubMeta) console.log(`  [OG Meta] published_time: ${pubMeta[1]}`);
      if (modMeta) console.log(`  [OG Meta] modified_time: ${modMeta[1]}`);

      // Check Schema JSON-LD dates
      const scriptRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
      let match;
      let foundDateInSchema = false;

      while ((match = scriptRegex.exec(html)) !== null) {
        try {
          const parsed = JSON.parse(match[1]);
          const entities = parsed['@graph'] || [parsed];
          for (const ent of entities) {
            if (ent.datePublished || ent.dateModified) {
              foundDateInSchema = true;
              console.log(`  [Schema] @type: "${ent['@type']}" (id: ${ent['@id'] || 'n/a'})`);
              console.log(`    datePublished: ${ent.datePublished}`);
              console.log(`    dateModified:  ${ent.dateModified}`);
            }
          }
        } catch (e) {}
      }

      if (!foundDateInSchema) {
        console.log('  [Warning] No datePublished/dateModified found in Schema for', url);
      }
    } catch (e) {
      console.error(`  Failed to fetch ${url}:`, e.message);
    }
  }

  console.log('\n=== All Date Verifications Complete ===\n');
}

verifyDatesAcrossSite();
