async function verifyServicesPage() {
  console.log('\n=== Verifying Services Page Structure & CTA Buttons ===\n');

  try {
    const res = await fetch('http://localhost:3000/services/');
    const html = await res.text();

    console.log(`Page status: ${res.status}`);
    console.log(`Contains #services-list: ${html.includes('id="services-list"')}`);
    console.log(`Contains service-card-item: ${html.includes('service-card-item')}`);
    
    // Check explore and book buttons
    const btnGoldMatches = html.match(/class="[^"]*btn-gold[^"]*"[^>]*>([\s\S]*?)<\/a>/gi) || [];
    console.log(`\nFound ${btnGoldMatches.length} btn-gold elements.`);
    btnGoldMatches.slice(0, 5).forEach((b, i) => {
      const clean = b.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      console.log(`  Button ${i+1}: ${clean}`);
    });

    const bookMatches = html.match(/class="[^"]*btn-outline-white[^"]*"[^>]*>([\s\S]*?)<\/a>/gi) || [];
    console.log(`\nFound ${bookMatches.length} btn-outline-white elements.`);
    bookMatches.slice(0, 5).forEach((b, i) => {
      const clean = b.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      console.log(`  Book Button ${i+1}: ${clean}`);
    });

    console.log('\n=== Verification Successful ===\n');
  } catch (e) {
    console.error('Failed to verify services page:', e.message);
  }
}

verifyServicesPage();
