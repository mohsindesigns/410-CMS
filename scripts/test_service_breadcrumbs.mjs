async function testServiceBreadcrumbs() {
  console.log('\n=== Testing Service Detail Page Breadcrumbs ===\n');

  try {
    const res = await fetch('http://localhost:3000/maryland-sports-massage-therapist/');
    const html = await res.text();

    const breadcrumbMatch = html.match(/<nav[^>]*aria-label=["']Breadcrumb["'][^>]*>([\s\S]*?)<\/nav>/i);
    if (breadcrumbMatch) {
      console.log('Visual Breadcrumb HTML:\n', breadcrumbMatch[1].replace(/<span/g, '\n<span').replace(/<a/g, '\n<a'));
    } else {
      console.log('Breadcrumb nav not found in HTML.');
    }

    const scriptRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = scriptRegex.exec(html)) !== null) {
      try {
        const parsed = JSON.parse(match[1]);
        if (parsed['@graph']) {
          const bcrumb = parsed['@graph'].find((g) => g['@type'] === 'BreadcrumbList');
          if (bcrumb) {
            console.log('\nSchema BreadcrumbList:\n', JSON.stringify(bcrumb, null, 2));
          }
        }
      } catch (e) {}
    }
  } catch (e) {
    console.error('Test failed:', e.message);
  }
}

testServiceBreadcrumbs();
