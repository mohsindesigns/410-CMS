async function testBlogsLive() {
  const tests = [
    { url: 'http://localhost:3000/blogs/', expected: 200 },
    { url: 'http://localhost:3000/blogs/is-deep-tissue-massage-painful/', expected: 200 },
    { url: 'http://localhost:3000/blog/', expected: 308 },
    { url: 'http://localhost:3000/blog/is-deep-tissue-massage-painful/', expected: 308 },
    { url: 'http://localhost:3000/sitemap.xml', expected: 200 }
  ];

  console.log('\n=== Testing Live Blog Routes ===\n');

  for (const t of tests) {
    try {
      const res = await fetch(t.url, { redirect: 'manual' });
      const location = res.headers.get('location');
      console.log(`URL: ${t.url} -> Status: ${res.status} ${location ? `(Redirect to: ${location})` : ''}`);
    } catch (e) {
      console.error(`Failed testing ${t.url}:`, e.message);
    }
  }

  // Fetch blogs page and check canonical & links
  try {
    const res = await fetch('http://localhost:3000/blogs/');
    const text = await res.text();
    const canonicalMatch = text.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
    console.log('\nBlogs Page Canonical:', canonicalMatch ? canonicalMatch[1] : 'Not found');

    const postLinkMatches = text.match(/href="\/blogs\/[^"]+"/g);
    console.log('Sample post links rendered on /blogs/:', postLinkMatches ? postLinkMatches.slice(0, 3) : 'None');
  } catch (e) {
    console.error('Failed checking /blogs/ content:', e.message);
  }

  // Fetch a single blog post and check schema & canonical
  try {
    const res = await fetch('http://localhost:3000/blogs/is-deep-tissue-massage-painful/');
    const text = await res.text();
    const canonicalMatch = text.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
    console.log('\nSingle Post Canonical:', canonicalMatch ? canonicalMatch[1] : 'Not found');
    const backMatch = text.match(/href="\/blogs\/"/);
    console.log('Back to Blogs button exists:', !!backMatch);
  } catch (e) {
    console.error('Failed checking single post content:', e.message);
  }
}

testBlogsLive();
