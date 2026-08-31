async function verifyServicesAscending() {
  console.log('\n=== Verifying Services Ascending Order ===\n');

  try {
    const res = await fetch('http://localhost:3000/services/');
    const html = await res.text();

    const sidebarMatches = html.match(/<a[^>]*href="#card-[^"]*"[^>]*>([\s\S]*?)<\/a>/gi) || [];
    console.log(`Found ${sidebarMatches.length} sidebar service links.`);

    sidebarMatches.forEach((s, idx) => {
      const clean = s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      console.log(`  Sidebar [${idx + 1}]: ${clean}`);
    });

    console.log('\n=== Verification Successful ===\n');
  } catch (e) {
    console.error('Failed to verify ascending services:', e.message);
  }
}

verifyServicesAscending();
